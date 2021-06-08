class ScoreStorage{
	constructor(){
		this.scores = {}
		this.scoresP2 = {}
		this.requestP2 = new Set()
		this.requestedP2 = new Set()
		this.songTitles = {}
		this.difficulty = ["oni", "ura", "hard", "normal", "easy"]
		this.scoreKeys = ["points", "good", "ok", "bad", "maxCombo", "drumroll"]
		this.crownValue = ["", "silver", "gold", "rainbow"]
	}
	load(strings, loadFailed){
		var scores = {}
		var scoreStrings = {}
		if(loadFailed){
			try{
				var localScores = localStorage.getItem("saveFailed")
				if(localScores){
					scoreStrings = JSON.parse(localScores)
				}
			}catch(e){}
		}else if(strings){
			scoreStrings = this.prepareStrings(strings)
		}else if(account.loggedIn){
			return
		}else{
			try{
				var localScores = localStorage.getItem("scoreStorage")
				if(localScores){
					scoreStrings = JSON.parse(localScores)
				}
			}catch(e){}
		}
		for(var hash in scoreStrings){
			var scoreString = scoreStrings[hash]
			var songAdded = false
			if(typeof scoreString === "string" && scoreString){
				var diffArray = scoreString.split(";")
				for(var i in this.difficulty){
					if(diffArray[i]){
						var crown = parseInt(diffArray[i].slice(0, 1)) || 0
						var score = {
							crown: this.crownValue[crown] || ""
						}
						var scoreArray = diffArray[i].slice(1).split(",")
						for(var j in this.scoreKeys){
							var name = this.scoreKeys[j]
							var value = parseInt(scoreArray[j], 36) || 0
							if(value < 0){
								value = 0
							}
							score[name] = value
						}
						if(!songAdded){
							scores[hash] = {title: null}
							songAdded = true
						}
						scores[hash][this.difficulty[i]] = score
					}
				}
			}
		}
		if(loadFailed){
			for(var hash in scores){
				for(var i in this.difficulty){
					var diff = this.difficulty[i]
					if(scores[hash][diff]){
						this.add(hash, diff, scores[hash][diff], true, this.songTitles[hash] || null).then(() => {
							localStorage.removeItem("saveFailed")
						}, () => {})
					}
				}
			}
		}else{
			this.scores = scores
			this.scoreStrings = scoreStrings
		}
		if(strings){
			this.load(false, true)
		}
	}
	prepareScores(scores){
		var output = []
		for (var k in scores) {
			output.push({'hash': k, 'score': scores[k]})
		}
		return output
	}
	prepareStrings(scores){
		var output = {}
		for(var k in scores){
			output[scores[k].hash] = scores[k].score
		}
		return output
	}
	save(){
		for(var hash in this.scores){
			this.writeString(hash)
		}
		this.write()
		return this.sendToServer({
			scores: this.prepareScores(this.scoreStrings),
			is_import: true
		})
	}
	write(){
		if(!account.loggedIn){
			try{
				localStorage.setItem("scoreStorage", JSON.stringify(this.scoreStrings))
			}catch(e){}
		}
	}
	writeString(hash){
		var score = this.scores[hash]
		var diffArray = []
		var notEmpty = false
		for(var i = this.difficulty.length; i--;){
			var diff = this.difficulty[i]
			if(score[diff]){
				var scoreArray = []
				var crown = this.crownValue.indexOf(score[diff].crown).toString()
				for(var j in this.scoreKeys){
					var name = this.scoreKeys[j]
					var value = score[diff][name]
					value = Math.floor(value).toString(36)
					scoreArray.push(value)
				}
				diffArray.unshift(crown + scoreArray.join(","))
				notEmpty = true
			}else if(notEmpty){
				diffArray.unshift("")
			}
		}
		this.scoreStrings[hash] = diffArray.join(";")
	}
	titleHash(song){
		if(song in this.songTitles){
			return this.songTitles[song]
		}else{
			return song
		}
	}
	get(song, difficulty, isHash){
		if(!song){
			return this.scores
		}else{
			var hash = isHash ? song : this.titleHash(song)
			if(difficulty){
				if(hash in this.scores){
					return this.scores[hash][difficulty]
				}
			}else{
				return this.scores[hash]
			}
		}
	}
	getP2(song, difficulty, isHash){
		if(!song){
			return this.scoresP2
		}else{
			var hash = isHash ? song : this.titleHash(song)
			if(!(hash in this.scoresP2) && !this.requestP2.has(hash) && !this.requestedP2.has(hash)){
				this.requestP2.add(hash)
				this.requestedP2.add(hash)
			}
			if(difficulty){
				if(hash in this.scoresP2){
					return this.scoresP2[hash][difficulty]
				}
			}else{
				return this.scoresP2[hash]
			}
		}
	}
	add(song, difficulty, scoreObject, isHash, setTitle, saveFailed){
		var hash = isHash ? song : this.titleHash(song)
		if(!(hash in this.scores)){
			this.scores[hash] = {}
		}
		if(difficulty){
			if(setTitle){
				this.scores[hash].title = setTitle
			}
			this.scores[hash][difficulty] = scoreObject
		}else{
			this.scores[hash] = scoreObject
			if(setTitle){
				this.scores[hash].title = setTitle
			}
		}
		this.writeString(hash)
		this.write()
		if(saveFailed){
			var failedScores = {}
			try{
				var localScores = localStorage.getItem("saveFailed")
				if(localScores){
					failedScores = JSON.parse(localScores)
				}
			}catch(e){}
			if(!(hash in failedScores)){
				failedScores[hash] = {}
			}
			failedScores[hash] = this.scoreStrings[hash]
			try{
				localStorage.setItem("saveFailed", JSON.stringify(failedScores))
			}catch(e){}
			return Promise.reject()
		}else{
			var obj = {}
			obj[hash] = this.scoreStrings[hash]
			return this.sendToServer({
				scores: this.prepareScores(obj)
			}).catch(() => this.add(song, difficulty, scoreObject, isHash, setTitle, true))
		}
	}
	addP2(song, difficulty, scoreObject, isHash, setTitle){
		var hash = isHash ? song : this.titleHash(song)
		if(!(hash in this.scores)){
			this.scoresP2[hash] = {}
		}
		if(difficulty){
			if(setTitle){
				this.scoresP2[hash].title = setTitle
			}
			this.scoresP2[hash][difficulty] = scoreObject
		}else{
			this.scoresP2[hash] = scoreObject
			if(setTitle){
				this.scoresP2[hash].title = setTitle
			}
		}
	}
	template(){
		var template = {crown: ""}
		for(var i in this.scoreKeys){
			var name = this.scoreKeys[i]
			template[name] = 0
		}
		return template
	}
	remove(song, difficulty, isHash){
		var hash = isHash ? song : this.titleHash(song)
		if(hash in this.scores){
			if(difficulty){
				if(difficulty in this.scores[hash]){
					delete this.scores[hash][difficulty]
					var noDiff = true
					for(var i in this.difficulty){
						if(this.scores[hash][this.difficulty[i]]){
							noDiff = false
							break
						}
					}
					if(noDiff){
						delete this.scores[hash]
						delete this.scoreStrings[hash]
					}else{
						this.writeString(hash)
					}
				}
			}else{
				delete this.scores[hash]
				delete this.scoreStrings[hash]
			}
			this.write()
			this.sendToServer({
				scores: this.prepareScores(this.scoreStrings),
				is_import: true
			})
		}
	}
	sendToServer(obj, retry){
		if(account.loggedIn){
			return loader.getCsrfToken().then(token => {
				var request = new XMLHttpRequest()
				request.open("POST", "api/scores/save")
				var promise = pageEvents.load(request).then(response => {
					if(request.status !== 200){
						return Promise.reject()
					}
				}).catch(() => {
					if(retry){
						this.scoreSaveFailed = true
						account.loggedIn = false
						delete account.username
						delete account.displayName
						delete account.don
						this.load()
						pageEvents.send("logout")
						return Promise.reject()
					}else{
						return new Promise(resolve => {
							setTimeout(() => {
								resolve()
							}, 3000)
						}).then(() => this.sendToServer(obj, true))
					}
				})
				request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
				request.setRequestHeader("X-CSRFToken", token)
				request.send(JSON.stringify(obj))
				return promise
			})
		}else{
			return Promise.resolve()
		}
	}
	eventLoop(){
		if(p2.session && this.requestP2.size){
			var req = []
			this.requestP2.forEach(hash => {
				req.push(hash)
			})
			this.requestP2.clear()
			if(req.length){
				p2.send("getcrowns", req)
			}
		}
	}
	clearP2(){
		this.scoresP2 = {}
		this.requestP2.clear()
		this.requestedP2.clear()
	}
}
