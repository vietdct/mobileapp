"use strict";


const time = document.getElementById("time");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");

let startTime =0;       // Startボタンクリック時の時刻
let timeoutid = null;       // ID
let stopTime = 0;    // Stopまでの経過時間

// ====== Sounds ======
const snd = {
  start: new Audio('sound/start.mp3'),
  stop1: new Audio('sound/stop1.mp3'),
  stop2: new Audio('sound/stop2.mp3'),
  reset: new Audio('sound/reset.mp3'),
};
Object.values(snd).forEach(a => { a.preload = 'auto'; });

function play(audio) {
  try {
    audio.currentTime = 0;
    audio.play();
  } catch (_) { /* ignore */ }
}
// ボタンを"初期"状態とする
setButtonStateInitial()

////////////////////////
// Startボタンクリック
////////////////////////
start.addEventListener("click",
  function() {
    // ボタンをタイマー"動作中"状態とする
    setButtonStateRunning();
    startTime = Date.now();
    play(snd.start);                   // sound start
    countUp();
  },false
);

////////////////////////
// Stopボタンクリック
////////////////////////
stop.addEventListener("click",
  function() {
    // タイマーを"停止中"状態とする
    setButtonStateStopped();
    clearTimeout(timeoutid); //setTimeout()でセットしたタイマーを解除する際に使用
    stopTime = Date.now() - startTime;
       // Nếu dừng ở 10秒台 (giây = 10.xxx) thì thắng
    const elapsed = stopTime;                          // ms
    const sec = Math.floor((elapsed / 1000) % 60);     // 0..59
    if (sec === 10) {
      play(snd.stop2);
      document.body.classList.add('fireworks');   // đúng 10秒台
    } else {
      play(snd.stop1);   // còn lại
    }
    },false
);

////////////////////////
// Resetボタンクリック
////////////////////////
reset.addEventListener("click",
  function() {
    // ボタンを"初期"状態とする
    setButtonStateInitial()
    timer.textContent = "00:00.000";
    stopTime = 0;
    play(snd.reset);
    document.body.classList.remove('fireworks');

  }
);


function countUp() {
  const d = new Date(Date.now() - startTime + stopTime);
  /* padStart()で２桁固定表示とする */
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  /* 描画 */
  timer.textContent = `${m}:${s}.${ms}`;

  timeoutid = setTimeout(() => {
    //再帰呼び出し
    countUp();
  }, 10);
}

// 初期 または Reset後
function setButtonStateInitial() {
  start.classList.remove("js-inactive");
  stop.classList.add("js-inactive");
  reset.classList.add("js-inactive");
  start.classList.remove("js-unclickable");
  stop.classList.add("js-unclickable");
  reset.classList.add("js-unclickable");
}

// 状態:タイマー動作中
function setButtonStateRunning() {
  timer.classList.add("timer-fontColor_hidden"); //時間を見えなくする
  start.classList.add("js-inactive");   // 非活性
  stop.classList.remove("js-inactive");  // 活性
  reset.classList.add("js-inactive");   // 非活性
  start.classList.add("js-unclickable");
  stop.classList.remove("js-unclickable");
  reset.classList.add("js-unclickable");
}

// 状態:タイマー停止中
function setButtonStateStopped() {
  timer.classList.remove("timer-fontColor_hidden"); //時間を見えるようにする
  timer.classList.add("timer_appear"); //時間をゆっくり表示
  start.classList.add("js-inactive"); // 活性
  stop.classList.add("js-inactive");    // 非活性
  reset.classList.remove("js-inactive"); // 活性
  start.classList.add("js-unclickable");
  stop.classList.add("js-unclickable");
  reset.classList.remove("js-unclickable");
}