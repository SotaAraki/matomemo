// 戻るボタン処理
const backButton = document.getElementById("back");     // 戻るボタン

backButton.addEventListener("click", () => {
  // history.back();
  window.location.href = "title.html";    // 前の画面に戻るだとタグ選択とかに飛んじゃうのでタイトルに戻す
});

// Firebaseのdbインスタンスをインポート（firebase.jsから）
// Firestoreを扱うための関数もインポート
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// メモ作成ボタン
const makeButton = document.getElementById("make");

// ボタンがクリックされたときの処理を定義
makeButton.addEventListener("click", async () => {
  // 入力内容を取得
  const title = document.getElementById("title").value;             // タイトル入力欄の値
  const mainText = document.getElementById("main-text").value;      // 本文入力欄の値
  const summary = document.getElementById("summary").value;         // 要約入力欄の値
  // タグの値
  // const tags = document.getElementById("add-tag-zone").textContent;
  const tagElements = document.querySelectorAll("#add-tag-zone .tag");
  const tags = Array.from(tagElements).map(tagEl => tagEl.textContent);

  // 入力チェック
  // タイトルまたは本文が空の場合は保存せずに警告
  if (!title) {
    alert("タイトルは必須です。");
    return; // ここで処理を止める
  }

  // Firestoreに保存
  try {
    // memosに新しくメモを追加
    const docRef = await addDoc(collection(db, "memos"), {
      title: title,                // メモのタイトル
      text: mainText,              // メモ本文
      summary: summary,            // 要約
      tags: tags,                  // タグ
      createdAt: serverTimestamp() // 現在日時
    });

    // 保存成功時の処理
    alert("メモを保存しました！");
    console.log("保存されたドキュメントのID:", docRef.id);

    // フォームをリセット
    document.getElementById("title").value = "";
    document.getElementById("main-text").value = "";
    document.getElementById("summary").value = "";
    // document.getElementById("add-tag-zone").value = "";
    document.getElementById("add-tag-zone").innerHTML = "";
    // localStorage.removeItem("localTags");   // localのタグを削除
    // console.log("localのtagを削除");

    // sessionStorageの削除
    // 今後sessionStorageにメモ機能以外を入れるのであれば全部消さないようにする
    // sessionStorage.removeItem("title");
    // sessionStorage.removeItem("text");
    // sessionStorage.removeItem("localTags");
    // sessionStorage.removeItem("summary");
    sessionStorage.clear();  // 全部
    console.log("sessionstorageを削除");

    window.location.href = "title.html";

  } catch (e) {
    // 保存に失敗した場合
    console.error("Firestoreへの保存エラー:", e);
    alert("メモの保存に失敗しました。");
  }
});

// タグ追加ボタン
const tag_button = document.getElementById("tag_add");
// タグ追加ボタンを押した時に現在の入力内容を保持してから画面遷移
tag_button.addEventListener("click", async () => {
  // 各項目をアイテムの中から取得
  const title = document.getElementById("title").value;      // タイトル
  const text = document.getElementById("main-text").value;   // 本文
  const summary = document.getElementById("summary").value;  // 要約

  // sessionStorageに保存
  sessionStorage.setItem("title", title);
  sessionStorage.setItem("text", text);
  sessionStorage.setItem("summary", summary);
  
  // // 現在メモに付いているタグを取得
  // const tagElements = document.querySelectorAll("#add-tag-zone .tag");
  // // 取得したタグを配列に変換（多分）
  // const sessionTags = Array.from(tagElements).map(el => ({
  //   id: el.textContent,   // FirestoreのタグIDを使うならここを差し替え
  //   name: el.textContent
  // }));

  // // sessionStorageに保存
  // sessionStorage.setItem("localTags", JSON.stringify(sessionTags));
})

function loadMemononakamis(){
  // sessionStorageから要素を取得
  const title_text = sessionStorage.getItem("title");      // タイトル
  const text = sessionStorage.getItem("text");             // 本文
  const summary_text = sessionStorage.getItem("summary");  // 要約
  console.log(title_text, text, summary_text);

  // html内の要素
  const title = document.getElementById("title");
  const main_text = document.getElementById("main-text");
  const summary = document.getElementById("summary");

  // input に値を入れる
  title.value = title_text;
  main_text.value = text;
  summary.value = summary_text;
}

// ページ読み込み時の処理
window.addEventListener("DOMContentLoaded", () => {
  // sessionstorageの中身をとりだしたりするよ
  loadMemononakamis();

  // 選んだタグを表示するコード
  // タグを置くところ
  const tag_zone = document.getElementById("add-tag-zone");
  // タグを入れる配列 sessionStorageからタグを取得（なければ空）
  const tags = JSON.parse(sessionStorage.getItem("localTags")) || [];
  // 1つずつ中身を取り出す
  tags.forEach(tag => {
    // タグを入れるpを作る
    const p = document.createElement("p");
    p.textContent = tag.name;   // 名前入力
    p.classList.add("tag");     // class付ける
    p.dataset.docId = tag.id;   // id付ける
    tag_zone.appendChild(p);    // タグ入れるとこにpを入れる
  });
});
