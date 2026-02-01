# HOTEL PLANISPHERE 標準E2Eテスト計画（性別・年齢追加反映）

## Application Overview

ホテル予約サイト（日本語UI）の主要ユーザーフロー（会員登録・ログイン・宿泊プラン選択・予約・確認・完了・マイページ）と、入力検証・エラー処理・セキュリティ・ビジュアルリグレッションを包括的に検証する。

## Test Scenarios

### 1. ホーム/ナビゲーション

**Seed:** `tests/seed.spec.ts`

#### 1.1. ホーム表示と主要コンテンツの確認（ビジュアル含む）

**File:** `tests/standard/navigation/home-visual.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で http://127.0.0.1:8080/ja/ を開く。
    - expect: ページタイトルに「HOTEL PLANISPHERE」が含まれる。
    - expect: 主要見出し（Hotel Planisphere、サイト説明）が表示される。
    - expect: 画面全体のビジュアルスナップショットが保存/比較される。
  2. お知らせの表示内容を確認する。
    - expect: お知らせの見出しと本文が表示される。

#### 1.2. グローバルナビゲーション遷移

**File:** `tests/standard/navigation/nav-links.spec.ts`

**Steps:**
  1. 新しいブラウザ状態でホームを開く。
    - expect: ナビゲーションに「ホーム」「宿泊予約」「会員登録」「ログイン」が表示される。
  2. 「宿泊予約」をクリックする。
    - expect: 宿泊プラン一覧ページに遷移する。
  3. 「会員登録」をクリックする。
    - expect: 会員登録ページに遷移する。
  4. 「ログイン」をクリックする。
    - expect: ログインページに遷移する。

#### 1.3. レスポンシブ表示（モバイル）ビジュアル

**File:** `tests/standard/navigation/home-visual-mobile.spec.ts`

**Steps:**
  1. 新しいブラウザ状態でビューポートをモバイル幅に設定しホームを開く。
    - expect: ナビゲーションと主要見出しがモバイル幅で崩れず表示される。
    - expect: 画面全体のビジュアルスナップショットが保存/比較される。

### 2. ログイン

**Seed:** `tests/seed.spec.ts`

#### 2.1. 既存ユーザでログイン成功（プレミアム会員）

**File:** `tests/standard/auth/login-premium-success.spec.ts`

**Steps:**
  1. 新しいブラウザ状態でログインページを開く。
    - expect: メール/パスワード入力欄とログインボタンが表示される。
  2. 登録済みユーザ（ichiro@example.com / password）でログインする。
    - expect: マイページに遷移する。
    - expect: 会員ランクが「プレミアム会員」と表示される。
    - expect: ナビゲーションに「ログアウト」が表示される。
    - expect: 画面全体のビジュアルスナップショットが保存/比較される。

#### 2.2. ログイン失敗（未入力/誤入力）

**File:** `tests/standard/auth/login-errors.spec.ts`

**Steps:**
  1. 新しいブラウザ状態でログインページを開く。
    - expect: フォームが表示される。
  2. メール/パスワード未入力でログインする。
    - expect: ログインに失敗し、マイページに遷移しない。
    - expect: 必須入力のバリデーションが表示される。
  3. 不正なメール形式と誤ったパスワードでログインする。
    - expect: ログインに失敗し、認証エラーが通知される。
    - expect: セッションが作成されない。

#### 2.3. アクセシビリティ：ラベル/必須/エラーの関連付け

**File:** `tests/standard/auth/login-accessibility.spec.ts`

**Steps:**
  1. 新しいブラウザ状態でログインページを開く。
    - expect: メール/パスワード入力欄にラベルが関連付けられている。
  2. 必須未入力でログインを試行する。
    - expect: エラーメッセージが入力欄と関連付けられている（視認/読み上げ可能）。

#### 2.4. セキュリティ：SQLi/XSS風入力でログイン不可

**File:** `tests/standard/security/login-injection.spec.ts`

**Steps:**
  1. 新しいブラウザ状態でログインページを開く。
    - expect: フォームが表示される。
  2. メール/パスワードにSQLi・XSS風の文字列を入力してログインする。
    - expect: ログインに失敗する。
    - expect: 画面にスクリプトが実行されない。
    - expect: エラーメッセージが安全に表示される（エスケープされている）。

### 3. 会員登録

**Seed:** `tests/seed.spec.ts`

#### 3.1. 会員登録の正常系（必須項目のみ）

**File:** `tests/standard/signup/signup-min-success.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で会員登録ページを開く。
    - expect: 必須項目が表示される。
  2. 必須項目（メール、パスワード、パスワード確認、氏名、会員種別）を入力し登録する。
    - expect: 登録成功後にマイページへ遷移する。
    - expect: 登録したメール/氏名が表示される。
    - expect: 画面全体のビジュアルスナップショットが保存/比較される。

