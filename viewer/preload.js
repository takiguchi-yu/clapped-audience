const { contextBridge, ipcRenderer } = require('electron')

// Node.js の全 API は、プリロードプロセスで利用可能です。
// Chrome 拡張機能と同じサンドボックスも持っています。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

// contextBridge
// 分離されたプリロードスクリプトから API をレンダラーに公開する
contextBridge.exposeInMainWorld(
  'electronAPI', 
  {
    nyan: (data) => ipcRenderer.invoke('nyan', data),
    wan: (data) => ipcRenderer.invoke('wan', data),
    eventCode: () => ipcRenderer.invoke('eventCode'),
  }
)
