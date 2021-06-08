class Controller{
	constructor(selectedSong, songData, autoPlayEnabled, multiplayer, touchEnabled){
		this.selectedSong = selectedSong
		this.songData = songData
		this.autoPlayEnabled = autoPlayEnabled
		this.saveScore = !autoPlayEnabled
		this.multiplayer = multiplayer
		this.touchEnabled = touchEnabled
		if(multiplayer === 2){
			this.snd = p2.player === 2 ? "_p1" : "_p2"
			this.don = p2.don || defaultDon
		}else{
			this.snd = multiplayer ? "_p" + p2.player : ""
			this.don = account.loggedIn ? account.don : defaultDon
		}
		if(this.snd === "_p2" && this.objEqual(defaultDon, this.don)){
			this.don = {
				body_fill: defaultDon.face_fill,
				face_fill: defaultDon.body_fill
			}
		}
		
		this.calibrationMode = selectedSong.folder === "calibration"
		this.audioLatency = 0
		this.videoLatency = 0
		if(!this.calibrationMode){
			var latency = settings.getItem("latency")
			if(!autoPlayEnabled || this.multiplayer){
				this.audioLatency = Math.round(latency.audio) || 0
			}
			this.videoLatency = Math.round(latency.video) || 0 + this.audioLatency
		}
		if(this.multiplayer !== 2){
			loader.changePage("game", false)
		}
		
		if(selectedSong.type === "tja"){
			this.parsedSongData = new ParseTja(songData, selectedSong.difficulty, selectedSong.stars, selectedSong.offset)
		}else{
			this.parsedSongData = new ParseOsu(songData, selectedSong.difficulty, selectedSong.stars, selectedSong.offset)
		}
		this.offset = this.parsedSongData.soundOffset
		
		var maxCombo = this.parsedSongData.circles.filter(circle => ["don", "ka", "daiDon", "daiKa"].indexOf(circle.type) > -1 && (!circle.branch || circle.branch.name == "master")).length
		if (maxCombo >= 50) {
			var comboVoices = ["v_combo_50"].concat(Array.from(Array(Math.min(50, Math.floor(maxCombo / 100))), (d, i) => "v_combo_" + ((i + 1) * 100)))
			var promises = []
			
			comboVoices.forEach(name => {
				if (!assets.sounds[name + "_p1"]) {
					promises.push(loader.loadSound(name + ".ogg", snd.sfxGain).then(sound => {
						assets.sounds[name + "_p1"] = assets.sounds[name].copy(snd.sfxGainL)
						assets.sounds[name + "_p2"] = assets.sounds[name].copy(snd.sfxGainR)
					}))
				}
			})
			
			Promise.all(promises)
		}
		
		if(this.calibrationMode){
			this.volume = 1
		}else{
			assets.songs.forEach(song => {
				if(song.id == this.selectedSong.folder){
					this.mainAsset = song.sound
					this.volume = song.volume || 1
					if(!multiplayer && (!this.touchEnabled || this.autoPlayEnabled) && settings.getItem("showLyrics")){
						if(song.lyricsData){
							var lyricsDiv = document.getElementById("song-lyrics")
							this.lyrics = new Lyrics(song.lyricsData, selectedSong.offset, lyricsDiv)
						}else if(this.parsedSongData.lyrics){
							var lyricsDiv = document.getElementById("song-lyrics")
							this.lyrics = new Lyrics(this.parsedSongData.lyrics, selectedSong.offset, lyricsDiv, true)
						}
					}
				}
			})
		}
		
		this.game = new Game(this, this.selectedSong, this.parsedSongData)
		this.view = new View(this)
		this.mekadon = new Mekadon(this, this.game)
		this.keyboard = new GameInput(this)
		if(!autoPlayEnabled && this.multiplayer !== 2){
			this.easierBigNotes = settings.getItem("easierBigNotes") || this.keyboard.keyboard.TaikoForceLv5
		}else{
			this.easierBigNotes = false
		}
		
		this.drumSounds = settings.getItem("latency").drumSounds
		this.playedSounds = {}
	}
	run(syncWith){
		if(syncWith){
			this.syncWith = syncWith
		}
		if(this.multiplayer !== 2){
			snd.musicGain.setVolumeMul(this.volume)
		}
		this.game.run()
		this.view.run()
		if(this.multiplayer === 1){
			syncWith.run(this)
			syncWith.game.elapsedTime = this.game.elapsedTime
			syncWith.game.startDate = this.game.startDate
		}
		requestAnimationFrame(() => {
			this.startMainLoop()
			if(!this.multiplayer){
				debugObj.controller = this
				if(debugObj.debug){
					debugObj.debug.updateStatus()
				}
			}
		})
	}
	startMainLoop(){
		this.mainLoopRunning = true
		this.gameLoop()
		this.viewLoop()
		if(this.multiplayer !== 2){
			this.gameInterval = setInterval(this.gameLoop.bind(this), 1000 / 60)
			pageEvents.send("game-start", {
				selectedSong: this.selectedSong,
				autoPlayEnabled: this.autoPlayEnabled,
				multiplayer: this.multiplayer,
				touchEnabled: this.touchEnabled
			})
		}
	}
	stopMainLoop(){
		this.mainLoopRunning = false
		if(this.game.mainAsset){
			this.game.mainAsset.stop()
		}
		if(this.multiplayer !== 2){
			clearInterval(this.gameInterval)
		}
	}
	gameLoop(){
		if(this.mainLoopRunning){
			if(this.multiplayer === 1){
				this.syncWith.game.elapsedTime = this.game.elapsedTime
				this.syncWith.game.startDate = this.game.startDate
			}
			var ms = this.game.elapsedTime
			
			if(this.game.musicFadeOut < 3){
				this.keyboard.checkMenuKeys()
			}
			if(this.calibrationMode){
				this.game.calibration()
			}
			if(!this.game.isPaused()){
				this.keyboard.checkGameKeys()
				
				if(ms < 0){
					this.game.updateTime()
				}else{
					if(!this.calibrationMode){
						this.game.update()
					}
					if(!this.mainLoopRunning){
						return
					}
					this.game.playMainMusic()
				}
			}
			if(this.multiplayer === 1){
				this.syncWith.gameLoop()
			}
		}
	}
	viewLoop(){
		if(this.mainLoopRunning){
			if(this.multiplayer !== 2){
				requestAnimationFrame(() => {
					var player = this.multiplayer ? p2.player : 1
					if(player === 1){
						this.viewLoop()
					}
					if(this.multiplayer === 1){
						this.syncWith.viewLoop()
					}
					if(player === 2){
						this.viewLoop()
					}
					if(this.scoresheet){
						if(this.view.ctx){
							this.view.ctx.save()
							this.view.ctx.setTransform(1, 0, 0, 1, 0, 0)
						}
						this.scoresheet.redraw()
						if(this.view.ctx){
							this.view.ctx.restore()
						}
					}
				})
			}
			this.view.refresh()
		}
	}
	gameEnded(){
		var score = this.getGlobalScore()
		var vp
		if(this.game.rules.clearReached(score.gauge)){
			if(score.ok === 0 && score.bad === 0){ // TODO: donder fullcombo
				vp = "fullcombo"
				this.playSound("v_fullcombo", 1.350)
			}else if(score.bad === 0){
				vp = "fullcombo"
				this.playSound("v_fullcombo", 1.350)
			}else{
				vp = "clear"
			}
		}else{
			vp = "fail"
		}
		this.playSound("se_game" + vp)
	}
	displayResults(){
		if(this.multiplayer !== 2){
			if(this.view.cursorHidden){
				this.view.canvas.style.cursor = ""
			}
			this.scoresheet = new Scoresheet(this, this.getGlobalScore(), this.multiplayer, this.touchEnabled)
		}
	}
	displayScore(score, notPlayed, bigNote){
		this.view.displayScore(score, notPlayed, bigNote)
	}
	songSelection(fadeIn, showWarning){
		if(!fadeIn){
			this.clean()
		}
		if(this.calibrationMode){
			new SettingsView(this.touchEnabled, false, null, "latency")
		}else{
			new SongSelect(false, fadeIn, this.touchEnabled, null, showWarning)
		}
	}
	restartSong(){
		this.clean()
		if(this.multiplayer){
			new LoadSong(this.selectedSong, false, true, this.touchEnabled)
		}else{
			new Promise(resolve => {
				if(this.calibrationMode){
					resolve()
				}else{
					var songObj = assets.songs.find(song => song.id === this.selectedSong.folder)
					var promises = []
					if(songObj.chart && songObj.chart !== "blank"){
						var chart = songObj.chart
						if(chart.separateDiff){
							var chartDiff = this.selectedSong.difficulty
							chart = chart[chartDiff]
						}
						this.addPromise(promises, chart.read(this.selectedSong.type === "tja" ? "sjis" : undefined).then(data => {
							this.songData = data.replace(/\0/g, "").split("\n")
							return Promise.resolve()
						}), chart.url)
					}
					if(songObj.lyricsFile){
						this.addPromise(promises, songObj.lyricsFile.read().then(result => {
							songObj.lyricsData = result
						}, () => Promise.resolve()), songObj.lyricsFile.url)
					}
					Promise.all(promises).then(resolve)
				}
			}).then(() => {
				var taikoGame = new Controller(this.selectedSong, this.songData, this.autoPlayEnabled, false, this.touchEnabled)
				taikoGame.run()
			})
		}
	}
	addPromise(promises, promise, url){
		promises.push(promise.catch(error => {
			if(this.restartSongError){
				return
			}
			this.restartSongError = true
			if(url){
				error = (Array.isArray(error) ? error[0] + ": " : (error ? error + ": " : "")) + url
			}
			pageEvents.send("load-song-error", error)
			errorMessage(new Error(error).stack)
			var title = this.selectedSong.title
			if(title !== this.selectedSong.originalTitle){
				title += " (" + this.selectedSong.originalTitle + ")"
			}
			setTimeout(() => {
				new SongSelect(false, false, this.touchEnabled, null, {
					name: "loadSongError",
					title: title,
					id: this.selectedSong.folder,
					error: error
				})
			}, 500)
			return Promise.reject(error)
		}))
	}
	playSound(id, time, noSnd){
		if(!this.drumSounds && (id === "neiro_1_don" || id === "neiro_1_ka" || id === "se_don" || id === "se_ka")){
			return
		}
		var ms = Date.now() + (time || 0) * 1000
		if(!(id in this.playedSounds) || ms > this.playedSounds[id] + 30){
			assets.sounds[id + (noSnd ? "" : this.snd)].play(time)
			this.playedSounds[id] = ms
		}
	}
	togglePause(forcePause, pauseMove, noSound){
		if(this.multiplayer === 1){
			this.syncWith.game.togglePause(forcePause, pauseMove, noSound)
		}
		this.game.togglePause(forcePause, pauseMove, noSound)
	}
	getKeys(){
		return this.keyboard.getKeys()
	}
	setKey(pressed, name, ms){
		return this.keyboard.setKey(pressed, name, ms)
	}
	getElapsedTime(){
		return this.game.elapsedTime
	}
	getCircles(){
		return this.game.getCircles()
	}
	getCurrentCircle(){
		return this.game.getCurrentCircle()
	}
	isWaiting(key, type){
		return this.keyboard.isWaiting(key, type)
	}
	waitForKeyup(key, type){
		this.keyboard.waitForKeyup(key, type)
	}
	getKeyTime(){
		return this.keyboard.getKeyTime()
	}
	getCombo(){
		return this.game.getCombo()
	}
	getGlobalScore(){
		return this.game.getGlobalScore()
	}
	autoPlay(circle){
		if(this.multiplayer){
			p2.play(circle, this.mekadon)
		}else{
			return this.mekadon.play(circle)
		}
	}
	objEqual(a, b){
		for(var i in a){
			if(a[i] !== b[i]){
				return false
			}
		}
		return true
	}
	clean(){
		if(this.multiplayer === 1){
			this.syncWith.clean()
		}
		this.stopMainLoop()
		this.keyboard.clean()
		this.view.clean()
		snd.buffer.loadSettings()
		
		if(!this.multiplayer){
			debugObj.controller = null
			if(debugObj.debug){
				debugObj.debug.updateStatus()
			}
		}
		if(this.lyrics){
			this.lyrics.clean()
		}
	}
}
