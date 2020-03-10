class View{
	constructor(controller){
		this.controller = controller
		
		this.canvas = document.getElementById("canvas")
		this.ctx = this.canvas.getContext("2d")
		var resolution = settings.getItem("resolution")
		var noSmoothing = resolution === "low" || resolution === "lowest"
		if(noSmoothing){
			this.ctx.imageSmoothingEnabled = false
		}
		if(resolution === "lowest"){
			this.canvas.style.imageRendering = "pixelated"
		}
		
		this.gameDiv = document.getElementById("game")
		this.songBg = document.getElementById("songbg")
		this.songStage = document.getElementById("song-stage")
		
		this.rules = this.controller.game.rules
		this.portraitClass = false
		this.touchp2Class = false
		this.darkDonBg = false
		
		this.pauseOptions = strings.pauseOptions
		this.categories = {
			"J-POP": {
				sort: 0,
				infoFill: "#004d68"
			},
			"アニメ": {
				sort: 1,
				infoFill: "#9c4002"
			},
			"ボーカロイド™曲": {
				sort: 2,
				infoFill: "#546184"
			},
			"バラエティ": {
				sort: 3,
				infoFill: "#3c6800"
			},
			"クラシック": {
				sort: 4,
				infoFill: "#865800"
			},
			"ゲームミュージック": {
				sort: 5,
				infoFill: "#4f2886"
			},
			"ナムコオリジナル": {
				sort: 6,
				infoFill: "#961e00"
			},
			"default": {
				sort: 7,
				infoFill: "#656565"
			}
		}
		this.difficulty = {
			"easy": 0,
			"normal": 1,
			"hard": 2,
			"oni": 3,
			"ura": 4
		}
		
		this.currentScore = {
			ms: -Infinity,
			type: 0
		}
		this.noteFace = {
			small: 0,
			big: 3
		}
		this.state = {
			pausePos: 0,
			moveMS: 0,
			moveHover: null,
			hasPointer: false
		}
		this.nextBeat = 0
		this.gogoTime = 0
		this.gogoTimeStarted = -Infinity
		this.drumroll = []
		this.touchEvents = 0
		if(this.controller.parsedSongData.branches){
			this.branch = "normal"
			this.branchAnimate = {
				ms: -Infinity,
				fromBranch: "normal"
			}
			this.branchMap = {
				"normal": {
					"bg": "rgba(0, 0, 0, 0)",
					"text": "#d3d3d3",
					"stroke": "#393939",
					"shadow": "#000"
				},
				"advanced": {
					"bg": "rgba(29, 129, 189, 0.4)",
					"text": "#94d7e7",
					"stroke": "#315973",
					"shadow": "#082031"
				},
				"master": {
					"bg": "rgba(230, 29, 189, 0.4)",
					"text": "#f796ef",
					"stroke": "#7e2e6e",
					"shadow": "#3e0836"
				}
			}
		}
		
		if(this.controller.calibrationMode){
			this.beatInterval = 512
		}else{
			this.beatInterval = this.controller.parsedSongData.beatInfo.beatInterval
		}
		this.font = strings.font
		
		this.draw = new CanvasDraw(noSmoothing)
		this.assets = new ViewAssets(this)
		
		this.titleCache = new CanvasCache(noSmoothing)
		this.comboCache = new CanvasCache(noSmoothing)
		this.pauseCache = new CanvasCache(noSmoothing)
		this.branchCache = new CanvasCache(noSmoothing)
		
		this.multiplayer = this.controller.multiplayer
		
		this.touchEnabled = this.controller.touchEnabled
		this.touch = -Infinity
		this.touchAnimation = settings.getItem("touchAnimation")
		
		versionDiv.classList.add("version-hide")
		loader.screen.parentNode.insertBefore(versionDiv, loader.screen)
		
		if(this.multiplayer !== 2){
			
			if(this.controller.touchEnabled){
				this.touchDrumDiv = document.getElementById("touch-drum")
				this.touchDrumImg = document.getElementById("touch-drum-img")
				
				this.setBgImage(this.touchDrumImg, assets.image["touch_drum"].src)
				
				if(this.controller.autoPlayEnabled){
					this.touchDrumDiv.style.display = "none"
				}
				pageEvents.add(this.canvas, "touchstart", this.ontouch.bind(this))
				
				this.gameDiv.classList.add("touch-visible")
				
				this.touchFullBtn = document.getElementById("touch-full-btn")
				pageEvents.add(this.touchFullBtn, "touchend", toggleFullscreen)
				if(!fullScreenSupported){
					this.touchFullBtn.style.display = "none"
				}
				
				this.touchPauseBtn = document.getElementById("touch-pause-btn")
				pageEvents.add(this.touchPauseBtn, "touchend", () => {
					this.controller.togglePause()
				})
				if(this.multiplayer){
					this.touchPauseBtn.style.display = "none"
				}
			}
		}
		if(this.multiplayer){
			this.gameDiv.classList.add("multiplayer")
		}else{
			pageEvents.add(this.canvas, "mousedown", this.onmousedown.bind(this))
		}
	}
	run(){
		if(this.multiplayer !== 2){
			this.setBackground()
		}
		this.setDonBg()
		
		this.startTime = this.controller.game.getAccurateTime()
		this.lastMousemove = this.startTime
		pageEvents.mouseAdd(this, this.onmousemove.bind(this))
		
		this.refresh()
	}
	refresh(){
		var ctx = this.ctx
		
		var winW = innerWidth
		var winH = lastHeight
		
		if(winW / 32 > winH / 9){
			winW = winH / 9 * 32
		}
		
		this.portrait = winW < winH
		var touchMultiplayer = this.touchEnabled && this.multiplayer && !this.portrait
		
		this.pixelRatio = window.devicePixelRatio || 1
		var resolution = settings.getItem("resolution")
		if(resolution === "medium"){
			this.pixelRatio *= 0.75
		}else if(resolution === "low"){
			this.pixelRatio *= 0.5
		}else if(resolution === "lowest"){
			this.pixelRatio *= 0.25
		}
		winW *= this.pixelRatio
		winH *= this.pixelRatio
		if(this.portrait){
			var ratioX = winW / 720
			var ratioY = winH / 1280
		}else{
			var ratioX = winW / 1280
			var ratioY = winH / 720
		}
		var ratio = (ratioX < ratioY ? ratioX : ratioY)
		
		var resized = false
		if(this.winW !== winW || this.winH !== winH){
			this.winW = winW
			this.winH = winH
			this.ratio = ratio
			
			if(this.multiplayer !== 2){
				this.canvas.width = winW
				this.canvas.height = winH
				ctx.scale(ratio, ratio)
				this.canvas.style.width = (winW / this.pixelRatio) + "px"
				this.canvas.style.height = (winH / this.pixelRatio) + "px"
				
				this.titleCache.resize(640, 90, ratio)
			}
			if(!this.multiplayer){
				this.pauseCache.resize(81 * this.pauseOptions.length * 2, 464, ratio)
			}
			this.fillComboCache()
			this.setDonBgHeight()
			resized = true
		}else if(this.controller.game.paused && !document.hasFocus()){
			return
		}else if(this.multiplayer !== 2){
			ctx.clearRect(0, 0, winW / ratio, winH / ratio)
		}
		winW /= ratio
		winH /= ratio
		if(!this.controller.game.paused){
			this.ms = this.controller.game.getAccurateTime()
		}
		var ms = this.ms
		
		if(this.portrait){
			var frameTop = winH / 2 - 1280 / 2
			var frameLeft = winW / 2 - 720 / 2
		}else{
			var frameTop = winH / 2 - 720 / 2
			var frameLeft = winW / 2 - 1280 / 2
		}
		if(this.multiplayer === 2){
			frameTop += this.multiplayer === 2 ? 165 : 176
		}
		if(touchMultiplayer){
			if(!this.touchp2Class){
				this.touchp2Class = true
				this.gameDiv.classList.add("touchp2")
				this.setDonBgHeight()
			}
			frameTop -= 90
		}else if(this.touchp2Class){
			this.touchp2Class = false
			this.gameDiv.classList.remove("touchp2")
			this.setDonBgHeight()
		}
		
		ctx.save()
		ctx.translate(0, frameTop)
		
		this.drawGogoTime()
		
		if(!touchMultiplayer || this.multiplayer === 1 && frameTop >= 0){
			this.assets.drawAssets("background")
		}
		
		if(this.multiplayer !== 2){
			this.titleCache.get({
				ctx: ctx,
				x: winW - (touchMultiplayer && fullScreenSupported ? 750 : 650),
				y: touchMultiplayer ? 75 : 10,
				w: 640,
				h: 90,
				id: "title"
			}, ctx => {
				var selectedSong = this.controller.selectedSong
				
				this.draw.layeredText({
					ctx: ctx,
					text: selectedSong.title,
					fontSize: 40,
					fontFamily: this.font,
					x: 620,
					y: 20,
					width: 600,
					align: "right"
				}, [
					{outline: "#000", letterBorder: 10},
					{fill: "#fff"}
				])
				
				if(selectedSong.category){
					var _w = 142
					var _h = 22
					var _x = 628 - _w
					var _y = 88 - _h
					if(selectedSong.category in this.categories){
						ctx.fillStyle = this.categories[selectedSong.category].infoFill
					}else{
						ctx.fillStyle = this.categories.default.infoFill
					}
					this.draw.roundedRect({
						ctx: ctx,
						x: _x, y: _y,
						w: _w, h: _h,
						radius: 11
					})
					ctx.fill()
					
					if(selectedSong.category in strings.categories){
						var categoryName = strings.categories[selectedSong.category]
					}else{
						var categoryName = selectedSong.category
					}
					this.draw.layeredText({
						ctx: ctx,
						text: categoryName,
						fontSize: 15,
						fontFamily: this.font,
						align: "center",
						baseline: "middle",
						x: _x + _w / 2,
						y: _y + _h / 2,
						width: 122
					}, [
						{fill: "#fff"}
					])
				}
			})
		}
		
		var score = this.controller.getGlobalScore()
		var gaugePercent = this.rules.gaugePercent(score.gauge)
		
		if(this.multiplayer === 2){
			var scoreImg = "bg_score_p2"
			var scoreFill = "#6bbec0"
		}else{
			var scoreImg = "bg_score_p1"
			var scoreFill = "#fa4529"
		}
		
		if(this.portrait){
			// Portrait
			
			if(!this.portraitClass){
				this.portraitClass = true
				this.gameDiv.classList.add("portrait")
				this.setDonBgHeight()
			}
			
			this.slotPos = {
				x: 66,
				y: frameTop + 375,
				size: 100,
				paddingLeft: 0
			}
			this.scorePos = {x: 363, y: frameTop + (this.multiplayer === 2 ? 520 : 227)}
			
			var animPos = {
				x1: this.slotPos.x + 13,
				y1: this.slotPos.y + (this.multiplayer === 2 ? 27 : -27),
				x2: winW - 38,
				y2: frameTop + (this.multiplayer === 2 ? 484 : 293)
			}
			var taikoPos = {
				x: 19,
				y: frameTop + (this.multiplayer === 2 ? 464 : 184),
				w: 111,
				h: 130
			}
			
			ctx.fillStyle = "#000"
			ctx.fillRect(
				0,
				this.multiplayer === 2 ? 306 : 288,
				winW,
				this.multiplayer === 1 ? 184 : 183
			)
			ctx.beginPath()
			if(this.multiplayer === 2){
				ctx.moveTo(0, 467)
				ctx.lineTo(384, 467)
				ctx.lineTo(384, 512)
				ctx.lineTo(184, 560)
				ctx.lineTo(0, 560)
			}else{
				ctx.moveTo(0, 217)
				ctx.lineTo(184, 217)
				ctx.lineTo(384, 265)
				ctx.lineTo(384, 309)
				ctx.lineTo(0, 309)
			}
			ctx.fill()
			
			// Left side
			ctx.fillStyle = scoreFill
			var leftSide = (ctx, mul) => {
				ctx.beginPath()
				if(this.multiplayer === 2){
					ctx.moveTo(0, 468 * mul)
					ctx.lineTo(380 * mul, 468 * mul)
					ctx.lineTo(380 * mul, 512 * mul)
					ctx.lineTo(184 * mul, 556 * mul)
					ctx.lineTo(0, 556 * mul)
				}else{
					ctx.moveTo(0, 221 * mul)
					ctx.lineTo(184 * mul, 221 * mul)
					ctx.lineTo(380 * mul, 265 * mul)
					ctx.lineTo(380 * mul, 309 * mul)
					ctx.lineTo(0, 309 * mul)
				}
			}
			leftSide(ctx, 1)
			ctx.fill()
			ctx.globalAlpha = 0.5
			this.draw.pattern({
				ctx: ctx,
				img: assets.image[scoreImg],
				shape: leftSide,
				dx: 0,
				dy: 45,
				scale: 1.55
			})
			ctx.globalAlpha = 1
			
			// Score background
			ctx.fillStyle = "#000"
			ctx.beginPath()
			if(this.multiplayer === 2){
				this.draw.roundedCorner(ctx, 184, 512, 20, 0)
				ctx.lineTo(384, 512)
				this.draw.roundedCorner(ctx, 384, 560, 12, 2)
				ctx.lineTo(184, 560)
			}else{
				ctx.moveTo(184, 217)
				this.draw.roundedCorner(ctx, 384, 217, 12, 1)
				ctx.lineTo(384, 265)
				this.draw.roundedCorner(ctx, 184, 265, 20, 3)
			}
			ctx.fill()
			
			// Difficulty
			if(this.controller.selectedSong.difficulty){
				ctx.drawImage(assets.image["difficulty"],
					0, 144 * this.difficulty[this.controller.selectedSong.difficulty],
					168, 143,
					126, this.multiplayer === 2 ? 497 : 228,
					62, 53
				)
			}
			
			// Badges
			if(this.controller.autoPlayEnabled && !this.controller.multiplayer){
				this.ctx.drawImage(assets.image["badge_auto"],
					183,
					this.multiplayer === 2 ? 490 : 265,
					23,
					23
				)
			}
			
			// Gauge
			ctx.fillStyle = "#000"
			ctx.beginPath()
			var gaugeX = winW - 788 * 0.7 - 32
			if(this.multiplayer === 2){
				ctx.moveTo(gaugeX, 464)
				ctx.lineTo(winW, 464)
				ctx.lineTo(winW, 489)
				this.draw.roundedCorner(ctx, gaugeX, 489, 12, 3)
			}else{
				this.draw.roundedCorner(ctx, gaugeX, 288, 12, 0)
				ctx.lineTo(winW, 288)
				ctx.lineTo(winW, 314)
				ctx.lineTo(gaugeX, 314)
			}
			ctx.fill()
			this.draw.gauge({
				ctx: ctx,
				x: winW,
				y: this.multiplayer === 2 ? 468 : 273,
				clear: this.rules.gaugeClear,
				percentage: gaugePercent,
				font: this.font,
				scale: 0.7,
				multiplayer: this.multiplayer === 2,
				blue: this.multiplayer === 2
			})
			this.draw.soul({
				ctx: ctx,
				x: winW - 40,
				y: this.multiplayer === 2 ? 484 : 293,
				scale: 0.75,
				cleared: this.rules.clearReached(score.gauge)
			})
			
			// Note bar
			ctx.fillStyle = "#2c2a2c"
			ctx.fillRect(0, 314, winW, 122)
			ctx.fillStyle = "#847f84"
			ctx.fillRect(0, 440, winW, 24)
		
		}else{
			// Landscape
			
			if(this.portraitClass){
				this.portraitClass = false
				this.gameDiv.classList.remove("portrait")
				this.setDonBgHeight()
			}
			
			this.slotPos = {
				x: 413,
				y: frameTop + 257,
				size: 106,
				paddingLeft: 332
			}
			this.scorePos = {
				x: 155,
				y: frameTop + (this.multiplayer === 2 ? 318 : 193)
			}
			
			var animPos = {
				x1: this.slotPos.x + 14,
				y1: this.slotPos.y + (this.multiplayer === 2 ? 29 : -29),
				x2: winW - 55,
				y2: frameTop + (this.multiplayer === 2 ? 378 : 165)
			}
			var taikoPos = {x: 179, y: frameTop + 190, w: 138, h: 162}
			
			ctx.fillStyle = "#000"
			ctx.fillRect(
				0,
				184,
				winW,
				this.multiplayer === 1 ? 177 : 176
			)
			ctx.beginPath()
			if(this.multiplayer === 2){
				ctx.moveTo(328, 351)
				ctx.lineTo(winW, 351)
				ctx.lineTo(winW, 385)
				this.draw.roundedCorner(ctx, 328, 385, 10, 3)
			}else{
				ctx.moveTo(328, 192)
				this.draw.roundedCorner(ctx, 328, 158, 10, 0)
				ctx.lineTo(winW, 158)
				ctx.lineTo(winW, 192)
			}
			ctx.fill()
			
			// Gauge
			this.draw.gauge({
				ctx: ctx,
				x: winW,
				y: this.multiplayer === 2 ? 357 : 135,
				clear: this.rules.gaugeClear,
				percentage: gaugePercent,
				font: this.font,
				multiplayer: this.multiplayer === 2,
				blue: this.multiplayer === 2
			})
			this.draw.soul({
				ctx: ctx,
				x: winW - 57,
				y: this.multiplayer === 2 ? 378 : 165,
				cleared: this.rules.clearReached(score.gauge)
			})
			
			// Note bar
			ctx.fillStyle = "#2c2a2c"
			ctx.fillRect(332, 192, winW - 332, 130)
			ctx.fillStyle = "#847f84"
			ctx.fillRect(332, 326, winW - 332, 26)
			
			// Left side
			ctx.fillStyle = scoreFill
			ctx.fillRect(0, 192, 328, 160)
			ctx.globalAlpha = 0.5
			this.draw.pattern({
				ctx: ctx,
				img: assets.image[scoreImg],
				x: 0,
				y: 192,
				w: 328,
				h: 160,
				dx: 0,
				dy: 45,
				scale: 1.55
			})
			ctx.globalAlpha = 1
			
			// Difficulty
			if(this.controller.selectedSong.difficulty){
				ctx.drawImage(assets.image["difficulty"],
					0, 144 * this.difficulty[this.controller.selectedSong.difficulty],
					168, 143,
					16, this.multiplayer === 2 ? 194 : 232,
					141, 120
				)
				var diff = this.controller.selectedSong.difficulty
				var text = strings[diff === "ura" ? "oni" : diff]
				ctx.font = this.draw.bold(this.font) + "20px " + this.font
				ctx.textAlign = "center"
				ctx.textBaseline = "bottom"
				ctx.strokeStyle = "#000"
				ctx.fillStyle = "#fff"
				ctx.lineWidth = 7
				ctx.miterLimit = 1
				ctx.strokeText(text, 87, this.multiplayer === 2 ? 310 : 348)
				ctx.fillText(text, 87, this.multiplayer === 2 ? 310 : 348)
				ctx.miterLimit = 10
			}
			
			// Badges
			if(this.controller.autoPlayEnabled && !this.controller.multiplayer){
				this.ctx.drawImage(assets.image["badge_auto"],
					125, 235, 34, 34
				)
			}
			
			// Score background
			ctx.fillStyle = "#000"
			ctx.beginPath()
			if(this.multiplayer === 2){
				ctx.moveTo(0, 312)
				this.draw.roundedCorner(ctx, 176, 312, 20, 1)
				ctx.lineTo(176, 353)
				ctx.lineTo(0, 353)
			}else{
				ctx.moveTo(0, 191)
				ctx.lineTo(176, 191)
				this.draw.roundedCorner(ctx, 176, 232, 20, 2)
				ctx.lineTo(0, 232)
			}
			ctx.fill()
		}
		
		ctx.restore()
		
		animPos.w = animPos.x2 - animPos.x1
		animPos.h = animPos.y1 - animPos.y2
		this.animateBezier = [{
			// 427, 228
			x: animPos.x1,
			y: animPos.y1
		}, {
			// 560, 10
			x: animPos.x1 + animPos.w / 6,
			y: animPos.y1 - animPos.h * (this.multiplayer === 2 ? 2.5 : 3.5)
		}, {
			// 940, -150
			x: animPos.x2 - animPos.w / 3,
			y: animPos.y2 - animPos.h * (this.multiplayer === 2 ? 3.5 : 5)
		}, {
			// 1225, 165
			x: animPos.x2,
			y: animPos.y2
		}]
		
		var touchTop = frameTop + (touchMultiplayer ? 135 : 0)
		this.touchDrum = (() => {
			var sw = 842
			var sh = 340
			var x = 0
			var y = this.portrait ? touchTop + 477 : touchTop + 365
			var paddingTop = 13
			var w = winW
			var maxH = winH - y
			var h = maxH - paddingTop
			if(w / h >= sw / sh){
				w = h / sh * sw
				x = (winW - w) / 2
				y += paddingTop
			}else{
				h = w / sw * sh
				y = y + (maxH - h)
			}
			return {
				x: x, y: y, w: w, h: h
			}
		})()
		this.touchCircle = {
			x: winW / 2,
			y: winH + this.touchDrum.h * 0.1,
			rx: this.touchDrum.w / 2 - this.touchDrum.h * 0.03,
			ry: this.touchDrum.h * 1.07
		}
		
		if(this.multiplayer !== 2){
			this.mouseIdle()
			this.drawTouch()
		}
		
		// Score
		ctx.save()
		ctx.font = "30px TnT, Meiryo, sans-serif"
		ctx.fillStyle = "#fff"
		ctx.strokeStyle = "#fff"
		ctx.lineWidth = 0.3
		ctx.textAlign = "center"
		ctx.textBaseline = "top"
		var glyph = 29
		var pointsText = score.points.toString().split("")
		ctx.translate(this.scorePos.x, this.scorePos.y)
		ctx.scale(0.7, 1)
		for(var i in pointsText){
			var x = glyph * (i - pointsText.length + 1)
			ctx.strokeText(pointsText[i], x, 0)
			ctx.fillText(pointsText[i], x, 0)
		}
		ctx.restore()
		
		// Branch background
		var keyTime = this.controller.getKeyTime()
		var sound = keyTime["don"] > keyTime["ka"] ? "don" : "ka"
		var padding = this.slotPos.paddingLeft
		var mul = this.slotPos.size / 106
		var barY = this.slotPos.y - 65 * mul
		var barH = 130 * mul
		
		if(this.branchAnimate && ms <= this.branchAnimate.ms + 300){
			var alpha = Math.max(0, (ms - this.branchAnimate.ms) / 300)
			ctx.globalAlpha = 1 - alpha
			ctx.fillStyle = this.branchMap[this.branchAnimate.fromBranch].bg
			ctx.fillRect(padding, barY, winW - padding, barH)
			ctx.globalAlpha = alpha
		}
		if(this.branch){
			ctx.fillStyle = this.branchMap[this.branch].bg
			ctx.fillRect(padding, barY, winW - padding, barH)
			ctx.globalAlpha = 1
		}
		
		// Current branch text
		if(this.branch){
			if(resized){
				this.fillBranchCache()
			}
			var textW = Math.floor(260 * mul)
			var textH = Math.floor(barH)
			var textX = winW - textW
			var oldOffset = 0
			var newOffset = 0
			var elapsed = ms - this.startTime
			if(elapsed < 250){
				textX = winW
			}else if(elapsed < 500){
				textX += (1 - this.draw.easeOutBack((elapsed - 250) / 250)) * textW
			}
			if(this.branchAnimate && ms - this.branchAnimate.ms < 310 && ms >= this.branchAnimate.ms){
				var fromBranch = this.branchAnimate.fromBranch
				var elapsed = ms - this.branchAnimate.ms
				var reverse = fromBranch === "master" || fromBranch === "advanced" && this.branch === "normal" ? -1 : 1
				if(elapsed < 65){
					oldOffset = elapsed / 65 * 12 * mul * reverse
					ctx.globalAlpha = 1
					var newAlpha = 0
				}else if(elapsed < 215){
					var animPoint = (elapsed - 65) / 150
					oldOffset = (12 - animPoint * 48) * mul * reverse
					newOffset = (36 - animPoint * 48) * mul * reverse
					ctx.globalAlpha = this.draw.easeIn(1 - animPoint)
					var newAlpha = this.draw.easeIn(animPoint)
				}else{
					newOffset = (1 - (elapsed - 215) / 95) * -12 * mul * reverse
					ctx.globalAlpha = 0
					var newAlpha = 1
				}
				this.branchCache.get({
					ctx: ctx,
					x: textX, y: barY + oldOffset,
					w: textW, h: textH,
					id: fromBranch
				})
				ctx.globalAlpha = newAlpha
			}
			this.branchCache.get({
				ctx: ctx,
				x: textX, y: barY + newOffset,
				w: textW, h: textH,
				id: this.branch
			})
			ctx.globalAlpha = 1
		}
		
		// Go go time background
		if(this.gogoTime || ms <= this.gogoTimeStarted + 100){
			var grd = ctx.createLinearGradient(padding, 0, winW, 0)
			grd.addColorStop(0, "rgba(255, 0, 0, 0.16)")
			grd.addColorStop(0.45, "rgba(255, 0, 0, 0.28)")
			grd.addColorStop(0.77, "rgba(255, 83, 157, 0.4)")
			grd.addColorStop(1, "rgba(255, 83, 157, 0)")
			ctx.fillStyle = grd
			if(!this.touchEnabled){
				var alpha = Math.min(100, ms - this.gogoTimeStarted) / 100
				if(!this.gogoTime){
					alpha = 1 - alpha
				}
				ctx.globalAlpha = alpha
			}
			ctx.fillRect(padding, barY, winW - padding, barH)
		}
		
		// Bar pressed keys
		if(keyTime[sound] > ms - 130){
			var gradients = {
				"don": "255, 0, 0",
				"ka": "0, 170, 255"
			}
			var yellow = "255, 231, 0"
			var currentGradient = gradients[sound]
			ctx.globalCompositeOperation = "lighter"
			do{
				var grd = ctx.createLinearGradient(padding, 0, winW, 0)
				grd.addColorStop(0, "rgb(" + currentGradient + ")")
				grd.addColorStop(1, "rgba(" + currentGradient + ", 0)")
				ctx.fillStyle = grd
				ctx.globalAlpha = (1 - (ms - keyTime[sound]) / 130) / 5
				ctx.fillRect(padding, barY, winW - padding, barH)
			}while(this.currentScore.ms > ms - 130 && currentGradient !== yellow && (currentGradient = yellow))
			ctx.globalCompositeOperation = "source-over"
		}
		ctx.globalAlpha = 1
		
		// Taiko
		ctx.drawImage(assets.image["taiko"],
			0, 0, 138, 162,
			taikoPos.x, taikoPos.y, taikoPos.w, taikoPos.h
		)
		
		// Taiko pressed keys
		var keys = ["ka_l", "ka_r", "don_l", "don_r"]
		
		for(var i = 0; i < keys.length; i++){
			var keyMS = ms - keyTime[keys[i]]
			if(keyMS < 130){
				if(keyMS > 70 && !this.touchEnabled){
					ctx.globalAlpha = this.draw.easeOut(1 - (keyMS - 70) / 60)
				}
				ctx.drawImage(assets.image["taiko"],
					0, 162 * (i + 1), 138, 162,
					taikoPos.x, taikoPos.y, taikoPos.w, taikoPos.h
				)
			}
		}
		ctx.globalAlpha = 1
		
		// Combo
		var scoreMS = ms - this.currentScore.ms
		
		var comboCount = this.controller.getCombo()
		if(comboCount >= 3){
			var comboText = comboCount.toString().split("")
			var mul = this.portrait ? 0.8 : 1
			var comboX = taikoPos.x + taikoPos.w / 2
			var comboY = taikoPos.y + taikoPos.h * 0.09
			var comboScale = 0
			if(this.currentScore !== 0 && scoreMS < 100){
				comboScale = this.draw.fade(scoreMS / 100)
			}
			var glyphW = 51
			var glyphH = 65
			var letterSpacing = (comboText.length >= 4 ? 38 : 42) * mul
			var orange = comboCount >= 100 ? "1" : "0"
			
			var w = glyphW * mul
			var h = glyphH * mul * (1 + comboScale / 8)
			
			for(var i in comboText){
				var textX = comboX + letterSpacing * (i - (comboText.length - 1) / 2)
				this.comboCache.get({
					ctx: ctx,
					x: textX - w / 2,
					y: comboY + glyphH * mul - h,
					w: w,
					h: h,
					id: orange + "combo" + comboText[i]
				})
			}
			
			var fontSize = 24 * mul
			var comboTextY = taikoPos.y + taikoPos.h * 0.63
			if(orange === "1"){
				var grd = ctx.createLinearGradient(
					0,
					comboTextY - fontSize * 0.6,
					0,
					comboTextY + fontSize * 0.1
				)
				grd.addColorStop(0, "#ff2000")
				grd.addColorStop(0.5, "#ffc321")
				grd.addColorStop(1, "#ffedb7")
				ctx.fillStyle = grd
			}else{
				ctx.fillStyle = "#fff"
			}
			ctx.font = this.draw.bold(this.font) + fontSize + "px " + this.font
			ctx.lineWidth = 7 * mul
			ctx.textAlign = "center"
			ctx.miterLimit = 1
			ctx.strokeStyle = "#000"
			ctx.strokeText(strings.combo, comboX, comboTextY)
			ctx.miterLimit = 10
			ctx.fillText(strings.combo, comboX, comboTextY)
		}
		
		// Slot
		this.draw.slot(ctx, this.slotPos.x, this.slotPos.y, this.slotPos.size)
		
		// Measures
		ctx.save()
		ctx.beginPath()
		ctx.rect(this.slotPos.paddingLeft, 0, winW - this.slotPos.paddingLeft, winH)
		ctx.clip()
		this.drawMeasures()
		ctx.restore()
		
		// Go go time fire
		this.assets.drawAssets("bar")
		
		// Hit notes shadow
		if(scoreMS < 300 && this.currentScore.type){
			var fadeOut = scoreMS > 120 && !this.touchEnabled
			if(fadeOut){
				ctx.globalAlpha = 1 - (scoreMS - 120) / 180
			}
			var scoreId = this.currentScore.type === 230 ? 0 : 1
			if(this.currentScore.bigNote){
				scoreId += 2
			}
			ctx.drawImage(assets.image["notes_hit"],
				0, 128 * scoreId, 128, 128,
				this.slotPos.x - 64, this.slotPos.y - 64,
				128, 128
			)
			if(fadeOut){
				ctx.globalAlpha = 1
			}
		}
		
		// Future notes
		this.updateNoteFaces()
		ctx.save()
		ctx.beginPath()
		ctx.rect(this.slotPos.paddingLeft, 0, winW - this.slotPos.paddingLeft, winH)
		ctx.clip()
		
		this.drawCircles(this.controller.getCircles())
		if(this.controller.game.calibrationState === "video"){
			if(ms % this.beatInterval < 1000 / 60 * 5){
				this.drawCircle({
					ms: ms,
					type: "don",
					endTime: ms + 100,
					speed: 0
				}, {
					x: this.slotPos.x,
					y: this.slotPos.y
				})
			}
		}
		
		ctx.restore()
		
		// Hit notes explosion
		this.assets.drawAssets("notes")
		
		// Good, OK, Bad
		if(scoreMS < 300){
			var mul = this.slotPos.size / 106
			var scores = {
				"0": "bad",
				"230": "ok",
				"450": "good"
			}
			var yOffset = scoreMS < 70 ? scoreMS * (13 / 70) : 0
			var fadeOut = scoreMS > 250 && !this.touchEnabled
			if(fadeOut){
				ctx.globalAlpha = 1 - (scoreMS - 250) / 50
			}
			this.draw.score({
				ctx: ctx,
				score: scores[this.currentScore.type],
				x: this.slotPos.x,
				y: this.slotPos.y - 98 * mul - yOffset,
				scale: 1.35 * mul,
				align: "center"
			})
			if(fadeOut){
				ctx.globalAlpha = 1
			}
		}
		
		// Animating notes
		this.drawAnimatedCircles(this.controller.getCircles())
		this.drawAnimatedCircles(this.drumroll)
		
		// Go-go time fireworks
		if(!this.touchEnabled && !this.portrait && !this.multiplayer){
			this.assets.drawAssets("foreground")
		}
		
		// Pause screen
		if(!this.multiplayer && this.controller.game.paused){
			ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
			ctx.fillRect(0, 0, winW, winH)
			
			ctx.save()
			if(this.portrait){
				ctx.translate(frameLeft - 242, frameTop + 308)
				var pauseScale = 720 / 766
				ctx.scale(pauseScale, pauseScale)
			}else{
				ctx.translate(frameLeft, frameTop)
			}
			
			var state = this.controller.game.calibrationState
			if(state && state in strings.calibration){
				var boldTitle = strings.calibration[state].title
			}
			if(boldTitle){
				this.draw.layeredText({
					ctx: ctx,
					text: boldTitle,
					fontSize: 35,
					fontFamily: this.font,
					x: 300,
					y: 70
				}, [
					{outline: "#fff", letterBorder: 22}
				])
			}
			var pauseRect = (ctx, mul) => {
				this.draw.roundedRect({
					ctx: ctx,
					x: 269 * mul,
					y: 93 * mul,
					w: 742 * mul,
					h: 494 * mul,
					radius: 17 * mul
				})
			}
			pauseRect(ctx, 1)
			ctx.strokeStyle = "#fff"
			ctx.lineWidth = 24
			ctx.stroke()
			ctx.strokeStyle = "#000"
			ctx.lineWidth = 12
			ctx.stroke()
			this.draw.pattern({
				ctx: ctx,
				img: assets.image["bg_pause"],
				shape: pauseRect,
				dx: 68,
				dy: 11
			})
			if(boldTitle){
				this.draw.layeredText({
					ctx: ctx,
					text: boldTitle,
					fontSize: 35,
					fontFamily: this.font,
					x: 300,
					y: 70
				}, [
					{outline: "#000", letterBorder: 10},
					{fill: "#fff"}
				])
			}
			
			switch(state){
				case "audioHelp":
				case "videoHelp":
				case "results":
					var content = state === "audioHelp" && this.touchEnabled ? "contentAlt" : "content"
					if(state === "audioHelp"){
						var kbdSettings = settings.getItem("keyboardSettings")
						var keys = [
							kbdSettings.don_l[0].toUpperCase(),
							kbdSettings.don_r[0].toUpperCase()
						]
						var substitute = (config, index, width) => {
							var ctx = config.ctx
							var bold = this.draw.bold(config.fontFamily)
							ctx.font = bold + (config.fontSize * 0.66) + "px " + config.fontFamily
							var w = config.fontSize * 0.6 + ctx.measureText(keys[index]).width
							if(width){
								return w
							}else{
								var h = 30
								ctx.lineWidth = 3
								ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
								this.draw.roundedRect({
									ctx: ctx,
									x: 0, y: 1, w: w, h: h,
									radius: 3
								})
								ctx.stroke()
								ctx.strokeStyle = "#ccc"
								ctx.fillStyle = "#fff"
								this.draw.roundedRect({
									ctx: ctx,
									x: 0, y: 0, w: w, h: h,
									radius: 3
								})
								ctx.stroke()
								ctx.fill()
								ctx.fillStyle = "#f7f7f7"
								ctx.fillRect(2, 2, w - 4, h - 4)
								
								ctx.fillStyle = "#333"
								ctx.textBaseline = "middle"
								ctx.textAlign = "center"
								ctx.fillText(keys[index], w / 2, h / 2)
							}
						}
					}else if(state === "results"){
						var progress = this.controller.game.calibrationProgress
						var latency = [
							progress.audio,
							progress.video
						]
						var substitute = (config, index, width) => {
							var ctx = config.ctx
							var bold = this.draw.bold(config.fontFamily)
							ctx.font = bold + (config.fontSize * 1.1) + "px " + config.fontFamily
							var text = this.addMs(latency[index])
							if(width){
								return ctx.measureText(text).width
							}else{
								ctx.fillText(text, 0, 0)
							}
						}
					}else{
						var substitute = null
					}
					this.draw.wrappingText({
						ctx: ctx,
						text: strings.calibration[state][content],
						fontSize: 30,
						fontFamily: this.font,
						x: 300,
						y: 130,
						width: 680,
						height: 240,
						lineHeight: 35,
						fill: "#000",
						verticalAlign: "middle",
						substitute: substitute
					})
					
					var _x = 640
					var _w = 464
					var _h = 80
					for(var i = 0; i < this.pauseOptions.length; i++){
						var text = this.pauseOptions[i]
						var _y = 470 - 90 * (this.pauseOptions.length - i - 1)
						if(this.state.moveHover !== null){
							var selected = i === this.state.moveHover
						}else{
							var selected = i === this.state.pausePos
						}
						if(selected){
							ctx.fillStyle = "#ffb447"
							this.draw.roundedRect({
								ctx: ctx,
								x: _x - _w / 2,
								y: _y,
								w: _w,
								h: _h,
								radius: 30
							})
							ctx.fill()
						}
						if(selected){
							var layers = [
								{outline: "#000", letterBorder: 10},
								{fill: "#fff"}
							]
						}else{
							var layers = [
								{fill: "#000"}
							]
						}
						this.draw.layeredText({
							ctx: ctx,
							text: text,
							x: _x,
							y: _y + 18,
							width: _w,
							height: _h - 54,
							fontSize: 40,
							fontFamily: this.font,
							letterSpacing: -1,
							align: "center"
						}, layers)
						
						var highlight = 0
						if(this.state.moveHover === i){
							highlight = 2
						}else if(selected){
							highlight = 1
						}
						if(highlight){
							this.draw.highlight({
								ctx: ctx,
								x: _x - _w / 2 - 3.5,
								y: _y - 3.5,
								w: _w + 7,
								h: _h + 7,
								animate: highlight === 1,
								animateMS: this.state.moveMS,
								opacity: highlight === 2 ? 0.8 : 1,
								radius: 30
							})
						}
					}
					break
				case "audioComplete":
				case "videoComplete":
					this.draw.wrappingText({
						ctx: ctx,
						text: strings.calibration[state],
						fontSize: 40,
						fontFamily: this.font,
						x: 300,
						y: 130,
						width: 680,
						height: 420,
						lineHeight: 47,
						fill: "#000",
						verticalAlign: "middle",
						textAlign: "center",
					})
					break
				default:
					ctx.drawImage(assets.image["mimizu"],
						313, 247, 136, 315
					)
					
					var _y = 108
					var _w = 80
					var _h = 464
					for(var i = 0; i < this.pauseOptions.length; i++){
						var text = this.pauseOptions[i]
						if(this.controller.calibrationMode && i === this.pauseOptions.length - 1){
							text = strings.calibration.back
						}
						var _x = 520 + 110 * i
						if(this.state.moveHover !== null){
							var selected = i === this.state.moveHover
						}else{
							var selected = i === this.state.pausePos
						}
						if(selected){
							ctx.fillStyle = "#ffb447"
							this.draw.roundedRect({
								ctx: ctx,
								x: _x - _w / 2,
								y: _y,
								w: _w,
								h: _h,
								radius: 30
							})
							ctx.fill()
						}
						this.pauseCache.get({
							ctx: ctx,
							x: _x - _w / 2,
							y: _y,
							w: _w,
							h: _h,
							id: text + (selected ? "1" : "0")
						}, ctx => {
							var textConfig = {
								ctx: ctx,
								text: text,
								x: _w / 2,
								y: 18,
								width: _w,
								height: _h - 54,
								fontSize: 40,
								fontFamily: this.font,
								letterSpacing: -1
							}
							if(selected){
								textConfig.fill = "#fff"
								textConfig.outline = "#000"
								textConfig.outlineSize = 10
							}else{
								textConfig.fill = "#000"
							}
							this.draw.verticalText(textConfig)
						})
						
						var highlight = 0
						if(this.state.moveHover === i){
							highlight = 2
						}else if(selected){
							highlight = 1
						}
						if(highlight){
							this.draw.highlight({
								ctx: ctx,
								x: _x - _w / 2 - 3.5,
								y: _y - 3.5,
								w: _w + 7,
								h: _h + 7,
								animate: highlight === 1,
								animateMS: this.state.moveMS,
								opacity: highlight === 2 ? 0.8 : 1,
								radius: 30
							})
						}
					}
					break
			}
			
			ctx.restore()
		}
	}
	addMs(input){
		var split = strings.calibration.ms.split("%s")
		var index = 0
		var output = ""
		var inputStrings = [(input > 0 ? "+" : "") + input.toString()]
		split.forEach((string, i) => {
			if(i !== 0){
				output += inputStrings[index++]
			}
			output += string
		})
		return output
	}
	setBackground(){
		var selectedSong = this.controller.selectedSong
		var songSkinName = selectedSong.songSkin.name
		var supportsBlend = "mixBlendMode" in this.songBg.style
		var songLayers = [document.getElementById("layer1"), document.getElementById("layer2")]
		var prefix = ""
		
		if(selectedSong.category in this.categories){
			var catId = this.categories[selectedSong.category].sort
		}else{
			var catId = this.categories.default.sort
		}
		
		if(!selectedSong.songSkin.song){
			var id = selectedSong.songBg
			this.songBg.classList.add("songbg-" + id)
			this.setLayers(songLayers, "bg_song_" + id + (supportsBlend ? "" : "a"), supportsBlend)
		}else if(selectedSong.songSkin.song !== "none"){
			var prefix = selectedSong.songSkin.prefix || ""
			var notStatic = selectedSong.songSkin.song !== "static"
			if(notStatic){
				this.songBg.classList.add("songbg-" + selectedSong.songSkin.song)
			}
			this.setLayers(songLayers, prefix + "bg_song_" + songSkinName + (notStatic ? "_" : ""), notStatic)
		}
		
		if(!selectedSong.songSkin.stage){
			this.songStage.classList.add("song-stage-" + selectedSong.songStage)
			this.setBgImage(this.songStage, assets.image["bg_stage_" + selectedSong.songStage].src)
		}else if(selectedSong.songSkin.stage !== "none"){
			var prefix = selectedSong.songSkin.prefix || ""
			this.setBgImage(this.songStage, assets.image[prefix + "bg_stage_" + songSkinName].src)
		}
	}
	setDonBg(){
		var selectedSong = this.controller.selectedSong
		var songSkinName = selectedSong.songSkin.name
		var donLayers = []
		var filename = !selectedSong.songSkin.don && this.multiplayer === 2 ? "bg_don2_" : "bg_don_"
		var prefix = ""
		
		this.donBg = document.createElement("div")
		this.donBg.classList.add("donbg")
		if(this.multiplayer === 2){
			this.donBg.classList.add("donbg-bottom")
		}
		for(var layer = 1; layer <= 3; layer++){
			var donLayer = document.createElement("div")
			donLayer.classList.add("donlayer" + layer)
			this.donBg.appendChild(donLayer)
			if(layer !== 3){
				donLayers.push(donLayer)
			}
		}
		this.songBg.parentNode.insertBefore(this.donBg, this.songBg)
		var asset1, asset2
		if(!selectedSong.songSkin.don){
			this.donBg.classList.add("donbg-" + selectedSong.donBg)
			this.setLayers(donLayers, filename + selectedSong.donBg, true)
			asset1 = filename + selectedSong.donBg + "a"
			asset2 = filename + selectedSong.donBg + "b"
		}else if(selectedSong.songSkin.don !== "none"){
			var prefix = selectedSong.songSkin.prefix || ""
			var notStatic = selectedSong.songSkin.don !== "static"
			if(notStatic){
				this.donBg.classList.add("donbg-" + selectedSong.songSkin.don)
				asset1 = filename + songSkinName + "_a"
				asset2 = filename + songSkinName + "_b"
			}else{
				asset1 = filename + songSkinName
				asset2 = filename + songSkinName
			}
			this.setLayers(donLayers, prefix + filename + songSkinName + (notStatic ? "_" : ""), notStatic)
		}else{
			return
		}
		var w1 = assets.image[prefix + asset1].width
		var w2 = assets.image[prefix + asset2].width
		this.donBg.style.setProperty("--sw", w1 > w2 ? w1 : w2)
		this.donBg.style.setProperty("--sw1", w1)
		this.donBg.style.setProperty("--sw2", w2)
		this.donBg.style.setProperty("--sh1", assets.image[prefix + asset1].height)
		this.donBg.style.setProperty("--sh2", assets.image[prefix + asset2].height)
	}
	setDonBgHeight(){
		this.donBg.style.setProperty("--h", getComputedStyle(this.donBg).height)
		var gameDiv = this.gameDiv
		gameDiv.classList.add("fix-animations")
		setTimeout(()=>{
			gameDiv.classList.remove("fix-animations")
		}, 50)
	}
	setLayers(elements, file, ab){
		if(ab){
			this.setBgImage(elements[0], assets.image[file + "a"].src)
			this.setBgImage(elements[1], assets.image[file + "b"].src)
		}else{
			this.setBgImage(elements[0], assets.image[file].src)
		}
	}
	setBgImage(element, url){
		element.style.backgroundImage = "url('" + url + "')"
	}
	
	drawMeasures(){
		var measures = this.controller.parsedSongData.measures
		var ms = this.getMS()
		var mul = this.slotPos.size / 106
		var distanceForCircle = this.winW / this.ratio - this.slotPos.x
		var measureY = this.slotPos.y - 65 * mul
		var measureH = 130 * mul
		
		measures.forEach(measure => {
			var timeForDistance = this.posToMs(distanceForCircle, measure.speed)
			var startingTime = measure.ms - timeForDistance + this.controller.videoLatency
			var finishTime = measure.ms + this.posToMs(this.slotPos.x - this.slotPos.paddingLeft + 3, measure.speed) + this.controller.videoLatency
			if(measure.visible && (!measure.branch || measure.branch.active) && ms >= startingTime && ms <= finishTime){
				var measureX = this.slotPos.x + this.msToPos(measure.ms - ms + this.controller.videoLatency, measure.speed)
				this.ctx.strokeStyle = measure.branchFirst ? "#ff0" : "#bdbdbd"
				this.ctx.lineWidth = 3
				this.ctx.beginPath()
				this.ctx.moveTo(measureX, measureY)
				this.ctx.lineTo(measureX, measureY + measureH)
				this.ctx.stroke()
			}
			if(this.multiplayer !== 2 && ms >= measure.ms && measure.nextBranch && !measure.viewChecked && measure.gameChecked){
				measure.viewChecked = true
				if(measure.nextBranch.active !== this.branch){
					this.branchAnimate.ms = ms
					this.branchAnimate.fromBranch = this.branch
				}
				this.branch = measure.nextBranch.active
			}
		})
	}
	updateNoteFaces(){
		var ms = this.getMS()
		while(ms >= this.nextBeat){
			this.nextBeat += this.beatInterval
			if(this.controller.getCombo() >= 50){
				var face = Math.floor(ms / this.beatInterval) % 2
				this.noteFace = {
					small: face,
					big: face + 2
				}
			}else{
				this.noteFace = {
					small: 0,
					big: 3
				}
			}
		}
	}
	drawCircles(circles){
		var distanceForCircle = this.winW / this.ratio - this.slotPos.x
		var ms = this.getMS()
		
		for(var i = circles.length; i--;){
			var circle = circles[i]
			var speed = circle.speed
			
			var timeForDistance = this.posToMs(distanceForCircle + this.slotPos.size / 2, speed)
			var startingTime = circle.ms - timeForDistance + this.controller.videoLatency
			var finishTime = circle.endTime + this.posToMs(this.slotPos.x - this.slotPos.paddingLeft + this.slotPos.size * 2, speed) + this.controller.videoLatency
			
			if(circle.isPlayed <= 0 || circle.score === 0){
				if((!circle.branch || circle.branch.active) && ms >= startingTime && ms <= finishTime && circle.isPlayed !== -1){
					this.drawCircle(circle)
				}
			}else if(!circle.animating){
				// Start animation to gauge
				circle.animate(ms)
			}
			if(ms >= circle.ms && !circle.gogoChecked && (!circle.branch || circle.branch.active)){
				if(this.gogoTime != circle.gogoTime){
					this.toggleGogoTime(circle)
				}
				circle.gogoChecked = true
			}
		}
	}
	drawAnimatedCircles(circles){
		var ms = this.getMS()
		
		for(var i = 0; i < circles.length; i++){
			var circle = circles[i]
			
			if(circle.animating){
				
				var animT = circle.animT
				if(ms < animT + 490){
					
					if(circle.fixedPos){
						circle.fixedPos = false
						circle.animT = ms
						animT = ms
					}
					var animPoint = (ms - animT) / 490
					var bezierPoint = this.calcBezierPoint(this.draw.easeOut(animPoint), this.animateBezier)
					this.drawCircle(circle, {x: bezierPoint.x, y: bezierPoint.y})
					
				}else if(ms < animT + 810){
					var pos = this.animateBezier[3]
					this.drawCircle(circle, pos, (ms - animT - 490) / 160)
				}else{
					circle.animationEnded = true
				}
			}
		}
	}
	calcBezierPoint(t, data){
		var at = 1 - t
		data = data.slice()
		
		for(var i = 1; i < data.length; i++){
			for(var k = 0; k < data.length - i; k++){
				data[k] = {
					x: data[k].x * at + data[k + 1].x * t,
					y: data[k].y * at + data[k + 1].y * t
				}
			}
		}
		return data[0]
	}
	drawCircle(circle, circlePos, fade){
		var ctx = this.ctx
		var mul = this.slotPos.size / 106
		
		var bigCircleSize = 106 * mul / 2
		var circleSize = 70 * mul / 2
		var lyricsSize = 20 * mul
		
		var fill, size, faceID
		var type = circle.type
		var ms = this.getMS()
		var circleMs = circle.ms
		var endTime = circle.endTime
		var animated = circle.animating
		var speed = circle.speed
		var played = circle.isPlayed
		var drumroll = 0
		var endX = 0
		
		if(!circlePos){
			circlePos = {
				x: this.slotPos.x + this.msToPos(circleMs - ms + this.controller.videoLatency, speed),
				y: this.slotPos.y
			}
		}
		if(animated){
			var noteFace = {
				small: 0,
				big: 3
			}
		}else{
			var noteFace = this.noteFace
		}
		if(type === "don" || type === "daiDon" && played === 1){
			fill = "#f34728"
			size = circleSize
			faceID = noteFace.small
		}else if(type === "ka" || type === "daiKa" && played === 1){
			fill = "#65bdbb"
			size = circleSize
			faceID = noteFace.small
		}else if(type === "daiDon"){
			fill = "#f34728"
			size = bigCircleSize
			faceID = noteFace.big
		}else if(type === "daiKa"){
			fill = "#65bdbb"
			size = bigCircleSize
			faceID = noteFace.big
		}else if(type === "balloon"){
			if(animated){
				fill = "#f34728"
				size = bigCircleSize * 0.8
				faceID = noteFace.big
			}else{
				fill = "#f87700"
				size = circleSize
				faceID = noteFace.small
				var h = size * 1.8
				if(circleMs + this.controller.audioLatency < ms && ms <= endTime + this.controller.audioLatency){
					circlePos.x = this.slotPos.x
				}else if(ms > endTime + this.controller.audioLatency){
					circlePos.x = this.slotPos.x + this.msToPos(endTime - ms + this.controller.audioLatency, speed)
				}
				ctx.drawImage(assets.image["balloon"],
					circlePos.x + size - 4,
					circlePos.y - h / 2 + 2,
					h / 61 * 115,
					h
				)
			}
		}else if(type === "drumroll" || type === "daiDrumroll"){
			fill = "#f3b500"
			if(type == "drumroll"){
				size = circleSize
				faceID = noteFace.small
			}else{
				size = bigCircleSize
				faceID = noteFace.big
			}
			endX = this.msToPos(endTime - circleMs, speed)
			drumroll = endX > 50 ? 2 : 1
			
			ctx.fillStyle = fill
			ctx.strokeStyle = "#000"
			ctx.lineWidth = 3
			ctx.beginPath()
			ctx.moveTo(circlePos.x, circlePos.y - size + 1.5)
			ctx.arc(circlePos.x + endX, circlePos.y, size - 1.5, Math.PI / -2, Math.PI / 2)
			ctx.lineTo(circlePos.x, circlePos.y + size - 1.5)
			ctx.fill()
			ctx.stroke()
		}
		if(!fade || fade < 1){
			// Main circle
			ctx.fillStyle = fill
			ctx.beginPath()
			ctx.arc(circlePos.x, circlePos.y, size - 1, 0, Math.PI * 2)
			ctx.fill()
			// Face on circle
			var drawSize = size
			if(faceID < 2){
				drawSize *= bigCircleSize / circleSize
			}
			ctx.drawImage(assets.image[drumroll ? "notes_drumroll" : "notes"],
				0, 172 * faceID,
				172, 172,
				circlePos.x - drawSize - 4,
				circlePos.y - drawSize - 4,
				drawSize * 2 + 8,
				drawSize * 2 + 8
			)
		}
		if(fade && !this.touchEnabled){
			ctx.globalAlpha = this.draw.easeOut(fade < 1 ? fade : 2 - fade)
			ctx.fillStyle = "#fff"
			ctx.beginPath()
			ctx.arc(circlePos.x, circlePos.y, size - 1, 0, Math.PI * 2)
			ctx.fill()
			ctx.globalAlpha = 1
		}
		if(!circle.animating && circle.text){
			// Text
			var text = circle.text
			var textX = circlePos.x
			var textY = circlePos.y + 83 * mul
			ctx.font = lyricsSize + "px Kozuka, Microsoft YaHei, sans-serif"
			ctx.textBaseline = "middle"
			ctx.textAlign = "center"
			
			if(drumroll === 2){
				var longText = text.split("ー")
				text = longText[0]
				var text0Width = ctx.measureText(longText[0]).width
				var text1Width = ctx.measureText(longText[1]).width
			}
			
			ctx.fillStyle = "#fff"
			ctx.strokeStyle = "#000"
			ctx.lineWidth = 5
			ctx.strokeText(text, textX, textY)
			
			if(drumroll === 2){
				ctx.strokeText(longText[1], textX + endX, textY)
				
				ctx.lineWidth = 4
				var x1 = textX + text0Width / 2
				var x2 = textX + endX - text1Width / 2
				ctx.beginPath()
				ctx.moveTo(x1, textY - 2)
				ctx.lineTo(x2, textY - 2)
				ctx.lineTo(x2, textY + 1)
				ctx.lineTo(x1, textY + 1)
				ctx.closePath()
				ctx.stroke()
				ctx.fill()
			}
			
			ctx.strokeStyle = "#fff"
			ctx.lineWidth = 0.5
			
			ctx.strokeText(text, textX, textY)
			ctx.fillText(text, textX, textY)
			
			if(drumroll === 2){
				ctx.strokeText(longText[1], textX + endX, textY)
				ctx.fillText(longText[1], textX + endX, textY)
			}
		}
	}
	fillComboCache(){
		var fontSize = 58
		var letterSpacing = fontSize * 0.67
		var glyphW = 51
		var glyphH = 65
		var textX = 5
		var textY = 5
		var letterBorder = fontSize * 0.15
		
		this.comboCache.resize((glyphW + 1) * 20, glyphH + 1, this.ratio)
		for(var orange = 0; orange < 2; orange++){
			for(var i = 0; i < 10; i++){
				this.comboCache.set({
					w: glyphW,
					h: glyphH,
					id: orange + "combo" + i
				}, ctx => {
					ctx.scale(0.9, 1)
					if(orange){
						var grd = ctx.createLinearGradient(
							(glyphW - glyphH) / 2,
							0,
							(glyphW + glyphH) / 2,
							glyphH
						)
						grd.addColorStop(0.3, "#ff2000")
						grd.addColorStop(0.5, "#ffc321")
						grd.addColorStop(0.6, "#ffedb7")
						grd.addColorStop(0.8, "#ffffce")
						var fill = grd
					}else{
						var fill = "#fff"
					}
					this.draw.layeredText({
						ctx: ctx,
						text: i.toString(),
						fontSize: fontSize,
						fontFamily: "TnT, Meiryo, sans-serif",
						x: textX,
						y: textY
					}, [
						{x: -2, y: -1, outline: "#000", letterBorder: letterBorder},
						{x: 3.5, y: 1.5},
						{x: 3, y: 1},
						{},
						{x: -2, y: -1, fill: "#fff"},
						{x: 3.5, y: 1.5, fill: fill},
						{x: 3, y: 1, fill: "rgba(0, 0, 0, 0.5)"},
						{fill: fill}
					])
				})
			}
		}
		this.globalAlpha = 0
		this.comboCache.get({
			ctx: this.ctx,
			x: 0,
			y: 0,
			w: 54,
			h: 77,
			id: "combo0"
		})
		this.globalAlpha = 1
	}
	fillBranchCache(){
		var mul = this.slotPos.size / 106
		var textW = Math.floor(260 * mul)
		var barH = Math.floor(130 * mul)
		var branchNames = this.controller.game.branchNames
		var textX = textW - 33 * mul
		var textY = 63 * mul
		var fontSize = (strings.id === "en" ? 33 : (strings.id === "ko" ? 38 : 43)) * mul
		this.branchCache.resize((textW + 1), (barH + 1) * 3, this.ratio)
		for(var i in branchNames){
			this.branchCache.set({
				w: textW,
				h: barH,
				id: branchNames[i]
			}, ctx => {
				var currentMap = this.branchMap[branchNames[i]]
				ctx.font = this.draw.bold(this.font) + fontSize + "px " + this.font
				ctx.lineJoin = "round"
				ctx.miterLimit = 1
				ctx.textAlign = "right"
				ctx.textBaseline = "middle"
				ctx.lineWidth = 8 * mul
				ctx.strokeStyle = currentMap.shadow
				ctx.strokeText(strings.branch[branchNames[i]], textX, textY + 4 * mul)
				ctx.strokeStyle = currentMap.stroke
				ctx.strokeText(strings.branch[branchNames[i]], textX, textY)
				ctx.fillStyle = currentMap.text
				ctx.fillText(strings.branch[branchNames[i]], textX, textY)
			})
		}
	}
	toggleGogoTime(circle){
		this.gogoTime = circle.gogoTime
		if(circle.gogoTime || this.gogoTimeStarted !== -Infinity){
			this.gogoTimeStarted = circle.ms
		}
		
		if(this.gogoTime){
			this.assets.fireworks.forEach(fireworksAsset => {
				fireworksAsset.setAnimation("normal")
				fireworksAsset.setAnimationStart(circle.ms)
				var length = fireworksAsset.getAnimationLength("normal")
				fireworksAsset.setAnimationEnd(length, () => {
					fireworksAsset.setAnimation(false)
				})
			})
			this.assets.fire.setAnimation("normal")
			var don = this.assets.don
			don.setAnimation("gogostart")
			var length = don.getAnimationLength("gogo")
			don.setUpdateSpeed(4 / length)
			var start = circle.ms - (circle.ms % this.beatInterval)
			don.setAnimationStart(start)
			var length = don.getAnimationLength("gogostart")
			don.setAnimationEnd(length, don.normalAnimation)
		}
	}
	drawGogoTime(){
		var ms = this.getMS()
		
		if(this.gogoTime){
			var circles = this.controller.parsedSongData.circles
			var lastCircle = circles[circles.length - 1]
			var endTime = lastCircle.endTime + 3000
			if(ms >= endTime){
				this.toggleGogoTime({
					gogoTime: 0,
					ms: endTime
				})
			}
		}else{
			var animation = this.assets.don.getAnimation()
			var score = this.controller.getGlobalScore()
			var cleared = this.rules.clearReached(score.gauge)
			if(animation === "gogo" || cleared && animation === "normal" || !cleared && animation === "clear"){
				this.assets.don.normalAnimation()
			}
			if(ms >= this.gogoTimeStarted + 100){
				this.assets.fire.setAnimation(false)
			}
		}
	}
	updateCombo(combo){
		var don = this.assets.don
		var animation = don.getAnimation()
		if(
			combo > 0
			&& combo % 10 === 0
			&& animation !== "10combo"
			&& animation !== "gogostart"
			&& animation !== "gogo"
		){
			don.setAnimation("10combo")
			var ms = this.getMS()
			don.setAnimationStart(ms)
			var length = don.getAnimationLength("normal")
			don.setUpdateSpeed(4 / length)
			var length = don.getAnimationLength("10combo")
			don.setAnimationEnd(length, don.normalAnimation)
		}
	}
	displayScore(score, notPlayed, bigNote){
		if(!notPlayed){
			this.currentScore.ms = this.getMS()
			this.currentScore.type = score
			this.currentScore.bigNote = bigNote
			
			if(score > 0){
				var explosion = this.assets.explosion
				explosion.type = (bigNote ? 0 : 2) + (score === 450 ? 0 : 1)
				explosion.setAnimation("normal")
				explosion.setAnimationStart(this.getMS())
				explosion.setAnimationEnd(bigNote ? 14 : 7, () => {
					explosion.setAnimation(false)
				})
			}
			this.setDarkBg(score === 0)
		}else{
			this.setDarkBg(true)
		}
	}
	setDarkBg(miss){
		if(!miss && this.darkDonBg){
			this.darkDonBg = false
			this.donBg.classList.remove("donbg-dark")
		}else if(miss && !this.darkDonBg){
			this.darkDonBg = true
			this.donBg.classList.add("donbg-dark")
		}
	}
	posToMs(pos, speed){
		var circleSize = 70 * this.slotPos.size / 106 / 2
		return 140 / circleSize * pos / speed
	}
	msToPos(ms, speed){
		var circleSize = 70 * this.slotPos.size / 106 / 2
		return speed / (140 / circleSize) * ms
	}
	drawTouch(){
		if(this.touchEnabled){
			var ms = this.getMS()
			var mul = this.ratio / this.pixelRatio
			
			var drumWidth = this.touchDrum.w * mul
			var drumHeight = this.touchDrum.h * mul
			if(drumHeight !== this.touchDrumHeight || drumWidth !== this.touchDrumWidth){
				this.touchDrumWidth = drumWidth
				this.touchDrumHeight = drumHeight
				this.touchDrumDiv.style.width = drumWidth + "px"
				this.touchDrumDiv.style.height = drumHeight + "px"
			}
			if(this.touchAnimation){
				if(this.touch > ms - 100){
					if(!this.drumPadding){
						this.drumPadding = true
						this.touchDrumImg.style.backgroundPositionY = "7px"
					}
				}else if(this.drumPadding){
					this.drumPadding = false
					this.touchDrumImg.style.backgroundPositionY = ""
				}
			}
		}
	}
	ontouch(event){
		if(!("changedTouches" in event)){
			event.changedTouches = [event]
		}
		for(var i = 0; i < event.changedTouches.length; i++){
			var touch = event.changedTouches[i]
			event.preventDefault()
			if(this.controller.game.paused){
				var mouse = this.mouseOffset(touch.pageX, touch.pageY)
				var moveTo = this.pauseMouse(mouse.x, mouse.y)
				if(moveTo !== null){
					this.pauseConfirm(moveTo)
				}
			}else if(!this.controller.autoPlayEnabled){
				var pageX = touch.pageX * this.pixelRatio
				var pageY = touch.pageY * this.pixelRatio
				
				var c = this.touchCircle
				var pi = Math.PI
				var inPath = () => this.ctx.isPointInPath(pageX, pageY)
				
				this.ctx.beginPath()
				this.ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, pi, 0)
				
				if(inPath()){
					if(pageX < this.winW / 2){
						this.touchNote("don_l")
					}else{
						this.touchNote("don_r")
					}
				}else{
					if(pageX < this.winW / 2){
						this.touchNote("ka_l")
					}else{
						this.touchNote("ka_r")
					}
				}
				this.touchEvents++
			}
		}
	}
	touchNote(note){
		var keyboard = this.controller.keyboard
		var ms = this.controller.game.getAccurateTime()
		this.touch = ms
		keyboard.setKey(false, note)
		keyboard.setKey(true, note, ms)
	}
	mod(length, index){
		return ((index % length) + length) % length
	}
	pauseMove(pos, absolute){
		if(absolute){
			this.state.pausePos = pos
		}else{
			this.state.pausePos = this.mod(this.pauseOptions.length, this.state.pausePos + pos)
		}
		this.state.moveMS = Date.now() - (absolute ? 0 : 500)
		this.state.moveHover = null
	}
	pauseConfirm(pos){
		if(typeof pos === "undefined"){
			pos = this.state.pausePos
		}
		var game = this.controller.game
		var state = game.calibrationState
		switch(state){
			case "audioHelp":
				pos = pos === 0 ? 2 : 0
				break
			case "videoHelp":
				if(pos === 0){
					assets.sounds["se_don"].play()
					game.calibrationReset("audio")
					return
				}else{
					pos = 0
				}
				break
			case "results":
				if(pos === 0){
					assets.sounds["se_don"].play()
					game.calibrationReset("video")
					return
				}else{
					var input = settings.getItem("latency")
					var output = {}
					var progress = game.calibrationProgress
					for(var i in input){
						if(i === "audio" || i === "video"){
							output[i] = progress[i]
						}else{
							output[i] = input[i]
						}
					}
					settings.setItem("latency", output)
					pos = 2
				}
				break
		}
		switch(pos){
			case 1:
				this.controller.playSound("se_don", 0, true)
				if(state === "video"){
					game.calibrationReset(state)
				}else{
					this.controller.restartSong()
				}
				pageEvents.send("pause-restart")
				break
			case 2:
				this.controller.playSound("se_don", 0, true)
				this.controller.songSelection()
				pageEvents.send("pause-song-select")
				break
			default:
				this.controller.togglePause(false)
				break
		}
		return true
	}
	onmousedown(event){
		if(this.controller.game.paused){
			if(event.which !== 1){
				return
			}
			var mouse = this.mouseOffset(event.offsetX, event.offsetY)
			var moveTo = this.pauseMouse(mouse.x, mouse.y)
			if(moveTo !== null){
				this.pauseConfirm(moveTo)
			}
		}
	}
	onmousemove(event){
		this.lastMousemove = this.getMS()
		this.cursorHidden = false
		
		if(!this.multiplayer && this.controller.game.paused){
			var mouse = this.mouseOffset(event.offsetX, event.offsetY)
			var moveTo = this.pauseMouse(mouse.x, mouse.y)
			if(moveTo === null && this.state.moveHover === this.state.pausePos){
				this.state.moveMS = Date.now() - 500
			}
			this.state.moveHover = moveTo
			this.pointer(moveTo !== null)
		}
	}
	mouseOffset(offsetX, offsetY){
		return {
			x: (offsetX * this.pixelRatio - this.winW / 2) / this.ratio + (this.portrait ? 720 : 1280) / 2,
			y: (offsetY * this.pixelRatio - this.winH / 2) / this.ratio + (this.portrait ? 1280 : 720) / 2
		}
	}
	pointer(enabled){
		if(!this.canvas){
			return
		}
		if(enabled && this.state.hasPointer === false){
			this.canvas.style.cursor = "pointer"
			this.state.hasPointer = true
		}else if(!enabled && this.state.hasPointer === true){
			this.canvas.style.cursor = ""
			this.state.hasPointer = false
		}
	}
	pauseMouse(x, y){
		if(this.portrait){
			var pauseScale = 766 / 720
			x = x * pauseScale + 257
			y = y * pauseScale - 328
		}
		switch(this.controller.game.calibrationState){
			case "audioHelp":
			case "videoHelp":
			case "results":
				if(554 - 90 * this.pauseOptions.length <= y && y <= 554 && 404 <= x && x <= 876){
					return Math.floor((y - 554 + 90 * this.pauseOptions.length) / 90)
				}
				break
			default:
				if(104 <= y && y <= 575 && 465 <= x && x <= 465 + 110 * this.pauseOptions.length){
					return Math.floor((x - 465) / 110)
				}
				break
		}
		return null
	}
	mouseIdle(){
		var lastMouse = pageEvents.getMouse()
		if(lastMouse && !this.cursorHidden && !this.state.hasPointer){
			if(this.getMS() >= this.lastMousemove + 2000){
				this.canvas.style.cursor = "none"
				this.cursorHidden = true
			}else{
				this.canvas.style.cursor = ""
			}
		}
	}
	changeBeatInterval(beatMS){
		this.beatInterval = beatMS
		this.assets.changeBeatInterval(beatMS)
	}
	getMS(){
		return this.ms
	}
	clean(){
		this.draw.clean()
		this.assets.clean()
		this.titleCache.clean()
		this.comboCache.clean()
		this.pauseCache.clean()
		this.branchCache.clean()
		
		versionDiv.classList.remove("version-hide")
		loader.screen.parentNode.appendChild(versionDiv)
		if(this.multiplayer !== 2){
			if(this.touchEnabled){
				pageEvents.remove(this.canvas, "touchstart")
				pageEvents.remove(this.touchPauseBtn, "touchend")
				this.gameDiv.classList.add("touch-results")
				this.touchDrumDiv.parentNode.removeChild(this.touchDrumDiv)
				delete this.touchDrumDiv
				delete this.touchDrumImg
				delete this.touchFullBtn
				delete this.touchPauseBtn
			}
		}
		if(!this.multiplayer){
			pageEvents.remove(this.canvas, "mousedown")
			this.songBg.parentNode.removeChild(this.songBg)
			this.songStage.parentNode.removeChild(this.songStage)
			this.donBg.parentNode.removeChild(this.donBg)
			delete this.donBg
			delete this.songBg
			delete this.songStage
		}
		pageEvents.mouseRemove(this)

		delete this.pauseMenu
		delete this.gameDiv
		delete this.canvas
		delete this.ctx
	}
}
