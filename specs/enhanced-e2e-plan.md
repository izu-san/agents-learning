# HOTEL PLANISPHERE 追加E2Eテスト計画

## Application Overview

Hotel Planisphere（ホテル予約サイト）の既存テストを補完する追加テストケース。ユーザビリティ、パフォーマンス、エラーリカバリー、ブラウザ間互換性、国際化対応、キーボード操作、セッション管理など、既存テストでカバーされていない観点を重点的にテストします。

## Test Scenarios

### 1. ユーザビリティとアクセシビリティ

**Seed:** `tests/seed.spec.ts`

#### 1.1. キーボードナビゲーション - フォーム操作

**File:** `tests/enhanced/usability/keyboard-navigation.spec.ts`

**Steps:**
  1. 会員登録ページを開く。
    - expect: 会員登録フォームが表示される。
  2. Tabキーを使用して、すべての入力フィールドを順番に移動する。
    - expect: フォーカスが論理的な順序（メール→パスワード→パスワード確認→氏名...）で移動する。
    - expect: フォーカスインジケーターが視覚的に明確に表示される。
  3. 各入力フィールドに値を入力し、Enterキーで送信する。
    - expect: Enterキーでフォームが送信される。
    - expect: 必須項目が未入力の場合はバリデーションが表示される。
  4. ラジオボタン（会員種別）をキーボードの矢印キーで選択する。
    - expect: 矢印キーでラジオボタンが選択できる。

#### 1.2. キーボードナビゲーション - 予約完了ダイアログ

**File:** `tests/enhanced/usability/keyboard-dialog.spec.ts`

**Steps:**
  1. 予約フォームに有効な値を入力し、予約を完了させてダイアログを表示する。
    - expect: 予約完了ダイアログが表示される。
  2. Escキーを押す。
    - expect: ダイアログが閉じる。
  3. 再度予約を完了させ、Tabキーでフォーカスを移動する。
    - expect: フォーカスがダイアログ内の要素（閉じるボタン）にトラップされる。
    - expect: ダイアログ外の要素にフォーカスが移動しない。
  4. Enterキーで閉じるボタンを押す。
    - expect: ダイアログが閉じる。

#### 1.3. スクリーンリーダー対応 - ARIAラベルとロール

**File:** `tests/enhanced/usability/screen-reader-support.spec.ts`

**Steps:**
  1. 会員登録ページを開く。
    - expect: すべての入力フィールドに適切なaria-labelまたはlabelタグが関連付けられている。
    - expect: 必須項目にaria-required='true'が設定されている。
  2. ログインページを開き、エラーを発生させる。
    - expect: エラーメッセージにaria-live='polite'または'assertive'が設定されている。
    - expect: エラーメッセージが入力フィールドとaria-describedbyで関連付けられている。
  3. 予約完了ダイアログを表示する。
    - expect: ダイアログにrole='dialog'が設定されている。
    - expect: ダイアログにaria-labelまたはaria-labelledbyが設定されている。
    - expect: フォーカスがダイアログ内にトラップされている。

#### 1.4. フォームエラーの視認性とリカバリー

**File:** `tests/enhanced/usability/error-visibility.spec.ts`

**Steps:**
  1. 会員登録ページで必須項目を未入力にして送信する。
    - expect: 各必須項目の近くにエラーメッセージが表示される。
    - expect: エラーメッセージが赤色などの視覚的に目立つ色で表示される。
    - expect: 最初のエラーフィールドにフォーカスが移動する。
  2. エラーフィールドに有効な値を入力する。
    - expect: エラーメッセージがリアルタイムまたは次の送信時に消える。
    - expect: 入力フィールドの状態が正常に戻る。

#### 1.5. レスポンシブデザイン - タブレットビューポート

**File:** `tests/enhanced/usability/responsive-tablet.spec.ts`

