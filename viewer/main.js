// アプリケーションの寿命の制御と、ネイティブなブラウザウインドウを作成するモジュール
const { app, BrowserWindow, Tray, Menu, screen, ipcMain } = require('electron')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const isWin = process.platform === 'win32'
const env = process.env.NODE_ENV || 'development'
const log = require('electron-log')
log.transports.file.level = false;
log.transports.console.level = 'debug';
// ログは以下に出力されます（Macの場合）
// ~/Library/Logs/拍手喝采{バージョン}

if (env === 'development') {
  try {
    // ホットリロード
    require('electron-reloader')(module, {
      debug: false,
      watchRenderer: true
    });
  } catch (_) { log.error('Error'); }
}

log.debug("process.env.NODE_ENV : ", env)
log.debug("application version : ", app.getVersion())

// メインプロセス(Nodejs)の多重起動防止
const gotTheLock = app.requestSingleInstanceLock()
if(!gotTheLock){
  log.debug('メインプロセスが多重起動しました。終了します。')
  app.quit();
}

if(!isWin) {
  app.dock.hide() // Dockアイコンを非表示（MacOSのみ）
}

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

let tray = null
function createTaskBar () {
  // const icon = nativeImage.createFromPath('./icon.png'); // なぜかこの書き方だとアイコンが表示されない
  const icon = isWin ? __dirname + '/assets/tray_icon.ico' : __dirname + '/assets/tray_icon.png';
  tray = new Tray(icon);
  tray.setToolTip(app.name)

  const contextMenu = Menu.buildFromTemplate([
    { label: '設定...', click: function() { createEventWindow() }},
    {
      label: '描画領域',
      submenu: [
        { label: '100%',type: 'radio', checked: true, click: function() { createReactionAllWindow(1.0) } },
        { label: '70%', type: 'radio', click: function() { createReactionAllWindow(0.7) } },
        { label: '50%', type: 'radio', click: function() { createReactionAllWindow(0.5) } },
        { label: '30%', type: 'radio', click: function() { createReactionAllWindow(0.3) } },
        { label: 'ほぼミュート', type: 'radio', click: function() { createReactionAllWindow(0.01) } },
      ]
    },
    { type: 'separator' },
    { label: 'ログ出力する', type: 'checkbox', checked: false, click: function(item) { enableLogging(item.checked) }},
    { type: 'separator' },
    { label: "終了する", click: function () { app.quit(); } },
  ]);
  tray.setContextMenu(contextMenu);
}


// リアクションウインドウを生成する
let reactionWindows = []    // リアクションウインドウ's (複数モニターに対応)
function createReactionAllWindow(ratio = 1.0) {
  // 開いているリアクションウインドウがあればクローズ
  reactionWindows.forEach(win => {
    log.debug("ウインドウクローズ : ", win.getBounds())
    win.close()
  })

  reactionWindows = []  // 初期化

  screen.getAllDisplays().forEach(display => {
    if (display.bounds.x !== 0 || display.y !== 0) {

      // ウインドウサイズを計算
      h2 = Math.floor(display.workArea.height * ratio)
      x2 = display.workArea.x
      y2 = display.workArea.height - h2 + display.workArea.y
      w2 = display.workArea.width

      let win = new BrowserWindow({
        x: x2,
        y: y2,
        width: w2,
        height: h2,
        transparent: true,  // 透明化
        frame: false,
        hasShadow: false,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        },
      })
      win.setAlwaysOnTop(true, "screen-saver")  // 最前面表示
      win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true})  // すべてのワークスペース（デスクトップ）で表示（MacOSのみ）
      win.setIgnoreMouseEvents(true)  // マウスイベントを無効化
      win.loadFile('./renderer/reaction.html')
      // win.loadURL('https://github.com')

      log.debug("ディスプレイworkArea\t\t: ", display.workArea)
      log.debug("ウインドウworkArea(", ratio*100, "%)\t: ", win.getBounds())

      reactionWindows.push(win)
    }
  })
}

// ログ出力を on/off する
function enableLogging(checked) {
  if (checked) {
    log.transports.file.level = 'debug';
    log.debug('ログ出力 ON')
  } else {
    log.debug('ログ出力 OFF')
    log.transports.file.level = false;
  }
}

// このメソッドは、Electron の初期化が完了し、
// ブラウザウインドウの作成準備ができたときに呼ばれます。
// 一部のAPIはこのイベントが発生した後にのみ利用できます。
app.whenReady().then(() => {
  // イベント設定画面を作成
  createEventWindow()
  // タスクバーを作成
  createTaskBar()
  // 別モニターにもリアクション画面を作成
  createReactionAllWindow()

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
let eventCode = uuidv4()
ipcMain.handle('eventCode', (event, data) => {
  log.debug("現在のeventCode : ", eventCode)
  // 任意のイベントコードを設定する場合
  if (data) {
    log.debug("変更後のeventCode : ", data)
    eventCode = data
    reactionWindows.forEach(window => {
      window.webContents.send('update-eventCode', eventCode)
    })
  }
  return eventCode
})

// このファイルでは、アプリ内のとある他のメインプロセスコードを
// インクルードできます。 
// 別々のファイルに分割してここで require することもできます。