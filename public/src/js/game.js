class Game{
	constructor(controller, selectedSong, songData){
		this.controller = controller
		this.selectedSong = selectedSong
		this.songData = songData
		this.elapsedTime = 0
		this.currentCircle = -1
		this.currentEvent = 0
		this.updateCurrentCircle()
		this.combo = 0
		this.rules = new GameRules(this)
		this.globalScore = {
			points: 0,
			good: 0,
			ok: 0,
			bad: 0,
			maxCombo: 0,
			drumroll: 0,
			gauge: 0,
			title: selectedSong.title,
			difficulty: this.rules.difficulty
		}
		var combo = this.songData.circles.filter(circle => {
			var type = circle.type
			return (type === "don" || type === "ka" || type === "daiDon" || type === "daiKa") && (!circle.branch || circle.branch.active)
		}).length
		this.soulPoints = this.rules.soulPoints(combo)
		this.paused = false
		this.started = false
		this.mainMusicPlaying = false
		this.musicFadeOut = 0
		this.fadeOutStarted = false
		this.currentTimingPoint = 0
		this.branchNames = ["normal", "advanced", "master"]
		this.resetSection()
		this.gameLagSync = !this.controller.touchEnabled && !(/Firefox/.test(navigator.userAgent))
		
		assets.songs.forEach(song => {
			if(song.id == selectedSong.folder){
				this.mainAsset = song.sound
			}
		})
	}
	run(){
		this.timeForDistanceCircle = 2500
		this.initTiming()
		this.view = this.controller.view
	}
	initTiming(){
		// Date when the chrono is started (before the game begins)
		var firstCircle = this.songData.circles[0]
		if(this.controller.calibrationMode){
			var offsetTime = 0
		}else{
			var offsetTime = Math.max(0, this.timeForDistanceCircle - (firstCircle ? firstCircle.ms : 0)) |0
		}
		if(this.controller.multiplayer){
			var syncWith = this.controller.syncWith
			var syncCircles = syncWith.game.songData.circles
			var syncOffsetTime = Math.max(0, this.timeForDistanceCircle - syncCircles[0].ms) |0
			offsetTime = Math.max(offsetTime, syncOffsetTime)
		}
		this.elapsedTime = -offsetTime
		// The real start for the game will start when chrono will reach 0
		this.startDate = Date.now() + offsetTime
	}
	update(){
		this.updateTime()
		// Main operations
		this.updateCirclesStatus()
		this.checkPlays()
		// Event operations
		this.whenFadeoutMusic()
		if(this.controller.multiplayer !== 2){
			this.whenLastCirclePlayed()
		}
	}
	getCircles(){
		return this.songData.circles
	}
	updateCirclesStatus(){
		var nextSet = false
		var ms = this.elapsedTime
		var circles = this.songData.circles
		var startIndex = this.currentCircle === 0 ? 0 : this.currentCircle - 1
		var index = 0
		
		for(var i = startIndex; i < circles.length; i++){
			var circle = circles[i]
			if(circle && (!circle.branch || circle.branch.active) && !circle.isPlayed){
				var type = circle.type
				var drumrollNotes = type === "balloon" || type === "drumroll" || type === "daiDrumroll"
				var endTime = circle.endTime + (drumrollNotes ? 0 : this.rules.bad) + this.controller.audioLatency
				
				if(ms >= circle.ms + this.controller.audioLatency){
					if(drumrollNotes && !circle.rendaPlayed && ms < endTime + this.controller.audioLatency){
						circle.rendaPlayed = true
						if(this.rules.difficulty === "easy"){
							assets.sounds["v_renda" + this.controller.snd].stop()
							this.controller.playSound("v_renda")
						}
					}
				}
				if(circle.daiFailed && (ms >= circle.daiFailed.ms + this.rules.daiLeniency || ms > endTime)){
					this.checkScore(circle, circle.daiFailed.check)
				}else if(ms > endTime){
					if(!this.controller.autoPlayEnabled){
						if(drumrollNotes){
							if(circle.section && circle.timesHit === 0){
								this.resetSection()
							}
							circle.played(-1, false)
							this.updateCurrentCircle()
							if(this.controller.multiplayer === 1){
								var value = {
									pace: (ms - circle.ms - this.controller.audioLatency) / circle.timesHit
								}
								if(type === "drumroll" || type === "daiDrumroll"){
									value.kaAmount = circle.timesKa / circle.timesHit
								}
								p2.send("drumroll", value)
							}
						}else{
							this.skipNote(circle)
							this.updateCurrentCircle()
						}
					}
				}else if(!this.controller.autoPlayEnabled && !nextSet){
					nextSet = true
					this.currentCircle = i
				}
				if(index++ > 1){
					break
				}
			}
		}
		
		var branches = this.songData.branches
		if(branches){
			var force = this.controller.multiplayer === 2 ? p2 : this
			var measures = this.songData.measures
			if(this.controller.multiplayer === 2 || force.branch){
				if(!force.branchSet){
					force.branchSet = true
					if(branches.length){
						this.setBranch(branches[0], force.branch)
					}
					var view = this.controller.view
					var currentMeasure = view.branch
					for(var i = measures.length; i--;){
						var measure = measures[i]
						if(measure.nextBranch && measure.ms <= ms){
							currentMeasure = measure.nextBranch.active
						}
					}
					if(view.branch !== currentMeasure){
						if(!this.branchStatic){
							view.branchAnimate = {
								ms: ms,
								fromBranch: view.branch
							}
						}
						this.branchStatic = false
						view.branch = currentMeasure
					}
				}
			}
			for(var i = 0; i < measures.length; i++){
				var measure = measures[i]
				if(measure.ms > ms){
					break
				}else if(measure.nextBranch && !measure.gameChecked){
					measure.gameChecked = true
					var branch = measure.nextBranch
					if(branch.type){
						var accuracy = 0
						if(branch.type === "drumroll"){
							if(force.branch){
								var accuracy = Math.max(0, branch.requirement[force.branch])
							}else{
								var accuracy = this.sectionDrumroll
							}
						}else if(this.sectionNotes.length !== 0){
							if(force.branch){
								var accuracy = Math.max(0, Math.min(100, branch.requirement[force.branch]))
							}else{
								var accuracy = this.sectionNotes.reduce((a, b) => a + b) / this.sectionNotes.length * 100
							}
						}
						if(accuracy >= branch.requirement.master){
							this.setBranch(branch, "master")
						}else if(accuracy >= branch.requirement.advanced){
							this.setBranch(branch, "advanced")
						}else{
							this.setBranch(branch, "normal")
						}
					}else if(this.controller.multiplayer === 1){
						p2.send("branch", "normal")
					}
				}
			}
		}
	}
	fixNoteStream(keysDon){
		var circleIsNote = circle => {
			var type = circle.type
			return type === "don" || type === "ka" || type === "daiDon" || type === "daiKa"
		}
		var correctNote = circle => {
			var type = circle.type
			return keysDon ? (type === "don" || type === "daiDon") : (type === "ka" || type === "daiKa")
		}
		var ms = this.elapsedTime
		var circles = this.songData.circles
		
		for(var i = this.currentCircle + 1; i < circles.length; i++){
			var circle = circles[i]
			var relative = ms - circle.ms - this.controller.audioLatency
			if(!circle.branch || circle.branch.active){
				if((!circleIsNote(circle) || relative < -this.rules.bad)){
					break
				}else if(Math.abs(relative) < this.rules.ok && correctNote(circle)){
					for(var j = this.currentCircle; j < i; j++){
						var circle = circles[j]
						if(circle && !circle.branch || circle.branch.active){
							this.skipNote(circles[j])
						}
					}
					this.currentCircle = i
					return circles[i]
				}
			}
		}
	}
	skipNote(circle){
		if(circle.section){
			this.resetSection()
		}
		circle.played(-1, circle.type === "daiDon" || circle.type === "daiKa")
		this.sectionNotes.push(0)
		this.controller.displayScore(0, true)
		this.updateCombo(0)
		this.updateGlobalScore(0, false, false, false);
		if(this.controller.multiplayer === 1){
			p2.send("note", {
				score: -1
			})
		}
	}
	checkPlays(){
		var circles = this.songData.circles
		var circle = circles[this.currentCircle]
		
		if(this.controller.autoPlayEnabled){
			while(circle && this.controller.autoPlay(circle)){
				circle = circles[this.currentCircle]
			}
			return
		}
		var keys = this.controller.getKeys()
		
		var don_l = keys["don_l"] && !this.controller.isWaiting("don_l", "score")
		var don_r = keys["don_r"] && !this.controller.isWaiting("don_r", "score")
		var ka_l = keys["ka_l"] && !this.controller.isWaiting("ka_l", "score")
		var ka_r = keys["ka_r"] && !this.controller.isWaiting("ka_r", "score")
		
		var checkDon = () => {
			if(don_l && don_r){
				this.checkKey(["don_l", "don_r"], circle, "daiDon")
			}else if(don_l){
				this.checkKey(["don_l"], circle, "don")
			}else if(don_r){
				this.checkKey(["don_r"], circle, "don")
			}
		}
		var checkKa = () => {
			if(ka_l && ka_r){
				this.checkKey(["ka_l", "ka_r"], circle, "daiKa")
			}else if(ka_l){
				this.checkKey(["ka_l"], circle, "ka")
			}else if(ka_r){
				this.checkKey(["ka_r"], circle, "ka")
			}
		}
		var keyTime = this.controller.getKeyTime()
		if(keyTime["don"] >= keyTime["ka"]){
			checkDon()
			checkKa()
		}else{
			checkKa()
			checkDon()
		}
	}
	checkKey(keyCodes, circle, check){
		if(circle && !circle.isPlayed){
			if(!this.checkScore(circle, check)){
				return
			}
		}
		keyCodes.forEach(keyCode => {
			this.controller.waitForKeyup(keyCode, "score")
		})
	}
	checkScore(circle, check){
		var ms = this.elapsedTime
		var type = circle.type
		
		var keysDon = check === "don" || check === "daiDon"
		var keysKa = check === "ka" || check === "daiKa"
		var keyDai = check === "daiDon" || check === "daiKa"
		var typeDon = type === "don" || type === "daiDon"
		var typeKa = type === "ka" || type === "daiKa"
		var typeDai = type === "daiDon" || type === "daiKa"
		
		var keyTime = this.controller.getKeyTime()
		var currentTime = circle.daiFailed ? circle.daiFailed.ms : keysDon ? keyTime["don"] : keyTime["ka"]
		var relative = currentTime - circle.ms - this.controller.audioLatency
		
		if(relative >= this.rules.ok){
			var fixedNote = this.fixNoteStream(keysDon)
			if(fixedNote){
				return this.checkScore(fixedNote, check)
			}
		}
		
		if(typeDon || typeKa){
			if(-this.rules.bad >= relative || relative >= this.rules.bad){
				return true
			}
			var score = 0
			if(keysDon && typeDon || keysKa && typeKa){
				var circleStatus = -1
				relative = Math.abs(relative)
				if(relative < this.rules.good){
					circleStatus = 450
				}else if(relative < this.rules.ok){
					circleStatus = 230
				}else if(relative < this.rules.bad){
					circleStatus = 0
				}
				if(typeDai && !keyDai){
					if(this.controller.easierBigNotes){
						// Taiko Force Lv5 can't hit both Dons at the same time, so dai offered
						keyDai = true
					}else if(!circle.daiFailed){
						circle.daiFailed = {
							ms: ms,
							status: circleStatus,
							check: check
						}
						return false
					}else if(ms < circle.daiFailed.ms + this.rules.daiLeniency){
						return false
					}else{
						circleStatus = circle.daiFailed.status
					}
				}
				if(circleStatus === 230 || circleStatus === 450){
					score = circleStatus
				}
				circle.played(score, score === 0 ? typeDai : keyDai)
				this.controller.displayScore(score, false, typeDai && keyDai)
			}else{
				var keyTime = this.controller.getKeyTime()
				var keyTimeRelative = Math.abs(keyTime.don - keyTime.ka)
				if(Math.abs(relative) >= (keyTimeRelative <= 25 ? this.rules.bad : this.rules.good)){
					return true
				}
				circle.played(-1, typeDai)
				this.controller.displayScore(score, true, false)
			}
			this.updateCombo(score)
			this.updateGlobalScore(score, typeDai, keyDai, circle.gogoTime);
			this.updateCurrentCircle()
			if(circle.section){
				this.resetSection()
			}
			this.sectionNotes.push(score === 450 ? 1 : (score === 230 ? 0.5 : 0))
			if(this.controller.multiplayer === 1){
				var value = {
					score: score,
					ms: circle.ms - currentTime - this.controller.audioLatency,
					dai: typeDai ? (keyDai ? 2 : 1) : 0
				}
				if((!keysDon || !typeDon) && (!keysKa || !typeKa)){
					value.reverse = true
				}
				p2.send("note", value)
			}
		}else{
			if(circle.ms + this.controller.audioLatency > currentTime || currentTime > circle.endTime + this.controller.audioLatency){
				return true
			}
			if(keysDon && type === "balloon"){
				this.checkBalloon(circle)
				if(check === "daiDon" && !circle.isPlayed){
					this.checkBalloon(circle)
				}
			}else if((keysDon || keysKa) && (type === "drumroll" || type === "daiDrumroll")){
				this.checkDrumroll(circle, keysKa)
				if(keyDai){
					this.checkDrumroll(circle, keysKa)
				}
			}
		}
		return true
	}
	checkBalloon(circle) {
		var score;
		if(circle.timesHit >= circle.requiredHits - 1){
			score = this.songData.scoremode === 3 ? 100 : 5000;
			this.updateCurrentCircle()
			circle.hit()
			circle.played(score)
			if(this.controller.multiplayer == 1){
				p2.send("drumroll", {
					pace: (this.elapsedTime - circle.ms + this.controller.audioLatency) / circle.timesHit
				})
			}
		}else{
			score = this.songData.scoremode === 3 ? 100 : 300;
			circle.hit()
		}
		this.globalScore.drumroll++
		this.sectionDrumroll++
		this.globalScore.points += score
		this.view.setDarkBg(false)
	}
	checkDrumroll(circle, keysKa){
		var ms = this.elapsedTime
		var dai = circle.type === "daiDrumroll"
		var score = 100
		if(circle.section && circle.timesHit === 0){
			this.resetSection()
		}
		circle.hit(keysKa)
		var keyTime = this.controller.getKeyTime()
		if(circle.type === "drumroll"){
			var sound = keyTime["don"] > keyTime["ka"] ? "don" : "ka"
		}else{
			var sound = keyTime["don"] > keyTime["ka"] ? "daiDon" : "daiKa"
		}
		var circleAnim = new Circle({
			id: 0,
			start: ms,
			type: sound,
			txt: "",
			speed: circle.speed,
			gogoTime: circle.gogoTime,
			fixedPos: document.hasFocus()
		})
		circleAnim.played(score, dai)
		circleAnim.animate(ms)
		this.view.drumroll.push(circleAnim)
		this.globalScore.drumroll++
		this.sectionDrumroll++
		this.globalScore.points += score * ((dai && this.songData.scoremode !== 3) ? 2 : 1)
		this.view.setDarkBg(false)
	}
	getLastCircle(circles){
		for(var i = circles.length; i--;){
			return circles[i]
		}
	}
	whenLastCirclePlayed(){
		var ms = this.elapsedTime
		if(!this.lastCircle){
			var circles = this.songData.circles
			var circle = this.getLastCircle(circles)
			this.lastCircle = circle ? circle.endTime : 0
			if(this.controller.multiplayer){
				var syncWith = this.controller.syncWith
				var syncCircles = syncWith.game.songData.circles
				circle = this.getLastCircle(syncCircles)
				var syncLastCircle = circle ? circle.endTime : 0
				if(syncLastCircle > this.lastCircle){
					this.lastCircle = syncLastCircle
				}
			}
		}
		if(!this.fadeOutStarted && ms >= this.lastCircle + 2000 + this.controller.audioLatency){
			this.fadeOutStarted = ms
			if(this.controller.multiplayer){
				this.controller.syncWith.game.fadeOutStarted = ms
			}
		}
	}
	whenFadeoutMusic(){
		var started = this.fadeOutStarted
		if(started){
			var ms = this.elapsedTime
			var duration = this.mainAsset ? this.mainAsset.duration : 0
			var musicDuration = duration * 1000 - this.controller.offset
			if(this.musicFadeOut === 0){
				if(this.controller.multiplayer === 1){
					var obj = this.getGlobalScore()
					obj.name = account.loggedIn ? account.displayName : null
					p2.send("gameresults", obj)
				}
				this.musicFadeOut++
			}else if(this.musicFadeOut === 1 && ms >= started + 1600){
				this.controller.gameEnded()
				if(!p2.session && this.controller.multiplayer === 1){
					p2.send("gameend")
				}
				this.musicFadeOut++
			}else if(this.musicFadeOut === 2 && (ms >= started + 8600 && ms >= musicDuration + 250)){
				this.controller.displayResults()
				this.musicFadeOut++
			}else if(this.musicFadeOut === 3 && (ms >= started + 9600 && ms >= musicDuration + 1250)){
				this.controller.clean()
				if(this.controller.scoresheet){
					this.controller.scoresheet.startRedraw()
				}
			}
		}
	}
	playMainMusic(){
		var ms = this.elapsedTime + this.controller.offset
		if(!this.mainMusicPlaying && (!this.fadeOutStarted || ms < this.fadeOutStarted + 1600)){
			if(this.calibrationState === "audio"){
				var beatInterval = this.controller.view.beatInterval
				var startAt = ms % beatInterval
				var duration = this.mainAsset.duration * 1000
				if(startAt < duration){
					this.mainAsset.playLoop(0, false, startAt / 1000, 0, beatInterval / 1000)
				}else{
					this.mainAsset.playLoop((startAt - duration) / 1000, false, 0, 0, beatInterval / 1000)
				}
			}else if(this.controller.multiplayer !== 2 && this.mainAsset){
				this.mainAsset.play((ms < 0 ? -ms : 0) / 1000, false, Math.max(0, ms / 1000))
			}
			this.mainMusicPlaying = true
		}
	}
	togglePause(forcePause, pauseMove, noSound){
		if(!this.paused){
			if(forcePause === false){
				return
			}
			if(!noSound){
				this.controller.playSound("se_pause", 0, true)
			}
			this.paused = true
			this.latestDate = Date.now()
			if(this.mainAsset){
				this.mainAsset.stop()
			}
			this.mainMusicPlaying = false
			this.view.pauseMove(pauseMove || 0, true)
			this.view.gameDiv.classList.add("game-paused")
			this.view.lastMousemove = this.view.getMS()
			this.view.cursorHidden = false
			pageEvents.send("pause")
		}else if(!forcePause){
			if(forcePause !== false && this.calibrationState && ["audioHelp", "audioComplete", "videoHelp", "videoComplete", "results"].indexOf(this.calibrationState) !== -1){
				return
			}
			if(this.calibrationState === "audioHelp" || this.calibrationState === "videoHelp"){
				this.calibrationState = this.calibrationState === "audioHelp" ? "audio" : "video"
				this.controller.view.pauseOptions = strings.pauseOptions
				this.controller.playSound("se_don", 0, true)
			}else if(!noSound){
				this.controller.playSound("se_cancel", 0, true)
			}
			this.paused = false
			var currentDate = Date.now()
			this.startDate += currentDate - this.latestDate
			this.sndTime = currentDate - snd.buffer.getTime() * 1000
			this.view.gameDiv.classList.remove("game-paused")
			this.view.pointer()
			pageEvents.send("unpause", currentDate - this.latestDate)
		}
	}
	isPaused(){
		return this.paused
	}
	updateTime(){
		// Refreshed date
		var ms = this.elapsedTime
		if(ms >= 0 && !this.started){
			this.startDate = Date.now()
			this.elapsedTime = this.getAccurateTime()
			this.started = true
			this.sndTime = this.startDate - snd.buffer.getTime() * 1000
		}else if(ms < 0 || ms >= 0 && this.started){
			var currentDate = Date.now()
			if(this.gameLagSync){
				var sndTime = currentDate - snd.buffer.getTime() * 1000
				var lag = sndTime - this.sndTime
				if(Math.abs(lag) >= 50){
					this.startDate += lag
					this.sndTime = sndTime
					pageEvents.send("game-lag", lag)
				}
			}
			this.elapsedTime = currentDate - this.startDate
		}
	}
	getAccurateTime(){
		if(this.isPaused()){
			return this.elapsedTime
		}else{
			return Date.now() - this.startDate
		}
	}
	getCircles(){
		return this.songData.circles
	}
	updateCurrentCircle(){
		var circles = this.songData.circles
		do{
			var circle = circles[++this.currentCircle]
		}while(circle && (circle.branch && !circle.branch.active))
	}
	getCurrentCircle(){
		return this.currentCircle
	}
	updateCombo(score){
		if(score !== 0){
			this.combo++
		}else{
			this.combo = 0
		}
		if(this.combo > this.globalScore.maxCombo){
			this.globalScore.maxCombo = this.combo
		}
		if(this.combo === 50 || this.combo > 0 && this.combo % 100 === 0 && this.combo <= 5000){
			this.controller.playSound("v_combo_" + this.combo)
		}
		if (this.songData.scoremode == 2 && this.combo > 0 && this.combo % 100 == 0) { 
			this.globalScore.points += 10000;
		}
		this.view.updateCombo(this.combo)
	}
	getCombo(){
		return this.combo
	}
	getGlobalScore(){
		return this.globalScore
	}
	updateGlobalScore(score, typeDai, keyDai, gogoTime){
		// Circle score
		switch(score){
			case 450:
				this.globalScore.good++
				this.globalScore.gauge += this.soulPoints.good
				break
			case 230:
				this.globalScore.ok++
				this.globalScore.gauge += this.soulPoints.ok
				break
			case 0:
				this.globalScore.bad++
				this.globalScore.gauge += this.soulPoints.bad
				break
		}
		if (this.songData.scoremode) { 
			switch (score) {
				case 450:
					score = this.songData.scoreinit;
					break;
				case 230:
					score = Math.floor(this.songData.scoreinit / 2);
					break;
			}
		}
		// Gauge update
		if(this.globalScore.gauge < 0){
			this.globalScore.gauge = 0
		}else if(this.globalScore.gauge > 10000){
			this.globalScore.gauge = 10000
		}
		// Points update
		if (this.songData.scoremode == 2) {
			var diff_mul = 0;
			if (this.combo >= 100) {
				diff_mul = 8;
			} else if (this.combo >= 50) {
				diff_mul = 4;
			} else if (this.combo >= 30) {
				diff_mul = 2;
			} else if (this.combo >= 10) {
				diff_mul = 1;
			}
			score += this.songData.scorediff * diff_mul;
		} else if (this.songData.scoremode == 1) { 
			score += Math.max(0, Math.floor((Math.min(this.combo, 100) - 1) / 10) * (this.songData.scoremode ? this.songData.scorediff : 100));
		}
		let multiplier = 1;
		if (this.songData.scoremode === 3) {
			if (typeDai && !keyDai){
				multiplier = 0.5;
			}
		} else { 
			if (typeDai && keyDai){
				multiplier = 2;
			}
			if(gogoTime){
				multiplier *= 1.2;
			}
		}
		this.globalScore.points += Math.floor(score * multiplier / 10) * 10
	}
	setBranch(currentBranch, activeName){
		var pastActive = currentBranch.active
		var ms = currentBranch.ms
		for(var i = 0; i < this.songData.branches.length; i++){
			var branch = this.songData.branches[i]
			if(branch.ms >= ms){
				var relevantName = activeName
				var req = branch.requirement
				var noNormal = req.advanced <= 0
				var noAdvanced = req.master <= 0 || req.advanced >= req.master || branch.type === "accuracy" && req.advanced > 100
				var noMaster = branch.type === "accuracy" && req.master > 100
				if(relevantName === "normal" && noNormal){
					relevantName = noAdvanced ? "master" : "advanced"
				}
				if(relevantName === "advanced" && noAdvanced){
					relevantName = noMaster ? "normal" : "master"
				}
				if(relevantName === "master" && noMaster){
					relevantName = noAdvanced ? "normal" : "advanced"
				}
				for(var j in this.branchNames){
					var name = this.branchNames[j]
					if(name in branch){
						branch[name].active = name === relevantName
					}
				}
				if(branch === currentBranch){
					activeName = relevantName
				}
				branch.active = relevantName
			}
		}
		var circles = this.songData.circles
		var circle = circles[this.currentCircle]
		if(!circle || circle.branch === currentBranch[pastActive]){
			var ms = this.elapsedTime
			var closestCircle = circles.findIndex(circle => {
				return (!circle.branch || circle.branch.active) && circle.endTime + this.controller.audioLatency >= ms
			})
			if(closestCircle !== -1){
				this.currentCircle = closestCircle
			}
		}
		if(this.controller.multiplayer === 1){
			p2.send("branch", activeName)
		}
	}
	resetSection(){
		this.sectionNotes = []
		this.sectionDrumroll = 0
	}
	clearKeyTime(){
		var keyboard = this.controller.keyboard
		for(var key in keyboard.keyTime){
			keyboard.keys[key] = null
			keyboard.keyTime[key] = -Infinity
		}
	}
	calibration(){
		var view = this.controller.view
		if(!this.calibrationState){
			this.controller.parsedSongData.measures = []
			this.calibrationProgress = {
				audio: 0,
				video: 0,
				requirement: 40
			}
			this.calibrationReset("audio", true)
		}
		var progress = this.calibrationProgress
		var state = this.calibrationState
		switch(state){
			case "audio":
			case "video":
				if(state === "audio" && !this.mainAsset){
					this.mainAsset = assets.sounds["se_calibration"]
					this.mainMusicPlaying = false
				}
				if(progress.hit >= progress.requirement){
					var reduced = 0
					for(var i = 2; i < progress.offsets.length; i++){
						reduced += progress.offsets[i]
					}
					progress[state] = Math.max(0, Math.round(reduced / progress.offsets.length - 2))
					this.calibrationState += "Complete"
					view.pauseOptions = []
					this.clearKeyTime()
					this.togglePause(true, 1)
					this.mainAsset = null
				}
				break
			case "audioComplete":
			case "videoComplete":
				if(Date.now() - this.latestDate > 3000){
					var audioComplete = this.calibrationState === "audioComplete"
					this.controller.playSound("se_pause", 0, true)
					if(audioComplete){
						this.calibrationReset("video")
					}else{
						view.pauseOptions = [
							strings.calibration.retryPrevious,
							strings.calibration.finish
						]
					}
					this.calibrationState = audioComplete ? "videoHelp" : "results"
				}
				break
		}
	}
	calibrationHit(ms){
		var progress = this.calibrationProgress
		var beatInterval = this.controller.view.beatInterval
		var current = Math.floor((ms + 100) / beatInterval)
		if(current !== progress.last){
			var offset = ((ms + 100) % beatInterval) - 100
			var offsets = progress.offsets
			if(offsets.length >= progress.requirement){
				offsets.shift()
			}
			offsets.push(offset)
			progress.hit++
			progress.last = current
			this.globalScore.gauge = 10000 / (progress.requirement / progress.hit)
		}
	}
	calibrationReset(to, togglePause){
		var view = this.controller.view
		this.songData.circles = []
		view.pauseOptions = [
			to === "audio" ? strings.calibration.back : strings.calibration.retryPrevious,
			strings.calibration.start
		]
		this.calibrationState = to + "Help"
		var progress = this.calibrationProgress
		progress.offsets = []
		progress.hit = 0
		progress.last = null
		this.globalScore.gauge = 0
		if(to === "video"){
			this.clearKeyTime()
			this.initTiming()
			this.latestDate = this.startDate
			this.elapsedTime = 0
			view.ms = 0
		}
		if(togglePause){
			this.togglePause(true, 1, true)
		}else{
			view.pauseMove(1, true)
		}
	}
}
