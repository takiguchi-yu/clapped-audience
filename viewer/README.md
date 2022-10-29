## 開発環境

* node v16.17.0
* npm 8.18.0

## ビルド方法

```bash
npm install
npm run make
```

## 動作確認方法

```bash
npm start
```

## ログ出力

利用ライブラリ

* [electron-log](https://www.npmjs.com/package/electron-log)

ログレベルを NODE_ENV で判定してます

* development: debug
* 未設定: none

出力先

* on macOS: ~/Library/Logs/拍手喝采{バージョン}/{process type}.log
* on Windows: %USERPROFILE%\AppData\Roaming\拍手喝采{バージョン}\logs\{process type}.log

## そのほか

npm audit report を HTML で出力する方法

```
npm i -g npm-audit-html
npm audit --json | npm-audit-html
```