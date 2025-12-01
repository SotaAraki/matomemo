import { db, auth } from "./firebase.js";

// 必要なfirebaseの機能をインポート
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// sessionStorageから要素を取得
const id_text = sessionStorage.getItem("id");            // ID
const title_text = sessionStorage.getItem("title");      // タイトル
const text = sessionStorage.getItem("text");             // 本文
const tag_text = sessionStorage.getItem("tag");          // タグ
const summary_text = sessionStorage.getItem("summary");  // 要約

console.log(id_text, title_text, text, tag_text, summary_text);

// html内の要素
const title = document.getElementById("title");
const main_text = document.getElementById("main-text");
const summary = document.getElementById("summary");
const add_tag_zone = document.getElementById("add-tag-zone");

// input に値を入れる
title.value = title_text;
main_text.value = text;
add_tag_zone.textContent = tag_text;
summary.value = summary_text;

// メモ更新ボタン
const updateButton = document.getElementById("update");
// 戻るボタン処理
const backButton = document.getElementById("back");

// メモ更新ボタンを押した時
updateButton.addEventListener("click", async () => {
  console.log("メモ更新をクリック");  // 確認用

  // 入力内容を取得
  const title = document.getElementById("title").value;             // タイトル入力欄の値
  const mainText = document.getElementById("main-text").value;      // 本文入力欄の値
  const summary = document.getElementById("summary").value;         // 要約入力欄の値
  const tags = document.getElementById("add-tag-zone").textContent; // タグの文字列（仮）

  // 入力チェック
  // タイトルまたは本文が空の場合は保存せずに警告
  if (!title) {
    alert("タイトルは必須です。");
    return; // ここで処理を止める
  }

  // Firestoreに保存
  try {
    // メモの更新処理
    const docRef = await updateDoc(doc(db, "memos", id_text), {
      title: title,                // メモのタイトル
      text: mainText,              // メモ本文
      summary: summary,            // 要約
      tags: tags,                  // タグ（現時点ではテキスト形式）
      updatedAt: serverTimestamp() // Firebase側で記録される現在日時
    });

    // 保存成功時の処理
    alert("メモを更新しました！");
    console.log("更新されたドキュメントのID:", id_text);

    window.location.href = "memo_search.html";  // history.back();だと更新したメモが反映されないのでこちらを採用

  } catch (e) {
    // 保存に失敗した場合の処理
    console.error("Firestoreへの保存エラー:", e);
    alert("メモの保存に失敗しました。");
  }
});

// 戻るボタンを押した時の処理
backButton.addEventListener("click", () => {
    history.back();
});