class CanvasDraw{
	constructor(noSmoothing){
		this.diffStarPath = new Path2D(vectors.diffStar)
		this.longVowelMark = new Path2D(vectors.longVowelMark)
		
		this.diffIconPath = [[{w: 40, h: 33}, {
			fill: "#ff2803",
			d: new Path2D(vectors.diffEasy1)
		}, {
			fill: "#ffb910",
			noStroke: true,
			d: new Path2D(vectors.diffEasy2)
		}], [{w: 48, h: 31}, {
			fill: "#8daf51",
			d: new Path2D(vectors.diffNormal)
		}], [{w: 56, h: 37}, {
			fill: "#784439",
			d: new Path2D(vectors.diffHard1)
		}, {
			fill: "#000",
			noStroke: true,
			d: new Path2D(vectors.diffHard2)
		}, {
			fill: "#414b2b",
			d: new Path2D(vectors.diffHard3)
		}], [{w: 29, h: 27}, {
			fill: "#db1885",
			d: new Path2D(vectors.diffOni1)
		}, {
			fill: "#fff",
			d: new Path2D(vectors.diffOni2)
		}]]
		
		this.diffPath = {
			good: new Path2D(vectors.good),
			ok: new Path2D(vectors.ok),
			bad: new Path2D(vectors.bad)
		}
		
		this.crownPath = new Path2D(vectors.crown)
		this.soulPath = new Path2D(vectors.soul)
		
		this.optionsPath = {
			main: new Path2D(vectors.options),
			shadow: new Path2D(vectors.optionsShadow)
		}
		
		this.categoryPath = {
			main: new Path2D(vectors.category),
			shadow: new Path2D(vectors.categoryShadow),
			highlight: new Path2D(vectors.categoryHighlight)
		}
		
		this.regex = {
			comma: /[,.]/,
			ideographicComma: /[、。]/,
			apostrophe: /['＇’]/,
			degree: /[ﾟ°]/,
			brackets: /[\(（\)）\[\]「」『』【】:：;；≠]/,
			tilde: /[\-－~～〜_]/,
			tall: /[bｂdｄfｆgｇhｈj-lｊ-ｌtｔ♪]/,
			i: /[iｉ]/,
			uppercase: /[A-ZＡ-Ｚ]/,
			lowercase: /[a-zａ-ｚ･]/,
			latin: /[A-ZＡ-Ｚa-zａ-ｚ･]/,
			numbers: /[0-9０-９]/,
			exclamation: /[!！\?？ ]/,
			question: /[\?？]/,
			smallHiragana: /[ぁぃぅぇぉっゃゅょァィゥェォッャュョ]/,
			hiragana: /[\u3040-\u30ff]/,
			todo: /[トド]/,
			en: /[ceghknsuxyzｃｅｇｈｋｎｓｕｘｙｚçèéêëùúûü]/,
			em: /[mwｍｗ]/,
			emCap: /[MWＭＷ]/,
			rWidth: /[abdfIjo-rtvａｂｄｆＩｊｏ-ｒｔｖàáâäòóôö]/,
			lWidth: /[ilｉｌìíîï]/,
			ura: /\s*[\(（]裏[\)）]$/,
			cjk: /[\u3040-ゞ゠-ヾ一-\u9ffe]/
		}
		
		var numbersFull = "０１２３４５６７８９"
		var numbersHalf = "0123456789"
		this.numbersFullToHalf = {}
		for(var i = 0; i < 10; i++){
			this.numbersFullToHalf[numbersFull[i]] = numbersHalf[i]
			this.numbersFullToHalf[numbersHalf[i]] = numbersHalf[i]
		}
		this.wrapOn = [" ", "\n", "%s"]
		this.stickySymbols = "!,.:;?~‐–‼、。々〜ぁぃぅぇぉっゃゅょァィゥェォッャュョ・ーヽヾ！：；？"
		
		this.songFrameCache = new CanvasCache(noSmoothing)
		this.diffStarCache = new CanvasCache(noSmoothing)
		this.crownCache = new CanvasCache(noSmoothing)
		
		this.tmpCanvas = document.createElement("canvas")
		this.tmpCtx = this.tmpCanvas.getContext("2d")
	}
	
	roundedRect(config){
		var ctx = config.ctx
		var x = config.x
		var y = config.y
		var w = config.w
		var h = config.h
		var r = config.radius
		ctx.beginPath()
		this.roundedCorner(ctx, x, y, r, 0)
		this.roundedCorner(ctx, x + w, y, r, 1)
		this.roundedCorner(ctx, x + w, y + h, r, 2)
		this.roundedCorner(ctx, x, y + h, r, 3)
		ctx.closePath()
	}
	
	roundedCorner(ctx, x, y, r, rotation){
		var pi = Math.PI
		switch(rotation){
			case 0:
				return ctx.arc(x + r, y + r, r, pi, pi / -2)
			case 1:
				return ctx.arc(x - r, y + r, r, pi / -2, 0)
			case 2:
				return ctx.arc(x - r, y - r, r, 0, pi / 2)
			case 3:
				return ctx.arc(x + r, y - r, r, pi / 2, pi)
		}
	}
	
	songFrame(config){
		var ctx = config.ctx
		var x = config.x
		var y = config.y
		var w = config.width
		var h = config.height
		var border = config.border
		var innerBorder = config.innerBorder
		var allBorders = border + innerBorder
		var innerX = x + allBorders
		var innerY = y + allBorders
		var innerW = w - allBorders * 2
		var innerH = h - allBorders * 2
		
		ctx.save()
		
		var shadowBg = (ctx, noForce) => {
			this.shadow({
				ctx: ctx,
				fill: "rgba(0, 0, 0, 0.5)",
				blur: 10,
				x: 5,
				y: 5,
				force: !noForce
			})
			ctx.fillStyle = "#000"
			ctx.fillRect(0, 0, w, h)
		}
		if(config.cached){
			if(this.songFrameCache.w !== config.frameCache.w){
				this.songFrameCache.resize(config.frameCache.w, config.frameCache.h, config.frameCache.ratio)
			}
			this.songFrameCache.get({
				ctx: ctx,
				x: x,
				y: y,
				w: w + 15,
				h: h + 15,
				id: "shadow" + config.cached
			}, shadowBg)
		}else{
			ctx.translate(x, y)
			shadowBg(ctx, true)
		}
		
		ctx.restore()
		ctx.save()
		
		{
			let _x = x + border
			let _y = y + border
			let _w = w - border * 2
			let _h = h - border * 2
			ctx.fillStyle = config.borderStyle[1]
			ctx.fillRect(_x, _y, _w, _h)
			ctx.fillStyle = config.borderStyle[0]
			ctx.beginPath()
			ctx.moveTo(_x, _y)
			ctx.lineTo(_x + _w, _y)
			ctx.lineTo(_x + _w - innerBorder, _y + innerBorder)
			ctx.lineTo(_x + innerBorder, _y + _h - innerBorder)
			ctx.lineTo(_x, _y + _h)
			ctx.fill()
		}
		ctx.fillStyle = config.background
		ctx.fillRect(innerX, innerY, innerW, innerH)
		
		ctx.save()
		
		ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
		ctx.lineWidth = 3
		ctx.strokeRect(innerX, innerY, innerW, innerH)
		if(!config.noCrop){
			ctx.beginPath()
			ctx.rect(innerX, innerY, innerW, innerH)
			ctx.clip()
		}
		
		config.innerContent(innerX, innerY, innerW, innerH)
		
		ctx.restore()
		
		if(config.disabled){
			ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
			ctx.fillRect(x, y, w, h)
		}
		
		if(config.highlight){
			this.highlight({
				ctx: ctx,
				x: x,
				y: y,
				w: w,
				h: h,
				animate: config.highlight === 2,
				animateMS: config.animateMS,
				opacity: config.highlight === 1 ? 0.8 : 1
			})
		}
		
		ctx.restore()
	}
	
	highlight(config){
		var ctx = config.ctx
		ctx.save()
		if(config.shape){
			ctx.translate(config.x, config.y)
		}else{
			var _x = config.x + 3.5
			var _y = config.y + 3.5
			var _w = config.w - 7
			var _h = config.h - 7
		}
		if(config.animate){
			ctx.globalAlpha = this.fade((this.getMS() - config.animateMS) % 2000 / 2000)
		}else if(config.opacity){
			ctx.globalAlpha = config.opacity
		}
		if(config.radius){
			this.roundedRect({
				ctx: ctx,
				x: _x,
				y: _y,
				w: _w,
				h: _h,
				radius: config.radius
			})
		}else if(!config.shape){
			ctx.beginPath()
			ctx.rect(_x, _y, _w, _h)
		}
		if(config.shape){
			var stroke = () => ctx.stroke(config.shape)
		}else{
			var stroke = () => ctx.stroke()
		}
		var size = config.size || 14
		ctx.strokeStyle = "rgba(255, 249, 1, 0.45)"
		ctx.lineWidth = size
		stroke()
		ctx.strokeStyle = "rgba(255, 249, 1, .8)"
		ctx.lineWidth = 8 / 14 * size
		stroke()
		ctx.strokeStyle = "#fff"
		ctx.lineWidth = 6 / 14 * size
		stroke()
		
		ctx.restore()
	}
	fade(pos){
		if(pos < 0.5){
			pos = 1 - pos
		}
		return (1 - Math.cos(Math.PI * pos * 2)) / 2
	}
	easeIn(pos){
		return 1 - Math.cos(Math.PI / 2 * pos)
	}
	easeOut(pos){
		return Math.sin(Math.PI / 2 * pos)
	}
	easeOutBack(pos){
		return Math.sin(Math.PI / 1.74 * pos) * 1.03
	}
	easeInOut(pos){
		return (Math.cos(Math.PI * pos) - 1) / -2
	}
	
	verticalText(config){
		var ctx = config.ctx
		var inputText = config.text.toString()
		var mul = config.fontSize / 40
		var ura = false
		var r = this.regex
		
		var matches = inputText.match(r.ura)
		if(matches){
			inputText = inputText.slice(0, matches.index)
			ura = matches[0]
		}
		var bold = this.bold(config.fontFamily)
		
		var string = inputText.split("")
		var drawn = []
		var quoteOpened = false
		
		for(var i = 0; i < string.length; i++){
			let symbol = string[i]
			if(symbol === " "){
				// Space
				drawn.push({text: symbol, x: 0, y: 0, h: 18})
			}else if(symbol === "ー"){
				// Long-vowel mark
				if(bold){
					drawn.push({text: symbol, x: -1, y: -1, h: 33, rotate: true})
				}else{
					drawn.push({realText: symbol, svg: this.longVowelMark, x: -4, y: 5, h: 33, scale: [mul, mul]})
				}
			}else if(symbol === "∀"){
				drawn.push({text: symbol, x: 0, y: 0, h: 39, rotate: true})
			}else if(symbol === "↓"){
				drawn.push({text: symbol, x: 0, y: 12, h: 45})
			}else if(symbol === "．"){
				if(bold){
					drawn.push({realText: symbol, text: ".", x: 13, y: -15, h: 15})
				}else{
					drawn.push({realText: symbol, text: ".", x: 13, y: -7, h: 15, scale: [1.2, 0.7]})
				}
			}else if(symbol === "…"){
				drawn.push({text: symbol, x: bold ? 9 : 0, y: 5, h: 25, rotate: true})
			}else if(symbol === '"'){
				if(quoteOpened){
					drawn.push({realText: symbol, text: "“", x: -25, y: 10, h: 20})
				}else{
					drawn.push({realText: symbol, text: "”", x: 12, y: 15, h: 20})
				}
				quoteOpened = !quoteOpened
			}else if(r.comma.test(symbol)){
				// Comma, full stop
				if(bold){
					drawn.push({text: symbol, x: 13, y: -15, h: 15})
				}else{
					drawn.push({text: symbol, x: 13, y: -7, h: 15, scale: [1.2, 0.7]})
				}
			}else if(r.ideographicComma.test(symbol)){
				// Ideographic comma, full stop
				drawn.push({text: symbol, x: 16, y: -16, h: 18})
			}else if(r.apostrophe.test(symbol)){
				// Apostrophe
				if(bold){
					drawn.push({text: symbol, x: 20, y: -25, h: 0})
				}else{
					drawn.push({realText: symbol, text: ",", x: 20, y: -39, h: 0, scale: [1.2, 0.7]})
				}
			}else if(r.degree.test(symbol)){
				// Degree
				if(bold){
					drawn.push({text: symbol, x: 16, y: 9, h: 25})
				}else{
					drawn.push({text: symbol, x: 16, y: 3, h: 18})
				}
			}else if(r.brackets.test(symbol)){
				// Rotated brackets
				if(bold){
					drawn.push({text: symbol, x: 0, y: 0, h: 35, rotate: true})
				}else{
					drawn.push({text: symbol, x: 0, y: -5, h: 25, rotate: true})
				}
			}else if(r.tilde.test(symbol)){
				// Rotated hyphen, tilde
				drawn.push({realText: symbol, text: symbol === "~" ? "～" : symbol, x: 0, y: 2, h: 35, rotate: true})
			}else if(r.tall.test(symbol)){
				// Tall latin script lowercase
				drawn.push({text: symbol, x: 0, y: 4, h: 34})
			}else if(r.i.test(symbol)){
				// Lowercase i
				drawn.push({text: symbol, x: 0, y: 7, h: 34})
			}else if(r.uppercase.test(symbol)){
				// Latin script upper case
				drawn.push({text: symbol, x: 0, y: 8, h: 37})
			}else if(r.lowercase.test(symbol)){
				// Latin script lower case
				drawn.push({text: symbol, x: 0, y: -1, h: 28})
			}else if(r.numbers.test(symbol)){
				// Numbers
				var number = this.numbersFullToHalf[symbol]
				drawn.push({realText: symbol, text: number, x: 0, y: 4, h: 34})
			}else if(r.exclamation.test(symbol)){
				// Exclamation mark
				var toDraw = [symbol]
				for(var repeat = 1; repeat - 1 < i; repeat++){
					if(!r.exclamation.test(string[i - repeat])){
						break
					}
					toDraw.push(string[i - repeat])
				}
				if(repeat > 1){
					drawn.splice(i - repeat + 1, repeat)
					var allExclamations = !toDraw.find(a => a !== "!")
					
					for(var j = 1; j < repeat + 1; j++){
						var text = string[i - repeat + j]
						if(allExclamations){
							var y = 18
							var h = 61
						}else{
							var y = 8
							var h = 37
						}
						if(i === repeat - 1){
							h -= y - 4
							y = 4
						}
						
						var addX = bold && (text === "！" || text === "？") ? 10 : 0
						drawn.push({
							text: text,
							x: ((j - 1) - (repeat - 1) / 2) * 15 + addX,
							y: y - (j === 1 ? 0 : h),
							h: j === 1 ? h : 0
						})
					}
				}else{
					var addX = bold && (symbol === "！" || symbol === "？") ? 10 : 0
					drawn.push({text: symbol, x: addX, y: 8, h: 37})
				}
			}else if(r.smallHiragana.test(symbol)){
				// Small hiragana, small katakana
				drawn.push({text: symbol, x: 0, y: -8, h: 25, right: true})
			}else if(r.hiragana.test(symbol)){
				// Hiragana, katakana
				drawn.push({text: symbol, x: 0, y: 5, h: 38, right: r.todo.test(symbol)})
			}else{
				// Kanji, other
				drawn.push({text: symbol, x: 0, y: 3, h: 39})
			}
		}
		
		var drawnHeight = 0
		for(let symbol of drawn){
			if(config.letterSpacing){
				symbol.h += config.letterSpacing
			}
			drawnHeight += symbol.h * mul
		}
		
		ctx.save()
		ctx.translate(config.x, config.y)
		
		if(config.selectable){
			config.selectable.innerHTML = ""
			var scale = config.selectableScale
			var style = config.selectable.style
			style.left = (config.x - config.width / 2) * scale + "px"
			style.top = config.y * scale + "px"
			style.width = config.width * scale + "px"
			style.height = (drawnHeight+15) * scale + "px"
			style.fontSize = 40 * mul * scale + "px"
			style.transform = ""
		}
		
		var scaling = 1
		var strokeScaling = 1
		var height = config.height - (ura ? 52 * mul : 0)
		if(height && drawnHeight > height){
			scaling = height / drawnHeight
			if(config.align === "bottom"){
				strokeScaling = Math.max(0.6, height / drawnHeight)
				ctx.translate(40 * mul, 0)
				ctx.scale(strokeScaling, scaling)
				ctx.translate(-40 * mul, 0)
			}else{
				strokeScaling = scaling
				ctx.scale(1, scaling)
			}
			if(config.selectable){
				style.transform = "scale(1, " + scaling + ")"
				style.top = (config.y + (height - drawnHeight) / 2 - 15 / 2 * scaling) * scale + "px"
			}
		}
		
		if(ura){
			// Circled ura
			drawn.push({realText: ura, text: "裏", x: 0, y: 25, h: 52, ura: true, scale: [1, 1 / scaling]})
		}
		
		if(config.align === "bottom"){
			drawn.reverse()
		}
		
		var actions = []
		if(config.outline){
			actions.push("stroke")
		}
		if(config.fill){
			actions.push("fill")
		}
		if(config.selectable){
			actions.push("selectable")
		}
		for(let action of actions){
			ctx.font = bold + config.fontSize + "px " + config.fontFamily
			ctx.textBaseline = "top"
			if(action === "stroke"){
				ctx.strokeStyle = config.outline
				ctx.lineWidth = config.outlineSize * mul
				if(config.align === "bottom"){
					ctx.lineWidth /= strokeScaling
				}
				ctx.lineJoin = "round"
				ctx.miterLimit = 1
			}else if(action === "fill"){
				ctx.fillStyle = config.fill
			}
			if(config.align === "bottom"){
				var offsetY = drawnHeight > config.height ? drawnHeight : config.height
			}else{
				var offsetY = 0
			}
			
			for(let symbol of drawn){
				var saved = false
				var currentX = symbol.x
				if(symbol.right){
					currentX += 20 * mul
				}
				var currentY = offsetY + symbol.y * mul
				if(config.align === "bottom"){
					currentY -= symbol.h * mul
				}
				offsetY = offsetY + symbol.h * mul * (config.align === "bottom" ? -1 : 1)
				if(action === "selectable"){
					let div = document.createElement("div")
					div.classList.add("stroke-sub")
					let text = symbol.realText || symbol.text
					let textWidth = ctx.measureText(text).width
					let transform = []
					if(symbol.scale){
						transform.push("scale(" + symbol.scale[0] + "," + symbol.scale[1] + ")")
					}
					if(symbol.rotate || symbol.realText === "ー"){
						transform.push("rotate(90deg)")
					}
					if(transform.length){
						div.style.transform = transform.join(" ")
					}
					if(symbol.right){
						currentX = currentX + config.width / 2 - textWidth
					}else{
						currentX = currentX + config.width / 2 - textWidth / 2
					}
					if(symbol.ura){
						div.style.font = (30 / (40 * mul)) + "em Meiryo, sans-serif"
					}
					div.style.left = currentX * scale + "px"
					div.style.top = currentY * scale + "px"
					div.appendChild(document.createTextNode(text))
					div.setAttribute("alt", text)
					config.selectable.appendChild(div)
					continue
				}
				if(symbol.rotate || symbol.scale || symbol.svg || symbol.ura){
					saved = true
					ctx.save()
					
					if(symbol.rotate){
						ctx.translate(currentX + 20 * mul, currentY + 20 * mul)
						ctx.rotate(Math.PI / 2)
					}else{
						ctx.translate(currentX, currentY)
					}
					if(symbol.scale){
						ctx.scale(symbol.scale[0], symbol.scale[1])
						ctx.lineWidth = ctx.lineWidth / symbol.scale[0]
					}
					currentX = 0
					currentY = 0
				}
				if(symbol.svg){
					ctx[action](symbol.svg)
				}else{
					if(symbol.right){
						ctx.textAlign = "right"
					}else{
						ctx.textAlign = "center"
					}
					if(symbol.ura){
						ctx.font = (30 * mul) + "px Meiryo, sans-serif"
						ctx.textBaseline = "middle"
						ctx.beginPath()
						ctx.arc(currentX, currentY + (17 * mul), (18 * mul), 0, Math.PI * 2)
						if(action === "stroke"){
							ctx.fillStyle = config.outline
							ctx.fill()
						}else if(action === "fill"){
							ctx.strokeStyle = config.fill
							ctx.lineWidth = 2.5 * mul
							ctx.fillText(symbol.text, currentX, currentY + (17 * mul))
						}
						ctx.stroke()
					}else{
						ctx[action + "Text"](symbol.text, currentX, currentY)
					}
				}
				if(saved){
					ctx.restore()
				}
			}
		}
		ctx.restore()
	}
	
	layeredText(config, layers){
		var ctx = config.ctx
		var inputText = config.text.toString()
		var mul = config.fontSize / 40
		var ura = false
		var r = this.regex
		
		var matches = inputText.match(r.ura)
		if(matches){
			inputText = inputText.slice(0, matches.index)
			ura = matches[0]
		}
		var bold = this.bold(config.fontFamily)
		
		var string = inputText.split("")
		var drawn = []
		
		for(var i = 0; i < string.length; i++){
			let symbol = string[i]
			
			if(symbol === "-"){
				drawn.push({text: symbol, x: -2, y: 0, w: 28})
			}else if(symbol === "™"){
				drawn.push({text: symbol, x: -2, y: 0, w: 20, scale: [0.6, 0.5]})
			}else if(symbol === " "){
				drawn.push({text: symbol, x: 0, y: 0, w: 10})
			}else if(symbol === '"'){
				drawn.push({text: symbol, x: 2, y: 0, w: 10})
			}else if(symbol === "∀"){
				if(bold){
					drawn.push({text: symbol, x: 0, y: 0, w: 40})
				}else{
					drawn.push({text: symbol, x: -3, y: 0, w: 55})
				}
			}else if(symbol === "．"){
				drawn.push({text: symbol, x: -9, y: 0, w: 37})
			}else if(r.apostrophe.test(symbol)){
				drawn.push({text: ",", x: 0, y: -15, w: 7, scale: [1, 0.7]})
			}else if(r.comma.test(symbol)){
				// Comma, full stop
				if(bold){
					drawn.push({text: symbol, x: -3, y: 0, w: 13})
				}else{
					drawn.push({text: symbol, x: -3, y: 13, w: 13, scale: [1.2, 0.7]})
				}
			}else if(r.tilde.test(symbol)){
				// Hyphen, tilde
				drawn.push({text: symbol === "~" ? "～" : symbol, x: 0, y: 0, w: 39})
			}else if(r.en.test(symbol)){
				// n-width
				drawn.push({text: symbol, x: 0, y: 0, w: 28})
			}else if(r.em.test(symbol)){
				// m-width
				drawn.push({text: symbol, x: 0, y: 0, w: 38})
			}else if(r.rWidth.test(symbol)){
				// r-width
				drawn.push({text: symbol, x: 0, y: 0, w: 24})
			}else if(r.lWidth.test(symbol)){
				// l-width
				drawn.push({text: symbol, x: 0, y: 0, w: 12})
			}else if(r.emCap.test(symbol)){
				// m-width uppercase
				drawn.push({text: symbol, x: 0, y: 0, w: 38})
			}else if(r.numbers.test(symbol)){
				// Numbers
				var number = this.numbersFullToHalf[symbol]
				drawn.push({text: number, x: 0, y: 0, w: 32})
			}else if(r.degree.test(symbol)){
				// Degree
				if(bold){
					drawn.push({text: symbol, x: 0, y: 0, w: 20})
				}else{
					drawn.push({text: symbol, x: 5, y: 0, w: 0})
				}
			}else if(r.uppercase.test(symbol)){
				// Latin script uppercase
				drawn.push({text: symbol, x: 0, y: 0, w: 32})
			}else if(r.exclamation.test(symbol)){
				// Exclamation mark
				var nextExclamation = string[i + 1] ? r.exclamation.test(string[i + 1]) : false
				drawn.push({
					text: symbol,
					x: nextExclamation ? 4 : -1,
					y: 0,
					w: nextExclamation ? 16 : 28
				})
			}else if(r.smallHiragana.test(symbol)){
				// Small hiragana, small katakana
				drawn.push({text: symbol, kana: true, x: 0, y: 0, w: 30})
			}else if(r.hiragana.test(symbol)){
				// Hiragana, katakana
				drawn.push({text: symbol, kana: true, x: 0, y: 0, w: 35})
			}else{
				drawn.push({text: symbol, kana: true, x: 0, y: 0, w: 39})
			}
		}
		
		var drawnWidth = 0
		for(let symbol of drawn){
			if(config.letterSpacing){
				symbol.w += config.letterSpacing
			}
			if(config.kanaSpacing && symbol.kana){
				symbol.w += config.kanaSpacing
			}
			drawnWidth += symbol.w * mul
		}
		
		ctx.save()
		ctx.translate(config.x, config.y)
		
		if(config.scale){
			ctx.scale(config.scale[0], config.scale[1])
		}
		var scaling = 1
		var width = config.width - (ura ? 55 * mul : 0)
		if(width && drawnWidth > width){
			scaling = width / drawnWidth
			ctx.scale(scaling, 1)
		}
		
		if(ura){
			// Circled ura
			drawn.push({text: "裏", x: 0, y: 3, w: 55, ura: true, scale: [1 / scaling, 1]})
		}
		
		if(config.align === "right"){
			drawn.reverse()
		}
		
		ctx.font = bold + config.fontSize + "px " + config.fontFamily
		ctx.textBaseline = config.baseline || "top"
		ctx.textAlign = "center"
		
		for(let layer of layers){
			var savedLayer = false
			var action = "strokeText"
			if(layer.scale){
				savedLayer = true
				ctx.save()
				ctx.scale(layer.scale[0], layer.scale[1])
			}
			if(layer.outline){
				ctx.strokeStyle = layer.outline
				ctx.lineJoin = "round"
				ctx.miterLimit = 1
			}
			if(layer.letterBorder){
				ctx.lineWidth = layer.letterBorder
			}
			if(layer.fill){
				ctx.fillStyle = layer.fill
				action = "fillText"
			}
			if(layer.shadow){
				if(!savedLayer){
					savedLayer = true
					ctx.save()
				}
				this.shadow({
					ctx: ctx,
					fill: "rgba(0, 0, 0, " + (1 / (layer.shadow[3] || 2)) + ")",
					blur: layer.shadow[2],
					x: layer.shadow[0],
					y: layer.shadow[1],
					force: config.forceShadow
				})
			}
			var offsetX = 0
			for(let symbol of drawn){
				var saved = false
				var currentX = offsetX + symbol.x * mul + (layer.x || 0) + symbol.w * mul / 2
				var currentY = symbol.y + (layer.y || 0)
				
				if(config.align === "center"){
					currentX -= drawnWidth / 2
				}else if(config.align === "right"){
					currentX = -offsetX + symbol.x + (layer.x || 0) - symbol.w / 2
				}
				if(symbol.scale || symbol.ura){
					saved = true
					ctx.save()
					ctx.translate(currentX, currentY)
					if(symbol.scale){
						if(config.baseline === "middle"){
							ctx.translate(0, -ctx.lineWidth * (2 / symbol.scale[1]))
						}
						ctx.scale(symbol.scale[0], symbol.scale[1])
						ctx.lineWidth /= symbol.scale[0]
					}
					currentX = 0
					currentY = 0
				}
				if(symbol.ura){
					ctx.font = (30 * mul) + "px Meiryo, sans-serif"
					ctx.textBaseline = "middle"
					ctx.beginPath()
					ctx.arc(currentX, currentY + (17 * mul), (18 * mul), 0, Math.PI * 2)
					if(action === "strokeText"){
						ctx.fillStyle = layer.outline
						ctx.fill()
					}else if(action === "fillText"){
						ctx.strokeStyle = layer.fill
						ctx.lineWidth = 2.5 * mul
						ctx.fillText(symbol.text, currentX, currentY + (17 * mul))
					}
					ctx.stroke()
				}else{
					ctx[action](symbol.text, currentX, currentY)
				}
				if(saved){
					ctx.restore()
				}
				offsetX += symbol.w * mul
			}
			if(savedLayer){
				ctx.restore()
			}
		}
		ctx.restore()
	}
	
	wrappingText(config){
		var ctx = config.ctx
		var inputText = config.text.toString()
		var words = []
		var start = 0
		var substituteIndex = 0
		while(start < inputText.length){
			var character = inputText.slice(start, start + 1)
			if(words.length !== 0){
				var previous = words[words.length - 1]
				if(!previous.substitute && previous !== "\n" && this.stickySymbols.indexOf(character) !== -1){
					words[words.length - 1] += character
					start++
					continue
				}
			}
			var index = Infinity
			var currentIndex = inputText.slice(start).search(this.regex.cjk)
			if(currentIndex !== -1){
				index = start + currentIndex
				var on = inputText.charAt(index)
			}
			for(var i = 0; i < this.wrapOn.length; i++){
				var currentIndex = inputText.indexOf(this.wrapOn[i], start)
				if(currentIndex !== -1 && currentIndex < index){
					var on = this.wrapOn[i]
					index = currentIndex
				}
			}
			if(index === Infinity){
				if(start !== inputText.length){
					words.push(inputText.slice(start, inputText.length))
				}
				break
			}
			var end = index + (on === " " ? 1 : 0)
			if(start !== end){
				words.push(inputText.slice(start, end))
			}
			if(on === "%s" && config.substitute){
				words.push({
					substitute: true,
					index: substituteIndex,
					width: config.substitute(config, substituteIndex, true) || 0
				})
				substituteIndex++
			}else if(on !== " "){
				words.push(on)
			}
			start = index + on.length
		}
		
		ctx.save()
		
		var bold = this.bold(config.fontFamily)
		ctx.font = bold + config.fontSize + "px " + config.fontFamily
		ctx.textBaseline = config.baseline || "top"
		ctx.textAlign = "left"
		ctx.fillStyle = config.fill
		var lineHeight = config.lineHeight || config.fontSize
		
		var x = 0
		var y = 0
		var totalW = 0
		var totalH = 0
		var line = ""
		var toDraw = []
		var lastWidth = 0
		
		var addToDraw = obj => {
			toDraw.push(obj)
			if(x + lastWidth > totalW){
				totalW = x + lastWidth
			}
			if(y + lineHeight > totalH){
				totalH = y + lineHeight
			}
		}
		var recenter = () => {
			if(config.textAlign === "center"){
				for(var j in toDraw){
					if(toDraw[j].y === y){
						toDraw[j].x += (config.width - x - lastWidth) / 2
					}
				}
			}
		}
		var search = () => {
			var end = line.length
			var dist = end
			while(dist){
				dist >>= 1
				line = words[i].slice(0, end)
				lastWidth = ctx.measureText(line).width
				end += lastWidth < config.width ? dist : -dist
			}
			if(line !== words[i]){
				words.splice(i + 1, 0, words[i].slice(line.length))
				words[i] = line
			}
		}
		
		for(var i = 0; i < words.length; i++){
			var skip = words[i].substitute || words[i] === "\n"
			if(!skip){
				var currentWidth = ctx.measureText(line + words[i]).width
			}
			if(skip || (x !== 0 || line) && x + currentWidth > config.width){
				if(line){
					addToDraw({
						text: line,
						x: x, y: y
					})
				}
				if(words[i].substitute){
					line = ""
					var currentWidth = words[i].width
					if(x + lastWidth + currentWidth > config.width){
						recenter()
						x = 0
						y += lineHeight
						lastWidth = 0
					}
					addToDraw({
						substitute: true,
						index: words[i].index,
						x: x + lastWidth, y: y
					})
					x += lastWidth + currentWidth
					lastWidth = currentWidth
				}else{
					recenter()
					x = 0
					y += lineHeight
					if(words[i] === "\n"){
						line = ""
						lastWidth = 0
					}else{
						line = words[i]
						lastWidth = ctx.measureText(line).width
						if(line.length !== 1 && lastWidth > config.width){
							search()
						}
					}
				}
			}else if(!line){
				line = words[i]
				lastWidth = ctx.measureText(line).width
				if(line.length !== 1 && lastWidth > config.width){
					search()
				}
			}else{
				line += words[i]
				lastWidth = currentWidth
			}
		}
		if(line){
			addToDraw({
				text: line,
				x: x, y: y
			})
			recenter()
		}
		
		var addX = 0
		var addY = 0
		if(config.verticalAlign === "middle"){
			addY = ((config.height || 0) - totalH) / 2
		}
		for(var i in toDraw){
			var x = config.x + toDraw[i].x + addX
			var y = config.y + toDraw[i].y + addY
			if(toDraw[i].text){
				ctx.fillText(toDraw[i].text, x, y)
			}else if(toDraw[i].substitute){
				ctx.save()
				ctx.translate(x, y)
				config.substitute(config, toDraw[i].index)
				ctx.restore()
			}
		}
		
		ctx.restore()
	}
	
	diffIcon(config){
		var ctx = config.ctx
		var scale = config.scale
		ctx.save()
		ctx.lineWidth = config.border
		ctx.strokeStyle = "#000"
		var icon = this.diffIconPath[config.diff === 4 ? 3 : config.diff]
		ctx.translate(config.x - icon[0].w * scale / 2, config.y - icon[0].h * scale / 2)
		ctx.scale(scale, scale)
		for(var i = 1; i < icon.length; i++){
			if(!icon[i].noStroke){
				ctx.stroke(icon[i].d)
			}
		}
		if(!config.noFill){
			for(var i = 1; i < icon.length; i++){
				if(config.diff === 4 && icon[i].fill === "#db1885"){
					ctx.fillStyle = "#7135db"
				}else{
					ctx.fillStyle = icon[i].fill
				}
				ctx.fill(icon[i].d)
			}
		}
		ctx.restore()
	}
	
	diffOptionsIcon(config){
		var ctx = config.ctx
		ctx.save()
		
		if(config.iconName === "back"){
			ctx.translate(config.x - 21, config.y - 21)
			
			var drawLine = y => {
				ctx.beginPath()
				ctx.moveTo(12, y)
				ctx.arc(20.5, 24, 8.5, Math.PI, Math.PI * 2, true)
				ctx.lineTo(29, 18)
				ctx.stroke()
			}
			var drawTriangle = noFill => {
				ctx.beginPath()
				ctx.moveTo(29, 5)
				ctx.lineTo(21, 19)
				ctx.lineTo(37, 19)
				ctx.closePath()
				if(!noFill){
					ctx.fill()
				}
			}
			ctx.strokeStyle = "#000"
			ctx.lineWidth = 13
			drawLine(8)
			ctx.lineWidth = 6
			drawTriangle(true)
			ctx.stroke()
			ctx.lineWidth = 7
			ctx.fillStyle = "#fff"
			ctx.strokeStyle = "#fff"
			drawLine(11)
			drawTriangle()
			ctx.translate(-1.5, -0.5)
			ctx.fillStyle = "#23a6e1"
			ctx.strokeStyle = "#23a6e1"
			ctx.globalCompositeOperation = "darken"
			drawLine(11)
			drawTriangle()
		}else if(config.iconName === "options"){
			ctx.translate(config.x, config.y)
			ctx.rotate(-55 * Math.PI / 180)
			ctx.translate(-6, -20)
			ctx.strokeStyle = "#000"
			ctx.lineWidth = 6
			ctx.stroke(this.optionsPath.main)
			ctx.translate(-2, 2)
			ctx.stroke(this.optionsPath.main)
			ctx.fillStyle = "#7e7c76"
			ctx.fill(this.optionsPath.shadow)
			ctx.translate(2, -2)
			ctx.fillStyle = "#d9d6ce"
			ctx.fill(this.optionsPath.main)
		}
		
		ctx.restore()
	}
	
	diffCursor(config){
		var ctx = config.ctx
		ctx.save()
		if(config.scale){
			ctx.translate(config.x, config.y)
			ctx.scale(config.scale, config.scale)
			ctx.translate(-48, -64)
		}else{
			ctx.translate(config.x - 48, config.y - 64)
		}
		
		ctx.fillStyle = config.two ? "#65cdcd" : "#ff411c"
		ctx.strokeStyle = "#000"
		ctx.lineWidth = 6
		ctx.beginPath()
		if(!config.side){
			var textX = config.two ? 22 : 20
			ctx.moveTo(48, 120)
			ctx.arc(48, 48.5, 45, Math.PI * 0.58, Math.PI * 0.42)
		}else if(config.two){
			var textX = 72
			ctx.moveTo(56, 115)
			ctx.arc(98, 48.5, 45, Math.PI * 0.75, Math.PI * 0.59)
		}else{
			var textX = -30
			ctx.moveTo(39, 115)
			ctx.arc(-2, 48.5, 45, Math.PI * 0.41, Math.PI * 0.25)
		}
		ctx.closePath()
		ctx.fill()
		ctx.stroke()
		this.layeredText({
			ctx: ctx,
			text: config.two ? "2P" : "1P",
			fontSize: 43,
			fontFamily: config.font,
			x: textX,
			y: 26,
			width: 54,
			letterSpacing: -4
		}, [
			{outline: "#fff", letterBorder: 11},
			{fill: "#000"}
		])
		
		ctx.restore()
	}
	
	diffStar(config){
		var ctx = config.ctx
		ctx.save()
		if(config.songSel || config.ura){
			if(this.diffStarCache.scale !== config.ratio){
				this.diffStarCache.resize(62, 31, config.ratio)
			}
			var offset = 30 / 2 - 18 / 2
			var big = config.ura && !config.songSel
			this.diffStarCache.get({
				ctx: ctx,
				x: config.x - 9 - offset,
				y: config.y - 9 - offset,
				w: 30,
				h: 30,
				id: big ? "big" : "small"
			}, ctx => {
				ctx.fillStyle = "#fff"
				this.shadow({
					ctx: ctx,
					fill: "#fff",
					blur: 10,
					force: true
				})
				if(big){
					ctx.translate(30 / 2 - 21 / 2, 30 / 2 - 19 / 2)
					ctx.scale(1.1, 1.1)
				}else{
					ctx.translate(offset, offset)
				}
				ctx.fill(this.diffStarPath)
			})
		}else{
			ctx.fillStyle = "#f72568"
			ctx.translate(config.x - 10.5, config.y - 9.5)
			ctx.scale(1.1, 1.1)
			ctx.fill(this.diffStarPath)
		}
		ctx.restore()
	}
	
	pattern(config){
		var ctx = config.ctx
		ctx.save()
		var mul = config.scale || 1
		
		if(mul !== 1){
			ctx.scale(1 / mul, 1 / mul)
		}
		ctx.fillStyle = ctx.createPattern(config.img, "repeat")
		if(config.shape){
			config.shape(ctx, mul)
		}else{
			ctx.beginPath()
			ctx.rect(config.x * mul, config.y * mul, config.w * mul, config.h * mul)
		}
		ctx.translate(config.dx * mul, config.dy * mul)
		ctx.fill()
		
		ctx.restore()
	}
	
	score(config){
		var ctx = config.ctx
		ctx.save()
		
		ctx.translate(config.x, config.y)
		if(config.scale){
			ctx.scale(config.scale, config.scale)
		}
		ctx.strokeStyle = "#000"
		ctx.lineWidth = 7
		if(strings.good === "良"){
			if(config.align === "center"){
				ctx.translate(config.score === "bad" ? -49 / 2 : -23 / 2, 0)
			}
			if(config.score === "good"){
				var grd = ctx.createLinearGradient(0, 0, 0, 29)
				grd.addColorStop(0.3, "#f7fb00")
				grd.addColorStop(0.9, "#ff4900")
				ctx.fillStyle = grd
				ctx.stroke(this.diffPath.good)
				ctx.fill(this.diffPath.good)
			}else if(config.score === "ok"){
				ctx.fillStyle = "#fff"
				ctx.stroke(this.diffPath.ok)
				ctx.fill(this.diffPath.ok)
			}else if(config.score === "bad"){
				var grd = ctx.createLinearGradient(0, 0, 0, 27)
				grd.addColorStop(0.1, "#6B5DFF")
				grd.addColorStop(0.7, "#00AEDE")
				ctx.fillStyle = grd
				ctx.stroke(this.diffPath.bad)
				ctx.fill(this.diffPath.bad)
				ctx.translate(26, 0)
				ctx.stroke(this.diffPath.ok)
				ctx.fill(this.diffPath.ok)
			}
		}else{
			ctx.font = this.bold(strings.font) + "26px " + strings.font
			if(config.results){
				ctx.textAlign = "left"
			}else{
				ctx.textAlign = "center"
			}
			ctx.textBaseline = "top"
			ctx.miterLimit = 1
			if(config.score === "good"){
				if(config.results && strings.id === "en"){
					ctx.scale(0.75, 1)
				}
				var grd = ctx.createLinearGradient(0, 0, 0, 29)
				grd.addColorStop(0.3, "#f7fb00")
				grd.addColorStop(0.9, "#ff4900")
				ctx.fillStyle = grd
				ctx.strokeText(strings.good, 0, 4)
				ctx.fillText(strings.good, 0, 4)
			}else if(config.score === "ok"){
				ctx.fillStyle = "#fff"
				ctx.strokeText(strings.ok, 0, 4)
				ctx.fillText(strings.ok, 0, 4)
			}else if(config.score === "bad"){
				var grd = ctx.createLinearGradient(0, 0, 0, 27)
				grd.addColorStop(0.1, "#6B5DFF")
				grd.addColorStop(0.7, "#00AEDE")
				ctx.fillStyle = grd
				ctx.strokeText(strings.bad, 0, 4)
				ctx.fillText(strings.bad, 0, 4)
			}
		}
		ctx.restore()
	}
	
	crown(config){
		var ctx = config.ctx
		ctx.save()
		
		ctx.translate(config.x, config.y)
		if(config.scale){
			ctx.scale(config.scale, config.scale)
		}
		ctx.translate(-47, -39)
		ctx.miterLimit = 1.7
		
		if(config.whiteOutline){
			if(!this.crownCache.w){
				this.crownCache.resize(140, 140, config.ratio)
			}
			var offset = 140 / 2 - 94 / 2
			this.crownCache.get({
				ctx: ctx,
				x: -offset,
				y: -offset,
				w: 140,
				h: 140,
				id: "crown"
			}, ctx => {
				ctx.save()
				ctx.translate(offset, offset)
				ctx.strokeStyle = "#fff"
				ctx.lineWidth = 35
				ctx.miterLimit = 1.7
				ctx.filter = "blur(1.5px)"
				ctx.stroke(this.crownPath)
				ctx.restore()
			})
		}
		
		if(config.shine){
			ctx.strokeStyle = "#fff"
			ctx.lineWidth = 18
			ctx.stroke(this.crownPath)
			ctx.globalAlpha = 1 - config.shine
		}
		
		ctx.strokeStyle = config.type ? "#000" : "#ffc616"
		ctx.lineWidth = 18
		ctx.stroke(this.crownPath)
		
		if(config.shine){
			ctx.globalAlpha = 1
			ctx.fillStyle = "#fff"
			ctx.fill(this.crownPath)
			ctx.globalAlpha = 1 - config.shine
		}
		
		if(config.type){
			var grd = ctx.createLinearGradient(0, 0, 94, 0)
			if(config.type === "rainbow"){ // TODO
				grd.addColorStop(0,"#0000ff")
				grd.addColorStop(0.15,"#00ffff")
				grd.addColorStop(0.35,"#00ff88")
				grd.addColorStop(0.5,"#ffffff")
				grd.addColorStop(0.65,"#ffff00")
				grd.addColorStop(0.85,"#ff8800")
				grd.addColorStop(1,"#ff00ff")
			}else if(config.type === "gold"){
				grd.addColorStop(0, "#ffffc5")
				grd.addColorStop(0.23, "#ffff44")
				grd.addColorStop(0.53, "#efbd12")
				grd.addColorStop(0.83, "#ffff44")
				grd.addColorStop(1, "#efbd12")
			}else if(config.type === "silver"){
				grd.addColorStop(0, "#d6efef")
				grd.addColorStop(0.23, "#bddfde")
				grd.addColorStop(0.53, "#97c1c0")
				grd.addColorStop(0.83, "#bddfde")
				grd.addColorStop(1, "#97c1c0")
			}
			ctx.fillStyle = grd
		}else{
			ctx.fillStyle = "#ffdb2c"
		}
		ctx.fill(this.crownPath)
		
		ctx.restore()
	}
	
	gauge(config){
		var ctx = config.ctx
		ctx.save()
		
		ctx.translate(config.x, config.y)
		if(config.scale){
			ctx.scale(config.scale, config.scale)
		}
		ctx.translate(-788, 0)
		
		var firstTop = config.multiplayer ? 0 : 30
		var secondTop = config.multiplayer ? 0 : 8
		
		config.percentage = Math.max(0, Math.min(1, config.percentage))
		var cleared = config.percentage >= config.clear
		
		var gaugeW = 14 * 50
		var gaugeClear = gaugeW * (config.clear - 1 / 50)
		var gaugeFilled = gaugeW * config.percentage
		
		ctx.fillStyle = "#000"
		ctx.beginPath()
		if(config.scoresheet){
			if(config.multiplayer){
				ctx.moveTo(-4, -4)
				ctx.lineTo(760, -4)
				this.roundedCorner(ctx, 760, 48, 13, 2)
				this.roundedCorner(ctx, gaugeClear - 4, 48, 13, 3)
				ctx.lineTo(gaugeClear - 4, 26)
				ctx.lineTo(-4, 26)
			}else{
				ctx.moveTo(-4, 26)
				ctx.lineTo(gaugeClear - 4, 26)
				this.roundedCorner(ctx, gaugeClear - 4, 4, 13, 0)
				this.roundedCorner(ctx, 760, 4, 13, 1)
				ctx.lineTo(760, 56)
				ctx.lineTo(-4, 56)
			}
		}else if(config.multiplayer){
			ctx.moveTo(gaugeClear - 7, 27)
			ctx.lineTo(788, 27)
			ctx.lineTo(788, 52)
			this.roundedCorner(ctx, gaugeClear - 7, 52, 18, 3)
		}else{
			ctx.moveTo(gaugeClear - 7, 24)
			this.roundedCorner(ctx, gaugeClear - 7, 0, 18, 0)
			ctx.lineTo(788, 0)
			ctx.lineTo(788, 24)
		}
		ctx.fill()
		
		if(!cleared){
			ctx.fillStyle = config.blue ? "#184d55" : "#680000"
			var x = Math.max(0, gaugeFilled - 5)
			ctx.fillRect(x, firstTop, gaugeClear - x + 2 + (gaugeClear < gaugeW ? 0 : -7), 22)
		}
		if(gaugeFilled > 0){
			var w = Math.min(gaugeW - 5, gaugeClear + 1, gaugeFilled - 4)
			ctx.fillStyle = config.blue ? "#00edff" : "#ff3408"
			ctx.fillRect(0, firstTop + 2, w, 20)
			ctx.fillStyle = config.blue ? "#9cffff" : "#ffa191"
			ctx.fillRect(0, firstTop, w, 3)
		}
		if(gaugeClear < gaugeW){
			if(gaugeFilled < gaugeW - 4){
				ctx.fillStyle = "#684900"
				var x = Math.max(gaugeClear + 9, gaugeFilled - gaugeClear + 9)
				ctx.fillRect(x, secondTop, gaugeW - 4 - x, 44)
			}
			if(gaugeFilled > gaugeClear + 14){
				var w = Math.min(gaugeW - 4, gaugeFilled - gaugeClear - 14)
				ctx.fillStyle = "#ff0"
				ctx.fillRect(gaugeClear + 9, secondTop + 2, w, 42)
				ctx.fillStyle = "#fff"
				ctx.fillRect(gaugeClear + 9, secondTop, w, 3)
			}
			ctx.fillStyle = cleared ? "#ff0" : "#684900"
			ctx.beginPath()
			if(config.multiplayer){
				this.roundedCorner(ctx, gaugeClear, secondTop + 44, 10, 3)
				ctx.lineTo(gaugeClear, secondTop)
				ctx.lineTo(gaugeClear + 10, secondTop)
			}else{
				ctx.moveTo(gaugeClear, secondTop + 44)
				this.roundedCorner(ctx, gaugeClear, secondTop, 10, 0)
				ctx.lineTo(gaugeClear + 10, secondTop + 44)
			}
			ctx.fill()
		}
		if(cleared){
			ctx.save()
			ctx.clip()
			ctx.fillStyle = "#fff"
			ctx.fillRect(gaugeClear, secondTop, 10, 3)
			ctx.restore()
		}
		
		ctx.strokeStyle = "rgba(0, 0, 0, 0.16)"
		ctx.beginPath()
		ctx.lineWidth = 5
		for(var i = 0; i < 49; i++){
			var x = 14 + i * 14 - ctx.lineWidth / 2
			if(i === config.clear * 50 - 1){
				ctx.stroke()
				ctx.beginPath()
				ctx.lineWidth = 4
			}
			ctx.moveTo(x, x < gaugeClear ? firstTop : secondTop)
			ctx.lineTo(x, x < gaugeClear ? firstTop + 22 : secondTop + 44)
		}
		ctx.stroke()
		if(config.clear < 47 / 50){
			this.layeredText({
				ctx: ctx,
				text: strings.clear,
				fontSize: 18,
				fontFamily: config.font,
				x: gaugeClear + 3,
				y: config.multiplayer ? 22 : 11,
				letterSpacing: -2
			}, [
				{scale: [1.1, 1.01], outline: "#000", letterBorder: 6},
				{scale: [1.11, 1], fill: cleared ? "#fff" : "#737373"}
			])
		}
		
		ctx.restore()
	}
	
	soul(config){
		var ctx = config.ctx
		ctx.save()
		
		ctx.translate(config.x, config.y)
		if(config.scale){
			ctx.scale(config.scale, config.scale)
		}
		ctx.translate(-23, -21)
		
		ctx.fillStyle = config.cleared ? "#fff" : "#737373"
		ctx.fill(this.soulPath)
		
		ctx.restore()
	}
	
	slot(ctx, x, y, size){
		var mul = size / 106
		
		ctx.save()
		ctx.globalAlpha = 0.7
		ctx.globalCompositeOperation = "screen"
		ctx.fillStyle = "#444544"
		ctx.beginPath()
		ctx.arc(x, y, 26 * mul, 0, Math.PI * 2)
		ctx.fill()
		ctx.lineWidth = 3
		ctx.strokeStyle = "#9c9e9c"
		ctx.beginPath()
		ctx.arc(x, y, 33.5 * mul, 0, Math.PI * 2)
		ctx.stroke()
		ctx.lineWidth = 3.5
		ctx.strokeStyle = "#5d5e5d"
		ctx.beginPath()
		ctx.arc(x, y, 51.5 * mul, 0, Math.PI * 2)
		ctx.stroke()
		ctx.restore()
	}
	
	category(config){
		var ctx = config.ctx
		ctx.save()
		
		ctx.translate(config.x, config.y)
		if(config.scale || config.right){
			ctx.scale((config.right ? -1 : 1) * (config.scale || 1), config.scale || 1)
		}
		ctx.translate(-15.5 + 14, -11)
		for(var i = 0; i < 4; i++){
			if(i < 2){
				ctx.lineWidth = 6
				ctx.strokeStyle = "#000"
				ctx.stroke(this.categoryPath.main)
			}else{
				ctx.fillStyle = config.fill
				ctx.fill(this.categoryPath.main)
				ctx.fillStyle = "rgba(255, 255, 255, 0.25)"
				ctx.fill(this.categoryPath.main)
				ctx.fillStyle = "rgba(0, 0, 0, 0.25)"
				ctx.fill(this.categoryPath.shadow)
			}
			if(i % 2 === 0){
				ctx.translate(-14, 0)
			}else if(i === 1){
				ctx.translate(14, 0)
			}
		}
		if(config.highlight){
			this.highlight({
				ctx: ctx,
				x: 0,
				y: 0,
				opacity: 0.8,
				shape: this.categoryPath.highlight,
				size: 8
			})
		}
		
		ctx.restore()
	}
	
	nameplate(config){
		var ctx = config.ctx
		var w = 264
		var h = 57
		var r = h / 2
		var pi = Math.PI
		
		ctx.save()
		
		ctx.translate(config.x, config.y)
		if(config.scale){
			ctx.scale(config.scale, config.scale)
		}
		
		ctx.fillStyle="rgba(0, 0, 0, 0.25)"
		ctx.beginPath()
		ctx.arc(r + 4, r + 5, r, pi / 2, pi / -2)
		ctx.arc(w - r + 4, r + 5, r, pi / -2, pi / 2)
		ctx.fill()
		ctx.beginPath()
		ctx.moveTo(r, 0)
		this.roundedCorner(ctx, w, 0, r, 1)
		ctx.lineTo(r, r)
		ctx.fillStyle = config.blue ? "#67cecb" : "#ff421d"
		ctx.fill()
		ctx.beginPath()
		ctx.moveTo(r, r)
		this.roundedCorner(ctx, w, h, r, 2)
		ctx.lineTo(r, h)
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
		ctx.fill()
		ctx.strokeStyle = "#000"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(r, 0)
		ctx.arc(w - r, r, r, pi / -2, pi / 2)
		ctx.lineTo(r, h)
		ctx.stroke()
		ctx.beginPath()
		ctx.moveTo(r, r - 1)
		ctx.lineTo(w, r - 1)
		ctx.lineWidth = 2
		ctx.stroke()
		ctx.beginPath()
		ctx.arc(r, r, r, 0, pi * 2)
		ctx.fillStyle = config.blue ? "#67cecb" : "#ff421d"
		ctx.fill()
		ctx.lineWidth = 4
		ctx.stroke()
		ctx.font = this.bold(config.font) + "28px " + config.font
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.lineWidth = 5
		ctx.miterLimit = 1
		ctx.strokeStyle = "#fff"
		ctx.fillStyle = "#000"
		var text = config.blue ? "2P" : "1P"
		ctx.strokeText(text, r + 2, r + 1)
		ctx.fillText(text, r + 2, r + 1)
		if(config.rank){
			this.layeredText({
				ctx: ctx,
				text: config.rank,
				fontSize: 20,
				fontFamily: config.font,
				x: w / 2 + r * 0.7,
				y: r * 0.5,
				width: 180,
				align: "center",
				baseline: "middle"
			}, [
				{fill: "#000"}
			])
		}
		this.layeredText({
			ctx: ctx,
			text: config.name || "",
			fontSize: 21,
			fontFamily: config.font,
			x: w / 2 + r * 0.7,
			y: r * 1.5 - 0.5,
			width: 180,
			kanaSpacing: 10,
			align: "center",
			baseline: "middle"
		}, [
			{outline: "#000", letterBorder: 6},
			{fill: "#fff"}
		])
		
		ctx.restore()
	}
	
	alpha(amount, ctx, callback, winW, winH){
		if(amount >= 1){
			return callback(ctx)
		}else if(amount >= 0){
			this.tmpCanvas.width = winW || ctx.canvas.width
			this.tmpCanvas.height = winH || ctx.canvas.height
			callback(this.tmpCtx)
			ctx.save()
			ctx.globalAlpha = amount
			ctx.drawImage(this.tmpCanvas, 0, 0)
			ctx.restore()
		}
	}
	
	shadow(config){
		if(!disableBlur || config.force){
			var ctx = config.ctx
			if(config.fill){
				ctx.shadowColor = config.fill
			}
			if(config.blur){
				ctx.shadowBlur = config.blur
			}
			if(config.x){
				ctx.shadowOffsetX = config.x
			}
			if(config.y){
				ctx.shadowOffsetY = config.y
			}
		}
	}
	
	bold(font){
		return font === "Microsoft YaHei, sans-serif" ? "bold " : ""
	}
	
	getMS(){
		return Date.now()
	}
	
	clean(){
		this.songFrameCache.clean()
		this.diffStarCache.clean()
		this.crownCache.clean()
		delete this.tmpCtx
		delete this.tmpCanvas
	}
}
