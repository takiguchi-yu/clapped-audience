const sock = new WebSocket('ws://127.0.0.1:5001');

// 接続処理
sock.addEventListener('open', (e) => {
  console.log('Socket 接続成功');
});

document.addEventListener('DOMContentLoaded', (e) => {
  // サーバーにデータを送信
  document.getElementById('item1').addEventListener('click', (e) => {
    sock.send(document.getElementById('item1').querySelector('img').getAttribute('src'));
  });
  document.getElementById('item2').addEventListener('click', (e) => {
    sock.send(document.getElementById('item2').querySelector('img').getAttribute('src'));
  });
  document.getElementById('item3').addEventListener('click', (e) => {
    sock.send(document.getElementById('item3').querySelector('img').getAttribute('src'));
  });
  document.getElementById('item4').addEventListener('click', (e) => {
    sock.send(document.getElementById('item4').querySelector('img').getAttribute('src'));
  });
  document.getElementById('item5').addEventListener('click', (e) => {
    sock.send(document.getElementById('item5').querySelector('img').getAttribute('src'));
  });
  document.getElementById('item6').addEventListener('click', (e) => {
    sock.send(document.getElementById('item6').querySelector('img').getAttribute('src'));
  });
});

// サーバーからデータを受信
sock.addEventListener('message', (e) => {
  console.log('Received: ' + JSON.parse(e.data).imagePath);
});