**Steps:**
  1. ビューポートをタブレットサイズ（768x1024）に設定してホームページを開く。
    - expect: ナビゲーションメニューが適切に表示される。
    - expect: コンテンツが横スクロールせずに表示される。
    - expect: ボタンやリンクがタッチ操作に適したサイズで表示される（最小44x44px）。
  2. 宿泊プラン一覧をタブレットビューポートで表示する。
    - expect: プランカードが適切にグリッド表示される。
    - expect: レイアウトが崩れない。

#### 1.6. レスポンシブデザイン - 小型モバイルビューポート

**File:** `tests/enhanced/usability/responsive-small-mobile.spec.ts`

**Steps:**
  1. ビューポートを小型モバイルサイズ（320x568）に設定してホームページを開く。
    - expect: ナビゲーションメニューがハンバーガーメニューまたは縦積みで表示される。
    - expect: すべてのコンテンツが画面内に収まり、横スクロールが不要。
    - expect: フォントサイズが読みやすい大きさで表示される。
  2. 予約フォームを小型モバイルビューポートで表示する。
    - expect: 入力フィールドが縦に積まれて表示される。
    - expect: ボタンが画面幅いっぱいに広がり、タップしやすい。

### 2. パフォーマンスと読み込み

**Seed:** `tests/seed.spec.ts`

#### 2.1. ページ読み込み時間 - 主要ページ

**File:** `tests/enhanced/performance/page-load-time.spec.ts`

**Steps:**
  1. ネットワーク速度を3G（遅い）に設定して、ホームページを開く。
    - expect: ページが10秒以内に完全に読み込まれる。
    - expect: 主要コンテンツ（ヒーローイメージ、ナビゲーション）が3秒以内に表示される。
  2. 宿泊プラン一覧を3G速度で開く。
    - expect: プランカードが順次読み込まれる。
    - expect: ローディングインジケーターまたはスケルトンスクリーンが表示される。

#### 2.2. 画像の遅延読み込み

**File:** `tests/enhanced/performance/lazy-loading.spec.ts`

**Steps:**
  1. 宿泊プラン一覧ページを開き、ネットワークリクエストを監視する。
    - expect: スクロールせずに表示される範囲の画像のみが最初に読み込まれる。
    - expect: スクロールして下部のプランを表示すると、その画像が読み込まれる。

#### 2.3. 大量データでのパフォーマンス - プラン一覧

**File:** `tests/enhanced/performance/large-data-plans.spec.ts`

**Steps:**
  1. プレミアム会員でログインして、すべてのプラン（最大数）を表示する。
    - expect: ページが5秒以内にレンダリングされる。
    - expect: スクロールが滑らかで、フリーズやラグが発生しない。

### 3. セッション管理とステート管理

**Seed:** `tests/seed.spec.ts`

#### 3.1. セッションタイムアウト

**File:** `tests/enhanced/session/session-timeout.spec.ts`

**Steps:**
  1. ログインして、長時間（例：30分）待機する。
    - expect: セッションがタイムアウトする。
    - expect: マイページや認証が必要なページにアクセスすると、ログインページにリダイレクトされる。

#### 3.2. 複数タブでのログイン状態の同期

**File:** `tests/enhanced/session/multi-tab-sync.spec.ts`

**Steps:**
  1. タブ1でログインする。
    - expect: マイページが表示される。
  2. タブ2を開いて、同じサイトのホームページを表示する。
    - expect: タブ2でもログイン状態が反映される。
    - expect: ナビゲーションに「ログアウト」が表示される。
  3. タブ1でログアウトする。
    - expect: タブ1がログアウト状態になる。
    - expect: タブ2を再読み込みまたはナビゲーションすると、ログアウト状態が反映される。

#### 3.3. ブラウザの戻る/進むボタンでのステート保持

**File:** `tests/enhanced/session/browser-history.spec.ts`

