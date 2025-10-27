// これを読み込んだhtmlファイルにホームボタンなどを追加する
function homeButton() {
    // ホームボタン
    const homeButton = document.createElement("a");     // ホームボタンが入るタaタグ
    homeButton.className = "home-button";               // ホームボタンのclass
    homeButton.href = "title.html";                     // ホームへのリンク

    const home_img = document.createElement("img");     // img要素を作成
    home_img.src = "image/home_button.png";             // 画像を追加
    home_img.className = "img-style";                   // imgのクラス
    homeButton.appendChild(home_img);                   // 親に画像を追加

    // メニューボタン
    const menuButton = document.createElement("a");     // メニューボタンが入るタaタグ
    menuButton.className = "menu-button";               // メニューボタンのclass

    const menu_img = document.createElement("img");     // img要素を作成
    menu_img.src = "image/menu_button.png";             // 画像を追加
    menu_img.className = "img-style";                   // imgのクラス
    menuButton.appendChild(menu_img);                   // 親に画像を追加

    // モーダル
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.display = "none";

    // モーダルの中身
    const modalContent = document.createElement("div");
    modalContent.className = "modal-html";
    modalContent.innerHTML = `
        <img src="image/close_button.png" alt="閉じる" id="close-btn">
        <!-- ボタンまとめdiv -->
        <div id="mo-as">
            <!-- メモ作成 -->
            <a href="memo_make.html">
                <img src="image/memo_make.png" alt="メモ作成" class="mo-icon">
                <p class="mo-icon-text">メモ作成</p>
            </a>
            <hr>    <!-- 横線 -->
            <!-- メモ検索 -->
            <a href="memo_search.html">
                <img src="image/memo_search.png" alt="メモ検索" class="mo-icon">
                <p class="mo-icon-text">メモ検索</p>
            </a>
            <hr>
            <!-- 設定 -->
            <a href="memo_option.html">
                <img src="image/memo_settings.png" alt="設定" class="mo-icon">
                <p class="mo-icon-text">設定</p>
            </a>
        </div>
    `;

    modal.appendChild(modalContent);    // モーダルの中身をモーダルのdivに入れる

    // <head>内に追加
    document.body.appendChild(homeButton);
    document.body.appendChild(menuButton);
    document.body.appendChild(modal);

    // モーダル関係の処理
    // メニューボタンを押した時の処理
    menuButton.addEventListener("click", () => {
        modal.style.display = "flex"; // 表示（flexで中央寄せ）
        setTimeout(() => modal.classList.add("show"), 10); // アニメーション用クラス追加
    });

    // 「閉じる」ボタンで閉じる
    modalContent.querySelector("#close-btn").addEventListener("click", () => {
        modal.classList.remove("show");
        setTimeout(() => modal.style.display = "none", 400); // アニメ終了後に非表示
    });

    // 背景クリックでも閉じる
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
            setTimeout(() => modal.style.display = "none", 400);
        }
    });
}

// css関係の処理
const cardStyle = `
    .home-button{
        position:fixed;
        top: 0px;
        left: 0px;
    }
    .menu-button{
        position:fixed;
        top: 0px;
        right: 0px;
    }
    .img-style{
        width: 70px;
        margin: 15px;
    }

    /* モーダルの外側（背景） */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5); /* 半透明の黒背景 */
        display: none;                          /* 最初は非表示 */
        justify-content: flex-end;              /* 右端に配置 */
        align-items: center;                    /* 中央寄せ（縦） */
        z-index: 1000;                          /* 前面に表示 */
    }
    /* モーダルの中身 */
    .modal-html{
        top: 0;
        left: 0;
        width: 50%;
        max-height: 100%;
        text-align: left;
        background-color: white;    /* モーダルの背景色 */
        z-index: 1000;              /* 全面表示 */

        overflow-y: auto;   /* スクロール可能 */

        /* 初期状態（右の外側に隠す） */
        transform: translateX(100%);
        transition: transform 0.4s ease;
        
        scrollbar-width: none;  /* スクロールバーを非表示にする */
    }
    /* 表示時にスライドイン */
    .modal.show .modal-html {
        transform: translateX(0);
    }
    /* 閉じるボタン */
    #close-btn{
        width: 40px;
    }
    
    /* リンク内のアイコンなど */
    /* 画像を入れているaを入れているdivタグ */
    #mo-as{
        text-align: center;
        display: column;
        justify-content: center;
    }
    /* 画像を入れているaタグ */
    a{
        margin-bottom: 0;
        text-decoration: none;  /* 画像下の文字リンクの下線を消す */
    }
    /* 画像 */
    .mo-icon{
        width: 180px;
        margin: 50px;
        margin-top: 0;
        margin-bottom: 0;
    }

    /* 画像下の説明テキスト */
    .mo-icon-text{
        text-align: center;
        text-decoration: none;
        color: #000000; /* 画像下文字の色付け */
    }
`;

// <style> タグを新規作成し、上記CSSスタイルをセット
const styleTag = document.createElement('style');
styleTag.textContent = cardStyle;

// <head>内に<style>タグを追加し、ページ全体にCSSを適用
document.head.appendChild(styleTag);


// htmlが読み込まれたら勝手に発動するやつ
document.addEventListener("DOMContentLoaded", () => {
    homeButton();
});
