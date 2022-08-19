// アプリケーションの寿命の制御と、ネイティブなブラウザウインドウを作成するモジュール
const { app, BrowserWindow } = require('electron')
const path = require('path')
const env = process.env.NODE_ENV || 'development';
// ホットリロード
if (env === 'development') {
  try {
      require('electron-reloader')(module, {
          debug: true,
          watchRenderer: true
      });
  } catch (_) { console.log('Error'); }
}

function createWindow () {
  // ブラウザウインドウを作成します。
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    transparent: true,
    frame: false,
    alwaysOnTop: true,  // 前面表示
    hasShadow: false,
  })

  // そしてアプリの index.html を読み込みます。
  mainWindow.loadFile('index.html')

  // マウスイベントを無効化
  mainWindow.setIgnoreMouseEvents(true)

  // ウインドウサイズを最大化
  mainWindow.maximize()

  // デベロッパー ツールを開きます。
  // mainWindow.webContents.openDevTools()
}

// このメソッドは、Electron の初期化が完了し、
// ブラウザウインドウの作成準備ができたときに呼ばれます。
// 一部のAPIはこのイベントが発生した後にのみ利用できます。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // macOS では、Dock アイコンのクリック時に他に開いているウインドウがない
    // 場合、アプリ内にウインドウを再作成するのが一般的です。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// macOS を除き、全ウインドウが閉じられたときに終了します。 ユーザーが
// Cmd + Q で明示的に終了するまで、アプリケーションとそのメニューバーを
// アクティブにするのが一般的です。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// このファイルでは、アプリ内のとある他のメインプロセスコードを
// インクルードできます。 
// 別々のファイルに分割してここで require することもできます。