# Playwright + BDD + Component Object Pattern 導入手順書 & コーディング規約 (ドラフト)

本ドキュメントは、TypeScript, Playwright, playwright-bdd を用いたE2Eテスト自動化プロジェクトのセットアップ手順および開発ガイドラインです。

## 0. 採用技術・アーキテクチャ概要

本プロジェクトでは、「メンテナンス性の高さ」と「仕様と実装の分離」を両立するため、以下の技術スタックとデザインパターンを採用します。

### 0-1. 技術スタック

| カテゴリ | 技術・ツール | 選定理由 |
| :--- | :--- | :--- |
| **言語** | **TypeScript** | 静的型付けにより、セレクタや操作ミスの早期発見が可能。IDE補完も強力。 |
| **テストフレームワーク** | **Playwright Test** | Microsoft製。高速・並列実行、自動待機、トレーシング機能があらかじめ統合されており安定性が高い。 |
| **BDDライブラリ** | **playwright-bdd** | Playwrightランナー上でCucumber(Gherkin)を直接動作させるツール。Playwrightの強力な機能(Fixtures等)をそのまま使えるのが強み。 |
| **仕様記述** | **Gherkin (.feature)** | 「Given/When/Then」形式で記述する自然言語構文。非エンジニアでも仕様を理解・レビュー可能にする。 |

### 0-2. デザインパターン：Component Object Pattern

Page Object Model (POM) をさらに発展させた**Component Object Pattern**を採用します。

*   **概要**: 画面全体を1つのクラスにするのではなく、「検索バー」「ヘッダー」「日付ピッカー」などの**UI部品単位**でクラス化し、ページクラスはそれらを組み合わせるだけの構成にします。
*   **メリット**:
    *   **再利用性**: 共通部品（例: 日付選択）のロジックが1箇所にまとまる。
    *   **変更に強い**: UI構造が変わっても、修正はそのComponentクラス1つだけで済む。

### 0-3. アーキテクチャ全体像

3層構造で責務を分離します。

1.  **仕様層 (Features)**: Gherkinで「ユーザーが何をしたいか」を記述。実装詳細を含まない。
2.  **接着層 (Steps & Fixtures)**: Featureの各行を、コードに紐付ける。Fixture機能によりComponent Objectを自動注入する。
3.  **操作層 (Components/Pages)**: 実際にブラウザを操作するロジック（`click`, `fill`等）。Playwright APIを直接呼ぶのはここだけ。

---

## 1. プロジェクト構築手順

### 1-1. 初期化とインストール

```bash
# 1. Playwrightプロジェクトの作成（対話モードでTypeScriptを選択）
npm init playwright@latest

# 2. playwright-bdd のインストール
npm install -D playwright-bdd

# 3. 推奨VS Code拡張機能
# - Playwright Test for VSCode (Microsoft)
# - Cucumber (Full Support) (Alexander Krechik)
```

### 1-2. 構成設定 (`playwright.config.ts`)

`playwright-bdd` を統合するための設定を行います。

```typescript
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// BDD設定: featureファイルとstep定義の場所を指定
const testDir = defineBddConfig({
  features: 'e2e/features/*.feature',
  steps: 'e2e/steps/*.ts',
});

export default defineConfig({
  testDir, // 生成されたテストファイルを指すこの変数を設定
  reporter: 'html',
  use: {
    baseURL: 'https://example.com', // 対象サイトURL
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // 必要に応じて他ブラウザを追加
  ],
});
```

---

## 2. ディレクトリ構成

役割ごとに責務を明確に分離します。

```text
e2e/
├── features/               # Gherkin形式の仕様書 (.feature)
│   └── booking.feature
├── steps/                  # Step定義ファイル (featureとコードの接着剤)
│   └── booking.steps.ts
├── pages/                  # Page Objects (画面単位のコンテナ)
│   └── search.page.ts
├── components/             # Component Objects (再利用可能なUI部品)
│   ├── header.component.ts
│   └── date-picker.component.ts
├── fixtures/               # DIコンテナ定義 (Pom/Componentの注入)
│   └── index.ts
└── .features-gen/          # (自動生成) bddが生成するテスト実行ファイル
```

---

## 3. コーディング規約

### 3-1. ロケーター戦略 (最重要)

「壊れにくいテスト」のため、ユーザーの視点に基づいたセレクタを使用します。

*   **原則**: DOM構造（div, span, class名）に依存せず、アクセシビリティ属性やテキストを使用する。
*   **優先順位**:
    1.  `page.getByRole(...)` (ボタン、リンク、見出し等)
    2.  `page.getByLabel(...)` (フォーム入力)
    3.  `page.getByText(...)` (静的テキスト)
    4.  `page.getByTestId(...)` (どうしても難しい場合のみ `data-testid` を付与)
*   **禁止**: `css=.login-btn`, `xpath=//*[@id="main"]/div[2]` などの構造依存セレクタ。

### 3-2. Component Object 設計