#### 3.2. 会員登録の入力検証（必須/形式/一致）

**File:** `tests/standard/signup/signup-validation.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で会員登録ページを開く。
    - expect: フォームが表示される。
  2. 必須項目を空で登録する。
    - expect: 必須入力のバリデーションが表示される。
    - expect: 登録が完了しない。
  3. パスワードを8文字未満にする。
    - expect: パスワード要件のエラーが表示される。
  4. パスワード確認を不一致にする。
    - expect: 不一致エラーが表示される。
  5. 電話番号に11桁以外/非数字を入力する。
    - expect: 電話番号形式エラーが表示される。

#### 3.3. 入力上限・長文・改行・絵文字

**File:** `tests/standard/signup/signup-input-limits.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で会員登録ページを開く。
    - expect: フォームが表示される。
  2. 氏名・住所に最大文字数付近の長文を入力して登録する。
    - expect: バリデーションが正しく適用される（受理またはエラー）。
  3. 住所に改行や絵文字を含めて登録する。
    - expect: 入力が崩れず、表示が適切に行われる。

#### 3.4. セキュリティ：登録入力のXSS耐性

**File:** `tests/standard/security/signup-xss.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で会員登録ページを開く。
    - expect: フォームが表示される。
  2. 氏名や住所にスクリプト文字列を入力して登録する。
    - expect: 登録自体はバリデーションに従う。
    - expect: マイページ表示でスクリプトが実行されず、文字列がエスケープされて表示される。

#### 3.5. 【追加】性別・年齢の表示/入力（任意項目）

**File:** `tests/standard/signup/signup-gender-age.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で会員登録ページを開く。
    - expect: 【追加】性別のセレクトが表示され、初期値が「未回答」である。
    - expect: 【追加】年齢の入力欄が表示される。
  2. 性別を「女性」に変更し、年齢に数値を入力して登録する。
    - expect: 登録成功後にマイページへ遷移する。
    - expect: 【追加】マイページに性別と年齢が表示される。
  3. 性別・年齢を未入力のまま必須項目のみで登録する。
    - expect: 登録が完了し、【追加】性別は「未回答」、年齢は「未登録」と表示される。

### 4. 宿泊プラン一覧

**Seed:** `tests/seed.spec.ts`

#### 4.1. ゲストでプラン一覧表示と遷移

**File:** `tests/standard/plans/plans-guest.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で宿泊プラン一覧を開く。
    - expect: プラン一覧が表示される。
    - expect: おすすめプランが表示される。
    - expect: 画面全体のビジュアルスナップショットが保存/比較される。
  2. 任意の「このプランで予約」をクリックする。
    - expect: 宿泊予約画面が新しいタブ/ウィンドウで開く。

#### 4.2. レイアウト耐性（長文/エラー表示時）

**File:** `tests/standard/plans/plans-layout-resilience.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で宿泊プラン一覧を開く。
    - expect: プランカードのレイアウトが崩れていない。
    - expect: 画面全体のビジュアルスナップショットが保存/比較される。

#### 4.3. 会員ランクによるプラン表示差分

