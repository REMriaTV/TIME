// ==========================================
//  CONFIG: 任務データ（スケジュール）の設定
// ==========================================
// ★改善：1日に複数の予定がある場合は ["予定1", "予定2"] のように書けます
const missionData = {
    "2025-12-19": "「生物多様性」会議@京都",
    "2025-12-22": "「生物多様性」1月リサーチ@京都",
    "2026-01-12": "中平のお父さん/18:00-19:00＠熊野",
    "2026-01-13": "YBS中学校_理論＋ティーワーク/13:00-14:30@三重",
    "2026-01-30": "屋久島と地球の未来会議２０２６＠三重",
    "2026-01-31": "屋久島と地球の未来会議２０２６＠三重",
    "2026-02-01": "屋久島と地球の未来会議２０２６＠三重",
    "2026-02-01": "交流会/DAY-1@奈良",
    "2026-02-02": "交流会/DAY-2@奈良",
    "2026-02-05": "島根IN（フライト）",
    "2026-02-06": "会議＠島根/10:00-16:00",
    "2026-02-10": "会議/13:00-15:00@愛知教育大"
    
    
};

// ==========================================
//  SYSTEM: 動作ロジック
// ==========================================
const date = new Date();
const daysContainer = document.getElementById("daysContainer");
const monthYear = document.getElementById("monthYear");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const clockElement = document.getElementById("clock");
const logList = document.getElementById("logList");

// ポップアップ用の要素
const modalOverlay = document.getElementById("modalOverlay");
const modalDate = document.getElementById("modalDate");
const modalTaskList = document.getElementById("modalTaskList");
const closeModalBtn = document.getElementById("closeModalBtn");

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

    // 前月
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="empty">${prevLastDay - x + 1}</div>`;
    }

    // 当月
    for (let i = 1; i <= lastDay; i++) {
        const isToday = i === new Date().getDate() && 
                        month === new Date().getMonth() && 
                        year === new Date().getFullYear();
        
        // キー作成
        const checkMonth = String(month + 1).padStart(2, '0');
        const checkDay = String(i).padStart(2, '0');
        const dateKey = `${year}-${checkMonth}-${checkDay}`;
        
        // 予定チェック
        const rawData = missionData[dateKey];
        const hasEventClass = rawData ? "has-event" : "";
        
        // データ属性にはキー(日付)を持たせておく
        let dayClass = "";
        if (isToday) dayClass += "today ";
        if (hasEventClass) dayClass += hasEventClass;

        days += `<div class="${dayClass}" data-date="${dateKey}">${i}</div>`;
    }

    // 翌月
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="empty">0${j}</div>`;
    }

    daysContainer.innerHTML = days;
    
    // ▼ クリックイベント：ポップアップを開く
    document.querySelectorAll('.days div:not(.empty)').forEach(day => {
        day.addEventListener('click', (e) => {
            const targetDate = e.target.getAttribute('data-date');
            openModal(targetDate);
        });
    });
}

// ポップアップを開く処理
function openModal(dateKey) {
    // 日付表示
    modalDate.innerText = `TARGET_DATE: ${dateKey}`;
    
    // 予定リスト生成
    modalTaskList.innerHTML = "";
    const tasks = missionData[dateKey];

    if (tasks) {
        // 配列ならループ、文字列なら単発で処理
        const taskArray = Array.isArray(tasks) ? tasks : [tasks];
        
        taskArray.forEach(task => {
            const li = document.createElement("li");
            li.textContent = task;
            modalTaskList.appendChild(li);
        });
    } else {
        // 予定がない場合
        const li = document.createElement("li");
        li.textContent = "NO_DATA_FOUND";
        li.style.color = "#666";
        modalTaskList.appendChild(li);
    }

    // 表示
    modalOverlay.classList.add("active");
}

// ポップアップを閉じる処理
function closeModal() {
    modalOverlay.classList.remove("active");
}

// 閉じるボタン＆背景クリックで閉じる
closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
});

// 時計更新
function updateClock() {
    const now = new Date();
    clockElement.innerText = now.toLocaleTimeString('en-US', { hour12: false });
}

// フェイクログ（演出用）
const fakeLogs = [
    "Scanning ports...", "Encrypted packet received.", "Updating cache...",
    "Ping: 14ms", "Traceback complete.", "User authentication: VERIFIED",
    "Memory usage: 42%", "Render complete.", "Monitoring system..."
];

function addLog() {
    const li = document.createElement("li");
    const randomLog = fakeLogs[Math.floor(Math.random() * fakeLogs.length)];
    const time = new Date().toLocaleTimeString().split(' ')[0];
    li.innerHTML = `[${time}] > ${randomLog}`;
    logList.prepend(li);
    if (logList.children.length > 10) logList.removeChild(logList.lastChild);
}

// ボタン
prevBtn.addEventListener("click", () => { date.setMonth(date.getMonth() - 1); renderCalendar(); });
nextBtn.addEventListener("click", () => { date.setMonth(date.getMonth() + 1); renderCalendar(); });

// 実行
renderCalendar();
setInterval(updateClock, 1000);
setInterval(addLog, 2500);
