// ==========================================
//  CONFIG: 任務データ（スケジュール）の設定
// ==========================================
const missionData = {
    "2025-12-14": ["SEExHARUイベント@慶應三田/7:00-19:00", "移動＠三田→京都／19:00-22:00"],
    "2025-12-15": "KUNIふりかえり@京都未来庵/9:00-12:00",
    "2025-12-16": ["奈良研修MTG@online/9:30-10:30", "東京都ふりかえり@online/13:00~14:00"],
    "2025-12-17": "英賀保@不明/9:00-11:00",
    "2025-12-19": "「生物多様性」会議@京都",
    "2025-12-22": ["「生物多様性」1月リサーチ@京都/10:00-13:00", "アプリ開発mtg@online/15:00-16:00"],
    "2025-12-25": ["GHmtg@online/13:00-14:00", "H&Eクリスマス会@東京／18:00~"],
    "2025-12-27": "ダイちゃん夫妻+Sacchan@自宅/12:00~14:00",
    "2026-01-12": "中平のお父さん/18:00-19:00＠熊野",
    "2026-01-13": "YBS中学校_理論＋ティーワーク/13:00-14:30@三重",
    "2026-01-15": "YBS中学校_ワーク/13:00-15:00@三重",
    "2026-01-19": "ひのたまリサーチラボ？@現地／9:00-14:00", 
    "2026-01-24": "「生物多様性」候補日@京都SOAN／10:00-18:00",
    "2026-01-25": "「生物多様性」候補日@京都SOAN／13:00-18:00",
    "2026-01-26": "おおた夢会議@online/10:00-12:00",
    "2026-01-29": "「未来力会議」＠京都／10:00-12:00",
    "2026-01-30": "屋久島と地球の未来会議２０２６＠屋久島",
    "2026-01-31": "屋久島と地球の未来会議２０２６＠屋久島",
    "2026-02-01": "屋久島と地球の未来会議２０２６＠屋久島",
    "2026-02-03": "交流会/DAY-1@奈良",
    "2026-02-04": "交流会/DAY-2@奈良",
    "2026-02-05": "島根IN（フライト）",
    "2026-02-06": "会議＠島根/10:00-16:00",
    "2026-02-10": "会議/13:00-15:00@愛知教育大",
    "2026-02-13": "「ひのたまインパクトデー」@ヴィータホール／18:30-20:30",
    "2026-02-15": "「ULTLAプログラム」プログラム本番@三重／"
};

// ==========================================
//  CONFIG: アニメーション速度設定
// ==========================================
// ★ここを変えるとJS側の待ち時間が変わります（単位：ミリ秒）
// ※CSSの style.css の animation: ... 0.3s; も同じ秒数に合わせてください（300 = 0.3s）ここを 300 から 150 にすれば2倍速になり、600 にすればスローになります。 （今回は少し早めた速度 200 に設定しています）。
const SLIDE_SPEED = 200; 

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

const modalOverlay = document.getElementById("modalOverlay");
const modalWindow = document.querySelector(".modal-window");
const modalDate = document.getElementById("modalDate");
const modalTaskList = document.getElementById("modalTaskList");
const closeModalBtn = document.getElementById("closeModalBtn");
const prevDayBtn = document.getElementById("prevDayBtn");
const nextDayBtn = document.getElementById("nextDayBtn");

let currentModalDateStr = "";
let isAnimating = false;

function formatDateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

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
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="empty">${prevLastDay - x + 1}</div>`;
    }
    for (let i = 1; i <= lastDay; i++) {
        const isToday = i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
        const checkMonth = String(month + 1).padStart(2, '0');
        const checkDay = String(i).padStart(2, '0');
        const dateKey = `${year}-${checkMonth}-${checkDay}`;
        const rawData = missionData[dateKey];
        const hasEventClass = rawData ? "has-event" : "";
        let dayClass = "";
        if (isToday) dayClass += "today ";
        if (hasEventClass) dayClass += hasEventClass;
        days += `<div class="${dayClass}" data-date="${dateKey}">${i}</div>`;
    }
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="empty">0${j}</div>`;
    }
    daysContainer.innerHTML = days;
    
    document.querySelectorAll('.days div:not(.empty)').forEach(day => {
        day.addEventListener('click', (e) => {
            const targetDate = e.target.getAttribute('data-date');
            openModal(targetDate);
        });
    });
}

function openModal(dateKey) {
    currentModalDateStr = dateKey;
    updateModalContent(dateKey);
    modalOverlay.classList.add("active");
    modalWindow.classList.remove("slide-out-left", "slide-in-right", "slide-out-right", "slide-in-left");
    modalWindow.classList.add("pop-in");
    setTimeout(() => modalWindow.classList.remove("pop-in"), SLIDE_SPEED);
}

function updateModalContent(dateKey) {
    modalDate.innerText = `TARGET_DATE: ${dateKey}`;
    modalTaskList.innerHTML = "";
    const tasks = missionData[dateKey];

    if (tasks) {
        const taskArray = Array.isArray(tasks) ? tasks : [tasks];
        taskArray.forEach(task => {
            const li = document.createElement("li");
            li.textContent = task;
            modalTaskList.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "NO_DATA_FOUND";
        li.style.color = "#666";
        modalTaskList.appendChild(li);
    }
}

// ★横スライド変更処理
function changeModalDate(offset) {
    if (isAnimating) return;
    isAnimating = true;

    const outClass = offset > 0 ? 'slide-out-left' : 'slide-out-right';
    const inClass = offset > 0 ? 'slide-in-right' : 'slide-in-left';

    // 1. スライドアウト開始
    modalWindow.classList.add(outClass);

    // 2. アニメーション完了直前(少し早め)にデータを切り替える
    // SLIDE_SPEEDから20ms引いたタイミングで切り替え（チラつき防止）
    setTimeout(() => {
        const parts = currentModalDateStr.split('-');
        const currentDate = new Date(parts[0], parts[1] - 1, parts[2]);
        currentDate.setDate(currentDate.getDate() + offset);
        const newKey = formatDateKey(currentDate);
        currentModalDateStr = newKey;

        updateModalContent(newKey);

        modalWindow.classList.remove(outClass);
        modalWindow.classList.add(inClass);

        // 3. インアニメーション完了後にクラスを削除
        setTimeout(() => {
            modalWindow.classList.remove(inClass);
            isAnimating = false;
        }, SLIDE_SPEED);

    }, SLIDE_SPEED - 20); 
}

prevDayBtn.addEventListener("click", () => changeModalDate(-1));
nextDayBtn.addEventListener("click", () => changeModalDate(1));
closeModalBtn.addEventListener("click", () => modalOverlay.classList.remove("active"));
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove("active");
});

// スワイプ処理
let touchStartX = 0;
let touchEndX = 0;
modalOverlay.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
modalOverlay.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, {passive: true});

function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) changeModalDate(1);
    if (touchEndX > touchStartX + threshold) changeModalDate(-1);
}

function updateClock() {
    const now = new Date();
    clockElement.innerText = now.toLocaleTimeString('en-US', { hour12: false });
}
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
prevBtn.addEventListener("click", () => { date.setMonth(date.getMonth() - 1); renderCalendar(); });
nextBtn.addEventListener("click", () => { date.setMonth(date.getMonth() + 1); renderCalendar(); });

renderCalendar();
setInterval(updateClock, 1000);
setInterval(addLog, 2500);
