// firebaseの初期化（ないとエラー？）
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
// 必要なfirebaseの機能をインポート
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebaseプロジェクトの接続の情報
const firebaseConfig = {
  apiKey: "AIzaSyDYmi7yqSSPU1mtd0gTmTifhmLQPvCqYCQ",
  authDomain: "matomemo-45d64.firebaseapp.com",
  projectId: "matomemo-45d64",
  storageBucket: "matomemo-45d64.firebasestorage.app",
  messagingSenderId: "23202501961",
  appId: "1:23202501961:web:0bbcd482e5ac5923a23698",
  measurementId: "G-CYJSJZZEV1"
};

// Firestoreに接続するのに使う
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 各要素を取得（検索バー・検索ボタン・結果表示エリアなど）
const titleInput = document.getElementById("title-search");
const searchBtn = document.querySelector(".side-title .img-button");
const resultZone = document.getElementById("add-search-zone");

// ページ読み込み処理
async function loadAllMemos() {
  // 読み込み中を表示
  resultZone.innerHTML = "<p>読み込み中...</p>";

  try {
    // Firestoreの 中身を、作成日時(createdAt)の降順で取得
    const q = query(collection(db, "memos"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    // 表示エリアをクリア
    resultZone.innerHTML = "";

    // 1件ずつメモをHTMLに追加
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // 表示用のdiv要素を作成
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("search-item"); // cssのclass

      // 内容をhtmlに入力
      itemDiv.innerHTML = `
        <div class="search-title">${data.title || "(タイトルなし)"}</div>
        <div class="search-text" style="display:none;">${data.text || ""}</div>
        <div class="search-tag">${data.tags || "-"}</div>
        <div class="search-summary">${data.summary || data.text || ""}</div>
      `;

      // firebaseのメモのid
      itemDiv.dataset.docId = doc.id;

      // 結果表示エリアに追加
      resultZone.appendChild(itemDiv);
    });

    // 1件もなければ
    if (querySnapshot.empty) { resultZone.innerHTML = "<p>メモが登録されていません。</p>"; }

  } catch (e) {
    // エラーが起きた場合の処理
    console.error("Firestore 読み込みエラー:", e);
    resultZone.innerHTML = "<p>読み込みに失敗しました。</p>";
  }
}

// 検索機能
async function searchMemos() {
  console.log("検索開始");  // 確認用

  // 入力されたキーワードを取得・小文字化
  const keyword = titleInput.value.trim().toLowerCase();
  resultZone.innerHTML = "<p>検索中...</p>";

  try {
    console.log("fire storeから要素を取得");  // 確認用
    
    // Firestoreから全件を取得（同じく作成日時降順）
    const q = query(collection(db, "memos"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    resultZone.innerHTML = "";
    let found = false; // 検索結果が見つかったかどうかのフラグ

    // 1件ずつチェックしてタイトルまたはタグにキーワードが含まれていれば表示
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const title = data.title?.toLowerCase() || "";
      const tags = data.tags?.toLowerCase() || "";
      const summary = data.summary || data.text || "";

      if (title.includes(keyword) || tags.includes(keyword)) {
        found = true;

        // 該当メモをHTML要素として追加
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("search-item");
        itemDiv.innerHTML = `
          <div class="search-title">${data.title}</div>
          <div class="search-text" style="display:none;">${data.text || ""}</div>
          <div class="search-tag">${data.tags}</div>
          <div class="search-summary">${summary}</div>
        `;
        resultZone.appendChild(itemDiv);
      }
    });

    // 該当なしの場合
    if (!found) {
      resultZone.innerHTML = "<p>該当するメモはありません。</p>";
    }

  } catch (e) {
    // エラー処理
    console.error("検索エラー:", e);
    resultZone.innerHTML = "<p>検索に失敗しました。</p>";
  }
}

// エンター押しても検索できるようにする
titleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchMemos();
  }
});

// メモ一覧をクリックしたときの処理
function attachClickEvents() {
  console.log("アイテムをクリック");  // 確認用

  const items = document.getElementsByClassName("search-item");

  Array.from(items).forEach((item) => {
    item.addEventListener("click", () => {
      // 各項目をアイテムの中から取得
      const title = item.querySelector(".search-title").textContent;      // タイトル
      const text = item.querySelector(".search-text").textContent;        // 本文
      const tag = item.querySelector(".search-tag").textContent;          // タグ
      const summary = item.querySelector(".search-summary").textContent;  // 要約

      // sessionStorageに保存
      sessionStorage.setItem("id", item.dataset.docId);
      sessionStorage.setItem("title", title);
      sessionStorage.setItem("text", text);
      sessionStorage.setItem("tag", tag);
      sessionStorage.setItem("summary", summary);

      // 画面遷移
      window.location.href = "memo-detail.html";
    });
  });
}

// ページ読み込み時に実行
window.addEventListener("load", async () => {
  console.log("ページ読み込み");  // 確認用
  await loadAllMemos();   // Firebaseからアイテムを取得して画面に追加
  attachClickEvents();    // 取得した要素にイベントを付ける
});

// 検索ボタンをクリックしたときに検索を実行
searchBtn.addEventListener("click", searchMemos);
