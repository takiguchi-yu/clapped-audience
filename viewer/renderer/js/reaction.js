const endpoint = 'wss://fyo5gy2ev5.execute-api.ap-northeast-1.amazonaws.com/dev'

// 指数バックオフ設定値
let initialReconnectDelay = 1000;
let currentReconnectDelay = initialReconnectDelay;
let maxReconnectDelay = 16000;

(async () => {
  // メッセージ受信の本処理
  function received(message) {
    const body = document.querySelector('body');  
    const reaction = document.createElement('img');
    const posY = Math.floor(Math.random() * window.innerHeight);
    const posX = Math.floor(Math.random() * window.innerWidth);
    const size = Math.floor(Math.random() * 250);
  
    reaction.style.position = 'absolute';
    reaction.style.top = posY + 'px';
    reaction.style.left = posX + 'px';
    reaction.style.width = 100 + size + 'px';
    // reaction.src = JSON.parse(e.data).imagePath;
    // reaction.src = e.data;
    reaction.src = message;
    reaction.className = 'item';
    const reactioAnimation = reaction.animate(
      [
        { top: posY + 'px' },
        { top: '0px', opacity: 0 }
      ],
      {
        duration: 2500,
        easing: 'ease-in'
      }
    )
    reactioAnimation.onfinish = () => {
      reaction.remove();
    }
  
    body.appendChild(reaction);
  };
  
  function wsConnection(endpoint, eventCode) {
    let ws = new WebSocket(`${endpoint}?eventCode=${eventCode}`);
    let s = (l) => console.log(l);
  
    // コネクション確立
    ws.onopen = m => {
      s(" CONNECTED")
      currentReconnectDelay = initialReconnectDelay;
    }
  
    // メッセージ受信
    ws.onmessage = m => {
      // s(" RECEIVED: " + JSON.stringify(m.data, null, 3))
      received(m.data)
    }
  
    // コネクションエラー
    ws.onerror = e => s(" ERROR")
  
    // コネクションクローズ (クローズしたら再接続)
    ws.onclose = e => {
      s(" CONNECTION CLOSED");
      setTimeout((function() {
        reconnectToWebsocket()
      }).bind(this), currentReconnectDelay + Math.floor(Math.random() * 3000))  // ランダム指数バックオフ
    }
  }

  function reconnectToWebsocket() {
    if(currentReconnectDelay < maxReconnectDelay) {
      currentReconnectDelay*=2;
      s(" RECONNECTION...");
      wsConnection(endpoint, eventCode);
    }
  }

  const eventCode = await window.electronAPI.eventCode()
  wsConnection(endpoint, eventCode);  
})()
