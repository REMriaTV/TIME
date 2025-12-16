// ==========================================
//  CONFIG: 任務データ（スケジュール）の設定
// ==========================================
// 【入力ルール】
// "イベント名 @ 場所 / 時間 // メモ"
// ★移動ルートなどを書くときはバッククォート(`)を使い、
//   時間の行を入れると自動でタイムライン表示になります。
//   例：
//   10:00 東京駅発
//   12:00 京都駅着

const missionData = {
    "2025-12-14": ["SEExHARUイベント@慶應三田/7:00-19:00", "移動＠三田→京都／19:00-22:00"],
    "2025-12-15": "KUNIふりかえり@京都未来庵/9:00-12:00 // 終了",
    "2025-12-16": ["奈良研修MTG@online/9:30-10:30 // 終了", "東京都ふりかえり@online/13:00~14:00"],
    "2025-12-17": `英賀保@兵庫県姫路市飾磨区山崎/9:00-11:00 // 
【移動ルート】
6:45 アゴーラ京都烏丸（タクシー）
7:00 京都駅（新幹線口）
7:20 京都駅（東海道新幹線　ひかり）
8:03 姫路駅
8:09 姫路駅発（山陽本線 岡山行）
8:13 英賀保駅
8:13 姫路駅発（山陽本線 岡山行）
8:18 英賀保駅
8:30 集合  
        `,
    
    "2025-12-19": "「生物多様性」会議@京都 // アレンジ度合いを探る",
    "2025-12-22": ["「生物多様性」1月リサーチ@京都/10:00-13:00", "アプリ開発mtg@online/15:00-16:00"],
    "2025-12-24": "ラムセス展@豊洲／9:00〜17:00 // チケット購入済",
    "2025-12-25": ["GHmtg@online/13:00-14:00", "H&Eクリスマス会@東京／18:00~ // "],
    
    // ▼ タイムライン表示の例
    "2025-12-27": `ダイちゃん夫妻+Sacchan@自宅/12:00~14:00 // 
【移動ルート】
09:00 東京駅発 (のぞみ21号)
11:15 京都駅着
11:30 地下鉄烏丸線 -> 国際会館駅
12:00 自宅到着`,
    
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
const modalFooter = document.querySelector(".modal-footer");

let currentModalDateStr = "";
let isAnimating = false;

function formatDateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// URLパラメータのチェック（リンク共有機能用）
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
        const targetDate = new Date(dateParam);
        if (!isNaN(targetDate.getTime())) {
            // カレンダーをその月まで移動させる
            date.setFullYear(targetDate.getFullYear());
            date.setMonth(targetDate.getMonth());
            renderCalendar(); // 再描画
            
            // ポップアップを開く
            openModal(dateParam);
        }
    }
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

