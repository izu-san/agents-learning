# `playwright-cli` 使ってみた

無理やり設定してPlaywright Agentsから`playwright-cli`を呼び出しては見たものの、  
ゴリ押しがすぎるので正しい手順を知りたいところ。
そもそもPlaywright Agentsから呼び出すものじゃない？詳しく調査する必要ある。

## `playwright-cli` is なに？

### 概要

`@playwright/cli`（playwright-cli）は、Playwright の代表的なブラウザ操作を **CLI コマンドとして提供**するツールです。
人間が手で叩いても使えますが、主なユースケースは **コーディングエージェント（Claude Code / GitHub Copilot など）が CLI を呼び出してブラウザを操作する**運用です。  
詳細は公式のリポジトリを確認ください。

公式: https://github.com/microsoft/playwright-cli

## セットアップ方法

```
npm install -g @playwright/cli@latest
playwright-cli --help
```

```
PS F:\Study\playwright\agents-learning> playwright-cli --version
0.0.62
```

## Claude Codeのスキル追加方法

```
/plugin marketplace add microsoft/playwright-cli
/plugin install playwright-cli
```

## 普通に使ってみる

```
❯ playwright-cliを使用して、 http://127.0.0.1:8080/ja/ このサイトの会員登録をテストして
```

↓

```
● 会員登録テスト完了 ✓
  Playwrightを使用して、http://127.0.0.1:8080/ja/ のサイトの会員登録をテストしました。
  以下のテストケースが正常に実行されました：
  
  テスト結果
  
  1. 会員登録フロー
  - 会員登録画面へのアクセス ✓
  - 必須項目の入力 ✓
    - メールアドレス: test@example.com
    - パスワード: TestPass123 (8文字以上)
    - パスワード確認: TestPass123
    - 氏名: テスト太郎
  - 登録ボタンクリック ✓
  - 登録成功後、マイページへの自動リダイレクト ✓

  2. ログイン検証
  - ログアウト ✓
  - 登録したユーザ情報でのログイン ✓
  - マイページ表示確認 ✓

  確認内容

  マイページに以下の登録情報が正しく表示されました：
  - メールアドレス: test@example.com
  - 氏名: テスト太郎
  - 会員ランク: プレミアム会員（デフォルト選択）

  すべてのテストが正常に完了し、会員登録機能が正常に動作することが確認されました。
```

## Agentsのコンテキスト削減できるか？

Playwright AgentsにてMCPを使用した場合と `playwright-cli` を使用した場合で、それぞれのコンテキスト長を調査する。  
コンテキスト長の確認が主目的なので、Agentsの成果物は載せていません。  
試したのは `Planner` のみです。

### 普通のPlaywright Agents

1. `/clear`コマンド実行直後のコンテキスト長を確認

```
❯ /context
  ⎿  Context Usage
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛀   arn:aws:bedrock:us-east-1:xxx:inference-profile/u
     ⛁ ⛁ ⛁ ⛁ ⛀ ⛀ ⛀ ⛶ ⛶ ⛶   iku-4-5-20251001-v1:0 · 29k/200k tokens (15%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   Estimated usage by category
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System prompt: 2.5k tokens (1.2%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System tools: 17.1k tokens (8.5%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ MCP tools: 9.2k tokens (4.6%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Custom agents: 285 tokens (0.1%)
     ⛶ ⛶ ⛶ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛁ Messages: 122 tokens (0.1%)
     ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛶ Free space: 138k (68.9%)
                           ⛝ Autocompact buffer: 33.0k tokens (16.5%)
```

2. Playwright AgentsのPlannerを実行

```
❯ @"playwright-test-planner(agent)"
以下サイトの実装詳細を確認して、実行すべきE2Eテスト項目を生成してください。
http://127.0.0.1:8080/ja/    
```

3. Planner実行後のコンテキスト長

```
❯ /context
  ⎿  Context Usage
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛀   arn:aws:bedrock:us-east-1:xxx:inference-profile/u
     ⛁ ⛁ ⛁ ⛁ ⛀ ⛀ ⛁ ⛁ ⛶ ⛶   iku-4-5-20251001-v1:0 · 30k/200k tokens (15%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   Estimated usage by category
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System prompt: 2.5k tokens (1.2%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System tools: 17.1k tokens (8.5%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ MCP tools: 9.2k tokens (4.6%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Custom agents: 285 tokens (0.1%)
     ⛶ ⛶ ⛶ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛁ Messages: 4.6k tokens (2.3%)
     ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛶ Free space: 133k (66.7%)
                           ⛝ Autocompact buffer: 33.0k tokens (16.5%)
```

