# 拍手喝采

『 拍手喝采 』はオンラインイベントリアクションツールです。

![clappedaudience](https://user-images.githubusercontent.com/8340629/187449719-f6db4408-a996-42d3-af70-230e2407df33.gif)

# 使い方

<img width="614" alt="gaiyou" src="https://user-images.githubusercontent.com/8340629/187465033-46396d63-9e54-4aed-885d-c8eea9f6177e.png">

# 発表者

アプリケーションを起動すると自動で イベント用URL が発行されます。  
発行された URL を視聴者に教えてください。

![viewer](https://user-images.githubusercontent.com/8340629/187465891-1a8d4bc6-9a38-4531-ae5d-a7f6bac59661.jpg)

```
アプリケーションの「コード署名」と「公証」をしていないため、実行すると 警告⚠️ が表示されます。次の手順を実施することで回避できます。
https://sp7pc.com/apple/mac/5734
```

## 発表が終わったら

アプリケーションを終了してください。

![traybar](https://user-images.githubusercontent.com/8340629/187466873-e42c53e6-f679-49d2-aea3-31c7989a4aac.jpg)

# 視聴者

URL を教えてもらったらボタンを押すだけです。

![client](https://user-images.githubusercontent.com/8340629/187466862-baa042eb-4324-489c-a8f2-d2c1891d09a0.png)

# インスパイアしたサービス

* [リモート擬音さん](https://www.remotegionsan.com/)
* [ClapHand](https://syobochim.hatenablog.com/entry/2020/10/31/205851)

# ディレクトリの説明

|ディレクトリ|説明|
|-|-|
|client|視聴者用の Web ページ|
|server|リアクションサーバー<br>AWS に構築|
|viewer|配信者用の アプリケーション<br>Electron で開発|
|static-site|Amazon S3 の静的ホスティングを構築する CDK|
|local-server|ローカルのリアクションサーバー|
