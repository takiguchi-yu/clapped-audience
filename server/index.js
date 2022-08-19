const server = require('ws').Server;
const s = new server({ port: 5001 });

s.on('connection', (ws) => {
  // メッセージ送信
  ws.on('message', (message) => {
    console.log('Received: ' + message);
    s.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          imagePath: message.toString(),
        })
      );
    });
  });

  // クライアントがサーバーから切断されたときの処理
  ws.on('close', () => {
    console.log('I lost a client');
  });

  // クライアント接続エラー処理
  ws.onerror = () => {
    console.log('Some Error occurred');
  };
});