**Steps:**
  1. 宿泊予約フォームに値を入力する（宿泊日、人数、氏名など）。
    - expect: 入力値がフォームに反映される。
  2. プラン一覧ページに戻る。
    - expect: プラン一覧が表示される。
  3. ブラウザの「進む」ボタンで予約フォームに戻る。
    - expect: 以前入力した値がフォームに保持されている。
    - expect: または、フォームがリセットされている（仕様による）。

#### 3.4. localStorage/sessionStorageの整合性

**File:** `tests/enhanced/session/storage-consistency.spec.ts`

**Steps:**
  1. ログインして、localStorageとsessionStorageの内容を確認する。
    - expect: ログイン情報が適切にストレージに保存されている。
    - expect: 機密情報（パスワード）が平文で保存されていない。
  2. ログアウトして、再度ストレージを確認する。
    - expect: ログイン関連の情報がlocalStorageとsessionStorageから削除されている。

### 4. エラーハンドリングとリカバリー

**Seed:** `tests/seed.spec.ts`

#### 4.1. ネットワークエラー時の挙動

**File:** `tests/enhanced/error-handling/network-error.spec.ts`

**Steps:**
  1. ログインフォームを表示し、ネットワークをオフラインにする。
    - expect: ページがまだ表示されている（キャッシュによる）。
  2. オフライン状態でログインを試みる。
    - expect: ネットワークエラーのメッセージが表示される。
    - expect: または、リトライボタンが表示される。
    - expect: ページがクラッシュしない。
  3. ネットワークをオンラインに戻し、リトライする。
    - expect: ログインが成功する。
    - expect: マイページに遷移する。

#### 4.2. サーバーエラー（5xx）時の表示

**File:** `tests/enhanced/error-handling/server-error.spec.ts`

**Steps:**
  1. ログインAPIが500エラーを返すようにモックする。
    - expect: （注：実際のテストではAPIモックまたはテストサーバーが必要）
  2. ログインを試みる。
    - expect: サーバーエラーのメッセージが表示される。
    - expect: エラーメッセージがユーザーフレンドリーである。
    - expect: 技術的なエラー詳細が一般ユーザーに表示されない。

#### 4.3. 予期しないデータ形式への対応

**File:** `tests/enhanced/error-handling/invalid-data.spec.ts`

**Steps:**
  1. 予約フォームで、日付フィールドに不正な形式（例：'abc'）を直接設定する。
    - expect: バリデーションエラーが表示される。
    - expect: または、入力が無効化される。
    - expect: アプリケーションがクラッシュしない。
  2. 料金計算APIが不正なデータを返す場合をシミュレートする。
    - expect: エラーメッセージが表示される。
    - expect: または、デフォルト値が使用される。
    - expect: ページが白紙にならない。

#### 4.4. JavaScriptエラー時のフォールバック

**File:** `tests/enhanced/error-handling/js-error-fallback.spec.ts`

**Steps:**
  1. ページを開き、意図的にJavaScriptエラーを発生させる（コンソールでエラーを投げる）。
    - expect: ページの他の部分が動作し続ける（エラーが伝播しない）。
    - expect: エラーがコンソールに記録される。

### 5. ブラウザ間互換性

**Seed:** `tests/seed.spec.ts`

#### 5.1. Firefox固有の動作確認

**File:** `tests/enhanced/browser-compat/firefox-specific.spec.ts`

**Steps:**
  1. Firefoxブラウザで会員登録フォームを開く。
    - expect: すべての入力フィールドが正しく表示される。
    - expect: CSSスタイルが正しく適用される。
  2. 日付ピッカーを使用して宿泊日を選択する。
    - expect: Firefoxのネイティブ日付ピッカーが正しく動作する。
    - expect: 選択した日付がフォームに反映される。

#### 5.2. Safari固有の動作確認

**File:** `tests/enhanced/browser-compat/safari-specific.spec.ts`