### Playwright Agents with `playwright-cli`

0. `.claude/agents/*.md` を書き換えて `playwright-cli` を使用するようにする

- [agents/*.md](agents/)

1. `/clear`コマンド実行直後のコンテキスト長を確認

```
❯ /context
  ⎿  Context Usage
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛀   arn:aws:bedrock:us-east-1:xxx:inference-profile/u
     ⛀ ⛀ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   iku-4-5-20251001-v1:0 · 19k/200k tokens (10%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ 
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   Estimated usage by category
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System prompt: 2.5k tokens (1.3%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System tools: 16.4k tokens (8.2%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Custom agents: 285 tokens (0.1%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Skills: 72 tokens (0.0%)
     ⛶ ⛶ ⛶ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛁ Messages: 122 tokens (0.1%)
     ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛶ Free space: 148k (73.8%)
                           ⛝ Autocompact buffer: 33.0k tokens (16.5%)
```

2. Playwright AgentsのPlannerを実行

```
❯ @"playwright-test-planner(agent)"
以下サイトの実装詳細を確認して、実行すべきE2Eテスト項目を生成してください。
http://127.0.0.1:8080/ja/    
```

3. Planner実行後のコンテキスト長

```
 ❯ /context
  ⎿  Context Usage
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛀   arn:aws:bedrock:us-east-1:xxx:inference-profile/u
     ⛀ ⛁ ⛁ ⛁ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   iku-4-5-20251001-v1:0 · 24k/200k tokens (12%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   Estimated usage by category
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System prompt: 2.5k tokens (1.3%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System tools: 16.4k tokens (8.2%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Custom agents: 285 tokens (0.1%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Skills: 72 tokens (0.0%)
     ⛶ ⛶ ⛶ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛁ Messages: 7.0k tokens (3.5%)
     ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛶ Free space: 141k (70.4%)
                           ⛝ Autocompact buffer: 33.0k tokens (16.5%)
```

  ### 比較（`/context` 出力ベース）

  `/context` の表示は概ね `k` 単位で丸められるため、差分は目安です。

  #### 総量（使用トークン）

  | タイミング | 普通のPlaywright Agents | Playwright Agents with `playwright-cli` | 差（CLI - 普通） |
  | --- | --- | --- | --- |
  | `/clear` 直後 | 29k/200k (15%) | 19k/200k (10%) | -10k（約-34%） |
  | Planner 実行後 | 30k/200k (15%) | 24k/200k (12%) | -6k（約-20%） |
  | 増分（Plannerで増えた分） | +1k | +5k | +4k |

  #### 内訳（見えている範囲）

  | タイミング | 項目 | 普通のPlaywright Agents | with `playwright-cli` |
  | --- | --- | --- | --- |
  | `/clear` 直後 | System tools | 17.1k | 16.4k |
  |  | MCP tools | 9.2k | （表示なし） |
  |  | Skills | （表示なし） | 72 |
  |  | Messages | 122 | 122 |
  |  | Free space | 138k (68.9%) | 148k (73.8%) |
  | Planner 実行後 | Messages | 4.6k | 7.0k |
  |  | Free space | 133k (66.7%) | 141k (70.4%) |

  ### 結果（要点）

  - `/clear` 直後は、`playwright-cli` 利用で **使用トークンが 29k → 19k に減少**（約 10k 減）。
  - Planner 実行後も、`playwright-cli` 利用の方が **30k → 24k と小さく収まる**。
  - Planner 後の **Messages は CLI 側の方が増える**（4.6k → 7.0k）が、総量としては CLI 側が小さい。

### メモ

- MCPを使用しないように設定したので、MCP toolsが消えた分だけ使用トークンが減った
- Messagesが増えたのは、アウトプットが増えたため？？
  - 作業中のアウトプットが増えたように感じる
  - 明示的にアウトプットを抑止するようにしたら、もっと使用トークンが減るかも
