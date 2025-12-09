// ==========================================
//  CONFIG: 任務データ（スケジュール）の設定
// ==========================================
// 形式: "YYYY-MM-DD": "表示させたい文字"
const missionData = {
    "2025-12-12": "DEADLINE: PROJECT_ALPHA", // 締め切り
    "2025-12-24": "PROTOCOL: HOLY_NIGHT",    // クリスマスイブ
    "2025-12-25": "GIFT_DISTRIBUTION",       // クリスマス
    "2025-12-31": "SYSTEM_SHUTDOWN // END",  // 大晦日
    "2026-01-01": "BOOT_SEQUENCE: 2026",     // 元旦
    "2026-01-07": "SERVER_MAINTENANCE",      // メンテ
};

// ==========================================
//  SYSTEM: 動作ロジック（ここから下は触らなくてOK）
// ==========================================
const date = new Date();
const daysContainer = document.getElementById("daysContainer");
const monthYear = document.getElementById("monthYear");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const clockElement = document.getElementById("clock");
const logList = document.getElementById("logList");

// カレンダー描画関数
function renderCalendar() {
    date.setDate(1);
    const month = date.getMonth();
    const year = date.getFullYear();

    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();
    const firstDayIndex = date.getDay();
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    const months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    monthYear.innerHTML = `${year} // <span style="color:var(--accent-color)">${months[month]}</span>`;

    let days = "";

    // 前月の日付（グレーアウト）
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="empty">${prevLastDay - x + 1}</div>`;
    }

    // 当月の日付（ここがメイン）
    for (let i = 1; i <= lastDay; i++) {
        // 今日の判定
        const isToday = i === new Date().getDate() && 
                        month === new Date().getMonth() && 
                        year === new Date().getFullYear();
        
        // 予定の判定用キー作成 (例: "2025-12-05")
        const checkMonth = String(month + 1).padStart(2, '0');
        const checkDay = String(i).padStart(2, '0');
        const dateKey = `${year}-${checkMonth}-${checkDay}`;
        
        // 予定があるかチェック
        const eventText = missionData[dateKey];
        const hasEventClass = eventText ? "has-event" : "";
        const eventAttr = eventText ? eventText : "";

        // HTML生成
        let dayClass = "";
        if (isToday) dayClass += "today ";
        if (hasEventClass) dayClass += hasEventClass;

        days += `<div class="${dayClass}" data-event="${eventAttr}">${i}</div>`;
    }

    // 翌月の日付
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="empty">0${j}</div>`;
    }

    daysContainer.innerHTML = days;
    
    // クリックイベントの登録（予定がある日をクリックするとログが出る）
    document.querySelectorAll('.days div:not(.empty)').forEach(day => {
        day.addEventListener('click', (e) => {
            const eventText = e.target.getAttribute('data-event');
            if (eventText) {
                // 予定があればログに特別なメッセージを表示
                addCustomLog(`ACCESSING DATA... [TARGET]: ${eventText}`, true);
            }
        });
    });
}

// 時計の更新
function updateClock() {
    const now = new Date();
    clockElement.innerText = now.toLocaleTimeString('en-US', { hour12: false });
}

// フェイクのシステムログ
const fakeLogs = [
    "Scanning ports...",
    "Encrypted packet received.",
    "Updating cache...",
    "Ping: 14ms",
    "Traceback complete.",
    "User authentication: VERIFIED",
    "Memory usage: 42%",
    "Downloading aesthetic_patch.exe...",
    "Render complete.",
    "Checking integrity..."
];

// ログを追加する関数
function addLog() {
    const randomLog = fakeLogs[Math.floor(Math.random() * fakeLogs.length)];
    addCustomLog(randomLog, false);
}

// ログ表示の共通処理
function addCustomLog(message, isImportant) {
    const li = document.createElement("li");
    const time = new Date().toLocaleTimeString().split(' ')[0];
    
    li.innerHTML = `[${time}] > ${message}`;
    
    if (isImportant) {
        li.style.color = "var(--accent-color)"; // 重要なログは紫にする
        li.style.textShadow = "0 0 5px var(--accent-color)";
    }

    logList.prepend(li);
    
    if (logList.children.length > 10) {
        logList.removeChild(logList.lastChild);
    }
}

// ボタン操作
prevBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

// 初期化実行
renderCalendar();
setInterval(updateClock, 1000);
setInterval(addLog, 2500);
