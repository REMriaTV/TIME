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

    // 月の最終日と、前の月の最終日、開始曜日を取得
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();
    const firstDayIndex = date.getDay();
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    // 月名の表示 (英語表記でクールに)
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

    // 当月の日付
    for (let i = 1; i <= lastDay; i++) {
        if (
            i === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear()
        ) {
            days += `<div class="today">${i}</div>`;
        } else {
            days += `<div>${i}</div>`;
        }
    }

    // 翌月の日付（埋め合わせ）
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="empty">0${j}</div>`;
    }

    daysContainer.innerHTML = days;
}

// 時計の更新
function updateClock() {
    const now = new Date();
    clockElement.innerText = now.toLocaleTimeString('en-US', { hour12: false });
}

// フェイクのシステムログを生成する（ハッカー演出）
const fakeLogs = [
    "Scanning ports...",
    "Encrypted packet received.",
    "Updating cache...",
    "Ping: 14ms",
    "Traceback complete.",
    "User authentication: VERIFIED",
    "Memory usage: 42%",
    "Downloading aesthetic_patch.exe...",
    "Render complete."
];

function addLog() {
    const li = document.createElement("li");
    const randomLog = fakeLogs[Math.floor(Math.random() * fakeLogs.length)];
    const time = new Date().toLocaleTimeString().split(' ')[0];
    li.innerText = `[${time}] > ${randomLog}`;
    
    logList.prepend(li);
    
    // ログが増えすぎたら削除
    if (logList.children.length > 10) {
        logList.removeChild(logList.lastChild);
    }
}

// イベントリスナー
prevBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

// 初期化
renderCalendar();
setInterval(updateClock, 1000);
setInterval(addLog, 2500); // 2.5秒ごとに新しいログを表示
