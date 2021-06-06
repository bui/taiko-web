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
		ko: "클릭하거나 Enter를 누르세요!",
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
		ko: "돌아가기",
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
		ko: "플레이 방법",
		fr: "Comment Jouer",
	},
	aboutSimulator: {
		ja: "このシミュレータについて",
		en: "About Simulator",
		cn: "关于模拟器",
		tw: "關於模擬器",
		ko: "시뮬레이터 정보",
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
		ko: "자동",
		fr: "Automatique"
	},
	netplay: {
		ja: "ネットプレイ",
		en: "Netplay",
		cn: "网络对战",
		tw: "網上對打",
		ko: "온라인 대전",
		fr: "Jouer en Ligne"
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
		ko: "악보 분기 있음",
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
		ja: "サーバーへの接続に問題が発生して、スコアの保存ができませんでした。\n\nログインするかまたは更新してもう一度スコアの保存をお試しください。",
		en: "Could not connect to the server, your score has not been saved.\n\nPlease log in or refresh the page to try saving the score again.",
		fr: "Connexion au serveur impossible, votre score n'a pas été sauvegardé.\n\nReconnectez-vous ou rafraîchissez la page pour réessayer de sauvegarder."
	},
	loadSongError: {
		ja: "%s (ID: %s)の読み込み中に問題が発生しました。\n\n%s",
		en: "Could not load song %s with id %s.\n\n%s",
		fr: "Un problème est survenue lors du chargement de la chanson %s avec l'ID %s.\n\n%s",
	},
	loading: {
		ja: "ロード中...",
		en: "Loading...",
		cn: "加载中...",
		tw: "讀取中...",
		ko: "로딩 중...",
		fr: "Chargement...",
	},
	waitingForP2: {
		ja: "他のプレイヤーを待っている...",
		en: "Waiting for Another Player...",
		cn: "正在等待对方玩家...",
		tw: "正在等待對方玩家...",
		ko: "다른 플레이어 대기 중...",
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
		fr: "BIEN"
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
		fr: "Une erreur est survenue, merci de rafraîchir la page"
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
				"이동하는 음표가 테두리와 겹쳐졌을 때 북채로 태고를 두드리자!",
				"빨간 음표는 면을 두드리자 (%s 또는 %s)",
				"파란 음표는 테를 두드리자 (%s 또는 %s)",
				"USB 컨트롤러도 지원됩니다!"
			],
			fr: [
				"Tu dois tambouriner au moment où la note passe sur le cadre!",
				"Pour les notes rouges, tambourine la surface (%s ou %s)...",
				"...et pour les notes bleues, tambourine le rebord! (%s ou %s)",
				"Les manettes USB sont aussi supportés!"
			],
		},
		otherControls: {
			ja: "他のコントロール",
			en: "Other controls",
			cn: "其他控制",
			tw: "其他控制",
			ko: "기타 컨트롤",
			fr: "Autres Contrôles"
		},
		otherTutorial: {
			ja: [
				"%sはゲームを一時停止します",
				"曲をえらびながら%sか%sキーを押してジャンルをスキップします",
				"むずかしさをえらびながら%sキーを押してオートモードを有効",
				"むずかしさをえらびながら%sキーを押してネットプレイモードを有効"
			],
			en: [
				"%s \u2014 pause game",
				'%s and %s while selecting song \u2014 navigate categories',
				"%s while selecting difficulty \u2014 enable autoplay mode",
				"%s while selecting difficulty \u2014 enable 2P mode"
			],
			cn: [
				"%s暂停游戏",
				'%s 和 %s 选择歌曲时快速切换类别',
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
				'곡 선택 중 %s 또는 %s \u2014 카테고리 이동',
				"난이도 선택 동안 %s 홀드 \u2014 자동 모드 활성화",
				"난이도 선택 동안 %s 홀드 \u2014 온라인 대전 모드 활성화"
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
		},
		key: {
			ctrl: {
				en: "CTRL"
			},
			shift: {
				en: "⇧ SHIFT"
			},
			leftArrow: {
				en: "\u2190"
			},
			rightArrow: {
				en: "\u2192"
			},
			esc: {
				en: "ESC"
			},
			join: {
				en: "+"
			},
			or: {
				ja: "または",
				en: " or ",
				cn: "或",
				tw: "或",
				ko: " 또는 ",
				fr: " ou "
			}
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
			cn: [
				"这款模拟器仍处于开发中，",
				"您可以向我们报告在游戏中出现的任何bug，",
				"可以通过我们的Github仓库或发送电子邮件来报告错误。"
			],
			ko: [
				"이 시뮬레이터는 아직 개발 중입니다.",
				"버그를 찾으시면 신고해주시기 바랍니다.",
				"Github 레포지터리나 이메일을 통해 버그를 신고하실 수 있습니다."
			],
			fr: [
				"Ce simulateur est encore en phase de développement.",
				"Merci de signaler tout bug que vous trouvez.",
				"Vous pouvez les signaler depuis notre projet Git ou par email."
			],
		},
		diagnosticWarning: {
			ja: "以下の端末診断情報も併せて報告してください！",
			en: "Be sure to include the following diagnostic data!",
			cn: "请确保您的报告包括以下诊断数据!",
			ko: "신고하실 때 반드시 다음 진단 정보를 포함해주시기 바랍니다!",
			fr: "Assurez-vous d'inclure les choses suivantes!"
		},
		issueTemplate: {
			ja: "###### 下記の問題を説明してください。 スクリーンショットと診断情報を含めてください。",
			en: "###### Describe the problem you are having below. Please include a screenshot and the diagnostic information.",
			fr: "###### Décrivez le problem que vous avez ci-dessous. Merci d'inclure une capture d'écran et les informations de diagnostique."
		},
		issues: {
			ja: "課題",
			en: "Issues",
			cn: "工单",
			tw: "問題",
			ko: "이슈",
			fr: "Problèmes"
		}
	},
	session: {
		multiplayerSession: {
			ja: "オンラインセッション",
			en: "Multiplayer Session",
			cn: "在线会话",
			tw: "多人模式",
			ko: "멀티플레이어 세션",
			fr: "Session Multijoueur"
		},
		linkTutorial: {
			ja: "このリンクを共有して友達と遊ぼう！参加するまでこの画面を閉めないでください。",
			en: "Share this link with your friend to start playing together! Do not leave this screen while they join.",
			cn: "复制下方地址，给你的朋友即可开始一起游戏！当他们与您联系之前，请不要离开此页面。",
			tw: "複製下方地址，給你的朋友即可開始一起遊戲！當他們與您聯繫之前，請不要離開此頁面。",
			ko: "링크를 공유하여 친구와 플레이하세요! 친구가 입장하기 전에 페이지를 나가지 말아주세요.",
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
				ko: "높음",
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
				ko: "낮음",
				fr: "Faible"
			},
			lowest: {
				ja: "最低",
				en: "Lowest",
				cn: "最低",
				tw: "最低",
				ko: "매우 낮음",
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
				ko: "북 면 (왼쪽)",
				fr: "Surface Gauche"
			},
			don_r: {
				ja: "面(右)",
				en: "Right Surface",
				cn: "表面（右）",
				tw: "表面（右）",
				ko: "북 면 (오른쪽)",
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
				fr: "Réglage du type de manette"
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
				ja: "音符調整（レイテンシ）",
				en: "Latency",
				cn: "延迟校准",
				ko: "레이턴시",
				fr: "Latence"
			},
			value: {
				ja: "音: %s, 動画: %s",
				en: "Audio: %s, Video: %s",
				cn: "音频: %s, 视频: %s",
				ko: "오디오: %s, 비디오: %s",
				fr: "Audio: %s, Vidéo: %s"
			},
			calibration: {
				ja: "音符調整",
				en: "Latency Calibration",
				cn: "自动辅助校准",
				ko: "레이턴시 조절",
				fr: "Calibrage de la Latence"
			},
			audio: {
				ja: "音",
				en: "Audio",
				cn: "音频",
				ko: "오디오",
				fr: "Audio"
			},
			video: {
				ja: "動画",
				en: "Video",
				cn: "视频",
				ko: "비디오",
				fr: "Vidéo"
			},
			drumSounds: {
				ja: "太鼓の音",
				en: "Drum Sounds",
				cn: "鼓声",
				ko: "북 소리",
				fr: "Sons du Tambour"
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
				cn: "显示歌词",
				ko: "가사 표시하기",
				fr: "Afficher les Paroles"
			}
		},
		on: {
			ja: "オン",
			en: "On",
			cn: "开",
			tw: "開",
			ko: "켜짐",
			fr: "Activé"
		},
		off: {
			ja: "オフ",
			en: "Off",
			cn: "关",
			tw: "關",
			ko: "꺼짐",
			fr: "Désactivé"
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
			ja: "音符調整",
			en: "Latency Calibration",
			fr: "Calibrage de la Latence"
		},
		ms: {
			ja: "%sms",
			en: "%sms",
			fr: "%sms"
		},
		back: {
			ja: "設定に戻る",
			en: "Back to Settings",
			fr: "Retour aux Paramètres"
		},
		retryPrevious: {
			ja: "前の再試行",
			en: "Retry Previous",
			fr: "Réessayer le Précédent"
		},
		start: {
			ja: "始める",
			en: "Start",
			fr: "Commencer"
		},
		finish: {
			ja: "終わる",
			en: "Finish",
			fr: "Terminer",
		},
		audioHelp: {
			title: {
				ja: "音の調整をする",
				en: "Audio Latency Calibration",
				fr: "Calibrage de la Latence Audio",
			},
			content: {
				ja: "流れる音楽を聞いてください。\n\n流れる音楽を聴きながら、太鼓の表面 (%s か %s) を叩いてください!",
				en: "Listen to a sound playing in the background.\n\nHit the surface of the drum (%s or %s) as you hear it!",
				fr: "Ecoutez la musique qui se joue en fond.\n\nFrappez la surface du tambour (%s ou %s) en rythme!"
			},
			contentAlt: {
				ja: "流れる音楽を聞いてください。\n\n流れる音楽を聴きながら、太鼓の表面を叩いてください!",
				en: "Listen to a sound playing in the background.\n\nHit the surface of the drum as you hear it!",
				fr: "Ecoutez la musique qui se joue en fond.\n\nFrappez la surface du tambour en rythme!"
			}
		},
		audioComplete: {
			ja: "音の調整完了！",
			en: "Audio Latency Calibration completed!",
			fr: "Calibrage de la Latence Audio terminée!"
		},
		videoHelp: {
			title: {
				ja: "動画の調整をする",
				en: "Video Latency Calibration",
				fr: "Calibrage de la Latence Vidéo"
			},
			content: {
				ja: "今回は音は流れません。\n\nその代わりに、丸い形のところに音符を表示したら、太鼓を叩いてください！",
				en: "This time there will be no sounds.\n\nInstead, watch for notes blinking on the circle-shaped frame, hit the drum as they appear!",
				fr: "Cette fois-ci il n'y aura pas de son.\n\nA la place, regardez les notes sur le cadre et frappez le tambour quand elles apparaissent!"
			}
		},
		videoComplete: {
			ja: "動画の調整完了！",
			en: "Video Latency Calibration completed!",
			fr: "Calibrage de la Latence Vidéo terminée!"
		},
		results: {
			title: {
				ja: "音符調整の結果",
				en: "Latency Calibration Results",
				fr: "Résultats de la Calibration de la Latence"
			},
			content: {
				ja: "音の調整: %s\n動画の調整: %ms\n\nまた、設定でこの調整を変えることができます。",
				en: "Audio latency: %s\nVideo latency: %s\n\nYou can configure these latency values in the settings.",
				fr: "Latence Audio: %s\nLatence Vidéo: %s\n\nVous pouvez configurer ces latences dans les paramètres."
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
		privacy: {
			ja: "プライバシー",
			en: "Privacy",
			cn: "隐私权",
			tw: "隱私權",
			ko: "개인정보처리방침",
			fr: "Confidentialité"
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
			fr: "Les Mots de Passe ne correspondent pas"
		},
		newPasswordsDoNotMatch: {
			ja: "新しいパスワードが一致しません",
			en: "New passwords do not match",
			fr: "Les nouveaux Mots de Passe ne correspondent pas",		},
		cannotBeEmpty: {
			ja: "%sは空にできません",
			en: "%s cannot be empty",
			cn: "%s不能为空",
			tw: "%s不能為空",
			ko: "%s는 비어 있을 수 없습니다",
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
			ko: "로그아웃",
			fr: "Se Déconnecter"
		},
		back: {
			ja: "もどる",
			en: "Back",
			cn: "返回",
			tw: "返回",
			ko: "돌아가기",
			fr: "Retour"
		},
		cancel: {
			ja: "キャンセル",
			en: "Cancel",
			fr: "Annuler"
		},
		save: {
			ja: "保存",
			en: "Save",
			fr: "Sauvegarder"
		},
		displayName: {
			ja: "表示される名前",
			en: "Displayed Name",
			fr: "Nom Affiché"
		},
		customdon: {
			bodyFill: {
				ja: "本体",
				en: "Body",
				fr: "Corps"
			},
			faceFill: {
				ja: "顔",
				en: "Face",
				fr: "Visage"
			},
			reset: {
				ja: "リセット",
				en: "Reset",
				fr: "Réinitialiser"
			}
		},
		changePassword: {
			ja: "パスワードを変更",
			en: "Change Password",
			fr: "Changer le Mot de Passe"
		},
		currentNewRepeat: {
			ja: [
				"現在のパスワード",
				"新しいパスワード",
				"パスワードの再入力"
			],
			en: [
				"Current Password",
				"New Password",
				"Repeat New Password"
			],
			fr: [
				"Mot de Passe Actuel",
				"Nouveau Mot de Passe",
				"Réécrivez le Nouveau Mot de Passe"
			]
		},
		deleteAccount: {
			ja: "アカウントを削除",
			en: "Delete Account",
			fr: "Supprimer le Compte"
		},
		verifyPassword: {
			ja: "パスワードを確認して、アカウントを削除する",
			en: "Verify password to delete this account",
			fr: "Vérifiez le Mot de Passe pour supprimer ce compte"
		}
	},
	serverError: {
		not_logged_in: {
			ja: "ログインしていません",
			en: "Not logged in",
			fr: "Non connecté"
		},
		invalid_username: {
			ja: "このユーザー名は使用できません。ユーザー名の長さは３から２０文字以内に含まれて、文字、数字とアンダースコアしか使えません",
			en: "Invalid username, a username can only contain letters, numbers, and underscores, and must be between 3 and 20 characters long",
			fr: "Nom d'Utilisateur invalide, un nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores, et doit comporter entre 3 et 20 caractères"
		},
		username_in_use: {
			ja: "このユーザー名は既に使われています",
			en: "A user already exists with that username",
			fr: "Un utilisateur existe déjà avec ce nom d'utilisateur"
		},
		invalid_password: {
			ja: "このパスワードは使用できません。パスワードの長さが６文字以上だと確認してください。",
			en: "Cannot use this password, please check that your password is at least 6 characters long",
			fr: "Impossible d'utiliser ce Mot de Passe, vérifiez qu'il fait au moins 6 caractères"
		},
		invalid_username_password: {
			ja: "ユーザー名かパスワードを間違えています",
			en: "Invalid Username or Password",
			fr: "Nom d'Utilisateur ou Mot de Passe Invalide"
		},
		invalid_display_name: {
			ja: "この名前は使用できません。長さが２５文字以内だってことを確認してください",
			en: "Cannot use this name, please check that your new name is at most 25 characters long",
			fr: "Impossible d'utiliser ce nom, vérifiez qu'il ne fait pas plus de 25 caractères"
		},
		invalid_don: {
			ja: "カスタムどんちゃんを保存できませんでした",
			en: "Could not save your custom Don",
			fr: "Echec de la sauvegarde de votre Don"
		},
		current_password_invalid: {
			ja: "現在のパスワードが一致しません",
			en: "Current password does not match",
			fr: "Le Mot de Passe actuel ne correspond pas"
		},
		invalid_new_password: {
			ja: "このパスワードは使用できません。パスワードの長さが６文字以上だと確認してください。",
			en: "Cannot use this password, please check that your new password is at least 6 characters long",
			fr: "Impossible d'utiliser ce Mot de Passe, vérifiez qu'il fait au moins 6 caractères"
		},
		verify_password_invalid: {
			ja: "確認のパスワードが一致しません",
			en: "Verification password does not match",
			fr: "Le Mot de Passe de vérification ne correspond pas"
		},
		invalid_csrf: {
			ja: "セキュリティトークン（字句）の期限が切れました。このページを更新してください。",
			en: "Security token expired. Please refresh the page.",
			fr: "Le Jeton de Sécurité a expiré. Merci de rafraîchir la page."
		}
	},
	browserSupport: {
		browserWarning: {
			ja: "お使いのブラウザでは遊べません (%s)",
			en: "You are running an unsupported browser (%s)",
			fr: "Vous utilisez un navigateur non supporté (%s)"
		},
		details: {
			ja: "詳しく",
			en: "Details...",
			fr: "Détails..."
		},
		failedTests: {
			ja: "このテストが失敗しました：",
			en: "The following tests have failed:",
			fr: "Les tests suivants ont échoués:"
		},
		supportedBrowser: {
			ja: "%sなどのサポートされているブラウザを使用してください",
			en: "Please use a supported browser such as %s",
			fr: "Merci d'utiliser un navigateur supporté comme %s"
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
			ja: "制作者",
			en: "Maker:",
			cn: "制作者",
			tw: "製作者",
			ko: "제작자:",
			fr: "Créateur:"
		}
	},
	withLyrics: {
		ja: "歌詞あり",
		en: "With lyrics",
		cn: "带歌词",
		tw: "帶歌詞",
		ko: "가사 포함됨",
		fr: "Avec les Paroles"
	},
	customSongs: {
		title: {
			ja: "カスタム曲集",
			en: "Custom Song List",
			cn: "自定义歌曲列表",
			tw: "自定義歌曲列表",
			ko: "커스텀 노래 목록",
			fr: "Liste des chansons personnalisées"
		},
		default: {
			ja: "デフォルト曲集",
			en: "Default Song List",
			cn: "默认歌曲列表",
			tw: "默認歌曲列表",
			ko: "기본 노래 목록",
			fr: "Liste des chansons par défaut"
		},
		description: {
			ja: [
				"TJA拡張子の太鼓チャートファイルの入っているフォルダーを選択して、カスタムな曲で遊ぼう!"
			],
			en: [
				"Pick a folder with Taiko chart files in TJA format to play on a custom song list!"
			],
			cn: [
				"请选择一个含有太鼓谱面文件（TJA格式）的文件夹，以用于在自定义歌单中游玩。"
			],
			fr: [
				"Sélectionnez un dossier avec des fichiers chart Taiko dans le format TJA pour jouer avec des chansons personnalisées!"
			],
		},
		localFolder: {
			ja: "ローカルフォルダ...",
			en: "Local Folder...",
			cn: "本地文件夹...",
			tw: "本地文件夾...",
			ko: "로컬 폴더...",
			fr: "Dossier local"
		},
		gdriveFolder: {
			ja: "Google ドライブ...",
			en: "Google Drive...",
			cn: "Google云端硬盘...",
			tw: "Google雲端硬碟...",
			ko: "구글 드라이브...",
			fr: "Google Drive..."
		},
		gdriveAccount: {
			ja: "アカウントの切り替え",
			en: "Switch Accounts",
			cn: "切换帐户",
			tw: "切換帳戶",
			ko: "계정 전환",
			fr: "Changer de compte"
		},
		dropzone: {
			ja: "ここにファイルをドロップ",
			en: "Drop files here",
			cn: "将文件拖至此处",
			tw: "將文件拖至此處",
			ko: "파일을 여기에 드롭하세요",
			fr: "Déposez les fichiers ici"
		},
		importError: {
			ja: "インポートエラー",
			en: "Import Error",
			fr: "Erreur d'import"
		},
		noSongs: {
			ja: "選択されたフォルダに太鼓チャートファイルが見つかりませんでした。",
			en: "No Taiko chart files have been found in the provided folder.",
			fr: "Aucun fichier Taiko Chart trouvé dans le dossier sélectionné."
		}
	},
	gpicker: {
		locale: {
			ja: "ja",
			en: "en-GB",
			cn: "zh-CN",
			tw: "zh-TW",
			ko: "ko",
			fr: "fr-FR",
		},
		myDrive: {
			ja: "マイドライブ",
			en: "My Drive",
			cn: "我的云端硬盘",
			tw: "我的雲端硬碟",
			ko: "내 드라이브",
			fr: "Mon drive",
		},
		starred: {
			ja: "スター付き",
			en: "Starred",
			cn: "已加星标",
			tw: "已加星號",
			ko: "중요 문서함",
			fr: "Suivis"
		},
		sharedWithMe: {
			ja: "共有アイテム",
			en: "Shared with me",
			cn: "与我共享",
			tw: "與我共用",
			ko: "공유 문서함",
			fr: "Partagés avec moi"
		},
		authError: {
			ja: "認証エラー: %s",
			en: "Auth error: %s",
			fr: "Erreur d'authentification: %s"
		},
		cookieError: {
			ja: "この機能にはサードパーティのCookieが必要です。",
			en: "This function requires third party cookies.",
			fr: "Cette fonction nécessite des cookies tiers."
		}
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
