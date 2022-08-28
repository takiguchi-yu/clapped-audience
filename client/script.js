const queryString = location.search
const obj = new URLSearchParams(queryString);
const eventCode = obj.get('eventCode')
const sock = new WebSocket('wss://fyo5gy2ev5.execute-api.ap-northeast-1.amazonaws.com/dev' + location.search);

// 接続処理
sock.addEventListener('open', (e) => {
  console.log('Socket 接続成功');
});

document.addEventListener('DOMContentLoaded', (e) => {
  // サーバーにデータを送信
  document.getElementById('item1').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item1').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
  document.getElementById('item2').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item2').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
  document.getElementById('item3').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item3').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
  document.getElementById('item4').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item4').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
  document.getElementById('item5').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item5').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
  document.getElementById('item6').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item6').querySelector('img').getAttribute('src')
    sock.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
});

// サーバーからデータを受信
sock.addEventListener('message', (e) => {
  // console.log('Received Client: ' + JSON.parse(e.data).imagePath);
  console.log(`Received Client: ${e.data}`);
});

sock.addEventListener('close', (e) => {
  console.log('I lost a server');
});

sock.addEventListener('onerror', (e) => {
  console.log('Some Error occurred');
  sock.close()
});
