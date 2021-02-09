#!/usr/bin/env python3

import asyncio
import websockets
import json
import random
import sys

server_status = {
	"waiting": {},
	"users": [],
	"invites": {}
}
consonants = "bcdfghjklmnpqrstvwxyz"

def msgobj(msg_type, value=None):
	if value == None:
		return json.dumps({"type": msg_type})
	else:
		return json.dumps({"type": msg_type, "value": value})

def status_event():
	value = []
	for id, userDiff in server_status["waiting"].items():
		value.append({
			"id": id,
			"diff": userDiff["diff"]
		})
	return msgobj("users", value)

def get_invite():
	return "".join([random.choice(consonants) for x in range(5)])

async def notify_status():
	ready_users = [user for user in server_status["users"] if "ws" in user and user["action"] == "ready"]
	if ready_users:
		sent_msg = status_event()
		await asyncio.wait([user["ws"].send(sent_msg) for user in ready_users])

async def connection(ws, path):
	# User connected
	user = {
		"ws": ws,
		"action": "ready",
		"session": False,
		"name": None,
		"don": None
	}
	server_status["users"].append(user)
	try:
		# Notify user about other users
		await ws.send(status_event())
		while True:
			try:
				message = await asyncio.wait_for(ws.recv(), timeout=10)
			except asyncio.TimeoutError:
				# Keep user connected
				pong_waiter = await ws.ping()
				try:
					await asyncio.wait_for(pong_waiter, timeout=10)
				except asyncio.TimeoutError:
					# Disconnect
					break
			except websockets.exceptions.ConnectionClosed:
				# Connection closed
				break
			else:
				# Message received
				try:
					data = json.loads(message)
				except json.decoder.JSONDecodeError:
					data = {}
				action = user["action"]
				msg_type = data["type"] if "type" in data else None
				value = data["value"] if "value" in data else None
				if action == "ready":
					# Not playing or waiting
					if msg_type == "join":
						if value == None:
							continue
						waiting = server_status["waiting"]
						id = value["id"] if "id" in value else None
						diff = value["diff"] if "diff" in value else None
						user["name"] = value["name"] if "name" in value else None
						user["don"] = value["don"] if "don" in value else None
						if not id or not diff:
							continue
						if id not in waiting:
							# Wait for another user
							user["action"] = "waiting"
							user["gameid"] = id
							waiting[id] = {
								"user": user,
								"diff": diff
							}
							await ws.send(msgobj("waiting"))
						else:
							# Join the other user and start game
							user["name"] = value["name"] if "name" in value else None
							user["don"] = value["don"] if "don" in value else None
							user["other_user"] = waiting[id]["user"]
							waiting_diff = waiting[id]["diff"]
							del waiting[id]
							if "ws" in user["other_user"]:
								user["action"] = "loading"
								user["other_user"]["action"] = "loading"
								user["other_user"]["other_user"] = user
								user["other_user"]["player"] = 1
								user["player"] = 2
								await asyncio.wait([
									ws.send(msgobj("gameload", {"diff": waiting_diff, "player": 2})),
									user["other_user"]["ws"].send(msgobj("gameload", {"diff": diff, "player": 1})),
									ws.send(msgobj("name", {
										"name": user["other_user"]["name"],
										"don": user["other_user"]["don"]
									})),
									user["other_user"]["ws"].send(msgobj("name", {
										"name": user["name"],
										"don": user["don"]
									}))
								])
							else:
								# Wait for another user
								del user["other_user"]
								user["action"] = "waiting"
								user["gameid"] = id
								waiting[id] = {
									"user": user,
									"diff": diff
								}
								await ws.send(msgobj("waiting"))
						# Update others on waiting players
						await notify_status()
					elif msg_type == "invite":
						if value and "id" in value and value["id"] == None:
							# Session invite link requested
							invite = get_invite()
							server_status["invites"][invite] = user
							user["action"] = "invite"
							user["session"] = invite
							user["name"] = value["name"] if "name" in value else None
							user["don"] = value["don"] if "don" in value else None
							await ws.send(msgobj("invite", invite))
						elif value and "id" in value and value["id"] in server_status["invites"]:
							# Join a session with the other user
							user["name"] = value["name"] if "name" in value else None
							user["don"] = value["don"] if "don" in value else None
							user["other_user"] = server_status["invites"][value["id"]]
							del server_status["invites"][value["id"]]
							if "ws" in user["other_user"]:
								user["other_user"]["other_user"] = user
								user["action"] = "invite"
								user["session"] = value["id"]
								user["other_user"]["player"] = 1
								user["player"] = 2
								await asyncio.wait([
									ws.send(msgobj("session", {"player": 2})),
									user["other_user"]["ws"].send(msgobj("session", {"player": 1})),
									ws.send(msgobj("invite")),
									ws.send(msgobj("name", {
										"name": user["other_user"]["name"],
										"don": user["other_user"]["don"]
									})),
									user["other_user"]["ws"].send(msgobj("name", {
										"name": user["name"],
										"don": user["don"]
									}))
								])
							else:
								del user["other_user"]
								await ws.send(msgobj("gameend"))
						else:
							# Session code is invalid
							await ws.send(msgobj("gameend"))
				elif action == "waiting" or action == "loading" or action == "loaded":
					# Waiting for another user
					if msg_type == "leave":
						# Stop waiting
						if user["session"]:
							if "other_user" in user and "ws" in user["other_user"]:
								user["action"] = "songsel"
								await asyncio.wait([
									ws.send(msgobj("left")),
									user["other_user"]["ws"].send(msgobj("users", []))
								])
							else:
								user["action"] = "ready"
								user["session"] = False
								await asyncio.wait([
									ws.send(msgobj("gameend")),
									ws.send(status_event())
								])
						else:
							del server_status["waiting"][user["gameid"]]
							del user["gameid"]
							user["action"] = "ready"
							await asyncio.wait([
								ws.send(msgobj("left")),
								notify_status()
							])
					if action == "loading":
						if msg_type == "gamestart":
							user["action"] = "loaded"
							if user["other_user"]["action"] == "loaded":
								user["action"] = "playing"
								user["other_user"]["action"] = "playing"
								sent_msg = msgobj("gamestart")
								await asyncio.wait([
									ws.send(sent_msg),
									user["other_user"]["ws"].send(sent_msg)
								])
				elif action == "playing":
					# Playing with another user
					if "other_user" in user and "ws" in user["other_user"]:
						if msg_type == "note"\
							or msg_type == "drumroll"\
							or msg_type == "branch"\
							or msg_type == "gameresults":
							await user["other_user"]["ws"].send(msgobj(msg_type, value))
						elif msg_type == "songsel" and user["session"]:
							user["action"] = "songsel"
							user["other_user"]["action"] = "songsel"
							sent_msg1 = msgobj("songsel")
							sent_msg2 = msgobj("users", [])
							await asyncio.wait([
								ws.send(sent_msg1),
								ws.send(sent_msg2),
								user["other_user"]["ws"].send(sent_msg1),
								user["other_user"]["ws"].send(sent_msg2)
							])
						elif msg_type == "gameend":
							# User wants to disconnect
							user["action"] = "ready"
							user["other_user"]["action"] = "ready"
							sent_msg1 = msgobj("gameend")
							sent_msg2 = status_event()
							await asyncio.wait([
								ws.send(sent_msg1),
								ws.send(sent_msg2),
								user["other_user"]["ws"].send(sent_msg1),
								user["other_user"]["ws"].send(sent_msg2)
							])
							del user["other_user"]["other_user"]
							del user["other_user"]
					else:
						# Other user disconnected
						user["action"] = "ready"
						user["session"] = False
						await asyncio.wait([
							ws.send(msgobj("gameend")),
							ws.send(status_event())
						])
				elif action == "invite":
					if msg_type == "leave":
						# Cancel session invite
						if user["session"] in server_status["invites"]:
							del server_status["invites"][user["session"]]
						user["action"] = "ready"
						user["session"] = False
						if "other_user" in user and "ws" in user["other_user"]:
							user["other_user"]["action"] = "ready"
							user["other_user"]["session"] = False
							sent_msg = status_event()
							await asyncio.wait([
								ws.send(msgobj("left")),
								ws.send(sent_msg),
								user["other_user"]["ws"].send(msgobj("gameend")),
								user["other_user"]["ws"].send(sent_msg)
							])
						else:
							await asyncio.wait([
								ws.send(msgobj("left")),
								ws.send(status_event())
							])
					elif msg_type == "songsel" and "other_user" in user:
						if "ws" in user["other_user"]:
							user["action"] = "songsel"
							user["other_user"]["action"] = "songsel"
							sent_msg = msgobj(msg_type)
							await asyncio.wait([
								ws.send(sent_msg),
								user["other_user"]["ws"].send(sent_msg)
							])
						else:
							user["action"] = "ready"
							user["session"] = False
							await asyncio.wait([
								ws.send(msgobj("gameend")),
								ws.send(status_event())
							])
				elif action == "songsel":
					# Session song selection
					if "other_user" in user and "ws" in user["other_user"]:
						if msg_type == "songsel" or msg_type == "catjump":
							# Change song select position
							if user["other_user"]["action"] == "songsel" and type(value) is dict:
								value["player"] = user["player"]
								sent_msg = msgobj(msg_type, value)
								await asyncio.wait([
									ws.send(sent_msg),
									user["other_user"]["ws"].send(sent_msg)
								])
						elif msg_type == "crowns" or msg_type == "getcrowns":
							if user["other_user"]["action"] == "songsel":
								sent_msg = msgobj(msg_type, value)
								await asyncio.wait([
									user["other_user"]["ws"].send(sent_msg)
								])
						elif msg_type == "join":
							# Start game
							if value == None:
								continue
							id = value["id"] if "id" in value else None
							diff = value["diff"] if "diff" in value else None
							if not id or not diff:
								continue
							if user["other_user"]["action"] == "waiting":
								user["action"] = "loading"
								user["other_user"]["action"] = "loading"
								await asyncio.wait([
									ws.send(msgobj("gameload", {"diff": user["other_user"]["gamediff"]})),
									user["other_user"]["ws"].send(msgobj("gameload", {"diff": diff}))
								])
							else:
								user["action"] = "waiting"
								user["gamediff"] = diff
								await user["other_user"]["ws"].send(msgobj("users", [{
									"id": id,
									"diff": diff
								}]))
						elif msg_type == "gameend":
							# User wants to disconnect
							user["action"] = "ready"
							user["session"] = False
							user["other_user"]["action"] = "ready"
							user["other_user"]["session"] = False
							sent_msg1 = msgobj("gameend")
							sent_msg2 = status_event()
							await asyncio.wait([
								ws.send(sent_msg1),
								user["other_user"]["ws"].send(sent_msg1)
							])
							await asyncio.wait([
								ws.send(sent_msg2),
								user["other_user"]["ws"].send(sent_msg2)
							])
							del user["other_user"]["other_user"]
							del user["other_user"]
					else:
						# Other user disconnected
						user["action"] = "ready"
						user["session"] = False
						await asyncio.wait([
							ws.send(msgobj("gameend")),
							ws.send(status_event())
						])
	finally:
		# User disconnected
		del user["ws"]
		del server_status["users"][server_status["users"].index(user)]
		if "other_user" in user and "ws" in user["other_user"]:
			user["other_user"]["action"] = "ready"
			user["other_user"]["session"] = False
			await asyncio.wait([
				user["other_user"]["ws"].send(msgobj("gameend")),
				user["other_user"]["ws"].send(status_event())
			])
			del user["other_user"]["other_user"]
		if user["action"] == "waiting":
			del server_status["waiting"][user["gameid"]]
			await notify_status()
		elif user["action"] == "invite" and user["session"] in server_status["invites"]:
			del server_status["invites"][user["session"]]

port = int(sys.argv[1]) if len(sys.argv) > 1 else 34802
print('Starting server on port %d' % port)
loop = asyncio.get_event_loop()
tasks = asyncio.gather(
	websockets.serve(connection, "127.0.0.1", port)
)
try:
	loop.run_until_complete(tasks)
	loop.run_forever()
except KeyboardInterrupt:
	print("Stopping server")
	def shutdown_exception_handler(loop, context):
		if "exception" not in context or not isinstance(context["exception"], asyncio.CancelledError):
			loop.default_exception_handler(context)
	loop.set_exception_handler(shutdown_exception_handler)
	tasks = asyncio.gather(*asyncio.all_tasks(loop=loop), loop=loop, return_exceptions=True)
	tasks.add_done_callback(lambda t: loop.stop())
	tasks.cancel()
	while not tasks.done() and not loop.is_closed():
		loop.run_forever()
finally:
	if hasattr(loop, "shutdown_asyncgens"):
		loop.run_until_complete(loop.shutdown_asyncgens())
	loop.close()

