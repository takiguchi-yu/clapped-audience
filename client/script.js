const sock = new WebSocket('wss://pje4eh6ds8.execute-api.ap-northeast-1.amazonaws.com/Prod');
// const sock = new WebSocket('ws://127.0.0.1:5001');

// 接続処理
sock.addEventListener('open', (e) => {
  console.log('Socket 接続成功');
  console.log('search:' + location.search);
});

document.addEventListener('DOMContentLoaded', (e) => {
  // サーバーにデータを送信
  document.getElementById('item1').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item1').querySelector('img').getAttribute('src')
    
    // TODO: uuidv4を設定して send する
    // 存在しないイベントコードの場合、エラーにする

    sock.send(`{ "action": "sendmessage", "data": "${imgPath}"}`);
  });
  document.getElementById('item2').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item2').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}"}`);
  });
  document.getElementById('item3').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item3').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}"}`);
  });
  document.getElementById('item4').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item4').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}"}`);
  });
  document.getElementById('item5').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item5').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}"}`);
  });
  document.getElementById('item6').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item6').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}"}`);
  });
});

// サーバーからデータを受信
sock.addEventListener('message', (e) => {
  // console.log('Received Client: ' + JSON.parse(e.data).imagePath);
  console.log(`Received Client: ${e.data}`);
});

// ソケットクローズ
sock.addEventListener('close', (e) => {
  console.log('I lost a server');
});

// ソケットエラー
sock.addEventListener('onerror', (e) => {
  console.log('Some Error occurred');
  sock.close()
});
