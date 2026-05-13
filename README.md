# FE科目B トレーニング PWA

基本情報技術者試験（FE）科目B向けの、スマホで短時間演習するための軽量PWAです。GitHub Pagesで公開しやすいように、HTML/CSS/JavaScriptだけで構成しています。

## 使い方

1. `index.html` をHTTPS対応のサーバー、GitHub Pages、またはローカル確認用サーバーで開く
2. 「全て」「アルゴリズム」「セキュリティ」から出題カテゴリを選ぶ
3. 問題文と擬似コードを確認して、選択肢をタップする
4. 解答後に正誤判定と解説を確認する
5. 「間違い復習」で、不正解だった問題だけを解き直す

学習履歴は端末の `localStorage` に保存されます。保存する内容は、解答済み問題、正解数、不正解問題、最終学習日時です。

## ファイル構成

```text
fe-b-pwa/
  index.html
  manifest.webmanifest
  sw.js
  README.md
  css/
    styles.css
  js/
    app.js
  data/
    questions.json
  assets/
    icons/
      icon.svg
      icon-180.png
      icon-192.png
      icon-512.png
```

## 問題データ

問題は `data/questions.json` の `questions` 配列に追加します。

```json
{
  "id": "fe-b-sample-009",
  "category": "algorithm",
  "title": "問題タイトル",
  "difficulty": "基本",
  "question": "問題文をここに書きます。",
  "code": "擬似コードをここに書きます。不要な場合は空文字にします。",
  "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "answer": 0,
  "explanation": "解説をここに書きます。",
  "tags": ["配列", "トレース"]
}
```

`category` は `algorithm` または `security` を指定します。`answer` は正解の選択肢番号です。最初の選択肢が `0`、2番目が `1`、3番目が `2`、4番目が `3` です。

## PWA設定

- `manifest.webmanifest` はGitHub Pagesで動く相対パス構成です。
- `sw.js` が主要ファイルと `data/questions.json` をオフラインキャッシュします。
- 問題データや画面を更新したあと反映されにくい場合は、`sw.js` の `CACHE_NAME` を変更してください。
