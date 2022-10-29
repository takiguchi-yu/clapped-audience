const endpoint = 'wss://0wumxnt787.execute-api.ap-northeast-1.amazonaws.com/dev'

const queryString = new URLSearchParams(location.search);
const eventCode = queryString.get('eventCode')

// 指数バックオフ設定値
let initialReconnectDelay = 1000;
let currentReconnectDelay = initialReconnectDelay;
let maxReconnectDelay = 16000;

let ws  // WebSocket
function wsConnection(endpoint, eventCode) {
  ws = new WebSocket(`${endpoint}?eventCode=${eventCode}`);
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

  reconnectToWebsocket = () => {
    if(currentReconnectDelay < maxReconnectDelay) {
      currentReconnectDelay*=2;
      s(" RECONNECTION...");
      wsConnection(endpoint, eventCode);
    }
  }  
}

wsConnection(endpoint, eventCode);



// リアクションボタンが押されたときに呼ばれる
function sendMessage(buttonId) {
  const imgPath = document.getElementById(buttonId).querySelector('img').getAttribute('src')
  // console.log(imgPath);
  ws.send(`{ "action": "sendmessage", "data": "${location.protocol}//${location.host}/${imgPath}", "eventCode": "${eventCode}"}`);
}
