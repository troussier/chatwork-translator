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
11. Firebase Database URL にURLを入力します。（別途用意します。）
12. 「保存」をクリックします。

これでインストール完了です。

この状態で Chatwork にアクセスすると、各メッセージに「翻訳」ボタンが表示されます。このボタンを押すと翻訳文が表示されます。


----


Đây là tiện ích mở rộng Chrome giúp dịch các tin nhắn trên Chatwork.  
Sử dụng API của OpenAI để thực hiện dịch thuật.  
Dữ liệu đã dịch sẽ được lưu trên Firebase, cho phép cả nhóm đọc cùng một bản dịch.

## Hướng dẫn cài đặt

### Tải xuống file tiện ích mở rộng Chrome

1. Nhấp vào nút màu xanh lá「Code」ở góc trên bên phải, sau đó chọn「Download ZIP」.
2. Giải nén file zip vừa tải xuống.

### Cài đặt tiện ích mở rộng Chrome

3. Nhập「chrome://extensions」vào thanh địa chỉ của Chrome.
4. Bật「Chế độ nhà phát triển (Developer mode)」ở góc trên bên phải cửa sổ.
5. Nhấp vào「Tải tiện ích chưa được đóng gói (Load unpacked)」.
6. Chọn thư mục「chatwork-translator」bên trong thư mục đã giải nén.
7. Tiện ích「Chatwork Translator」sẽ xuất hiện trong danh sách tiện ích mở rộng.

### Cài đặt cấu hình tiện ích mở rộng Chrome

8. Nhấp vào「Chi tiết (Details)」của「Chatwork Translator」.
9. Trong menu hiển thị, nhấp vào「Tùy chọn tiện ích mở rộng (Extension options)」.
10. Nhập key vào ô OpenAI API Key.（Chuẩn bị riêng.）
11. Nhập URL vào ô Firebase Database URL.（Chuẩn bị riêng.）
12. Nhấp vào「Lưu (Save)」.

Cài đặt hoàn tất.

Sau khi hoàn tất, khi truy cập Chatwork, nút「Dịch」sẽ xuất hiện trên mỗi tin nhắn. Nhấn nút này để hiển thị bản dịch.
