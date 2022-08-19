# インスパイアしたサービス

リモート擬音さん

https://www.remotegionsan.com/

# アプリケーションのパッケージと頒布

1. アプリの開発用依存関係に Electron Forge を追加し、その `import` コマンドで Forge のセットアップをします。

```zsh
npm install --save-dev @electron-forge/cli
npx electron-forge import

✔ Checking your system
✔ Initializing Git Repository
✔ Writing modified package.json file
✔ Installing dependencies
✔ Writing modified package.json file
✔ Fixing .gitignore

We have ATTEMPTED to convert your app to be in a format that electron-forge understands.

Thanks for using "electron-forge"!!!
```

2. 以下のように Forge の `make` コマンドで頒布形式を作成します。

```zsh
npm run make

> my-electron-app@1.0.0 make /my-electron-app
> electron-forge make

✔ Checking your system
✔ Resolving Forge Config
We need to package your application before we can make it
✔ Preparing to Package Application for arch: x64
✔ Preparing native dependencies
✔ Packaging Application
Making for the following targets: zip
✔ Making for target: zip - On platform: darwin - For arch: x64
```