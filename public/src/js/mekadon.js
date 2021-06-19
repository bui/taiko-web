class Mekadon{
	constructor(controller, game){
		this.controller = controller
		this.game = game
		this.lr = false
		this.lastHit = -Infinity
		this.delay = controller.audioLatency
	}
	play(circle){
		var type = circle.type
		if((type === "balloon" || type === "drumroll" || type === "daiDrumroll") && this.getMS() > circle.endTime){
			if(circle.section && circle.timesHit === 0){
				this.game.resetSection()
			}
			circle.played(-1, false)
			this.game.updateCurrentCircle()
		}
		type = circle.type
		if(type === "balloon"){
			return this.playDrumrollAt(circle, 0, 30)
		}else if(type === "drumroll" || type === "daiDrumroll"){
			return this.playDrumrollAt(circle, 0, 60)
		}else{
			return this.playAt(circle, 0, 450)
		}
	}
	playAt(circle, ms, score, dai, reverse){
		var currentMs = circle.ms - this.getMS() + this.delay
		if(ms > currentMs - 10){
			return this.playNow(circle, score, dai, reverse)
		}
	}
	playDrumrollAt(circle, ms, pace, kaAmount){
		if(pace && this.getMS() >= this.lastHit + pace){
			var score = 1
			if(kaAmount > 0){
				score = Math.random() > kaAmount ? 1 : 2
			}
			return this.playAt(circle, ms, score)
		}
	}
	miss(circle){
		var currentMs = circle.ms - this.getMS()
		if(0 >= currentMs - 10){
			this.controller.displayScore(0, true)
			this.game.updateCurrentCircle()
			this.game.updateCombo(0)
			this.game.updateGlobalScore(0, false, false, circle.gogoTime)
			this.game.sectionNotes.push(0)
			return true
		}
	}
	playNow(circle, score, dai, reverse){
		var type = circle.type
		var typeDai = type === "daiDon" || type === "daiKa";
		var keyDai = false
		var playDai = !dai || dai === 2
		var drumrollNotes = type === "balloon" || type === "drumroll" || type === "daiDrumroll"
		
		if(drumrollNotes){
			var ms = this.getMS()
		}else{
			var ms = circle.ms
		}
		
		if(reverse){
			if(type === "don" || type === "daiDon"){
				type = "ka"
			}else if(type === "ka" || type === "daiKa"){
				type = "don"
			}
		}
		if(type === "daiDon" && playDai){
			this.setKey("don_l", ms)
			this.setKey("don_r", ms)
			this.lr = false
			keyDai = true
		}else if(type === "don" || type === "daiDon" || drumrollNotes && score !== 2){
			this.setKey(this.lr ? "don_l" : "don_r", ms)
			this.lr = !this.lr
		}else if(type === "daiKa" && playDai){
			this.setKey("ka_l", ms)
			this.setKey("ka_r", ms)
			this.lr = false
			keyDai = true
		}else if(type === "ka" || type === "daiKa" || drumrollNotes){
			this.setKey(this.lr ? "ka_l" : "ka_r", ms)
			this.lr = !this.lr
		}
		if(type === "balloon"){
			if(circle.requiredHits === 1){
				assets.sounds["se_balloon"].play()
			}
			this.game.checkBalloon(circle)
		}else if(type === "drumroll" || type === "daiDrumroll"){
			this.game.checkDrumroll(circle, score === 2)
		}else{
			this.controller.displayScore(score, false, keyDai)
			this.game.updateCombo(score)
			this.game.updateGlobalScore(score, typeDai, keyDai, circle.gogoTime)
			this.game.updateCurrentCircle()
			circle.played(score, keyDai)
			if(circle.section){
				this.game.resetSection()
			}
			this.game.sectionNotes.push(score === 450 ? 1 : (score === 230 ? 0.5 : 0))
		}
		this.lastHit = ms
		return true
	}
	getMS(){
		return this.controller.getElapsedTime()
	}
	setKey(name, ms){
		this.controller.setKey(true, name, ms)
	}
}
