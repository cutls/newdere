# newdere

[@nita_minami](https://twitter.com/nita_minami)

![2022-10-30-cv](/res/2022-10-30-cv.png)  
↑2022年10月30日現在 **ボイス実装済み** | [ボイス未実装](https://github.com/cutls/newdere/blob/main/res/2022-10-30-nocv.png) | [限定スキル秒数対応表(2022/11)](https://github.com/cutls/newdere/blob/main/res/2022-11-04-limited.png) | [ブランスキル秒数対応表(2022/11)](https://github.com/cutls/newdere/blob/main/res/2022-12-04-blane.png)



## これなに

デレステのガシャ更新をお知らせするbot [参考: @nihatadumi1](https://twitter.com/nihatadumi1)

## みんな向け

* いつ投稿されますか？  
更新日の15:06頃に設定しています。公式のTwitterの情報を参考するのですが、大抵公式のガシャ更新通知は15:05過ぎくらいに投稿されます。よって、余裕を持って15:10投稿としています。手動では無いため、15:00ぴったりの投稿はできません。ご了承ください。
* Twitterでの画質が悪い  
画像の右上の「…」を押して「4Kを読み込む」を押すと、原寸大のものを読み込もうとします。
特にAndroidの場合だとほとんど差を感じないことがあるので、素直に「高画質版」のURLを開いた方が良いです。(高画質版: 約2MB/枚のPNG画像)
* ボイス実装済みと未実装が同時に来た場合はどうなりますか？  
もし仮にそういうことがあった場合、投稿される画像はすべて**ボイス実装済み**のものになります。ただ、ツイートされるテキストには全員が表記されます。
* 表記に誤りがあります  
[@nita_minami](https://twitter.com/nita_minami)にリプかDMしてください。


このソフトウェア、botは「アイドルマスター シンデレラガールズ スターライトステージ」(デレステ)公式、公認のものではありません。利用しているデータの権利は"BANDAI NAMCO Entertainment Inc."に所属します。

このbotが提供するデータの信頼性を開発者は保証できません。このbotを利用したことによる不都合の責を開発者が負うことはできません。

## オタク向け

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

必須項目は左から順に、ID, (Cu|Co|Pa), 名前, CV, 恒常数, 限定数, フェス数, 最終更新日です。[サンプルCSV 2022/10/30現在](https://github.com/cutls/newdere/blob/main/res/samplesheet-20221030.csv)

CVは今の所ボイス実装済みかどうかの判定だけにしか使いませんので、実装済みのアイドルだけ`1`とでも入力しておけば十分です。IDは厳密な連番ではなく、一部に抜けがあります。ただし、このIDはサードパーティAPI由来のもので、このbotに使用するものでは無いので、連番でもすべて同じ数字でもおそらく動きます。

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

スキル秒数対応表のデータは、`node dist/src/skill/init.limited.js`で取得できますが、対象スキルや対象アイドルに変更がある場合があるため、抜けが生じる場合があります。(2022/11/30時点の最新です)
また、APIに多くのリクエストを送信するため、繰り返し実行するのはおやめください。現在限定アイドルとブランフェスアイドルの諸スキルに対応しており、それぞれ`limited.json`、`blane.json`が作成されます。


試しに画像を取得してみる場合、

```
node dist/src/getImage.js
```

`src/getImage.ts`の9行目, 10行目付近に記載されている変数をいじることで、設定を変更できます。変更後は`npx tsc`を忘れずに。(または依存関係の`ts-node`を利用して、`npx ts-node src/getImage.ts`としても構いません。)

スキル対応表は`node dist/src/skill/image.js`で`image.png`に保存されます。

毎日15:10に実行するタスクは以下の通りです。cronなどに記載します。
```
node dist/src/task.js
```

task.jsは以下の作業を行います。

1. starlight.kirara.caのAPIを用いて、新しいカードがあるかどうかを取得します。(ない場合はここで終了)
1. APIの結果を整形した上で`allCharaIdData.json`に保存します。
1. 更新されたカードの種類(恒常, 限定, フェス)を確認するために、公式Twitterの情報を取得します。
1. スプレッドシートに書き込みます。
1. (これより先はgetImage.tsでも行われます)スプレッドシートを読み込みます。
1. `allCharaIdData.json`とスプレッドシートの情報から、画像を作成します。アイドルのカード画像はstarlight.kirara.caのAPIを用いて取得しています。
1. GCSにアップロードします。(getImage.tsでツイートがオフの場合は、ルートディレクトリにimage.pngを作成し、ここで終了します)
1. (限定/ブランの場合)スキル秒数対応表を作成します。`limited.json`または`blane.json`を以上の操作からえた更新情報を元に書き足します。
1. 画像をツイートします。

### Tips

* 解像度が足りません  
Twitterにアップロードできる最大解像度だとこれくらいが限界です。ただし、`src/create.ts`の9行目の`scale`の値を大きくすると、巨大な画像を生成できるため解像度を上げることができます。
* フォントを変えたい  
一番手っ取り早いのは、好きなフォントを`noto.otf`に改名してルートディレクトリにある`noto.otf`と入れ替えることです。ただ、Noto Sans Serifに準拠してピクセルを決定しているため、他のフォントにすると結構な確率でズレると思います。名前を変えるのが嫌だったり、そもそもOTFでは無い場合、適当な場所に置いて`src/create.ts`の`registerFont`(20行目あたり)のところなどを変えると良いでしょう。TTFでも動きます。
