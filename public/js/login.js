// インポート
import { auth, provider, signInWithPopup, signOut } from './firebase.js';

const login_button = document.getElementById("login");      // ログインボタン
const logout_button = document.getElementById("logout");    // ログアウトボタン

// ログイン処理
login_button.addEventListener("click", async () => {
    console.log("ログインクリック");  // 確認用

    signInWithPopup(auth, provider)
    .then((result) => {
      console.log("ログイン成功:", result.user.displayName);
      alert(`ようこそ ${result.user.displayName} さん`);
    })
    .catch((error) => {
      console.error("ログイン失敗:", error);
    });
});

// ログアウト処理
logout_button.addEventListener("click", async () => {
  console.log("ログアウトクリック");  // 確認用

    signOut(auth)
    .then(() => {
      alert(`ログアウトしました`);
      console.log("ログアウトしました");
    })
    .catch((error) => {
      console.error("ログアウト失敗:", error);
    });
});
