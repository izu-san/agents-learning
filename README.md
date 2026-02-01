# Playwright Agents 学習用りぽじとり

## 実行環境

- OS: Windows11 Home 24H2
- VSCode: 1.108.1
- Node.js: v22.20.0
- AIツール: GitHub Copilot
- モデル: GPT-5.2-Codex

## 環境構築

### 前提条件

- VSCodeインストール済み
- Node.jsインストール済み

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

## テスト対象

Hotel Planisphereをローカルにforkしたやつ  
https://github.com/izu-san/hotel-example-site

アクセス先: http://127.0.0.1:8080/ja/

forkしたやつを対象にした理由：サイト内容を変更してHealerの実行結果を確かめたかったから

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

### minimalとstandardの違いについて

- 説明資料: [docs/minimal-standard-diff.md](docs/minimal-standard-diff.md)

### Healerおためし

- チャット内容: [docs/healer/チャット内容.md](docs/healer/チャット内容.md)

### テスト項目の追加

- チャット内容: [docs/add_test/チャット内容.md](docs/add_test/チャット内容.md)
- Planner成果物: [specs/standard/e2e-plan.md](specs/standard/e2e-plan.md)
- Generator成果物: [tests/standard/\*.ts](tests/standard)

## スクリプト一覧

以下は `package.json` に定義されているスクリプトの一覧です。

### Minimal テスト用

- `npm run test:minimal` : Minimal テストを実行します。

### Standard テスト用

- `npm run bddgen:standard` : Standard テストの BDD ファイルを生成します。
- `npm run test:standard` : Standard テストを実行します。
- `npm run test:standard:vr` : Standard テストのビジュアルリグレッションを実行します。
- `npm run test:standard:all` : BDD ファイル生成後に Standard テストを実行します。