**Steps:**
  1. Safari（WebKit）ブラウザで予約フォームを開く。
    - expect: フォームが正しく表示される。
    - expect: Safariのオートフィル機能が正しく動作する。
  2. 料金計算の動的更新を確認する。
    - expect: 人数や宿泊数を変更すると、料金がリアルタイムで更新される。
    - expect: Safariでのイベントハンドリングが正しく動作する。

#### 5.3. Edge固有の動作確認

**File:** `tests/enhanced/browser-compat/edge-specific.spec.ts`

**Steps:**
  1. Microsoft Edgeブラウザでホームページを開く。
    - expect: ページが正しく表示される。
    - expect: Edgeの読み取りモードが利用可能（該当する場合）。
  2. ログインして、マイページを表示する。
    - expect: すべての機能が正しく動作する。
    - expect: Edgeのパスワード保存機能が正しく動作する。

### 6. 国際化とローカライゼーション

**Seed:** `tests/seed.spec.ts`

#### 6.1. 日付フォーマットの表示

**File:** `tests/enhanced/i18n/date-format.spec.ts`

**Steps:**
  1. 予約フォームを開き、日付を選択する。
    - expect: 日付が日本のフォーマット（YYYY/MM/DD）で表示される。
    - expect: 確認画面でも同じフォーマットで表示される。

#### 6.2. 通貨フォーマットの表示

**File:** `tests/enhanced/i18n/currency-format.spec.ts`

**Steps:**
  1. 予約フォームで料金を確認する。
    - expect: 料金が日本円のフォーマット（例：10,000円）で表示される。
    - expect: 3桁ごとにカンマが入る。
    - expect: 通貨記号「円」が表示される。

#### 6.3. 多言語切り替え（該当する場合）

**File:** `tests/enhanced/i18n/language-switch.spec.ts`

**Steps:**
  1. ホームページを開き、言語切り替えオプションがあるか確認する。
    - expect: 言語切り替えボタンまたはドロップダウンが表示される（該当する場合）。
  2. 英語に切り替える（該当する場合）。
    - expect: すべてのテキストが英語に切り替わる。
    - expect: 日付や通貨のフォーマットが英語圏のものに変わる（該当する場合）。

### 7. データ永続性とクッキー管理

**Seed:** `tests/seed.spec.ts`

#### 7.1. クッキー同意バナーの表示と保存

**File:** `tests/enhanced/data/cookie-consent.spec.ts`

**Steps:**
  1. 初回訪問時にホームページを開く。
    - expect: クッキー同意バナーが表示される（該当する場合）。
  2. 「同意する」ボタンをクリックする。
    - expect: バナーが非表示になる。
    - expect: 同意の情報がクッキーに保存される。
  3. ページを再読み込みする。
    - expect: クッキー同意バナーが再表示されない。

#### 7.2. 「ログイン状態を保持」機能

**File:** `tests/enhanced/data/remember-me.spec.ts`

**Steps:**
  1. ログインページで「ログイン状態を保持」オプションをチェックしてログインする（該当する場合）。
    - expect: ログインに成功する。
    - expect: 永続的なクッキーが設定される。
  2. ブラウザを閉じて、再度開いてサイトにアクセスする。
    - expect: ログイン状態が保持されている。
    - expect: マイページに直接アクセスできる。

#### 7.3. フォームの自動保存とリストア

**File:** `tests/enhanced/data/form-autosave.spec.ts`

**Steps:**
  1. 会員登録フォームに部分的に入力する（メール、パスワードのみ）。
    - expect: 入力値がフォームに表示される。
  2. ページを再読み込みする。
    - expect: 入力値が保持されている（localStorageによる自動保存がある場合）。
    - expect: または、入力値がクリアされる（仕様による）。

### 8. 統合テストとエンドツーエンドフロー

**Seed:** `tests/seed.spec.ts`

#### 8.1. 完全な予約フロー - ゲストユーザー

**File:** `tests/enhanced/e2e/complete-booking-guest.spec.ts`

