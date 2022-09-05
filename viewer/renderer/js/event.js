const button = document.getElementById('createBtn')
const url = document.querySelector('.box .card p')

document.addEventListener('DOMContentLoaded', async (e) => {
  // const endpoint = 'http://127.0.0.1:5500/client/index.html'
  const endpoint = 'https://d2xj9rdavab03i.cloudfront.net'
  url.innerHTML = endpoint + '?eventCode=' + await window.electronAPI.eventCode()
});

button.onclick = () => {
  button.innerHTML = `<div class="loading"></div>`
  navigator.clipboard.writeText(url.innerHTML.trim())
  setTimeout(() => {
    button.innerHTML = ''
    button.textContent = "URLをコピーしました"
  }, 500);
}
