function wsConnection(endpoint, eventCode) {
  var ws = new WebSocket(`${endpoint}?eventCode=${eventCode}`);
  var s = (l) => console.log(l);

  // コネクション確立
  ws.onopen = m => s(" CONNECTED")

  // メッセージ受信 (クライアントには不要なのでコメントアウト)
  // ws.onmessage = m => s(" RECEIVED: " + JSON.stringify(m.data, null, 3))

  // コネクションエラー
  ws.onerror = e => s(" ERROR")

  // コネクションクローズ (クローズしたら再接続)
  ws.onclose = e => {
    s(" CONNECTION CLOSED");
    s(" RECONNECTING...");
    setTimeout((function() {
      var ws2 = new WebSocket(ws.url);
      ws2.onopen = ws.onopen;
      ws2.onmessage = ws.onmessage;
      ws2.onclose = ws.onclose;
      ws2.onerror = ws.onerror;
      ws = ws2
    }).bind(this), 5000)
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

const queryString = new URLSearchParams(location.search);
const eventCode = queryString.get('eventCode')
wsConnection('wss://fyo5gy2ev5.execute-api.ap-northeast-1.amazonaws.com/dev', eventCode);