**File:** `tests/standard/plans/plans-member-variants.spec.ts`

**Steps:**
  1. 一般会員でログインし宿泊プラン一覧を開く。
    - expect: 一般会員向けのプランが表示される。
  2. プレミアム会員でログインし宿泊プラン一覧を開く。
    - expect: プレミアム会員向けのプランが表示される。

### 5. 宿泊予約

**Seed:** `tests/seed.spec.ts`

#### 5.1. 予約フォーム基本操作と料金計算

**File:** `tests/standard/reservation/reserve-price-calculation.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で任意プランの予約画面を開く。
    - expect: 宿泊日/宿泊数/人数/追加プラン/氏名/連絡方法が表示される。
    - expect: 合計金額が初期値で表示される。
    - expect: 画面全体のビジュアルスナップショットが保存/比較される。
  2. 宿泊数・人数・追加プランを変更する。
    - expect: 合計金額が入力に応じて更新される。
  3. 土日を含む日付に変更する。
    - expect: 週末料金の加算が反映される。

#### 5.2. 料金計算の境界値（人数/泊数の最小・最大）

**File:** `tests/standard/reservation/reserve-price-boundaries.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で任意プランの予約画面を開く。
    - expect: 初期合計金額が表示される。
  2. 人数・宿泊数を最小値に設定する。
    - expect: 合計金額が最小条件に一致する。
  3. 人数・宿泊数を最大値に設定する。
    - expect: 合計金額が最大条件に一致する。

#### 5.3. 連打・二重送信防止

**File:** `tests/standard/reservation/reserve-double-submit.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で予約フォームを有効な値で入力する。
    - expect: 確認ボタンが表示される。
  2. 「予約内容を確認する」を連打する。
    - expect: 確認画面への遷移が一度だけ行われる。

#### 5.4. 予約フォームの必須・範囲エラー

**File:** `tests/standard/reservation/reserve-validation.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で予約画面を開く。
    - expect: フォームが表示される。
  2. 氏名未入力・連絡方法未選択で「予約内容を確認する」を押す。
    - expect: 必須入力のエラーが表示され、確認画面に進まない。
  3. 宿泊日を許容範囲外（3ヶ月超、過去日）に設定する。
    - expect: 日付に関するバリデーションが表示される。
  4. 宿泊数・人数を許容範囲外の最小/最大に設定する。
    - expect: 範囲外エラーが表示される、または制限される。

#### 5.5. 連絡方法による入力切替

**File:** `tests/standard/reservation/reserve-contact-method.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で予約画面を開く。
    - expect: 連絡方法のセレクトが表示される。
  2. 「メールでのご連絡」を選択する。
    - expect: メールアドレス入力欄が表示され必須になる。
  3. 「電話でのご連絡」を選択する。
    - expect: 電話番号入力欄が表示され必須になる。

#### 5.6. 【追加】性別・年齢の表示/入力（任意項目）

**File:** `tests/standard/reservation/reserve-gender-age.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で任意プランの予約画面を開く。
    - expect: 【追加】性別のセレクトが表示され、初期値が「未回答」である。
    - expect: 【追加】年齢の入力欄が表示される。
  2. 性別と年齢を入力し「予約内容を確認する」を押す。
    - expect: 【追加】確認画面に性別・年齢の入力内容が表示される（表示項目がある場合）。
  3. 性別・年齢を未入力のまま有効な値で予約確認へ進む。
    - expect: 予約確認へ進める（任意項目として扱われる）。

#### 5.7. 【追加】年齢入力の境界/形式

