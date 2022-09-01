const endpoint = 'wss://fyo5gy2ev5.execute-api.ap-northeast-1.amazonaws.com/dev'

const queryString = new URLSearchParams(location.search);
const eventCode = queryString.get('eventCode')

// 指数バックオフ設定値
let initialReconnectDelay = 1000;
let currentReconnectDelay = initialReconnectDelay;
let maxReconnectDelay = 16000;

function wsConnection(endpoint, eventCode) {
  let ws = new WebSocket(`${endpoint}?eventCode=${eventCode}`);
  let s = (l) => console.log(l);

  // コネクション確立
  ws.onopen = m => {
    s(" CONNECTED")
    currentReconnectDelay = initialReconnectDelay;
  }

  // メッセージ受信 (クライアントには不要なのでコメントアウト)
  // ws.onmessage = m => s(" RECEIVED: " + JSON.stringify(m.data, null, 3))

  // コネクションエラー
  ws.onerror = e => s(" ERROR")

  // コネクションクローズ (クローズしたら再接続)
  ws.onclose = e => {
    s(" CONNECTION CLOSED");
    setTimeout((function() {
      reconnectToWebsocket()
    }).bind(this), currentReconnectDelay + Math.floor(Math.random() * 3000))  // ランダム指数バックオフ
  }

  function reconnectToWebsocket() {
    if(currentReconnectDelay < maxReconnectDelay) {
      currentReconnectDelay*=2;
      s(" RECONNECTION...");
      wsConnection(endpoint, eventCode);
    }
  }

  // リアクションボタンを押したときのイベントリスナーを登録
  document.getElementById('item1').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item1').querySelector('img').getAttribute('src')
    ws.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
  document.getElementById('item2').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item2').querySelector('img').getAttribute('src')
    ws.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
  document.getElementById('item3').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item3').querySelector('img').getAttribute('src')
    ws.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
  document.getElementById('item4').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item4').querySelector('img').getAttribute('src')
    ws.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
  document.getElementById('item5').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item5').querySelector('img').getAttribute('src')
    ws.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
  document.getElementById('item6').addEventListener('click', (e) => {
    const imgPath = document.getElementById('item6').querySelector('img').getAttribute('src')
    ws.send(`{ "action": "sendmessage", "data": "${imgPath}", "eventCode": "${eventCode}"}`);
  });
}

wsConnection(endpoint, eventCode);
