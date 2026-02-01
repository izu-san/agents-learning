Feature: 宿泊プラン一覧

  @plans @visual @smoke
  Scenario: ゲストでプラン一覧表示と遷移
    Given 新しいブラウザ状態で宿泊プラン一覧を開く
    Then プラン一覧とおすすめプランが表示される
    And 画面全体のビジュアルスナップショットを保存・比較する
    When 任意の「このプランで予約」をクリックする
    Then 宿泊予約画面が新しいタブで開く

  @plans @regression
  Scenario: 会員ランクによるプラン表示差分
    Given 一般会員でログインし宿泊プラン一覧を開く
    Then 一般会員向けのプランが表示される
    Given プレミアム会員でログインし宿泊プラン一覧を開く
    Then プレミアム会員向けのプランが表示される

  @plans @visual @regression
  Scenario: レイアウト耐性（長文/エラー表示時）
    Given 新しいブラウザ状態で宿泊プラン一覧を開く
    Then プランカードのレイアウトが崩れていない
    And 画面全体のビジュアルスナップショットを保存・比較する
