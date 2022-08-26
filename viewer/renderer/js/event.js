const button = document.getElementById('createBtn')
const elCopy = document.createElement('i');

button.onclick = async () => {

    if (button.classList.contains('copy')) {
        var url = document.getElementById('url').innerHTML;
        navigator.clipboard.writeText(url.trim())
        document.querySelector('.result').innerHTML = 'コピーしました'
    } else {
        button.innerHTML = `<div class="loading"></div>`
        setTimeout(() => {
            button.classList.add('copy')
            elCopy.className = 'fa-solid fa-copy'
            button.appendChild(elCopy)
            button.textContent = "URLをコピーする"
        }, 500);

        // イベントコード(uuidv4をメインプロセスから取得)

        // リアクション画面を生成？
    }
}
