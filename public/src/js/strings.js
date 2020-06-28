var languageList = ["ja", "en", "cn", "tw", "ko", "fr"]
var translations = {
	name: {
		ja: "日本語",
		en: "English",
		cn: "简体中文",
		tw: "正體中文",
		ko: "한국어",
		fr: "Français"
	},
	regex: {
		ja: /^ja$|^ja-/,
		en: /^en$|^en-/,
		cn: /^zh$|^zh-CN$|^zh-SG$/,
		tw: /^zh-HK$|^zh-TW$/,
		ko: /^ko$|^ko-/,
		fr: /^fr$|^fr-FR$/
	},
	font: {
		ja: "TnT, Meiryo, sans-serif",
		en: "TnT, Meiryo, sans-serif",
		cn: "Microsoft YaHei, sans-serif",
		tw: "Microsoft YaHei, sans-serif",
		ko: "Microsoft YaHei, sans-serif",
		fr: "TnT, Meiryo, sans-serif"
	},
	
	taikoWeb: {
		ja: "たいこウェブ",
		en: "Taiko Web",
		cn: "太鼓网页",
		tw: "太鼓網頁",
		ko: "태고 웹",
		fr: "Taiko Web"
	},
	titleProceed: {
		ja: "クリックするかEnterを押す！",
		en: "Click or Press Enter!",
		cn: "点击或按回车！",
		tw: "點擊或按確認！",
		ko: "클릭하거나 Enter를 누릅니다!",
		fr: "Appuyez sur Entrée!"
	},
	titleDisclaimer: {
		ja: "この非公式シミュレーターはバンダイナムコとは関係がありません。",
		en: "This unofficial simulator is unaffiliated with BANDAI NAMCO.",
		cn: "这款非官方模拟器与BANDAI NAMCO无关。",
		tw: "這款非官方模擬器與BANDAI NAMCO無關。",
		ko: "이 비공식 시뮬레이터는 반다이 남코와 관련이 없습니다.",
		fr: "Ce simulateur non-officiel n'est pas affilié à BANDAI NAMCO."
	},
	titleCopyright: {
		en: "Taiko no Tatsujin ©&™ 2011 BANDAI NAMCO Entertainment Inc."
		fr: "Taiko no Tatsujin ©&™ 2011 BANDAI NAMCO Entertainment Inc."
	},
	selectSong: {
		ja: "曲をえらぶ",
		en: "Select Song",
		cn: "选择乐曲",
		tw: "選擇樂曲",
		ko: "곡 선택",
		fr: "Choix de la chanson"
	},
	selectDifficulty: {
		ja: "むずかしさをえらぶ",
		en: "Select Difficulty",
		cn: "选择难度",
		tw: "選擇難度",
		ko: "난이도 선택",
		fr: "Choix de la difficulté"
	},
	back: {
		ja: "もどる",
		en: "Back",
		cn: "返回",
		tw: "返回",
		ko: "돌아간다",
		fr: "Retour"
	},
	random: {
		ja: "ランダム",
		en: "Random",
		cn: "随机",
		tw: "隨機",
		ko: "랜덤",
		fr: "Aléatoire"
	},
	randomSong: {
		ja: "ランダムに曲をえらぶ",
		en: "Random Song",
		cn: "随机选曲",
		tw: "隨機選曲",
		ko: "랜덤",
		fr: "Chanson Aléatoire"
	},
	howToPlay: {
		ja: "あそびかた説明",
		en: "How to Play",
		cn: "操作说明",
		tw: "操作說明",
		ko: "지도 시간",
		fr: "Comment Jouer",
	},
	aboutSimulator: {
		ja: "このシミュレータについて",
		en: "About Simulator",
		cn: "关于模拟器",
		tw: "關於模擬器",
		ko: "게임 정보",
		fr: "A propos du Simulateur"
	},
	gameSettings: {
		ja: "ゲーム設定",
		en: "Game Settings",
		cn: "游戏设定",
		tw: "遊戲設定",
		ko: "게임 설정",
		fr: "Paramètres"
	},
	browse: {
		ja: "参照する…",
		en: "Browse…",
		cn: "浏览…",
		tw: "開啟檔案…",
		ko: "찾아보기…",
		fr: "Parcourir…"
	},
	defaultSongList: {
		ja: "デフォルト曲リスト",
		en: "Default Song List",
		cn: "默认歌曲列表",
		tw: "默認歌曲列表",
		ko: "기본 노래 목록",
		fr: "Liste des Chansons par défaut"
	},
	songOptions: {
		ja: "演奏オプション",
		en: "Song Options",
		cn: "选项",
		tw: "選項",
		ko: "옵션",
		fr: "Paramètres de la chanson"
	},
	none: {
		ja: "なし",
		en: "None",
		cn: "无",
		tw: "無",
		ko: "없음",
		fr: "Aucun"
	},
	auto: {
		ja: "オート",
		en: "Auto",
		cn: "自动",
		tw: "自動",
		ko: "오토",
		fr: "Automatique"
	},
	netplay: {
		ja: "ネットプレイ",
		en: "Netplay",
		cn: "网络对战",
		tw: "網上對打",
		ko: "넷 플레이",
		fr: "Jeu en Ligne"
	},
	easy: {
		ja: "かんたん",
		en: "Easy",
		cn: "简单",
		tw: "簡單",
		ko: "쉬움",
		fr: "Facile"
	},
	normal: {
		ja: "ふつう",
		en: "Normal",
		cn: "普通",
		tw: "普通",
		ko: "보통",
		fr: "Normal"
	},
	hard: {
		ja: "むずかしい",
		en: "Hard",
		cn: "困难",
		tw: "困難",
		ko: "어려움",
		fr: "Difficile"
	},
	oni: {
		ja: "おに",
		en: "Extreme",
		cn: "魔王",
		tw: "魔王",
		ko: "귀신",
		fr: "Extrême"
	},
	songBranch: {
		ja: "譜面分岐あり",
		en: "Diverge Notes",
		cn: "有谱面分歧",
		tw: "有譜面分歧",
		ko: "악보 분기 있습니다",
		fr: "Notes divergentes"
	},
	defaultName: {
		ja: "どんちゃん",
		en: "Don-chan",
		cn: "小咚",
		tw: "小咚",
		ko: "동이",
		fr: "Don-chan"
	},
	default2PName: {
		ja: "かっちゃん",
		en: "Katsu-chan",
		cn: "小咔",
		tw: "小咔",
		ko: "딱이",
		fr: "Katsu-chan"
	},
	notLoggedIn: {
		ja: "ログインしていない",
		en: "Not logged in",
		cn: "未登录",
		tw: "未登錄",
		ko: "로그인하지 않았습니다",
		fr: "Non connecté"
	},
	sessionStart: {
		ja: "オンラインセッションを開始する！",
		en: "Begin an Online Session!",
		cn: "开始在线会话！",
		tw: "開始多人模式!",
		ko: "온라인 세션 시작!",
		fr: "Commencer une Partie en Ligne!"
	},
	sessionEnd: {
		ja: "オンラインセッションを終了する",
		en: "End Online Session",
		cn: "结束在线会话",
		tw: "結束多人模式",
		ko: "온라인 세션 끝내기",
		fr: "Finir la Partie en Ligne"
	},
	scoreSaveFailed: {
		ja: null,
		en: "Could not connect to the server, your score has not been saved.\n\nPlease log in or refresh the page to try saving the score again.",
		fr: "Connexion au serveur impossible, votre score n'a pas été sauvegardé.\n\nReconnectez-vous ou rafraîchissez la page pour réessayer de sauvegarder."
	},
	loadSongError: {
		ja: null,
		en: "Could not load song %s with id %s.\n\n%s",
		fr: "Impossible de charger la chanson %s avec l'id %s.\n\n%s"
	},
	loading: {
		ja: "ロード中...",
		en: "Loading...",
		cn: "加载中...",
		tw: "讀取中...",
		ko: "로딩 중...",
		fr: "Chargement..."
	},
	waitingForP2: {
		ja: "他のプレイヤーを待っている...",
		en: "Waiting for Another Player...",
		cn: "正在等待对方玩家...",
		tw: "正在等待對方玩家...",
		ko: "Waiting for Another Player...",
		fr: "En attente d'un autre joueur..."
	},
	cancel: {
		ja: "キャンセル",
		en: "Cancel",
		cn: "取消",
		tw: "取消",
		ko: "취소",
		fr: "Annuler"
	},
	note: {
		don: {
			ja: "ドン",
			en: "Don",
			cn: "咚",
			tw: "咚",
			ko: "쿵",
			fr: "Don"
		},
		ka: {
			ja: "カッ",
			en: "Ka",
			cn: "咔",
			tw: "咔",
			ko: "딱",
			fr: "Ka"
		},
		daiDon: {
			ja: "ドン(大)",
			en: "DON",
			cn: "咚(大)",
			tw: "咚(大)",
			ko: "쿵(대)",
			fr: "DON"
		},
		daiKa: {
			ja: "カッ(大)",
			en: "KA",
			cn: "咔(大)",
			tw: "咔(大)",
			ko: "딱(대)",
			fr: "KA"
		},
		drumroll: {
			ja: "連打ーっ!!",
			en: "Drum rollー!!",
			cn: "连打ー!!",
			tw: "連打ー!!",
			ko: "연타ー!!",
			fr: "Roul. tambourー!!"
		},
		daiDrumroll: {
			ja: "連打(大)ーっ!!",
			en: "DRUM ROLLー!!",
			cn: "连打(大)ー!!",
			tw: "連打(大)ー!!",
			ko: "연타(대)ー!!",
			fr: "ROUL. TAMBOURー!!"
		},
		balloon: {
			ja: "ふうせん",
			en: "Balloon",
			cn: "气球",
			tw: "氣球",
			ko: "풍선",
			fr: "Ballon"
		},
	},
	ex_note: {
		don: {
			ja: ["ド", "コ"],
			en: ["Do", "Do"],
			cn: ["咚", "咚"],
			tw: ["咚", "咚"],
			ko: ["쿠", "쿠"],
			fr: ["Do", "Do"]
		},
		ka: {
			ja: ["カ"],
			en: ["Ka"],
			cn: ["咔"],
			tw: ["咔"],
			ko: ["딱"],
			fr: ["Ka"]
		},
		daiDon: {
			ja: ["ドン(大)", "ドン(大)"],
			en: ["DON", "DON"],
			cn: ["咚(大)", "咚(大)"],
			tw: ["咚(大)", "咚(大)"],
			ko: ["쿵(대)", "쿵(대)"],
			fr: ["DON", "DON"]
		},
		daiKa: {
			ja: ["カッ(大)"],
			en: ["KA"],
			cn: ["咔(大)"],
			tw: ["咔(大)"],
			ko: ["딱(대)"],
			fr: ["KA"]
		},
	},
	combo: {
		ja: "コンボ",
		en: "Combo",
		cn: "连段",
		tw: "連段",
		ko: "콤보",
		fr: "Combo"
	},
	clear: {
		ja: "クリア",
		en: "Clear",
		cn: "通关",
		tw: "通關",
		ko: "클리어",
		fr: "Terminé"
	},
	good: {
		ja: "良",
		en: "GOOD",
		cn: "良",
		tw: "良",
		ko: "얼쑤",
		fr: "BON"
	},
	ok: {
		ja: "可",
		en: "OK",
		cn: "可",
		tw: "可",
		ko: "좋다",
		fr: "OK"
	},
	bad: {
		ja: "不可",
		en: "BAD",
		cn: "不可",
		tw: "不可",
		ko: "에구",
		fr: "MAUVAIS"
	},
	branch: {
		normal: {
			ja: "普通譜面",
			en: "Normal",
			cn: "一般谱面",
			tw: "一般譜面",
			ko: "보통 악보",
			fr: "Normal"
		},
		advanced: {
			ja: "玄人譜面",
			en: "Professional",
			cn: "进阶谱面",
			tw: "進階譜面",
			ko: "현인 악보",
			fr: "Professionnel"
		},
		master: {
			ja: "達人譜面",
			en: "Master",
			cn: "达人谱面",
			tw: "達人譜面",
			ko: "달인 악보",
			fr: "Maître"
		}
	},
	pauseOptions: {
		ja: [
			"演奏をつづける",
			"はじめからやりなおす",
			"「曲をえらぶ」にもどる"
		],
		en: [
			"Continue",
			"Retry",
			"Back to Select Song"
		],
		cn: [
			"继续演奏",
			"从头开始",
			"返回「选择乐曲」"
		],
		tw: [
			"繼續演奏",
			"從頭開始",
			"返回「選擇樂曲」"
		],
		ko: [
			"연주 계속하기",
			"처음부터 다시",
			"「곡 선택」으로"
		],
		fr: [
			"Continuer",
			"Réessayer",
			"Retour au choix de la chanson"
		]
	},
	results: {
		ja: "成績発表",
		en: "Results",
		cn: "发表成绩",
		tw: "發表成績",
		ko: "성적 발표",
		fr: "Résultats"
	},
	points: {
		ja: "点",
		en: "pts",
		cn: "点",
		tw: "分",
		ko: "점",
		fr: "pts"
	},
	maxCombo: {
		ja: "最大コンボ数",
		en: "MAX Combo",
		cn: "最多连段数",
		tw: "最多連段數",
		ko: "최대 콤보 수",
		fr: "Combo MAX"
	},
	drumroll: {
		ja: "連打数",
		en: "Drumroll",
		cn: "连打数",
		tw: "連打數",
		ko: "연타 횟수",
		fr: "Roul. de tambour"
	},
	
	errorOccured: {
		ja: "エラーが発生しました。再読み込みしてください。",
		en: "An error occurred, please refresh",
		fr: "Une erreur est survenue, rafraîchissez la page"
	},
	tutorial: {
		basics: {
			ja: [
				"流れてくる音符がワクに重なったらバチで太鼓をたたこう！",
				"赤い音符は面をたたこう（%sまたは%s）",
				"青い音符はフチをたたこう（%sまたは%s）",
				"USBコントローラがサポートされています！"
			],
			en: [
				"When a note overlaps the frame, that is your cue to hit the drum!",
				"For red notes, hit the surface of the drum (%s or %s)...",
				"...and for blue notes, hit the rim! (%s or %s)",
				"USB controllers are also supported!"
			],
			cn: [
				"当流动的音符将与框框重叠时就用鼓棒敲打太鼓吧",
				"遇到红色音符要敲打鼓面（%s或%s）",
				"遇到蓝色音符则敲打鼓边（%s或%s）",
				"USB控制器也支持！"
			],
			tw: [
				"當流動的音符將與框框重疊時就用鼓棒敲打太鼓吧",
				"遇到紅色音符要敲打鼓面（%s或%s）",
				"遇到藍色音符則敲打鼓邊（%s或%s）",
				"USB控制器也支持！"
			],
			ko: [
				"이동하는 음표가 테두리와 겹쳐졌을 때 북채로 태고를 두드리자！",
				"빨간 음표는 면을 두드리자 (%s 또는 %s)",
				"파란 음표는 테를 두드리자 (%s 또는 %s)",
				"USB 컨트롤러도 지원됩니다!"
			],
			fr: [
				"Tu dois tambouriner au moment où la note passe sur le cadre!",
				"Pour les notes rouges, tambourine la surface (%s or %s)...",
				"...et pour les notes bleues, tambourine le rebord! (%s or %s)",
				"Les controlleurs USB sont aussi supportés!"
			],
		},
		otherControls: {
			ja: "他のコントロール",
			en: "Other controls",
			cn: "其他控制",
			tw: "其他控制",
			ko: "기타 컨트롤",
			fr: "Autres Contrôles",
		},
		otherTutorial: {
			ja: [
				"%sはゲームを一時停止します",
				"曲をえらぶしながら%sか%sキーを押してジャンルをスキップします",
				"むずかしさをえらぶしながら%sキーを押しながらオートモードを有効",
				"むずかしさをえらぶしながら%sキーを押しながらネットプレイモードを有効"
			],
			en: [
				"%s \u2014 pause game",
				'%s and %s while selecting song \u2014 navigate categories',
				"%s while selecting difficulty \u2014 enable autoplay mode",
				"%s while selecting difficulty \u2014 enable 2P mode"
			],
			cn: [
				"%s暂停游戏",
				'%s and %s while selecting song \u2014 navigate categories',
				"选择难度时按住%s以启用自动模式",
				"选择难度时按住%s以启用网络对战模式"
			],
			tw: [
				"%s暫停遊戲",
				'%s and %s while selecting song \u2014 navigate categories',
				"選擇難度時按住%s以啟用自動模式",
				"選擇難度時按住%s以啟用網上對打模式"
			],
			ko: [
				"%s \u2014 게임을 일시 중지합니다",
				'%s and %s while selecting song \u2014 navigate categories',
				"난이도 선택 동안 %s 홀드 \u2014 오토 모드 활성화",
				"난이도 선택 동안 %s 홀드 \u2014 넷 플레이 모드 활성화"
			],
			fr: [
				"%s \u2014 mettre en pause",
				"%s et %s pendant la sélection d'une chanson \u2014 changer de catégorie",
				"%s pendant la sélection d'une difficulté \u2014 activer le mode automatique",
				"%s pendant la sélection d'une difficulté \u2014 activer le mode 2 Joueurs"
			],
		},
		ok: {
			ja: "OK",
			en: "OK",
			cn: "确定",
			tw: "確定",
			ko: "확인",
			fr: "OK"
		}
	},
	about: {
		bugReporting: {
			ja: [
				"このシミュレータは現在開発中です。",
				"バグが発生した場合は、報告してください。",
				"Gitリポジトリかメールでバグを報告してください。"
			],
			en: [
				"This simulator is still in development.",
				"Please report any bugs you find.",
				"You can report bugs either via our Git repository or email."
			],
			fr: [
				"Ce simulateur est toujours en développement.",
				"Merci de signaler chaque bug que vous trouvez.",
				"Vous pouvez les signaler soit depuis notre dépôt Git ou par email."
			],
		},
		diagnosticWarning: {
			ja: "以下の端末診断情報も併せて報告してください！",
			en: "Be sure to include the following diagnostic data!",
			fr: "Assurez-vous d'inclure les choses suivantes!",
		},
		issueTemplate: {
			ja: "###### 下記の問題を説明してください。 スクリーンショットと診断情報を含めてください。",
			en: "###### Describe the problem you are having below. Please include a screenshot and the diagnostic information.",
			fr: "###### Décrivez le problem que vous avez ci-dessous. Merci d'inclure une capture d'écran et les informations du diagnostique.",
		},
		issues: {
			ja: "課題",
			en: "Issues",
			cn: "工单",
			tw: "問題",
			ko: "이슈",
			fr: "Problèmes",
		}
	},
	session: {
		multiplayerSession: {
			ja: "オンラインセッション",
			en: "Multiplayer Session",
			cn: "在线会话",
			tw: "多人模式",
			ko: null,
			fr: "Session Multijoueur"
		},
		linkTutorial: {
			ja: null,
			en: "Share this link with your friend to start playing together! Do not leave this screen while they join.",
			cn: "复制下方地址，给你的朋友即可开始一起游戏！当他们与您联系之前，请不要离开此页面。",
			tw: "複製下方地址，給你的朋友即可開始一起遊戲！當他們與您聯繫之前，請不要離開此頁面。",
			ko: null,
			fr: "Partagez ce lien avec vos amis pour jouer ensemble! Ne quittez pas cet écran pendant qu'ils rejoignent."
		},
		cancel: {
			ja: "キャンセル",
			en: "Cancel",
			cn: "取消",
			tw: "取消",
			ko: "취소",
			fr: "Annuler"
		}
	},
	settings: {
		language: {
			name: {
				ja: "言語",
				en: "Language",
				cn: "语言",
				tw: "語系",
				ko: "언어",
				fr: "Langue"
			}
		},
		resolution: {
			name: {
				ja: "ゲームの解像度",
				en: "Game Resolution",
				cn: "游戏分辨率",
				tw: "遊戲分辨率",
				ko: "게임 해상도",
				fr: "Résolution du Jeu"
			},
			high: {
				ja: "高",
				en: "High",
				cn: "高",
				tw: "高",
				ko: "높은",
				fr: "Elevé"
			},
			medium: {
				ja: "中",
				en: "Medium",
				cn: "中",
				tw: "中",
				ko: "중간",
				fr: "Moyen"
			},
			low: {
				ja: "低",
				en: "Low",
				cn: "低",
				tw: "低",
				ko: "저",
				fr: "Faible"
			},
			lowest: {
				ja: "最低",
				en: "Lowest",
				cn: "最低",
				tw: "最低",
				ko: "최저",
				fr: "Très Faible"
			}
		},
		touchAnimation: {
			name: {
				ja: "タッチアニメーション",
				en: "Touch Animation",
				cn: "触摸动画",
				tw: "觸摸動畫",
				ko: "터치 애니메이션",
				fr: "Animation du Toucher"
			}
		},
		keyboardSettings: {
			name: {
				ja: "キーボード設定",
				en: "Keyboard Settings",
				cn: "键盘设置",
				tw: "鍵盤設置",
				ko: "키보드 설정",
				fr: "Paramètres du Clavier"
			},
			ka_l: {
				ja: "ふち(左)",
				en: "Left Rim",
				cn: "边缘（左）",
				tw: "邊緣（左）",
				ko: "가장자리 (왼쪽)",
				fr: "Rebord Gauche"
			},
			don_l: {
				ja: "面(左)",
				en: "Left Surface",
				cn: "表面（左）",
				tw: "表面（左）",
				ko: "표면 (왼쪽)",
				fr: "Surface Gauche"
			},
			don_r: {
				ja: "面(右)",
				en: "Right Surface",
				cn: "表面（右）",
				tw: "表面（右）",
				ko: "표면 (오른쪽)",
				fr: "Surface Droite"
			},
			ka_r: {
				ja: "ふち(右)",
				en: "Right Rim",
				cn: "边缘（右）",
				tw: "邊緣（右）",
				ko: "가장자리 (오른쪽)",
				fr: "Rebord Droite"
			}
		},
		gamepadLayout: {
			name: {
				ja: "そうさタイプ設定",
				en: "Gamepad Layout",
				cn: "操作类型设定",
				tw: "操作類型設定",
				ko: "조작 타입 설정",
				fr: "Layout de la Manette"
			},
			a: {
				ja: "タイプA",
				en: "Type A",
				cn: "类型A",
				tw: "類型A",
				ko: "타입 A",
				fr: "Type A"
			},
			b: {
				ja: "タイプB",
				en: "Type B",
				cn: "类型B",
				tw: "類型B",
				ko: "타입 B",
				fr: "Type B"
			},
			c: {
				ja: "タイプC",
				en: "Type C",
				cn: "类型C",
				tw: "類型C",
				ko: "타입 C",
				fr: "Type C"
			}
		},
		latency: {
			name: {
				ja: null,
				en: "Latency",
				fr: "Latence",
			},
			value: {
				ja: null,
				en: "Audio: %s, Video: %s",
				fr: "Audio: %s, Vidéo: %s",
			},
			calibration: {
				ja: null,
				en: "Latency Calibration",
				fr: "Calibrage de la Latence",
			},
			audio: {
				ja: null,
				en: "Audio",
				fr: "Audio",
			},
			video: {
				ja: null,
				en: "Video",
				fr: "Vidéo",
			},
			drumSounds: {
				ja: null,
				en: "Drum Sounds",
				fr: "Sons du Tambour",
			}
		},
		easierBigNotes: {
			name: {
				ja: "簡単な大きな音符",
				en: "Easier Big Notes",
				cn: "简单的大音符",
				tw: "簡單的大音符",
				ko: "쉬운 큰 음표",
				fr: "Grosses Notes plus Simples"
			}
		},
		showLyrics: {
			name: {
				ja: "歌詞の表示",
				en: "Show Lyrics",
				fr: "Afficher les Paroles"
			}
		},
		on: {
			ja: "オン",
			en: "On",
			cn: "开",
			tw: "開",
			ko: "온",
			fr: "On"
		},
		off: {
			ja: "オフ",
			en: "Off",
			cn: "关",
			tw: "關",
			ko: "오프",
			fr: "Off"
		},
		default: {
			ja: "既定値にリセット",
			en: "Reset to Defaults",
			cn: "重置为默认值",
			tw: "重置為默認值",
			ko: "기본값으로 재설정",
			fr: "Réinitialiser"
		},
		ok: {
			ja: "OK",
			en: "OK",
			cn: "确定",
			tw: "確定",
			ko: "확인",
			fr: "OK"
		}
	},
	calibration: {
		title: {
			ja: null,
			en: "Latency Calibration",
			fr: "Calibrage de la Latence",
		},
		ms: {
			ja: null,
			en: "%sms",
			fr: "%sms",
		},
		back: {
			ja: null,
			en: "Back to Settings",
			fr: "Retour aux Paramètres",
		},
		retryPrevious: {
			ja: null,
			en: "Retry Previous",
			fr: "Réessayer le Précédent",
		},
		start: {
			ja: null,
			en: "Start",
			fr: "Commencer",
		},
		finish: {
			ja: null,
			en: "Finish",
			fr: "Terminer",
		},
		audioHelp: {
			title: {
				ja: null,
				en: "Audio Latency Calibration",
				fr: "Calibrage de la Latence Audio",
			},
			content: {
				ja: null,
				en: "Listen to a sound playing in the background.\n\nHit the surface of the drum (%s or %s) as you hear it!",
				fr: "Ecoutez la musique qui se joue en fond.\n\nFrappez la surface du tambour (%s or %s) en rythme!",
			},
			contentAlt: {
				ja: null,
				en: "Listen to a sound playing in the background.\n\nHit the surface of the drum as you hear it!",
				fr: "Ecoutez la musique qui se joue en fond.\n\nFrappez la surface du tambour en rythme!",
			}
		},
		audioComplete: {
			ja: null,
			en: "Audio Latency Calibration completed!",
			fr: "Calibrage de la Latence Audio Terminée!",
		},
		videoHelp: {
			title: {
				ja: null,
				en: "Video Latency Calibration",
				fr: "Calibrage de la Latence Vidéo",
			},
			content: {
				ja: null,
				en: "This time there will be no sounds.\n\nInstead, watch for notes blinking on the circle-shaped frame, hit the drum as they appear!",
				fr: "Cette fois ci il n'y aurra pas de son.\n\nA la place, regardez les notes sur le cadre, frappez le tambour quand elles apparaissent!",
			}
		},
		videoComplete: {
			ja: null,
			en: "Video Latency Calibration completed!",
			fr: "Calibrage de la Latence Vidéo Terminée!",
		},
		results: {
			title: {
				ja: null,
				en: "Latency Calibration Results",
				fr: "Résultats de la Calibration de la Latence",
			},
			content: {
				ja: null,
				en: "Audio latency: %s\nVideo latency: %s\n\nYou can configure these latency values in the settings.",
				fr: "Latence Audio: %s\nLatence Vidéo: %s\n\nVous pouvez configurer ces latences dans les paramètres.",
			}
		}
	},
	account: {
		username: {
			ja: "ユーザー名",
			en: "Username",
			cn: "登录名",
			tw: "使用者名稱",
			ko: "사용자 이름",
			fr: "Nom d'Utilisateur"
		},
		enterUsername: {
			ja: "ユーザー名を入力",
			en: "Enter Username",
			cn: "输入用户名",
			tw: "輸入用戶名",
			ko: "사용자 이름을 입력하십시오",
			fr: "Entrez votre Nom d'Utilisateur"
		},
		password: {
			ja: "パスワード",
			en: "Password",
			cn: "密码",
			tw: "密碼",
			ko: "비밀번호",
			fr: "Mot de Passe"
		},
		enterPassword: {
			ja: "パスワードを入力",
			en: "Enter Password",
			cn: "输入密码",
			tw: "輸入密碼",
			ko: "비밀번호 입력",
			fr: "Entrez votre Mot de Passe"
		},
		repeatPassword: {
			ja: "パスワードを再入力",
			en: "Repeat Password",
			cn: "重新输入密码",
			tw: "再次輸入密碼",
			ko: "비밀번호 재입력",
			fr: "Réécrivez votre Mot de Passe"
		},
		remember: {
			ja: "ログイン状態を保持する",
			en: "Remember me",
			cn: "记住登录",
			tw: "記住登錄",
			ko: "자동 로그인",
			fr: "Se Souvenir de Moi"
		},
		login: {
			ja: "ログイン",
			en: "Log In",
			cn: "登录",
			tw: "登入",
			ko: "로그인",
			fr: "Se connecter"
		},
		register: {
			ja: "登録",
			en: "Register",
			cn: "注册",
			tw: "註冊",
			ko: "가입하기",
			fr: "S'inscrire"
		},
		registerAccount: {
			ja: "アカウントを登録",
			en: "Register account",
			cn: "注册帐号",
			tw: "註冊帳號",
			ko: "계정 등록",
			fr: "Créer un Compte"
		},
		passwordsDoNotMatch: {
			ja: "パスワードが一致しません",
			en: "Passwords do not match",
			cn: "密码不匹配",
			tw: "密碼不匹配",
			ko: "비밀번호가 일치하지 않습니다",
			fr: "Le Mot de Passe ne correspond pas"
		},
		newPasswordsDoNotMatch: {
			ja: null,
			en: "New passwords do not match",
			fr: "Les nouveaux Mots de Passe ne correspondent pas",
		},
		cannotBeEmpty: {
			ja: "%sは空にできません",
			en: "%s cannot be empty",
			cn: "%s不能为空",
			tw: "%s不能為空",
			ko: "%s 비어 있을 수 없습니다",
			fr: "%s ne peut être vide"
		},
		error: {
			ja: "リクエストの処理中にエラーが発生しました",
			en: "An error occurred while processing your request",
			cn: "处理您的请求时发生错误",
			tw: "處理您的請求時發生錯誤",
			ko: "요청을 처리하는 동안 오류가 발생했습니다",
			fr: "Une erreur est survenue lors du traitement de votre requête"
		},
		logout: {
			ja: "ログアウト",
			en: "Log Out",
			cn: "登出",
			tw: "登出",
			ko: "로그 아웃",
			fr: "Se Déconnecter"
		},
		back: {
			ja: "もどる",
			en: "Back",
			cn: "返回",
			tw: "返回",
			ko: "돌아간다",
			fr: "Retour"
		},
		cancel: {
			ja: null,
			en: "Cancel",
			fr: "Annuler",
		},
		save: {
			ja: null,
			en: "Save",
			fr: "Sauvegarder",
		},
		displayName: {
			ja: null,
			en: "Displayed Name",
			fr: "Nom Affiché",
		},
		customdon: {
			bodyFill: {
				ja: null,
				en: "Body",
				fr: "Corps",
			},
			faceFill: {
				ja: null,
				en: "Face",
				fr: "Visage",
			},
			reset: {
				ja: null,
				en: "Reset",
				fr: "Réinitialiser",
			}
		},
		changePassword: {
			ja: null,
			en: "Change Password",
			fr: "Changer le Mot de Passe",
		},
		currentNewRepeat: {
			ja: null,
			en: [
				"Current Password",
				"New Password",
				"Repeat New Password"
			],
			fr: [
				"Mot de Passe Actuel",
				"Nouveau Mot de Passe",
				"Réécrivez le Nouveau Mot de Passe"
			],
		},
		deleteAccount: {
			ja: null,
			en: "Delete Account",
			fr: "Supprimer le Compte",
		},
		verifyPassword: {
			ja: null,
			en: "Verify password to delete this account",
			fr: "Vérifiez le Mot de Passe pour supprimer ce Compte",
		}
	},
	serverError: {
		not_logged_in: {
			ja: null,
			en: "Not logged in",
			fr: "Non connecté",
		},
		invalid_username: {
			ja: null,
			en: "Invalid username, a username can only contain letters, numbers, and underscores, and must be between 3 and 20 characters long",
			fr: "Nom d'Utilisateur invalide, un nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores, et doit comporter entre 3 et 20 caractères",
		},
		username_in_use: {
			ja: null,
			en: "A user already exists with that username",
			fr: "Un utilisateur existe déjà avec ce nom d'utilisateur",
		},
		invalid_password: {
			ja: null,
			en: "Cannot use this password, please check that your password is at least 6 characters long",
			fr: "Impossible d'utiliser ce Mot de Passe, vérifiez qu'il est long d'au moins 6 caractères",
		},
		invalid_username_password: {
			ja: null,
			en: "Invalid Username or Password",
			fr: "Nom d'Utilisateur ou Mot de Passe Invalide",
		},
		invalid_display_name: {
			ja: null,
			en: "Cannot use this name, please check that your new name is at most 25 characters long",
			fr: "Impossible d'utiliser ce nom, vérifiez que votre nouveau nom ne fait pas plus de 25 caractères de long",
		},
		invalid_don: {
			ja: null,
			en: "Could not save your custom Don",
			fr: "Echec de la sauvegarde de votre Don"
		},
		current_password_invalid: {
			ja: null,
			en: "Current password does not match",
			fr: "Le Mot de Passe actuel ne correspond pas",
		},
		invalid_new_password: {
			ja: null,
			en: "Cannot use this password, please check that your new password is at least 6 characters long",
			fr: "Impossible d'utiliser ce Mot de Passe, vérifiez qu'il fait au moins 6 caractères de long",
		},
		verify_password_invalid: {
			ja: null,
			en: "Verification password does not match",
			fr: "Le Mot de Passe de vérification ne correspond pas",
		},
		invalid_csrf: {
			ja: null,
			en: "Security token expired. Please refresh the page.",
			fr: "Le Jeton de Sécurité a expiré. Rafraîchissez la page."
		}
	},
	browserSupport: {
		browserWarning: {
			ja: "サポートされていないブラウザを実行しています (%s)",
			en: "You are running an unsupported browser (%s)",
			fr: "Vous utilisez un navigateur non supporté (%s)",
		},
		details: {
			ja: "詳しく",
			en: "Details...",
			fr: "Détails...",
		},
		failedTests: {
			ja: "このテストは失敗しました：",
			en: "The following tests have failed:",
			fr: "Les tests suivants ont échoués:",
		},
		supportedBrowser: {
			ja: "%sなどのサポートされているブラウザを使用してください",
			en: "Please use a supported browser such as %s",
			fr: "Merci d'utiliser un navigateur supporté comme %s",
		}
	},
	creative: {
		creative: {
			ja: "創作",
			en: "Creative",
			cn: "创作",
			tw: "創作",
			ko: "창작",
			fr: "Créatif"
		},
		maker: {
			ja: "メーカー",
			en: "Maker:",
			cn: "制作者",
			tw: "製作者",
			ko: "만드는 사람",
			fr: "Créateur:"
		}
	},
	withLyrics: {
		ja: "歌詞あり",
		en: "With lyrics",
		cn: "带歌词",
		tw: "帶歌詞",
		ko: "가사가있는",
		fr: "Avec les Paroles"
	}
}
var allStrings = {}
function separateStrings(){
	for(var j in languageList){
		var lang = languageList[j]
		allStrings[lang] = {
			id: lang
		}
		var str = allStrings[lang]
		var translateObj = function(obj, name, str){
			if("en" in obj){
				for(var i in obj){
					str[name] = obj[lang] || obj.en
				}
			}else if(obj){
				str[name] = {}
				for(var i in obj){
					translateObj(obj[i], i, str[name])
				}
			}
		}
		for(var i in translations){
			translateObj(translations[i], i, str)
		}
	}
}
separateStrings()
