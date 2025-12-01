const backButton = document.getElementById("back");     // 戻るボタン

backButton.addEventListener("click", () => {
    history.back();
});