Feature: セキュリティ

  Scenario: SQLi/XSS風入力でログイン不可
    Given 新しいブラウザ状態でログインページを開く
    When メールとパスワードにSQLi・XSS風の文字列を入力してログインする
    Then ログインに失敗する
    And 画面にスクリプトが実行されない
    And エラーメッセージが安全に表示される

  Scenario: 登録入力のXSS耐性
    Given 新しいブラウザ状態で会員登録ページを開く
    When 氏名や住所にスクリプト文字列を入力して登録する
    Then マイページで文字列が安全に表示される

  Scenario: 不正な直接アクセスの防止
    Given 新しいブラウザ状態で mypage.html に直接アクセスする
    Then ログインページへリダイレクトされるかアクセス拒否が表示される
    Given 予約データなしで confirm.html に直接アクセスする
    Then 予約情報が表示されないか予約画面へ誘導される
    Given reserve.html の plan-id を不正な値に改ざんしてアクセスする
    Then 安全なフォールバックが行われる

  Scenario: plan-id の異常値バリエーション
    Given 新しいブラウザ状態で reserve.html に plan-id を負数で指定してアクセスする
    Then 例外やクラッシュが発生せず安全に扱われる
    Given 新しいブラウザ状態で reserve.html に plan-id を極端に大きい数値で指定してアクセスする
    Then エラー表示または既定プランへのフォールバックが行われる
    Given 新しいブラウザ状態で reserve.html に plan-id を文字列で指定してアクセスする
    Then 入力が無害化され安全な画面に遷移する
