(async () => {
  const eventCode = await window.electronAPI.eventCode()
  console.log(eventCode);
  const sock = new WebSocket('wss://fyo5gy2ev5.execute-api.ap-northeast-1.amazonaws.com/dev?eventCode=' + eventCode);

  // 接続処理
  sock.addEventListener('open', (e) => {
    console.log('Socket 接続成功');
  });
  
  // サーバーからデータを受信
  sock.addEventListener('message', async (e) => {
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
  
  sock.addEventListener('close', (e) => {
    console.log('I lost a server');
  });
  
  sock.addEventListener('onerror', (e) => {
    console.log('Some Error occurred');
    sock.close()
  });
})()

