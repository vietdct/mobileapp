"use strict";

// ページが読み込まれたタイミングで実行される
document.addEventListener("DOMContentLoaded",
     function() {

  // 1. localStorageが使えるか確認
  if (typeof localStorage === "undefined") {
    window.alert("このブラウザはLocal Storage機能が実装されていません");
    return;
  } else {
    // 2. localStorageへの保存
    viewStorage();
    saveLocalStorage();
    selectTable();
    delLocalStorage();
    allClearLocalStorage();

  }



  // 保存処理の関数
  function saveLocalStorage() {

    // HTML上の id="save" 要素を取得
    const save = document.getElementById("save");

    // クリックイベントを登録
    save.addEventListener("click",
         function(e) {
            e.preventDefault(); // フォーム送信のデフォルト動作を止める

      // HTML上の id="textKey" と id="textMemo" を取得
      const key = document.getElementById("textKey").value;
      const value = document.getElementById("textMemo").value;

      // 入力チェック（どちらかが空ならエラー）
      if (key === "" || value === "") {
        window.alert("Key、Memoはいずれも必須です。");
        return;
      } else {
        let w_confirm = confirm("LocalStorageに\n「" + key + "： " + value + "」\nを保存（save）しますか？");
        if (w_confirm === true) {
        // localStorageへ保存
        localStorage.setItem(key, value);
        viewStorage();
        // 保存完了メッセージを表示
        let w_msg = "LocalStorageに " + key + " " + value + " を保存しました";
        window.alert(w_msg);

        // 入力欄をリセット
        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    }
    }, false);
  }
}, false);

// 3. localStorage から 1 件削除（さくじょ）
function delLocalStorage() {

  const del = document.getElementById("del");
  del.addEventListener("click", function (e) {
    e.preventDefault();

    const chkbox1 = document.getElementsByName("chkbox1"); // version-up3 add
    const table1  = document.getElementById("table1");    // version-up3 add

    let w_cnt = 0;
    w_cnt = selectCheckBox("del"); // version-up3 chg（引数: "del"）

    if (w_cnt >= 1) {

      let w_confirm = window.confirm(
        "LocalStorageから選択されている" + w_cnt + "件を削除（delete）しますか？"
      );

      if (w_confirm === true) {

        for (let i = 0; i < chkbox1.length; i++) {
          if (chkbox1[i].checked === true) {
            // キー列(cell[1])の値を削除
            localStorage.removeItem(table1.rows[i + 1].cells[1].firstChild.data);
          }
        }

        viewStorage();

        let w_msg = "LocalStorageから" + w_cnt + "件を削除（delete）しました。";
        window.alert(w_msg);

        document.getElementById("textKey").value  = "";
        document.getElementById("textMemo").value = "";
      }
    }

  }, false);
}

// 4.localStorage からすべて削除（さくじょ）
function allClearLocalStorage() {

    const allClear = document.getElementById("allClear");   // A
    allClear.addEventListener("click",                      // B
        function(e) {
            e.preventDefault();                             // C

            let w_confirm = confirm("LocalStorage のデータをすべて削除（all clear）します。\nよろしいですか？");
            if (w_confirm === true) {                       // D

                localStorage.clear();                       // E

                let w_msg = "LocalStorageのデータをすべて削除（all clear）しました。";
                window.alert(w_msg);

                document.getElementById("textKey").value = "";
                document.getElementById("textMemo").value = "";

                viewStorage();                              // F
            }
        }, false
    );
}


function viewStorage() {

  // id「list」の要素を取得
  const list = document.getElementById("list");

  // テーブル初期化
  while (list.rows[0]) {
    list.deleteRow(0);
  }

  // localStorage の全データを取得して表示
  for (let i = 0; i < localStorage.length; i++) {

    // i番目のキーを取得
    let w_key = localStorage.key(i);

    // tr, td を生成
    let tr  = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");

    // テーブルへ追加
    list.appendChild(tr);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    // checkbox をセット（version-up2）
    td1.innerHTML = '<input type="checkbox" name="chkbox1">';

    // キーとメモをセット
    td2.innerHTML = w_key;
    td3.innerHTML = localStorage.getItem(w_key);
  }

  // tablesorter でソート（キー列・昇順）
  $("#table1").tablesorter({
    sortList: [[1, 0]]
  });

  $("#table1").trigger("update");
}

// 5.データ選択（せんたく）
function selectTable() {

  const select = document.getElementById("select");

  select.addEventListener("click", 
    function(e) {
      e.preventDefault(); 

      selectCheckBox("select");
  }, false);
}


// テーブルからデータ選択（せんたく）
function selectRadioBtn() {

  let w_sel = "0";
  const radio1 = document.getElementsByName("radio1");
  const table1 = document.getElementById("table1");

  for (let i = 0; i < radio1.length; i++) {

    if (radio1[i].checked) {

      document.getElementById("textKey").value  = table1.rows[i + 1].cells[1].firstChild.data;
      document.getElementById("textMemo").value = table1.rows[i + 1].cells[2].firstChild.data;

      return w_sel = "1";
    }
  }

  if (w_sel === "0") {
    window.alert("1件選択（せんたく）してください。");
  }
}

function selectCheckBox(mode) { // version-up3 chg

  let w_cnt = 0; // 選択されているチェックボックスの数
  const chkbox1 = document.getElementsByName("chkbox1");
  const table1  = document.getElementById("table1");

  let w_textKey  = "";
  let w_textMemo = "";

  for (let i = 0; i < chkbox1.length; i++) {
    if (chkbox1[i].checked === true) {

      // 最初にチェックされている行の値を取得
      if (w_cnt === 0) {
        w_textKey  = table1.rows[i + 1].cells[1].firstChild.data;
        w_textMemo = table1.rows[i + 1].cells[2].firstChild.data;
      }

      w_cnt++;
    }
  }

  // 画面入力項目にセット（常に最初の選択行をセット）
  document.getElementById("textKey").value  = w_textKey;
  document.getElementById("textMemo").value = w_textMemo;

  // mode別の判定
  if (mode === "select") {
    if (w_cnt === 1) {
      return w_cnt; // version-up3 chg w_sel="1" => w_cnt
    } else {
      window.alert("1つ選択（select）してください。");
      return w_cnt;
    }
  }

  if (mode === "del") {
    if (w_cnt >= 1) {
      return w_cnt;
    } else {
      window.alert("1つ以上選択（select）してください。");
      return w_cnt;
    }
  }

  // 想定外mode
  return w_cnt;
}