**File:** `tests/standard/reservation/reserve-age-validation.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で任意プランの予約画面を開く。
    - expect: 【追加】年齢入力欄が表示される。
  2. 年齢に負数、極端に大きい数値、または小数を入力する。
    - expect: 【追加】許容されない値はエラー表示または入力制限が働く。
  3. 年齢に空/0/最小許容値を入力して確認へ進む。
    - expect: 【追加】仕様に従って受理またはエラー表示される。

### 6. 予約確認/完了

**Seed:** `tests/seed.spec.ts`

#### 6.1. 予約確認画面の表示と完了ダイアログ

**File:** `tests/standard/reservation/confirm-and-complete.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で予約フォームを有効な値で入力し確認画面へ進む。
    - expect: 入力内容が確認画面に反映される。
    - expect: 合計金額と期間/人数/追加プランが表示される。
    - expect: 画面全体のビジュアルスナップショットが保存/比較される。
  2. 「この内容で予約する」を押す。
    - expect: 完了ダイアログが表示される。
  3. ダイアログを閉じる。
    - expect: 確認画面に戻る、または完了状態が維持される。

#### 6.2. 予約完了後の再読込/戻る挙動

**File:** `tests/standard/reservation/confirm-post-complete.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で予約フォームを有効な値で入力し完了まで進める。
    - expect: 完了ダイアログが表示される。
  2. 完了後にページを再読み込みする。
    - expect: 予約が二重に作成されたり、エラー状態にならない。
  3. ブラウザの戻る操作を行う。
    - expect: 不整合な状態にならない（再送信や二重予約が発生しない）。

#### 6.3. セキュリティ：不正な直接アクセスの防止

**File:** `tests/standard/security/direct-access.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で mypage.html に直接アクセスする。
    - expect: ログインページへリダイレクトされる、またはアクセス拒否が表示される。
  2. 予約データなしで confirm.html に直接アクセスする。
    - expect: 予約情報が表示されない/エラー表示/予約画面へ誘導される。
  3. reserve.html の plan-id を不正な値に改ざんしてアクセスする。
    - expect: 安全なフォールバックが行われる（エラー表示/既定プランへ誘導/予約不可）。

#### 6.4. セキュリティ：plan-id の異常値バリエーション

**File:** `tests/standard/security/plan-id-fuzz.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で reserve.html に plan-id を負数で指定してアクセスする。
    - expect: 例外やクラッシュが発生せず安全に扱われる。
  2. plan-id を極端に大きい数値で指定してアクセスする。
    - expect: エラー表示または既定プランへのフォールバックが行われる。
  3. plan-id を文字列で指定してアクセスする。
    - expect: 入力が無害化され、安全な画面に遷移する。

### 7. マイページ/ログアウト

**Seed:** `tests/seed.spec.ts`

#### 7.1. ログアウトでセッション破棄

**File:** `tests/standard/mypage/logout.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で既存ユーザでログインする。
    - expect: マイページが表示される。
  2. 「ログアウト」を押す。
    - expect: ホームまたはログイン画面へ遷移する。
    - expect: 再度 mypage.html に直接アクセスすると未ログイン扱いになる。

#### 7.2. ログアウト後のストレージ消去

**File:** `tests/standard/mypage/logout-storage-clear.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で既存ユーザでログインする。
    - expect: マイページが表示される。
  2. ログアウトを実行する。
    - expect: Cookie/SessionStorage/LocalStorage のログイン情報が削除される。

#### 7.3. 新規登録ユーザのマイページ機能

**File:** `tests/standard/mypage/mypage-new-user.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で会員登録しマイページへ遷移する。
    - expect: 登録情報が表示される。
    - expect: アイコン設定や退会の操作が有効になる。
  2. アイコン設定で画像を設定する。
    - expect: マイページにアイコンが表示される。
  3. 退会操作を実行する。
    - expect: ユーザ情報が削除され、ログインできなくなる。

#### 7.4. 【追加】マイページの性別・年齢表示

**File:** `tests/standard/mypage/mypage-gender-age.spec.ts`

**Steps:**
  1. 新しいブラウザ状態で既存ユーザでログインする。
    - expect: 【追加】マイページに性別が表示される。
    - expect: 【追加】年齢が未登録の場合「未登録」と表示される。
  2. 新規会員登録時に性別・年齢を入力してログインする。
    - expect: 【追加】マイページに入力した性別・年齢が表示される。
