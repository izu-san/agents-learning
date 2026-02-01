Feature: マイページ/ログアウト

  Scenario: ログアウトでセッション破棄
    Given 新しいブラウザ状態で既存ユーザでログインする
    When 「ログアウト」を押す
    Then ホームまたはログイン画面へ遷移する
    And 再度 mypage.html に直接アクセスすると未ログイン扱いになる

  Scenario: ログアウト後のストレージ消去
    Given 新しいブラウザ状態で既存ユーザでログインする
    When ログアウトを実行する
    Then Cookie・SessionStorage・LocalStorage のログイン情報が削除される

  Scenario: 新規登録ユーザのマイページ機能
    Given 新しいブラウザ状態で会員登録しマイページへ遷移する
    Then 登録情報が表示される
    And アイコン設定や退会の操作が有効になる
    When アイコン設定で画像を設定する
    Then マイページにアイコンが表示される
    When 退会操作を実行する
    Then ユーザ情報が削除されログインできなくなる
