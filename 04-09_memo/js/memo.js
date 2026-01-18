"use strict";

// ページが読み込まれたタイミングで実行される
document.addEventListener("DOMContentLoaded", function () {

  // 1. localStorageが使えるか確認
  if (typeof localStorage === "undefined") {
    Swal.fire({
      title: "Memo app",
      html: "このブラウザはLocal Storage機能が実装されていません",
      type: "error",
      allowOutsideClick: false
    });
    return;
  }

  // 初期表示
  viewStorage();

  // イベント登録
  saveLocalStorage();
  selectTable();
  delLocalStorage();
  allClearLocalStorage();

}, false);


// 2. localStorageへの保存（ほぞん）
function saveLocalStorage() {

  const save = document.getElementById("save");

  save.addEventListener("click", function (e) {
    e.preventDefault();

    const key = document.getElementById("textKey").value;
    const value = document.getElementById("textMemo").value;

    // 値の入力チェック
    if (key === "" || value === "") {
      Swal.fire({
        title: "Memo app",
        html: "Key、Memoはいずれも必須です。",
        type: "error",
        allowOutsideClick: false
      });
      return;
    }

    // 確認（かくにん）
    let w_msg = "LocalStorageに\n「" + key + "： " + value + "」\nを保存（save）しますか？";

    Swal.fire({
      title: "Memo app",
      html: w_msg,
      type: "question",
      showCancelButton: true
    }).then(function (result) {

      // OK のとき保存
      if (result.value === true) {
        localStorage.setItem(key, value);
        viewStorage();

        let done = "LocalStorageに「" + key + "： " + value + "」を保存（ほぞん）しました。";
        Swal.fire({
          title: "Memo app",
          html: done,
          type: "success",
          allowOutsideClick: false
        });

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    });

  }, false);
}


// 3. localStorageから選択されている行を削除（さくじょ）※複数削除
function delLocalStorage() {

  const del = document.getElementById("del");

  del.addEventListener("click", function (e) {
    e.preventDefault();

    const chkbox1 = document.getElementsByName("chkbox1");
    const table1 = document.getElementById("table1");

    // 選択されている件数を取得
    let w_cnt = 0;
    w_cnt = selectCheckBox("del");

    // 1件以上選択されている場合
    if (w_cnt >= 1) {

      let w_msg = "LocalStorageから選択されている" + w_cnt + "件を削除（delete）しますか？";

      Swal.fire({
        title: "Memo app",
        html: w_msg,
        type: "question",
        showCancelButton: true
      }).then(function (result) {

        // OK のとき削除
        if (result.value === true) {

          for (let i = 0; i < chkbox1.length; i++) {
            if (chkbox1[i].checked === true) {
              // キー列(cell[1])の値で削除
              localStorage.removeItem(table1.rows[i + 1].cells[1].firstChild.data);
            }
          }

          viewStorage();

          let done = "LocalStorageから" + w_cnt + "件を削除（delete）しました。";
          Swal.fire({
            title: "Memo app",
            html: done,
            type: "success",
            allowOutsideClick: false
          });

          document.getElementById("textKey").value = "";
          document.getElementById("textMemo").value = "";
        }
      });
    }

  }, false);
}


// 4. localStorageからすべて削除（さくじょ）
function allClearLocalStorage() {

  const allClear = document.getElementById("allClear");

  allClear.addEventListener("click", function (e) {
    e.preventDefault();

    let w_msg = "LocalStorageのデータをすべて削除（all clear）します。\nよろしいですか？";

    Swal.fire({
      title: "Memo app",
      html: w_msg,
      type: "question",
      showCancelButton: true
    }).then(function (result) {

      if (result.value === true) {
        localStorage.clear();
        viewStorage();

        let done = "LocalStorageのデータをすべて削除（all clear）しました。";
        Swal.fire({
          title: "Memo app",
          html: done,
          type: "success",
          allowOutsideClick: false
        });

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    });

  }, false);
}


// localStorageからのデータ取得（しゅとく）とテーブル表示（ひょうじ）
function viewStorage() {

  const list = document.getElementById("list");

  // テーブル初期化
  while (list.rows[0]) {
    list.deleteRow(0);
  }

  // localStorage全件表示
  for (let i = 0; i < localStorage.length; i++) {

    let w_key = localStorage.key(i);

    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");

    list.appendChild(tr);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    // checkbox（version-up2以降）
    td1.innerHTML = '<input type="checkbox" name="chkbox1">';

    td2.innerHTML = w_key;
    td3.innerHTML = localStorage.getItem(w_key);
  }

  // tablesorter
  $("#table1").tablesorter({
    sortList: [[1, 0]]
  });

  $("#table1").trigger("update");
}


// 5.データ選択（せんたく）
function selectTable() {

  const select = document.getElementById("select");

  select.addEventListener("click", function (e) {
    e.preventDefault();
    selectCheckBox("select"); // version-up3：引数追加
  }, false);
}


// テーブルからデータ選択（せんたく） version-up3
function selectCheckBox(mode) {

  let w_cnt = 0; // 選択されているチェックボックスの数
  const chkbox1 = document.getElementsByName("chkbox1");
  const table1 = document.getElementById("table1");

  let w_textKey = "";
  let w_textMemo = "";

  for (let i = 0; i < chkbox1.length; i++) {
    if (chkbox1[i].checked === true) {

      // 最初にチェックされている行の値を取得
      if (w_cnt === 0) {
        w_textKey = table1.rows[i + 1].cells[1].firstChild.data;
        w_textMemo = table1.rows[i + 1].cells[2].firstChild.data;
      }

      w_cnt++;
    }
  }

  // 画面にセット（最初の選択行）
  document.getElementById("textKey").value = w_textKey;
  document.getElementById("textMemo").value = w_textMemo;

  // mode別判定
  if (mode === "select") {
    if (w_cnt === 1) {
      return w_cnt;
    } else {
      Swal.fire({
        title: "Memo app",
        html: "1つ選択（select）してください。",
        type: "error",
        allowOutsideClick: false
      });
      return w_cnt;
    }
  }

  if (mode === "del") {
    if (w_cnt >= 1) {
      return w_cnt;
    } else {
      Swal.fire({
        title: "Memo app",
        html: "1つ以上選択（select）してください。",
        type: "error",
        allowOutsideClick: false
      });
      return w_cnt;
    }
  }

  return w_cnt;
}