// ★詳細展開機能（タイムライン＆リンク共有対応）
function updateModalContent(dateKey) {
    modalDate.innerText = `TARGET_DATE: ${dateKey}`;
    modalTaskList.innerHTML = "";
    
    // フッターにコピーボタンとリンク共有ボタンを追加
    modalFooter.innerHTML = `
        STATUS: DECRYPTED 
        <button id="copyBtn" class="copy-btn">[ COPY_TEXT ]</button>
        <button id="linkBtn" class="copy-btn" style="color:var(--main-color); border-color:var(--main-color);">[ GET_LINK ]</button>
    `;
    
    const tasks = missionData[dateKey];
    let copyText = `【MISSION DATA: ${dateKey}】\n------------------------\n`;

    if (tasks) {
        const taskArray = Array.isArray(tasks) ? tasks : [tasks];
        
        taskArray.forEach(taskStr => {
            let title = taskStr;
            let location = "UNKNOWN";
            let time = "TBD";
            let note = "";
            let isOnline = false;

            if (taskStr.includes("//")) {
                const parts = taskStr.split("//");
                title = parts[0].trim();
                note = parts[1].trim();
            } else {
                title = taskStr;
            }

            if (title.includes("@") || title.includes("＠")) {
                const splitAt = title.includes("@") ? "@" : "＠";
                const parts = title.split(splitAt);
                title = parts[0];
                const remainder = parts[1];
                if (remainder.includes("/") || remainder.includes("／")) {
                    const splitSlash = remainder.includes("/") ? "/" : "／";
                    const subParts = remainder.split(splitSlash);
                    location = subParts[0];
                    time = subParts[1];
                } else {
                    location = remainder;
                }
            } else if (title.includes("/") || title.includes("／")) {
                const splitSlash = title.includes("/") ? "/" : "／";
                const parts = title.split(splitSlash);
                title = parts[0];
                time = parts[1];
            }

            const onlineKeywords = ["online", "zoom", "meet", "webex", "teams", "skype", "discord", "オンライン", "リモート"];
            if (onlineKeywords.some(keyword => location.toLowerCase().includes(keyword))) {
                isOnline = true;
            }

            copyText += `[${time}] ${title}\nLOC: ${location}\n`;
            if(note) copyText += `NOTE:\n${note}\n`;
            copyText += `------------------------\n`;

            const locLabel = isOnline ? "CONN" : "LOC";
            let buttonsHtml = "";
            if (!isOnline && location !== "UNKNOWN") {
                buttonsHtml += `
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}" target="_blank" class="action-btn">>> OPEN_MAP</a>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}" target="_blank" class="action-btn">>> CALC_ROUTE</a>
                `;
            }

            // ★メモ欄のタイムライン変換ロジック
            let noteHtml = "";
            if (note) {
                // 行ごとに分割
                const lines = note.split('\n');
                let timelineHtml = '<div class="route-timeline">';
                let normalNoteHtml = '';
                let hasTimeline = false;

                lines.forEach(line => {
                    // "HH:MM 内容" の形式にマッチするかチェック (例: 09:00 東京駅発)
                    const timeMatch = line.trim().match(/^(\d{1,2}:\d{2})\s+(.*)/);
                    if (timeMatch) {
                        hasTimeline = true;
                        timelineHtml += `
                            <div class="timeline-step">
                                <div class="timeline-time">${timeMatch[1]}</div>
                                <div class="timeline-content">${timeMatch[2]}</div>
                            </div>
                        `;
                    } else {
                        // 通常のメモ行
                        if (line.trim() !== "") {
                            normalNoteHtml += line + "<br>";
                        }
                    }
                });
                timelineHtml += '</div>';

                noteHtml = '<div class="task-note">';
                if (normalNoteHtml) noteHtml += `<div>${normalNoteHtml}</div>`;
                if (hasTimeline) noteHtml += timelineHtml;
                noteHtml += '</div>';
            }

            const li = document.createElement("li");
            li.className = "task-item";
            li.innerHTML = `
                <span class="task-title">${title}</span>
                <div class="task-details">
                    <div class="detail-grid">
                        <div class="detail-label">TIME</div>
                        <div class="detail-value">${time}</div>
                        <div class="detail-label">${locLabel}</div>
                        <div class="detail-value">${location}</div>
                        <div class="detail-label">STATUS</div>
                        <div class="detail-value" style="color:#0f0">CONFIRMED</div>
                    </div>
                    <div class="task-actions">
                        ${buttonsHtml}
                    </div>
                    ${noteHtml}
                </div>
            `;
            
            li.addEventListener("click", function(e) {
                if(e.target.classList.contains('action-btn')) return;
                this.classList.toggle("expanded");
            });

            modalTaskList.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "NO_DATA_FOUND";
        li.style.color = "#666";
        li.className = "task-item";
        modalTaskList.appendChild(li);
        copyText += "NO DATA\n";
    }

    // テキストコピーボタン
    document.getElementById("copyBtn").addEventListener("click", () => {
        navigator.clipboard.writeText(copyText).then(() => {
            const btn = document.getElementById("copyBtn");
            const originalText = btn.innerText;
            btn.innerText = "COPIED!";
            btn.style.color = "var(--active-color)";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.color = "";
            }, 2000);
        });
    });

    // ★リンク生成・コピーボタン
    document.getElementById("linkBtn").addEventListener("click", () => {
        // 現在のURL（クエリなし） + ?date=YYYY-MM-DD
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?date=${dateKey}`;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            const btn = document.getElementById("linkBtn");
            const originalText = btn.innerText;
            btn.innerText = "LINK_READY!";
            btn.style.color = "var(--active-color)";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.color = "var(--main-color)";
            }, 2000);
        });
    });
}

function changeModalDate(offset) {
    if (isAnimating) return;
    isAnimating = true;

    const outClass = offset > 0 ? 'slide-out-left' : 'slide-out-right';
    const inClass = offset > 0 ? 'slide-in-right' : 'slide-in-left';

    modalWindow.classList.add(outClass);

    setTimeout(() => {
        const parts = currentModalDateStr.split('-');
        const currentDate = new Date(parts[0], parts[1] - 1, parts[2]);
        currentDate.setDate(currentDate.getDate() + offset);
        const newKey = formatDateKey(currentDate);
        currentModalDateStr = newKey;

        updateModalContent(newKey);

        modalWindow.classList.remove(outClass);
        modalWindow.classList.add(inClass);

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

// 初期化時にURLパラメータをチェック
renderCalendar();
checkUrlParams(); // ★追加：リンクで開かれたかチェック
setInterval(updateClock, 1000);
setInterval(addLog, 2500);
