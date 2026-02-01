# Playwright Agents 学習用りぽじとり

## 実行環境

* OS: Windows11 Home 24H2
* VSCode: 1.108.1
* Node.js: v22.20.0
* AIツール: GitHub Copilot
* モデル: GPT-5.2-Codex

## 環境構築

### 前提条件

* VSCodeインストール済み
* Node.jsインストール済み

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

### 最低限の指示のみ

* チャット内容: docs/minimal/チャット内容.md
* Planner成果物: 