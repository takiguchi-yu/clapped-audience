const sock = new WebSocket('ws://127.0.0.1:5001');

// 接続処理
sock.addEventListener('open', (e) => {
  console.log('Socket 接続成功');
});

// サーバーからデータを受信
sock.addEventListener('message', (e) => {
  // console.log(e.data);
  let body = document.querySelector('body');

  let element = document.createElement('img');
  let posY = Math.floor(Math.random() * window.innerHeight);
  let posX = Math.floor(Math.random() * window.innerWidth);
  let size = Math.floor(Math.random() * 250);

  element.style.position = 'absolute';
  element.style.top = posY + 'px';
  element.style.left = posX + 'px';
  element.style.width = 150 + size + 'px';

  element.src = JSON.parse(e.data).imagePath;

  element.className = 'item';

  body.appendChild(element);

  setTimeout(() => {
    var item = document.querySelectorAll(".item")[0];
    item.remove();
  }, 5000)
});
