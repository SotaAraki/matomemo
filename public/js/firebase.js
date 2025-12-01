// Firebase SDK読み込み firebaseの初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyDYmi7yqSSPU1mtd0gTmTifhmLQPvCqYCQ",
  authDomain: "matomemo-45d64.firebaseapp.com",
  projectId: "matomemo-45d64",
  storageBucket: "matomemo-45d64.firebasestorage.app",
  messagingSenderId: "23202501961",
  appId: "1:23202501961:web:0bbcd482e5ac5923a23698",
  measurementId: "G-CYJSJZZEV1"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ログイン状態監視（例：自動リダイレクト用）
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("ログイン中:", user.displayName);
  } else {
    console.log("未ログイン");
  }
});

// 共通で使えるようにエクスポート
export { app, db, auth, provider, signInWithPopup, signOut };
