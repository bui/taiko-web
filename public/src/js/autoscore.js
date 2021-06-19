class AutoScore { 
	constructor(difficulty, level, scoremode, circles) {
		this.scoremode = scoremode;
		this.circles = circles;
		this.basic_max_score_list = {
			oni: [
				1200000,
				700000,
				750000,
				800000,
				850000,
				900000,
				950000,
				1000000,
				1050000,
				1100000,
				1200000
			],
			ura: [
				1200000,
				700000,
				750000,
				800000,
				850000,
				900000,
				950000,
				1000000,
				1050000,
				1100000,
				1200000
			],
			hard: [
				900000,
				550000,
				600000,
				650000,
				700000,
				750000,
				800000,
				850000,
				900000,
			],
			normal: [
				700000,
				400000,
				450000,
				500000,
				550000,
				600000,
				650000,
				700000,
			],
			easy: [
				380000,
				300000,
				320000,
				340000,
				360000,
				380000,
			]
		}
		if (this.GetMaxCombo() === 0) { 
			this.ScoreDiff = 100;
			this.ScoreInit = 450;
			return;
		}
		const target = this.GetTargetScore(difficulty, level);
		this.Score = 0;
		this.ScoreDiff = 0;
		this.ScoreInit = 0;
		var max_init = this.GetMaxPossibleInit(target);
		var min_init = 0;
		if (this.scoremode === 3) { 
			this.ScoreDiff = 0;
			this.ScoreInit = max_init;
			return;
		}
		while (true) { 
			this.ScoreInit = (max_init + min_init) / 2;
			this.ScoreDiff = Math.round(this.ScoreInit / 4);
			this.Score = this.TryScore(this.ScoreInit, this.ScoreDiff);
			//console.log(min_init, max_init, this.ScoreInit, this.ScoreDiff, this.Score);
			if (this.ScoreInit === target) {
				this.ScoreInit = Math.floor(this.ScoreInit / 10) * 10;
				this.ScoreDiff = Math.round(this.ScoreInit / 4);
				this.Score = this.TryScore(this.ScoreInit, this.ScoreDiff);
				break;
			} else if (this.Score >= target) {
				max_init = this.ScoreInit;
			} else { 
				min_init = this.ScoreInit;
			}
			if (max_init - min_init <= 10) { 
				this.ScoreInit = Math.floor(this.ScoreInit / 10) * 10;
				this.ScoreDiff = Math.round(this.ScoreInit / 4);
				this.Score = this.TryScore(this.ScoreInit, this.ScoreDiff);
				break;
			}
		}
		while (this.Score < target) { 
			this.ScoreInit += 10;
			this.ScoreDiff = Math.round(this.ScoreInit / 4);
			this.Score = this.TryScore(this.ScoreInit, this.ScoreDiff);
			//console.log(this.ScoreInit, this.ScoreDiff, this.Score);
		}
		//console.log(this.ScoreInit, this.ScoreDiff, this.Score);
	}
	IsCommonCircle(circle) { 
		const ty = circle.type;
		return ty === "don" || ty === "ka" || ty === "daiDon" || ty === "daiKa";
	}
	TryScore(init, diff) { 
		var score = 0;
		var combo = 0;
		for (var circle of this.circles) { 
			if (circle.branch && circle.branch.name !== "master") { 
				continue;
			}
			if (this.IsCommonCircle(circle)) { 
				combo++;
				if (combo % 100 === 0 && this.scoremode === 2) { 
					score += 10000;
				}
			}
			var diff_mul = 0;
			var multiplier = (this.scoremode !== 3 && circle.gogoTime) ? 1.2 : 1;
			if (this.scoremode === 1) {
				diff_mul = Math.max(0, Math.floor((Math.min(combo, 100) - 1) / 10));
			} else if (this.scoremode === 2) { 
				if (combo >= 100) {
					diff_mul = 8;
				} else if (combo >= 50) {
					diff_mul = 4;
				} else if (combo >= 30) {
					diff_mul = 2;
				} else if (combo >= 10) {
					diff_mul = 1;
				}
			}
			if (this.scoremode === 3) {
				switch (circle.type) { 
					case "don":
					case "ka":
					case "daiDon":
					case "daiKa": { 
						score += Math.floor(init / 10) * 10;
						break;
					}
					case "balloon": { 
						score +=  100 * circle.requiredHits;
						break;
					}
					default: { 
						break;
					}
				}
			} else { 
				switch (circle.type) { 
					case "don":
					case "ka": { 
						score += Math.floor((init + diff * diff_mul) * multiplier / 10) * 10;
						break;
					}
					case "daiDon":
					case "daiKa": { 
						score += Math.floor((init + diff * diff_mul) * multiplier / 5) * 10;
						break;
					}
					case "balloon": { 
						score += (5000 + 300 * (circle.requiredHits - 1)) * multiplier;
						break;
					}
					default: { 
						break;
					}
				}
			}
		}
		return score;
	}
	GetTargetScore(difficulty, level) { 
		//console.log(difficulty, level)
		if (this.scoremode === 3) {
			return 1000000;
		}
		var ret = this.basic_max_score_list[difficulty][level];
		if (!ret) { 
			ret = this.basic_max_score_list[difficulty][0];
		}
		return ret;
	}
	GetMaxCombo() { 
		var combo = 0;
		for (var circle of this.circles) { 
			if (this.IsCommonCircle(circle) && (!circle.branch || circle.branch.name === "master")) { 
				++combo;
			}
		}
		return combo;
	}
	GetMaxPossibleInit(target) { 
		var basic_score = 0;
		if (this.scoremode === 2) { 
			const max_combo = this.GetMaxCombo();
			basic_score += Math.floor(max_combo / 100) * 10000;
		}
		var combo = 0;
		for (var circle of this.circles) { 
			if (circle.branch && circle.branch.name !== "master") { 
				continue;
			}
			var multiplier = (circle.gogoTime && this.scoremode !== 3) ? 1.2 : 1;
			if (this.scoremode === 3) {
				switch (circle.type) { 
					case "don":
					case "ka": 
					case "daiDon":
					case "daiKa": { 
						++combo;
						break;
					}
					case "balloon": { 
						basic_score += 100 * this.requiredHits;
						break;
					}
					default: { 
						break;
					}
				}
			} else { 
				switch (circle.type) { 
					case "don":
					case "ka": { 
						combo += (1 * multiplier);
						break;
					}
					case "daiDon":
					case "daiKa": { 
						combo += (2 * multiplier);
						break;
					}
					case "balloon": { 
						basic_score += (5000 + 300 * (circle.requiredHits - 1)) * multiplier;
						break;
					}
					default: { 
						break;
					}
				}
			}
		}
		combo = Math.floor(combo);
		return Math.ceil((target - basic_score) / combo / 10) * 10;
	}
}
