class ParseTja{
	constructor(file, difficulty, stars, offset, metaOnly){
		this.data = []
		for(let line of file){
			var indexComment = line.indexOf("//")
			if(indexComment !== -1 && !line.trim().toLowerCase().startsWith("maker:")){
				line = line.slice(0, indexComment).trim()
			}else{
				line = line.trim()
			}
			if(line !== ""){
				this.data.push(line)
			}
		}
		this.difficulty = difficulty
		this.stars = stars
		this.offset = (offset || 0) * -1000
		this.soundOffset = 0
		this.noteTypes = {
			"0": {name: false, txt: false},
			"1": {name: "don", txt: strings.note.don},
			"2": {name: "ka", txt: strings.note.ka},
			"3": {name: "daiDon", txt: strings.note.daiDon},
			"4": {name: "daiKa", txt: strings.note.daiKa},
			"5": {name: "drumroll", txt: strings.note.drumroll},
			"6": {name: "daiDrumroll", txt: strings.note.daiDrumroll},
			"7": {name: "balloon", txt: strings.note.balloon},
			"8": {name: false, txt: false},
			"9": {name: "balloon", txt: strings.note.balloon},
			"A": {name: "daiDon", txt: strings.note.daiDon},
			"B": {name: "daiKa", txt: strings.note.daiKa}
		}
		this.noteTypes_ex = strings.ex_note;
		this.courseTypes = {
			"0": "easy",
			"1": "normal",
			"2": "hard",
			"3": "oni",
			"4": "ura",
			"edit": "ura"
		}
		
		this.metadata = this.parseMetadata()
		this.measures = []
		this.beatInfo = {}
		this.events = []
		if(!metaOnly){
			this.circles = this.parseCircles()
		}
	}
	parseMetadata(){
		var metaNumbers = ["bpm", "offset", "demostart", "level", "scoremode", "scorediff"]
		var inSong = false
		var hasSong = false
		var courses = {}
		var currentCourse = {}
		var courseName = "oni"
		for(var lineNum = 0; lineNum < this.data.length; lineNum++){
			var line = this.data[lineNum]
			
			if(line.slice(0, 1) === "#"){
				
				var name = line.slice(1).toLowerCase()
				if(name === "start" && !inSong){
					
					inSong = true
					if(!hasSong){
						if(!(courseName in courses)){
							courses[courseName] = {}
						}
						for(var name in currentCourse){
							if(name !== "branch"){
								courses[courseName][name] = currentCourse[name]
							}
						}
						courses[courseName].start = lineNum + 1
						courses[courseName].end = this.data.length
					}
				}else if(name === "end" && inSong){
					inSong = false
					if(!hasSong){
						hasSong = true
						courses[courseName].end = lineNum
					}
				}else if(name.startsWith("branchstart") && inSong){
					courses[courseName].branch = true
				}else if(name.startsWith("lyric") && inSong){
					courses[courseName].inlineLyrics = true
				}
				
			}else if(!inSong){
				
				if(line.indexOf(":") > 0){
					
					var [name, value] = this.split(line, ":")
					name = name.toLowerCase().trim()
					value = value.trim()
					
					if(name === "course"){
						value = value.toLowerCase()
						if(value in this.courseTypes){
							courseName = this.courseTypes[value]
						}else{
							courseName = value
						}
						hasSong = false
					}else if(name === "balloon"){
						value = value ? value.split(",").map(digit => parseInt(digit)) : []
					}else if(this.inArray(name, metaNumbers)){
						value = parseFloat(value)
					}
					else if (name === "scoreinit") {
						value = value ? parseFloat(value.split(",")[0]) : 0; 
					}

					currentCourse[name] = value
				}
				
			}
		}
		return courses
	}
	inArray(string, array){
		return array.indexOf(string) >= 0
	}
	split(string, delimiter){
		var index = string.indexOf(delimiter)
		if(index < 0){
			return [string, ""]
		}
		return [string.slice(0, index), string.slice(index + delimiter.length)]
	}
	parseCircles(){
		var meta = this.metadata[this.difficulty] || {}
		var ms = (meta.offset || 0) * -1000 + this.offset
		var bpm = Math.abs(meta.bpm) || 120
		var scroll = 1
		var measure = 4
		this.beatInfo.beatInterval = 60000 / bpm
		var gogo = false
		var barLine = true
		
		var balloonID = 0
		var balloons = meta.balloon || []
		
		var lastDrumroll = false
		
		var branch = false
		var branchObj = {}
		var currentBranch = false
		var branchSettings = {}
		var branchFirstMeasure = false
		var sectionBegin = true
		var lastBpm = bpm
		var lastGogo = gogo
		var lyricsLine = null
		
		var currentMeasure = []
		var firstNote = true
		var circles = []
		var circleID = 0
		var regexAZ = /[A-Z]/
		var regexSpace = /\s/
		var regexLinebreak = /\\n/g
		var isAllDon = (note_chain, start_pos) => { 
			for (var i = start_pos; i < note_chain.length; ++i) { 
				var note = note_chain[i];
				if (note && note.type !== "don" && note.type !== "daiDon") { 
					return false;
				}
			}
			return true;
		}
		var checkChain = (note_chain, measure_length, is_last) => {
			//console.log(note_chain, measure_length, is_last);
			/*if (measure_length >= 24) {
				for (var note of note_chain) {
					note.text = this.noteTypes_ex[note.type][0];
				}
			} else { */
				var alldon_pos = null;
				for (var i = 0; i < note_chain.length - (is_last ? 1 : 0); ++i) {
					var note = note_chain[i];
					if (alldon_pos === null && is_last && isAllDon(note_chain, i)) { 
						alldon_pos = i;
					}
					note.text = this.noteTypes_ex[note.type][alldon_pos != null ? (i - alldon_pos) % 2 : 0];
				}
			//}
		}
		var pushMeasure = () => {
			var note = currentMeasure[0]
			if(note){
				var speed = note.bpm * note.scroll / 60
			}else{
				var speed = bpm * scroll / 60
			}
			this.measures.push({
				ms: ms,
				originalMS: ms,
				speed: speed,
				visible: barLine,
				branch: currentBranch,
				branchFirst: branchFirstMeasure
			})
			branchFirstMeasure = false
			if(currentMeasure.length){
				for(var i = 0; i < currentMeasure.length; i++){
					var note = currentMeasure[i]
					if(firstNote && note.type && note.type !== "event"){
						firstNote = false
						if(ms < 0){
							this.soundOffset = ms
							ms = 0
						}
					}
					note.start = ms
					if(note.endDrumroll){
						note.endDrumroll.endTime = ms
						note.endDrumroll.originalEndTime = ms
					}
					var msPerMeasure = 60000 * measure / note.bpm
					ms += msPerMeasure / currentMeasure.length
				}
				var note_chain = [];
				for (var i = 0; i < currentMeasure.length; i++){
					//console.log(note_chain.length);
					var note = currentMeasure[i]
					circleID++
					var circleObj = new Circle({
						id: circleID,
						start: note.start,
						type: note.type,
						txt: note.txt,
						speed: note.bpm * note.scroll / 60,
						gogoTime: note.gogo,
						endTime: note.endTime,
						requiredHits: note.requiredHits,
						beatMS: 60000 / note.bpm,
						branch: currentBranch,
						section: note.section
					})
					if (note.type) {
						if (note.type === "don" || note.type === "ka" || note.type === "daiDon" || note.type === "daiKa") {
							note_chain.push(circleObj);
						} else { 
							if (note_chain.length > 1 && currentMeasure.length >= 8) { 
								checkChain(note_chain, currentMeasure.length, false);
							}
							note_chain = [];
						} 
						if (lastDrumroll === note) {
							lastDrumroll = circleObj
						}
						
						if(note.type !== "event"){
							circles.push(circleObj)
						}
					} else if (!(currentMeasure.length >= 24 && (!currentMeasure[i + 1] || currentMeasure[i + 1].type))
						&& !(currentMeasure.length >= 48 && (!currentMeasure[i + 2] || currentMeasure[i + 2].type || !currentMeasure[i + 3] || currentMeasure[i + 3].type))) { 
						if (note_chain.length > 1 && currentMeasure.length >= 8) { 
							checkChain(note_chain, currentMeasure.length, true);
						}
						note_chain = [];
					}
					if(note.event){
						this.events.push(circleObj)
					}
					if("lyricsLine" in note){
						if(!this.lyrics){
							this.lyrics = []
						}
						if(this.lyrics.length !== 0){
							this.lyrics[this.lyrics.length - 1].end = note.start
						}
						this.lyrics.push({
							start: note.start,
							text: note.lyricsLine
						})
					}
				}
				if (note_chain.length > 1 && currentMeasure.length >= 8) { 
					checkChain(note_chain, currentMeasure.length, false);
				}
			}else{
				var msPerMeasure = 60000 * measure / bpm
				ms += msPerMeasure
			}
		}
		var insertNote = circleObj => {
			if(circleObj){
				if(bpm !== lastBpm || gogo !== lastGogo){
					circleObj.event = true
					lastBpm = bpm
					lastGogo = gogo
				}
				if(lyricsLine !== null){
					circleObj.lyricsLine = lyricsLine
					lyricsLine = null
				}
				currentMeasure.push(circleObj)
			}
		}
		var insertBlankNote = circleObj => {
			if(bpm !== lastBpm || gogo !== lastGogo){
				insertNote({
					type: "event",
					bpm: bpm,
					scroll: scroll,
					gogo: gogo
				})
			}else if(!circleObj){
				var circleObj2 = {
					bpm: bpm,
					scroll: scroll
				}
				if(lyricsLine !== null){
					circleObj2.lyricsLine = lyricsLine
					lyricsLine = null
				}
				currentMeasure.push(circleObj2)
			}
			if(circleObj){
				if(lyricsLine !== null){
					circleObj.lyricsLine = lyricsLine
					lyricsLine = null
				}
				currentMeasure.push(circleObj)
			}
		}
		
		for(var lineNum = meta.start; lineNum < meta.end; lineNum++){
			var line = this.data[lineNum]
			if(line.slice(0, 1) === "#"){
				
				var line = line.slice(1)
				var [name, value] = this.split(line, " ")
				name = name.toLowerCase()
				
				switch(name){
					case "gogostart":
						gogo = true
						break
					case "gogoend":
						gogo = false
						break
					case "bpmchange":
						bpm = parseFloat(value) || bpm
						break
					case "scroll":
						scroll = Math.abs(parseFloat(value)) || scroll
						break
					case "measure":
						var [numerator, denominator] = value.split("/")
						measure = numerator / denominator * 4 || measure
						break
					case "delay":
						ms += (parseFloat(value) || 0) * 1000
						break
					case "barlineon":
						barLine = true
						break
					case "barlineoff":
						barLine = false
						break
					case "branchstart":
						branch = true
						currentBranch = false
						branchFirstMeasure = true
						branchSettings = {
							ms: ms,
							gogo: gogo,
							bpm: bpm,
							scroll: scroll,
							sectionBegin: sectionBegin
						}
						value = value.split(",")
						if(!this.branches){
							this.branches = []
						}
						var req = {
							advanced: parseFloat(value[1]) || 0,
							master: parseFloat(value[2]) || 0
						}
						if(req.advanced > 0){
							var active = req.master > 0 ? "normal" : "master"
						}else{
							var active = req.master > 0 ? "advanced" : "master"
						}
						branchObj = {
							ms: ms,
							originalMS: ms,
							active: active,
							type: value[0].trim().toLowerCase() === "r" ? "drumroll" : "accuracy",
							requirement: req
						}
						this.branches.push(branchObj)
						if(this.measures.length === 1 && branchObj.type === "drumroll"){
							for(var i = circles.length; i--;){
								var circle = circles[i]
								if(circle.endTime && circle.type === "drumroll" || circle.type === "daiDrumroll" || circle.type === "balloon"){
									this.measures.push({
										ms: circle.endTime,
										originalMS: circle.endTime,
										speed: circle.bpm * circle.scroll / 60,
										visible: false,
										branch: circle.branch
									})
									break
								}
							}
						}
						if(this.measures.length !== 0){
							this.measures[this.measures.length - 1].nextBranch = branchObj
						}
						break
					case "branchend":
						branch = false
						currentBranch = false
						break
					case "section":
						sectionBegin = true
						if(branch && !currentBranch){
							branchSettings.sectionBegin = true
						}
						break
					case "n": case "e": case "m":
						if(!branch){
							break
						}
						ms = branchSettings.ms
						gogo = branchSettings.gogo
						bpm = branchSettings.bpm
						scroll = branchSettings.scroll
						sectionBegin = branchSettings.sectionBegin
						branchFirstMeasure = true
						var branchName = name === "m" ? "master" : (name === "e" ? "advanced" : "normal")
						currentBranch = {
							name: branchName,
							active: branchName === branchObj.active
						}
						branchObj[branchName] = currentBranch
						break
					case "lyric":
						lyricsLine = value.replace(regexLinebreak, "\n").trim()
						break
				}
				
			}else{
				
				var string = line.toUpperCase().split("")
				
				for(let symbol of string){
					
					var error = false
					switch(symbol){
						
						case "0":
							insertBlankNote()
							break
						case "1": case "2": case "3": case "4": case "A": case "B":
							var type = this.noteTypes[symbol]
							var circleObj = {
								type: type.name,
								txt: type.txt,
								gogo: gogo,
								bpm: bpm,
								scroll: scroll,
								section: sectionBegin
							}
							sectionBegin = false
							if(lastDrumroll){
								circleObj.endDrumroll = lastDrumroll
								lastDrumroll = false
							}
							insertNote(circleObj)
							break
						case "5": case "6": case "7": case "9":
							var type = this.noteTypes[symbol]
							var circleObj = {
								type: type.name,
								txt: type.txt,
								gogo: gogo,
								bpm: bpm,
								scroll: scroll,
								section: sectionBegin
							}
							sectionBegin = false
							if(lastDrumroll){
								if(symbol === "9"){
									insertNote({
										endDrumroll: lastDrumroll,
										gogo: gogo,
										bpm: bpm,
										scroll: scroll,
										section: sectionBegin
									})
									sectionBegin = false
									lastDrumroll = false
								}else{
									insertBlankNote()
								}
								break
							}
							if(symbol === "7" || symbol === "9"){
								var hits = balloons[balloonID]
								if(!hits || hits < 1){
									hits = 1
								}
								circleObj.requiredHits = hits
								balloonID++
							}
							lastDrumroll = circleObj
							insertNote(circleObj)
							break
						case "8":
							if(lastDrumroll){
								insertNote({
									endDrumroll: lastDrumroll,
									gogo: gogo,
									bpm: bpm,
									scroll: scroll,
									section: sectionBegin
								})
								sectionBegin = false
								lastDrumroll = false
							}else{
								insertBlankNote()
							}
							break
						case ",":
							if(currentMeasure.length === 0 && (bpm !== lastBpm || gogo !== lastGogo || lyricsLine !== null)){
								insertBlankNote()
							}
							pushMeasure()
							currentMeasure = []
							break
						default:
							if(regexAZ.test(symbol)){
								insertBlankNote()
							}else if(!regexSpace.test(symbol)){
								error = true
							}
							break
						
					}
					if(error){
						break
					}
				}
				
			}
		}
		pushMeasure()
		if(lastDrumroll){
			lastDrumroll.endTime = ms
			lastDrumroll.originalEndTime = ms
		}
		
		if(this.branches){
			circles.sort((a, b) => a.ms > b.ms ? 1 : -1)
			this.measures.sort((a, b) => a.ms > b.ms ? 1 : -1)
			circles.forEach((circle, i) => circle.id = i + 1)
		}
		this.scoreinit = meta.scoreinit;
		this.scorediff = meta.scorediff;
		if (this.scoreinit) {
			this.scoremode = meta.scoremode || 1;
		} else { 
			this.scoremode = meta.scoremode || 2;
			var autoscore = new AutoScore(this.difficulty, this.stars, this.scoremode, circles);
			this.scoreinit = autoscore.ScoreInit;
			this.scorediff = autoscore.ScoreDiff;
		}
		if(this.lyrics){
			var line = this.lyrics[this.lyrics.length - 1]
			line.end = Math.max(ms, line.start) + 5000
		}
		return circles
	}
}
