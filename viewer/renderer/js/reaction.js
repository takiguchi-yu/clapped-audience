// const sock = new WebSocket('ws://127.0.0.1:5001');
const sock = new WebSocket('wss://pje4eh6ds8.execute-api.ap-northeast-1.amazonaws.com/Prod?eventCode=eb605ee4-4c78-4d62-b580-6b2ab216a8a0');

// 接続処理
sock.addEventListener('open', (e) => {
  console.log('Socket 接続成功');
});

(async () => {
  const message = await window.electronAPI.nyan('はい')
  console.log(message)  // "はいにゃん"
  console.log(await window.electronAPI.uuidv4())
})()

// サーバーからデータを受信
sock.addEventListener('message', async (e) => {
  const message = await window.electronAPI.wan('はい')
  console.log(message)  // "はいわん"


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
  reaction.src = e.data;
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
