// アプリケーションの寿命の制御と、ネイティブなブラウザウインドウを作成するモジュール
const { app, BrowserWindow, Tray, Menu, screen, ipcMain } = require('electron')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const isWin = process.platform === 'win32'

console.log("application version : ", app.getVersion())

// メインプロセス(Nodejs)の多重起動防止
const gotTheLock = app.requestSingleInstanceLock()
if(!gotTheLock){
  console.log('メインプロセスが多重起動しました。終了します。')
  app.quit();
}

const env = process.env.NODE_ENV || 'development'
if (env === 'development') {
  try {
    // ホットリロード
    require('electron-reloader')(module, {
          debug: false,
          watchRenderer: true
      });
  } catch (_) { console.log('Error'); }
}

app.dock.hide() // Dockアイコンを非表示（MacOSのみ）

let eventWindow     // イベント設定画面
function createEventWindow() {

  // レンダラープロセス(画面)の多重起動防止
  if (eventWindow && !eventWindow.isDestroyed()) {
    eventWindow.show();
    eventWindow.focus();
    return;
  }

  eventWindow = new BrowserWindow({
    width: 500,
    height: 580,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false
    }
  })
  eventWindow.setMenu(null)
  eventWindow.loadFile('./renderer/event.html')
}

let reactionWindow  // リアクション表示画面
function createReactionWindow () {
  reactionWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    transparent: true,  // 透明化
    frame: false,
    hasShadow: false,
  })
  reactionWindow.setAlwaysOnTop(true, "screen-saver")  // 最前面表示
  reactionWindow.setVisibleOnAllWorkspaces(true)  // すべてのワークスペース（デスクトップ）で表示（MacOSのみ）
  reactionWindow.setIgnoreMouseEvents(true)  // マウスイベントを無効化
  reactionWindow.maximize()  // ウインドウサイズを最大化
  // reactionWindow.webContents.openDevTools() // デベロッパーツール
  reactionWindow.loadFile('./renderer/reaction.html')
}

function setScreenHight(ratio) {
  let workAreaSize = screen.getPrimaryDisplay().workAreaSize;
  height = Math.floor(workAreaSize.height * ratio)
  y = workAreaSize.height - height
  reactionWindow.setBounds({ x: 0, y: y, width: workAreaSize.width, height: height })
}

let tray = null
function createTaskBar () {
  // const icon = nativeImage.createFromPath('./icon.png'); // なぜかこの書き方だとアイコンが表示されない
  const icon = isWin ? __dirname + '/assets/tray_icon.ico' : __dirname + '/assets/tray_icon.png';
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: '設定...', click: function() { createEventWindow() }},
    {
      label: '描画領域',
      submenu: [
        { label: '100%', type: 'radio', checked: true, click: function() { reactionWindow.maximize() } },
        { label: '70%', type: 'radio', click: function() { setScreenHight(0.7) } },
        { label: '50%', type: 'radio', click: function() { setScreenHight(0.5) } },
        { label: '30%', type: 'radio', click: function() { setScreenHight(0.3) } },
      ]
    },
    { type: 'separator' },
    { label: "終了する", click: function () { app.quit(); } },
  ]);
  tray.setContextMenu(contextMenu);
}

// このメソッドは、Electron の初期化が完了し、
// ブラウザウインドウの作成準備ができたときに呼ばれます。
// 一部のAPIはこのイベントが発生した後にのみ利用できます。
app.whenReady().then(() => {
  // イベント設定画面を作成
  createEventWindow()
  // リアクション画面を作成
  createReactionWindow()
  // タスクバーを作成
  createTaskBar()

  app.on('activate', function () {
    // macOS では、Dock アイコンのクリック時に他に開いているウインドウがない
    // 場合、アプリ内にウインドウを再作成するのが一般的です。
    if (BrowserWindow.getAllWindows().length === 0) createTaskBar()
  })
})

// macOS を除き、全ウインドウが閉じられたときに終了します。 ユーザーが
// Cmd + Q で明示的に終了するまで、アプリケーションとそのメニューバーを
// アクティブにするのが一般的です。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

//----------------------------------------
// IPC通信
//----------------------------------------
// 語尾に "にゃん" を付けて返す
ipcMain.handle('nyan', (event, data) => {
  return(`${data}にゃん🐱`)
})

// 語尾に "わん" を付けて返す
ipcMain.handle('wan', (event, data) => {
  return(`${data}わん🐶`)
})

let eventCode = uuidv4()
ipcMain.handle('eventCode', (event, data) => {
  // 任意のイベントコードを設定する場合
  if (data) {
    eventCode = data
    reactionWindow.webContents.send('update-eventCode', eventCode)
  }
  return eventCode
})

// このファイルでは、アプリ内のとある他のメインプロセスコードを
// インクルードできます。 
// 別々のファイルに分割してここで require することもできます。