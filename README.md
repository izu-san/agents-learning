# Playwright Agents 学習用りぽじとり

## 免責事項

個人で調査した内容を記載しているので間違いが含まれている可能性があります。  
実運用に乗せる場合は改めて技術調査をすべきです。

## 実行環境

2026/02/03 時点の最新データです。

### 共通

- OS: Windows11 Home 24H2
- Node.js: v22.20.0

### VSCode

- VSCode: 1.108.1
- AIツール: GitHub Copilot Pro
- モデル: GPT-5.2-Codex

### Claude Code

- バージョン: 2.1.29
- モデル: Claude Haiku 4.5 with AWS Bedrock
  - 従量課金なので安めのモデルにしている

## 環境構築

### 前提条件

- VSCodeインストール済み
- Node.jsインストール済み
- 機密データは入力できない想定（公開情報のみ対象とする）
  - 機密データを取り扱いたいときはどうする？ → [docs/security/セキュリティ対応.md](docs/security/セキュリティ対応.md)

```
PS F:\Study\playwright\agents-learning> node -v
v22.20.0
PS F:\Study\playwright\agents-learning> npm -v
11.6.2
```

### インストール

```
npm init playwright@latest
npx playwright init-agents --loop=vscode
```

```
PS F:\Study\playwright\agents-learning> npx playwright --version
Version 1.58.1
```

## テスト対象

Hotel Planisphereをローカルにforkしたやつ  
https://github.com/izu-san/hotel-example-site

アクセス先: http://127.0.0.1:8080/ja/

forkしたやつを対象にした理由：サイト内容を変更してHealerの実行結果を確かめたかったから

---

## 実行結果まとめ

### 最低限の指示のみ（minimal）

テスト内容やテストコードの生成方法もすべて丸投げ。  
何も指示を出していない場合。

- オーバービュー: [docs/minimal/overview.md](docs/minimal/overview.md)
- チャット内容: [docs/minimal/チャット内容.md](docs/minimal/チャット内容.md)
- Planner成果物: [specs/minimal/e2e-plan.md](specs/minimal/e2e-plan.md)
- Generator成果物: [tests/minimal/\*.ts](tests/minimal)

### 色々指示だしたやつ（standard）

POM, BDD, Gherkin記法で出力させたやつ。

- オーバービュー: [docs/standard/overview.md](docs/standard/overview.md)
- チャット内容: [docs/standard/チャット内容.md](docs/standard/チャット内容.md)
- Planner成果物: [specs/standard/e2e-plan.md](specs/standard/e2e-plan.md)
- Generator成果物: [tests/standard/\*.ts](tests/standard)

### Healerおためし

- チャット内容: [docs/healer/チャット内容.md](docs/healer/チャット内容.md)

### テスト項目の追加

- チャット内容: [docs/add_test/チャット内容.md](docs/add_test/チャット内容.md)
- Planner成果物: [specs/standard/e2e-plan.md](specs/standard/e2e-plan.md)
- Generator成果物: [tests/standard/\*.ts](tests/standard)

### 技術スタックをガチガチに固めてから指示出し

- 追加予定です
  - 観点をガッツリ洗い出してからPlannerに指示
  - 使用する技術スタックやコードサンプルなどをガッツリ洗い出してからGeneratorに指示

## minimalとstandardの違いについての考察

- 説明資料: [docs/minimal-standard-diff.md](docs/minimal-standard-diff.md)

## `playwright-cli`使ってみた

- 説明資料: [docs/cli/playwright-cli.md](docs/cli/playwright-cli.md)

---

## ディレクトリ構成（簡易）

- [docs/](docs/) : 生成物や補足ドキュメント
- [specs/](specs/) : Planner のテスト計画（最小/標準）
- [tests/](tests/) : 実装されたテストコード
  - [tests/minimal/](tests/minimal/) : 素のPlaywrightテスト一式
  - [tests/standard/](tests/standard/) : BDD + POM + データ駆動構成
    - [tests/standard/features/](tests/standard/features/) : Gherkinシナリオ
    - [tests/standard/steps/](tests/standard/steps/) : Step定義
    - [tests/standard/pages/](tests/standard/pages/) : Page Object
    - [tests/standard/data/](tests/standard/data/) : テストデータ
    - [tests/standard/fixtures/](tests/standard/fixtures/) : フィクスチャ/共通設定

## スクリプト一覧（参考程度に）

以下は `package.json` に定義されているスクリプトの一覧です。  
ローカルでサイトを立ち上げないと失敗する。

### Minimal テスト用

- `npm run test:minimal` : Minimal テストを実行します。

### Standard テスト用

- `npm run bddgen:standard` : Standard テストの BDD ファイルを生成します。
- `npm run test:standard` : Standard テストを実行します。
- `npm run test:standard:vrt` : ビジュアルリグレッションテストのベースラインを更新します。
- `npm run test:standard:all` : BDD ファイル生成後に Standard テストを実行します。

---

## 変更履歴

- 2026/02/03:
  - 「変更履歴」セクションを追加
  - 「`playwright-cli`使ってみた」セクションを追加
- 2026/02/02: 
  - 初版作成