*   **責務**: UI部品の「操作(Action)」と「状態取得(Query)」のみを行う。**検証(Assertion)は行わない**。
*   **構造**: 親となる `Locator` をコンストラクタで受け取り、その配下の要素のみを操作する（カプセル化）。

**良い例 (`components/search-form.ts`):**
```typescript
export class SearchForm {
  constructor(readonly page: Page, readonly host: Locator) {}

  async search(text: string) {
    // host配下の要素のみを操作している
    await this.host.getByLabel('検索ワード').fill(text);
    await this.host.getByRole('button', { name: '検索' }).click();
  }
}
```

### 3-3. Page Object 設計

*   **責務**: 一つの画面を表す。Component Objectをプロパティとして持ち、画面全体の構成を定義する。
*   **メソッド**: ページ遷移 (`goto()`) や、ページ特有の処理を記述する。

**良い例 (`pages/top.page.ts`):**
```typescript
import { SearchForm } from '../components/search-form';

export class TopPage {
  readonly searchForm: SearchForm;

  constructor(readonly page: Page) {
    // ページ内の特定エリアをホストとしてコンポーネントを初期化
    this.searchForm = new SearchForm(page, page.locator('#main-search'));
  }

  async goto() {
    await this.page.goto('/');
  }
}
```

### 3-4. BDD (Feature / Steps) 記述

*   **Feature**: 実装詳細（「ボタンをクリックする」）ではなく、ユーザーの意図（「商品をカートに入れる」）を書く。
*   **Steps**: ロジックを書かず、Flow制御とFixture呼び出しに徹する。

**悪いFeature例:**
```gherkin
Given "input#username" に "user" と入力する
And "button.login" をクリックする
```

**良いFeature例:**
```gherkin
Given "user" としてログインする
```

---

## 4. 実装サンプル（垂直スライス）

### 4-1. Fixture定義 (`e2e/fixtures/index.ts`)

Page ObjectやComponent Objectをテストで使えるように登録します。

```typescript
import { test as base } from 'playwright-bdd';
import { TopPage } from '../pages/top.page';

type MyFixtures = {
  topPage: TopPage;
};

export const test = base.extend<MyFixtures>({
  topPage: async ({ page }, use) => {
    await use(new TopPage(page));
  },
});
```

### 4-2. Step定義 (`e2e/steps/search.steps.ts`)

Featureファイルの文言とコードを紐付けます。FixtureからPageObjectを受け取ります。

```typescript
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures'; // カスタムfixture
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

Given('トップページを開いている', async ({ topPage }) => {
  await topPage.goto();
});

When('{string} で検索する', async ({ topPage }, keyword: string) => {
  // Page -> Component へ委譲
  await topPage.searchForm.search(keyword);
});

Then('検索結果に {string} が表示される', async ({ page }, keyword: string) => {
  // 検証はここ(Steps)で行う
  await expect(page.getByRole('heading', { name: keyword })).toBeVisible();
});
```

---

## 5. 品質保証の拡張 (Advanced Roadmap)

プロジェクトが安定した後、さらに品質を高めるために導入すべき拡張機能です。

### 5-1. UXの完全保証 (Visual & Accessibility)

機能的な動作だけでなく、「見た目」と「使いやすさ」を機械的に保証します。

#### Visual Regression Testing (VRT)
Playwright標準の `toHaveScreenshot` を使用し、意図しないデザイン崩れをピクセル単位で検知します。
Component Object単位で実施することで、変更の影響範囲を特定しやすくなります。

```typescript
// Component Object内に追加するメソッド例
async expectSnapshot(name: string) {
  // コンポーネント(this.host)単体のスクリーンショットを比較
  await expect(this.host).toHaveScreenshot(`${name}.png`);
}
```

#### アクセシビリティ (a11y) 自動チェック
`@axe-core/playwright` を導入し、WCAG準拠チェックを自動化します。

```bash
npm install -D @axe-core/playwright
```

**実装例 (Step定義内):**
```typescript
import AxeBuilder from '@axe-core/playwright';

Then('アクセシビリティに問題がないこと', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

### 5-2. Performance Budget (速度の予算化)

`playwright-lighthouse` を組み込み、パフォーマンススコアの劣化をテスト失敗として検知します。
GoogleのLighthouseスコアをCIの通過条件（Budget）にします。

```bash
npm install -D playwright-lighthouse lighthouse
```

**実装における注意点:**
*   PlaywrightをChromeのリモートデバッグモードで起動する必要があります。
*   スコアは実行環境のスペックに依存するため、CI上での閾値調整が必要です。

**実装イメージ (Step定義内):**
```typescript
import { playAudit } from 'playwright-lighthouse';

Then('パフォーマンススコアが {int} 以上であること', async ({ page }, threshold: number) => {
  await playAudit({
    page: page,
    thresholds: {
      performance: threshold, // 例: 90
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    },
    port: 9222, // リモートデバッグポート
  });
});
```
