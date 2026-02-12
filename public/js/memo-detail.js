import { db, auth } from "./firebase.js";

// 必要なfirebaseの機能をインポート
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// // sessionStorageから要素を取得
// const id_text = sessionStorage.getItem("id");            // ID
// const title_text = sessionStorage.getItem("title");      // タイトル
// const text = sessionStorage.getItem("text");             // 本文
// const tag_text = sessionStorage.getItem("tags");         // タグ
// const summary_text = sessionStorage.getItem("summary");  // 要約

// console.log("id:", id_text, "タイトル:", title_text, "本文:", text, "タグ:", tag_text, "要約:", summary_text);

// // html内の要素
// const title = document.getElementById("title");
// const main_text = document.getElementById("main-text");
// const summary = document.getElementById("summary");
// const add_tag_zone = document.getElementById("add-tag-zone");

// // input に値を入れる
// title.value = title_text;
// main_text.value = text;
// // add_tag_zone.textContent = tag_text;   // タグ追加処理ができたので不要
// summary.value = summary_text;

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
  // タグの文字列
  // const tags = document.getElementById("add-tag-zone").textContent;
  const tagElements = document.querySelectorAll("#add-tag-zone .tag");  // .tag要素全てを取得
  const tags = Array.from(tagElements).map(el => el.textContent);

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

// タグ追加ボタン
const tag_button = document.getElementById("tag_add");
// タグ追加ボタンを押した時に現在の入力内容を保持してから画面遷移
tag_button.addEventListener("click", async () => {
  // 各項目をアイテムの中から取得
  const title = document.getElementById("title").value;      // タイトル
  const text = document.getElementById("main-text").value;   // 本文
  const summary = document.getElementById("summary").value;  // 要約
  // タグ
  const tagElements = document.querySelectorAll("#add-tag-zone .tag");  // 現在メモに付いているタグ（文字列）
  // localTags形式に変換
  const localTags = Array.from(tagElements).map(el => ({
    id: el.textContent,   // 仮ID（名前で代用）
    name: el.textContent
  }));

  // sessionStorageに保存
  sessionStorage.setItem("title", title);
  sessionStorage.setItem("text", text);
  sessionStorage.setItem("summary", summary);
  sessionStorage.setItem("localTags", JSON.stringify(localTags));
})

function loadMemononakamis(){
  // sessionStorageから要素を取得
  const id_text = sessionStorage.getItem("id");            // ID
  const title_text = sessionStorage.getItem("title");      // タイトル
  const text = sessionStorage.getItem("text");             // 本文
  const tags = JSON.parse(sessionStorage.getItem("tags")) || []; // タグ
  const summary_text = sessionStorage.getItem("summary");  // 要約
  console.log(
    "id:", id_text, 
    "タイトル:", title_text, 
    "本文:", text, 
    "タグ:", tags, 
    "要約:", summary_text
  );

  // html内の要素
  const title = document.getElementById("title");
  const main_text = document.getElementById("main-text");
  const add_tag_zone = document.getElementById("add-tag-zone");
  const summary = document.getElementById("summary");

  // inputに値を入れる
  title.value = title_text;
  main_text.value = text;
  summary.value = summary_text;

  // タグのinput
  // 1つずつ中身を取り出す
  tags.forEach(tag => {
    // タグを入れるpを作る
    const p = document.createElement("p");
    p.textContent = tag;   // 名前入力
    p.classList.add("tag");     // class付ける
    p.dataset.docId = tag;   // id付ける
    add_tag_zone.appendChild(p);    // タグ入れるとこにpを入れる
  });

  // // タグを再生成
  // add_tag_zone.innerHTML = ""; // タグを一旦クリア
  // if (tags) {
  //   const localTags = JSON.parse(tags);
  //   localTags.forEach(tag => {
  //     const span = document.createElement("span");
  //     span.classList.add("tag", "selected");
  //     span.textContent = tag.name;
  //     add_tag_zone.appendChild(span);
  //   });
  // }
}

// ページ読み込み時の処理
window.addEventListener("DOMContentLoaded", () => {
  // sessionstorageの中身をとりだしたりするよ
  loadMemononakamis();

  // // 選んだタグを表示するコード
  // // タグを置くところ
  // const tag_zone = document.getElementById("add-tag-zone");
  // // タグを入れる配列 localStorageからタグを取得（なければ空）
  // const tags = JSON.parse(sessionStorage.getItem("localTags")) || [];
  // // 1つずつ中身を取り出す
  // tags.forEach(tagName => {
  //   const p = document.createElement("p");  // タグを入れるpを作る
  //   p.textContent = tag.name;               // 名前入力
  //   p.classList.add("tag");                 // class付ける
  //   tag_zone.appendChild(p);                // タグ入れるとこにpを入れる
  // });

  // sessionStorage から選択済みタグを取得
  const selectedTags = JSON.parse(sessionStorage.getItem("localTags")) || [];
  // タグ一覧の要素を取得
  const allTagElements = document.querySelectorAll("#tag-zone .tag");

  // 選択済みかどうかを判定して selected クラスを付与
  allTagElements.forEach(tagEl => {
    if (selectedTags.some(t => t.name === tagEl.textContent)) {
      tagEl.classList.add("selected");
    } else {
      tagEl.classList.remove("selected");
    }

    // クリックで選択切替も追加
    tagEl.addEventListener("click", () => {
      tagEl.classList.toggle("selected");
    });
  });

});