**Steps:**
  1. ホームページを開く。
    - expect: ホームページが表示される。
  2. 「宿泊予約」リンクをクリックして、プラン一覧を表示する。
    - expect: プラン一覧が表示される。
  3. 任意のプランの「このプランで予約」をクリックする。
    - expect: 予約フォームが表示される。
  4. すべての必須項目を入力し、「予約内容を確認する」をクリックする。
    - expect: 予約確認画面が表示される。
    - expect: 入力内容が正しく表示される。
  5. 「この内容で予約する」をクリックする。
    - expect: 予約完了ダイアログが表示される。
  6. ダイアログを閉じる。
    - expect: ダイアログが閉じる。
    - expect: 予約が完了した状態になる。

#### 8.2. 完全な会員登録からログインまでのフロー

**File:** `tests/enhanced/e2e/signup-to-login-flow.spec.ts`

**Steps:**
  1. ホームページを開く。
    - expect: ホームページが表示される。
  2. 「会員登録」リンクをクリックする。
    - expect: 会員登録ページが表示される。
  3. すべての必須項目（メール、パスワード、氏名、会員種別）を入力し、登録する。
    - expect: 登録が成功し、マイページに遷移する。
    - expect: 登録情報が表示される。
  4. 「ログアウト」をクリックする。
    - expect: ログアウトし、ホームページに戻る。
  5. 「ログイン」リンクをクリックし、登録したメール/パスワードでログインする。
    - expect: ログインに成功し、マイページが表示される。

#### 8.3. プレミアム会員の完全な予約フロー

**File:** `tests/enhanced/e2e/premium-member-booking.spec.ts`

**Steps:**
  1. プレミアム会員でログインする。
    - expect: マイページが表示される。
    - expect: 会員ランクが「プレミアム会員」と表示される。
  2. 「宿泊予約」リンクをクリックする。
    - expect: プラン一覧が表示される。
    - expect: プレミアム会員限定プランが表示される。
  3. プレミアム会員限定プランの「このプランで予約」をクリックする。
    - expect: 予約フォームが表示される。
  4. 予約フォームに入力し、予約を完了する。
    - expect: 予約確認画面が表示される。
    - expect: 予約完了ダイアログが表示される。

### 9. セキュリティとプライバシー

**Seed:** `tests/seed.spec.ts`

#### 9.1. パスワード表示/非表示の切り替え

**File:** `tests/enhanced/security/password-visibility-toggle.spec.ts`

**Steps:**
  1. ログインページを開き、パスワードフィールドを確認する。
    - expect: パスワードが*****で隠されている。
    - expect: パスワード表示/非表示の切り替えボタンがある（該当する場合）。
  2. パスワード表示ボタンをクリックする（該当する場合）。
    - expect: パスワードが平文で表示される。
  3. 再度ボタンをクリックする。
    - expect: パスワードが再び隠される。

#### 9.2. HTTPS接続の確認

**File:** `tests/enhanced/security/https-connection.spec.ts`

**Steps:**
  1. ホームページを開き、URLを確認する。
    - expect: URLがhttps://で始まる（本番環境の場合）。
    - expect: ブラウザのアドレスバーに鍵アイコンが表示される（本番環境の場合）。

#### 9.3. CSRFトークンの存在確認

**File:** `tests/enhanced/security/csrf-token.spec.ts`

**Steps:**
  1. 会員登録フォームを開き、HTMLソースを確認する。
    - expect: フォームに隠しフィールドとしてCSRFトークンが含まれている（該当する場合）。

#### 9.4. 個人情報の安全な送信

**File:** `tests/enhanced/security/secure-data-transmission.spec.ts`

**Steps:**
  1. 会員登録フォームに個人情報を入力し、送信する。
    - expect: データがHTTPS経由で送信される（本番環境の場合）。
    - expect: ネットワークタブで、リクエストが暗号化されていることを確認する。
