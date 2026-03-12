# chatwork-translator

チャットワークのメッセージを翻訳してくれる Chrome 拡張です。  
OpenAI の API を使用して翻訳します。  
翻訳したデータはfirebaseに保存されますので、チームで同じ翻訳文を読むことが出来ます。

## インストール手順

### Chrome 拡張ファイルのダウンロード

1. 右上の緑の「Code」ボタンをクリックし「Download ZIP」をクリックします。
2. ダウンロードした zip ファイルを解凍します。

### Chrome 拡張のインストール

3. Chrome のロケーションバーに「chrome://extensions」と入力します。
4. ウィンドウ右上の「デベロッパーモード」をONにします。
5. 「パッケージ化されていない拡張機能を読み込む」をクリックします
6. zip を解凍したフォルダの中にある「chatwork-translator」を選択します。
7. 拡張機能に「Chatwork Translator」が表示されます。

### Chrome 拡張の設定

8. 「Chatwork Translator」の「詳細」をクリックします。
9. 表示されるメニューの中から「拡張機能のオプション」をクリックします。
10. OpenAI API Key にキーを入力します。（別途用意します。）
11. Firebase Database URL に `https://chatwork-translator-default-rtdb.asia-southeast1.firebasedatabase.app/` を入力します。

12. 「保存」をクリックします。

これでインストール完了です。

この状態で Chatwork にアクセスすると、各メッセージに「翻訳」ボタンが表示されます。このボタンを押すと翻訳文が表示されます。


