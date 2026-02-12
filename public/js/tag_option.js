// 戻るボタン
const backButton = document.getElementById("back"); // 戻るボタン
backButton.addEventListener("click", () => {
    history.back();
});

// Firebase
// firebase.js からインポートする想定
import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// 要素取得
const tag_button = document.getElementById("gogozeppeli"); // 決定ボタン
const tag_zone = document.getElementById("tag-zone");      // タグ表示領域

// URLパラメータ取得
const params = new URLSearchParams(window.location.search);
const from = params.get("from");  
console.log("from:", from); // 確認用

// ボタン文言設定
if (from === "tag_create") tag_button.textContent = "作成";
else if (from === "tag_add") tag_button.textContent = "追加";
else if (from === "tag_search") tag_button.textContent = "検索";

// タグ読み込み
async function loadAllTags() {
    tag_zone.innerHTML = "<p>読み込み中...</p>";
    try {
        const q = query(collection(db, "tags"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        tag_zone.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const itemP = document.createElement("p");
            itemP.classList.add("tag");
            itemP.textContent = data.tagName;
            itemP.dataset.docId = doc.id;
            tag_zone.appendChild(itemP);
        });
    } catch (e) {
        console.error("Firestore 読み込みエラー:", e);
        tag_zone.innerHTML = "<p>読み込みに失敗しました。</p>";
    }
}

// ボタンを押した時の処理 
tag_button.addEventListener("click", async () => { 
    // 共通で選択したタグの保存
    sessionStorage.setItem("localTags", JSON.stringify(localTags));
    console.log("保存されたタグ:", localTags);

    // fromの中身によって処理を変える 
    switch (from) { 
        // タグの作成 
        case "tag_create": 
        await tagCreate(); 
        break; 
        // タグの追加処理 // 
        case "tag_add": 
        window.location.href = "memo_make.html";
        break; 
        // タグの検索 
        case "tag_search": 
        await tagSearch();
        break; 
    } 
})

// -------------------- タグ作成 --------------------
async function tagCreate() {
    const tag_name = document.getElementById("tag-input").value;
    if (!tag_name) {
        alert("名前は必須です。");
        return;
    }
    try {
        const docRef = await addDoc(collection(db, "tags"), {
            tagName: tag_name,
            createdAt: serverTimestamp()
        });
        alert("タグを作成しました！");
        document.getElementById("tag-input").value = "";
        await loadAllTags();
        selectTags(); // 作成後も選択済みにする
        tagAdd();
    } catch (e) {
        console.error("Firestoreへの保存エラー:", e);
        alert("タグの作成に失敗しました。");
    }
}

// -------------------- タグ選択 --------------------
// sessionStorageに保存する配列
let localTags = JSON.parse(sessionStorage.getItem("localTags")) || [];
let tags = JSON.parse(sessionStorage.getItem("tags")) || [];

function tagAdd() {
    // .tag クラスがついたすべての要素（タグ）を取得
    const tags = document.querySelectorAll(".tag");
    // タグひとつひとつを回していく（クリックイベントのため）
    tags.forEach(tagEl => {
        // タグひとつひとつにクリックイベント（選択するため）
        tagEl.addEventListener("click", () => {
            // クリックされたタグの情報をオブジェクトにまとめる
            const tagData = { id: tagEl.dataset.docId, name: tagEl.textContent };
            // localTags に同じIDのタグがすでにあるか確認
            const exists = localTags.some(t => t.id === tagData.id);
            // localTags に同じIDのタグがすでにあるか確認
            if (!exists) {
                localTags.push(tagData);
                tagEl.classList.add("selected");
            } else {
                localTags = localTags.filter(t => t.id !== tagData.id);
                tagEl.classList.remove("selected");
            }
        });
    });
}

// -------------------- タグ検索 --------------------
function tagSearch(){
    // 選択されたタグ名だけを配列にする
    const selectedTagNames = localTags.map(t => t.name);

    // sessionStorage に保存
    sessionStorage.setItem("searchTags", JSON.stringify(selectedTagNames));

    console.log("検索用タグ保存:", selectedTagNames);

    // 検索画面へ戻る
    window.location.href = "memo_search.html";
}

// 既に選択されているタグを選択済みにする
function selectTags() {
    document.querySelectorAll(".tag").forEach(tagEl => {
        if (localTags.some(t => t.id === tagEl.dataset.docId)) {
            tagEl.classList.add("selected");
        }else if(tags.includes(tagEl.textContent)){
            tagEl.classList.add("selected");
        }
    });
}

// // 決定ボタン
// tag_button.addEventListener("click", () => {
//     // sessionStorage に保存
//     sessionStorage.setItem("localTags", JSON.stringify(localTags));
//     console.log("保存されたタグ:", localTags);

//     // 画面遷移（from に応じて変更可）
//     if (from === "tag_add") {
//         window.location.href = "memo_make.html";
//     } else if (from === "tag_create") {
//         // 作成画面ならリロードして最新タグを表示
//         tag_button.textContent = "作成";
//         document.getElementById("tag-input").value = "";
//         loadAllTags();
//         selectTags();
//         tagAdd();
//     }
// });

// ページ読み込み時
window.addEventListener("load", async () => {
    console.log("ページ読み込み");

    await loadAllTags();   // Firestoreからタグ取得
    selectTags();           // 選択済みタグ反映
    tagAdd();               // クリックイベント登録
});
