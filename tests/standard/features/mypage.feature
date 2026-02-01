Feature: マイページ/ログアウト

	@mypage @smoke
	Scenario: ログアウトでセッション破棄
		Given 新しいブラウザ状態で既存ユーザでログインする
		When 「ログアウト」を押す
		Then ホームまたはログイン画面へ遷移する
		And 再度 mypage.html に直接アクセスすると未ログイン扱いになる

	@mypage @storage
	Scenario: ログアウト後のストレージ消去
		Given 新しいブラウザ状態で既存ユーザでログインする
		When ログアウトを実行する
		Then Cookie・SessionStorage・LocalStorage のログイン情報が削除される

	@mypage
	Scenario: 新規登録ユーザのマイページ機能
		Given 新しいブラウザ状態で会員登録しマイページへ遷移する
		Then 登録情報が表示される
		And アイコン設定や退会の操作が有効になる
		When アイコン設定で画像を設定する
		Then マイページにアイコンが表示される
		When 退会操作を実行する
		Then ユーザ情報が削除されログインできなくなる

	@mypage @new-field
	Scenario: 【追加】マイページの性別と年齢表示
		Given 新しいブラウザ状態で既存ユーザでログインする
		Then 【追加】マイページに性別が表示される
		And 【追加】年齢が未登録の場合「未登録」と表示される
		When 【追加】新規会員登録時に性別と年齢を入力してログインする
		Then 【追加】マイページに入力した性別と年齢が表示される
