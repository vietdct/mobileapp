'use strict';

// ワークエリア
var wkFirst = "1" //初回FLG
var wkTotal = 0;  //合計
var wkInput = ""; //現在クリックされたボタンの値
var wkCalc = "+"; //初期値 "+"
var wkBefore = "1"; //１つ前の入力 … 0:数値  1:演算子

// ページ上の要素（Element)を参照
// 【Ａ】自分で考える
const elementCalLog   = document.getElementById("calLog");
const elementResult   = document.getElementById("result");

const elementNum1 = document.getElementById("num1");
const elementNum2 = document.getElementById("num2");
const elementNum3 = document.getElementById("num3");
const elementNum4 = document.getElementById("num4");
const elementNum5 = document.getElementById("num5");
const elementNum6 = document.getElementById("num6");
const elementNum7 = document.getElementById("num7");
const elementNum8 = document.getElementById("num8");
const elementNum9 = document.getElementById("num9");
const elementNum0 = document.getElementById("num0");

const elementAdd    = document.getElementById("add");
const elementSub    = document.getElementById("sub");
const elementMult   = document.getElementById("mult");
const elementDiv    = document.getElementById("div");

const elementEqual  = document.getElementById("equal");
const elementCancel = document.getElementById("cancel");
// イベントを登録
// 【Ｂ】自分で考える
elementNum1.addEventListener("click", function(){edit(1)});
elementNum2.addEventListener("click", function(){edit(2)});
elementNum3.addEventListener("click", function(){edit(3)});
elementNum4.addEventListener("click", function(){edit(4)});
elementNum5.addEventListener("click", function(){edit(5)});
elementNum6.addEventListener("click", function(){edit(6)});
elementNum7.addEventListener("click", function(){edit(7)});
elementNum8.addEventListener("click", function(){edit(8)});
elementNum9.addEventListener("click", function(){edit(9)});
elementNum0.addEventListener("click", function(){edit(0)});

elementAdd.addEventListener("click", function(){update("+")});
elementSub.addEventListener("click", function(){update("-")});
elementMult.addEventListener("click", function(){update("*")});
elementDiv.addEventListener("click", function(){update("/")});

elementEqual.addEventListener("click", dspResult);
elementCancel.addEventListener("click",clear);


/** 数字がクリックされたときの処理 */
function edit(wkInput) {
  if (wkBefore === "0") {
    // 直前も数値 → 連結して数値化
    elementResult.innerHTML = Number(elementResult.innerHTML + wkInput);
  } else {
    // 直前が演算子 → 新しい数値の開始
    elementResult.innerHTML = wkInput;
  }
  wkFirst = "0"
  wkBefore = "0"  // 直前入力＝数値
}
function update(calcType) {
    if (wkBefore === "0") {
        elementCalLog.innerHTML = elementCalLog.innerHTML + Number(elementResult.innerHTML) + calcType;
        calculator(); // 計算処理呼び出し
    } else {
        if (wkFirst === "1") {
            elementCalLog.innerHTML = "0" + calcType;
        } else {
            let wkLogLastWord = elementCalLog.innerHTML.slice(-1);
            if (["+", "-", "*", "/"].includes(wkLogLastWord)) {
                elementCalLog.innerHTML = elementCalLog.innerHTML.slice(0, -1) + calcType;
            } else {
                elementCalLog.innerHTML = elementCalLog.innerHTML + calcType;
            }
        }
    }
    wkCalc = calcType;
    wkBefore = "1";
}
/** =がクリックされたときの処理 */
// 【Ｄ】自分で考える
function dspResult() {
  if (wkFirst === "0" && wkBefore === "0") {
    elementCalLog.innerHTML = elementCalLog.innerHTML + Number(elementResult.innerHTML); // thêm toán hạng cuối vào log
    calculator();                                       // tính và hiển thị total
    // không xoá log nếu muốn thấy công thức
    wkCalc = " = " ;
    wkBefore= "1";
  }
}
/** 計算結果をクリアします。(clear Result) */
// 【Ｅ】自分で考える
/** 計算結果をクリアします (clear Result) */
function clear() {
    elementResult.innerHTML = 0;
    elementCalLog.innerHTML = "";
    wkFirst = "1";
    wkTotal = 0;
    wkCalc = "+";
    wkBefore = "1";
}
// 計算
// 【Ｆ】自分で考える
/** 計算処理 */
// 計算
function calculator() {
    switch (wkCalc) {
        case "+":
            wkTotal = Number(wkTotal) + Number(elementResult.innerHTML);
            break;
        case "-":
            wkTotal = Number(wkTotal) - Number(elementResult.innerHTML);
            break;
        case "*":
            wkTotal = Number(wkTotal) * Number(elementResult.innerHTML);
            break;
        case "/":
            wkTotal = Number(wkTotal) / Number(elementResult.innerHTML);
            break;
    }
    elementResult.innerHTML = wkTotal;
}
