# newdere

[@nita_minami](https://twitter.com/nita_minami)

![2022-10-30-cv](/res/2022-10-30-cv.png)  
↑2022年10月30日現在↑

## これなに

デレステのガシャ更新をお知らせするbot[参考: @nihatadumi1](https://twitter.com/nihatadumi1)

## 開発

### Setup

Node.js 14.16.0/16.13.1 で動作確認

```
git clone https://github.com/cutls/newdere
cd newdere

yarn
```

[canvasのREADME](https://github.com/Automattic/node-canvas#readme)を読んで、環境に合わせて依存ライブラリをインストールします。newdereではGIFやSVGは扱いませんので、giflibやlibgifといった一部ライブラリは不要です。JPEGやPNGに関連するものはインストールしてください。

### Prepare

こんな感じのGoogleスプレッドシートを用意します。

![Google SpreadSheet](/res/spreadsheet.png)

必須項目は左から順に、ID, (Cu|Co|Pa), 名前, CV, 恒常数, 限定数, フェス数, 最終更新日です。[サンプルCSV 2022/10/30現在](https://github.com/cutls/newdere/blob/main/samplesheet-20221030.csv)

CVは今の所ボイス実装済みかどうかの判定だけにしか使いませんので、実装済みのアイドルだけ`1`とでも入力しておけば十分です。

経過日数は、H3に`=IF(H2, DATEDIF(H2,TODAY(),"D"),"")`と入れて出しています。J列は空列にしておくことをおすすめします。(依存ライブラリの制限 [google-spreadsheet#367](https://github.com/theoephraim/node-google-spreadsheet/issues/367))

Google Cloud Platformで[サービスアカウント](https://console.cloud.google.com/iam-admin/serviceaccounts)を作って、そのメアド`USER@PROJECT.iam.gserviceaccount.com`にこのスプレッドシートを共有します。

また、同じプロジェクト内において、GCS(Google Cloud Storage)で新しいバケットを作り「Storage オブジェクト作成者」「Storage オブジェクト管理者」をこのメールアドレスに与えておきます。そして、このバケットを公開します。

### Env

`.env.sample`を埋めて`.env`にリネームします。

```
SHEET_ID='' # GoogleシートのID
GOOGLE_SERVICE_ACCOUNT_EMAIL='USER@PROJECT.iam.gserviceaccount.com'
GOOGLE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n' # 長いやつ
TW_CONSUMER_KEY='' # Twitterのコンシューマーキー
TW_CONSUMER_SECRET='' # Twitterのコンシューマーシークレット
TW_ACCESS_TOKEN='' # Twitterのアクセストークン
TW_ACCESS_TOKEN_SECRET='' # Twitterのアクセストークンシークレット
STORAGE='https://storage.googleapis.com/BACKET_NAME/'
```

GoogleシートのIDはURLを見ればわかります。`https://docs.google.com/spreadsheets/d/GOOGLE_SPREADSHEET_ID/edit`

Twitter APIの認証情報は頑張って作文してゲットしてください。

### Done

```
npx tsc
node dist/src/init.js
```

これで基準となるデータを取得できます。ルートディレクトリに`allCharaIdData.json`が作成されます。

試しに画像を取得してみる場合、

```
node dist/src/getImage.js
```

`src/getImage.ts`の9行目, 10行目付近に記載されている変数をいじることで、設定を変更できます。変更後は`npx tsc`を忘れずに。(または依存関係の`ts-node`を利用して、`npx ts-node src/getImage.ts`としても構いません。)

毎日15:15に実行するタスクは以下の通りです。cronなどに記載します。
```
node dist/src/task.js
```

task.jsは以下の作業を行います。

1. starlight.kirara.caのAPIを用いて、新しいカードがあるかどうかを取得します。(ない場合はここで終了)
1. APIの結果を整形した上で`allCharaIdData.json`に保存します。
1. 更新されたカードの種類(恒常, 限定, フェス)を確認するために、[非公式RSS](https://imastodon.net/@imascg_stage_bot.rss)を用いて、公式Twitterの情報を取得します。
1. スプレッドシートに書き込みます。
1. (これより先はgetImage.tsでも行われます)スプレッドシートを読み込みます。
1. `allCharaIdData.json`とスプレッドシートの情報から、画像を作成します。アイドルのカード画像はstarlight.kirara.caのAPIを用いて取得しています。
1. GCSにアップロードします。(getImage.tsでツイートがオフの場合は、ルートディレクトリにimage.pngを作成し、ここで終了します)
1. 画像をツイートします。

### Tips

* 解像度が足りません  
Twitterにアップロードできる最大解像度だとこれくらいが限界です。ただし、`src/create.ts`の9行目の`scale`の値を大きくすると、巨大な画像を生成できるため解像度を上げることができます。

このソフトウェア、botは「アイドルマスター シンデレラガールズ スターライトステージ」(デレステ)公式、公認のものではありません。利用しているデータの権利は"BANDAI NAMCO Entertainment Inc."に所属します。

このbotが提供するデータの信頼性を開発者は保証できません。このbotを利用したことによる不都合の責を開発者が負うことはできません。