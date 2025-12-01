// 戻るボタン処理
const backButton = document.getElementById("back");     // 戻るボタン

backButton.addEventListener("click", () => {
    history.back();
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
  const tags = document.getElementById("add-tag-zone").textContent; // タグの値

  // 入力チェック
  // タイトルまたは本文が空の場合は保存せずに警告
  if (!title) {
    alert("タイトルは必須です。");
    return; // ここで処理を止める
  }

  // Firestoreに保存
  try {
    // "memos" というコレクション（フォルダのようなもの）に新しく追加
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

    // フォームをリセットしてもOK（必要なら）
    document.getElementById("title").value = "";
    document.getElementById("main-text").value = "";
    document.getElementById("summary").value = "";

  } catch (e) {
    // 保存に失敗した場合の処理
    console.error("Firestoreへの保存エラー:", e);
    alert("メモの保存に失敗しました。");
  }
});