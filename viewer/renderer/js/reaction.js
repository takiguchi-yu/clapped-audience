const endpoint = 'wss://0wumxnt787.execute-api.ap-northeast-1.amazonaws.com/dev'

let ws; // WebSocket

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
    const size = Math.floor(Math.random() * 220);
  
    reaction.style.position = 'absolute';
    reaction.style.top = posY + 'px';
    reaction.style.left = posX + 'px';
    // reaction.style.width = size + 'px';
    reaction.style.width = 50 + size + 'px'; // ランダム値のみだと小さすぎる数値の場合に見えないので、最低サイズをプラスする
    // reaction.src = JSON.parse(e.data).imagePath;
    // reaction.src = e.data;
    reaction.src = message;
    reaction.className = 'item';
    const reactionAnimation = reaction.animate(
      [
        { top: posY + 'px', },
        { top: '0px', opacity: 0 }
        // { top: posY + 'px', transform: 'rotate(5deg)' },
        // { top: '0px', transform: 'rotate(-5deg)', opacity: 0 }
      ],
      {
        duration: 2500,
        easing: 'ease-in',
        // iterations: Infinity,
      }
    )
    reactionAnimation.onfinish = () => {
      reaction.remove();
    }
  
    body.appendChild(reaction);
  };
  
  function wsConnection(endpoint, eventCode) {
    ws = new WebSocket(`${endpoint}?eventCode=${eventCode}`);
    let s = (l) => console.log(l);
  
    // コネクション確立
    ws.onopen = m => {
      s(" CONNECTED")
      currentReconnectDelay = initialReconnectDelay;
    }
  
    // メッセージ受信
    ws.onmessage = m => {
      // s(" RECEIVED: " + JSON.stringify(m.data, null, 3))
      const message = m.data.split(',')
      if (message[0] === 'text') {
        const params = {
          message: message[1],
          position: message[2],
          duration: message[3],
          color: message[4],
          fontSize: message[5],
          fontWeight: message[6],
          opacity: message[7],
        }
        createText(params)
      } else {
        received(m.data)
      }
    }
  
    // コネクションエラー
    ws.onerror = e => s(" ERROR")
  
    // コネクションクローズ (クローズしたら再接続)
    ws.onclose = e => {
      s(" CONNECTION CLOSED");

      if (e.code === 1000) return;  // 任意のイベントコード経由の場合、再接続せずにクローズ

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

  const eventCode = await window.electronAPI.eventCode()
  wsConnection(endpoint, eventCode);

  // 任意のイベントコードを設定
  window.electronAPI.onUpdateEventCode((_event, eventCode) => {
    ws.close(1000, 'New EventCode issued')
    wsConnection(endpoint, eventCode);
  })
})()

/**
 * パラメータ例： { "action": "sendmessage", "data": "text,運営からのお知らせ：残り5分です,fixed,12000,red,64px,700", "eventCode": "test" }
 */
function createText({ message = '', position = 'random', duration = 10000, color = 'black', fontSize = '32px', fontWeight = 500, opacity = 0.8 }) {
  const body = document.querySelector('body');
  let spanText = document.createElement('span');
  spanText.className = 'text'
  spanText.style.position = 'absolute'
  if (position === 'fixed') {
    spanText.style.top = '30px';
  } else {
    let random = Math.round( Math.random()*document.documentElement.clientHeight );
    spanText.style.top = random + 'px';
  }
  spanText.style.left = (document.documentElement.clientWidth) + 'px';
  spanText.style.whiteSpace = 'nowrap'
  spanText.style.color = color
  spanText.style.opacity = opacity
  spanText.style.webkitTextStroke = '1px black'
  spanText.style.fontWeight = fontWeight
  spanText.style.fontSize = fontSize

  // 文字幅を計算するために canvas を作成
	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');
  // context.font = '900 64px \'Noto Sans\', sans-serif';
  context.font = fontWeight + ' ' +  fontSize + ' \'Noto Sans\', sans-serif';
	let metrics = context.measureText(message);
	let width = metrics.width

  const textAnimation = spanText.animate(
    [
      { left: '-' + width + 'px'},
    ],
    { duration: parseInt(duration) }
  )
  textAnimation.onfinish = () => {
    spanText.remove();
    canvas.remove();
  }
  spanText.appendChild(document.createTextNode(message));
  body.appendChild(canvas);
  body.appendChild(spanText);
}
