# minimal/ と standard/ の差異

## まとめ（差分の要点）

- **minimal**: Playwright Agentに全てを丸投げして作らせたE2Eテスト
- **standard**: Playwright Agentに指示出しして作成させたE2Eテスト（POM + BDD + Gherkin, ビジュアルリグレッションテスト含む）

## 比較表

| 観点 | minimal/ | standard/ |
| --- | --- | --- |
| テスト記述 | Playwrightの`.spec.ts`に直接記述 | Gherkin（`.feature`）+ Step定義 + POM |
| 設定 | ルートのPlaywright設定を流用 | `tests/standard/playwright.config.ts`で分離 |
| 生成フロー | なし | `bddgen`で`features-gen/`を生成 |
| データ管理 | `helpers/app.ts`に固定データ | `data/`にテストデータを分離 |
| 再利用性 | 低〜中（ヘルパー中心） | 高（Page Objectに集約） |
| カバレッジ | 主要機能の基本フロー中心 | 主要機能 + エラー + 追加観点（VRT/セキュリティ） |
| ビジュアル検証 | 明示的には扱わない | ビジュアルスナップショットを前提 |
| セキュリティ観点 | 最小限 | SQLi/XSS/不正アクセスなどを含む |
| 実行コマンド | `npm run test:minimal` | `npm run test:standard` / `npm run test:standard:all` |
| ベースURL | `http://127.0.0.1:8080/ja`（ヘルパーで使用） | `http://127.0.0.1:8080/ja`（標準設定で使用） |
| 生成ステップ | なし | `bddgen`で`features-gen/`を生成 |
| 成果物 | HTMLレポート/スクリーンショット/動画/トレース | HTMLレポート/スクリーンショット/動画/トレース + スナップショット |

## ディレクトリ構成の差

- **minimal**: `tests/minimal/<機能>/*.spec.ts` に集約
- **standard**: `features/`、`steps/`、`pages/`、`data/`、`features-gen/`に分割

## 考察

### minimal/

最低限の指示出し（1行くらい）で済むため、とりあえず「最低限動くE2Eテスト」を作りたいときにはいいかもしれない。  
ただ、再利用性が弱くなるデメリットがある。  
将来的な拡張を考えると、手戻りが発生したりそもそも拡張しにくい構成かも？  
E2Eテストを勉強し始めたい場合、この構成で作って学習するのがいいような気もしている。  
＋αの機能を何も使ってないので・・・。

### standard/

こちらから明確に構成の指示出しをしている関係で、その構成に従ってコーディングされている。  
当たり前だが、保守性や拡張性が高い構成になっている。  
コードサンプルは用意せずにプロンプトだけで指示出ししたので、もしかしたらコードサンプルも用意するとよりよいコードが生成されるかもね。  
ビジュアルリグレッションテストは明確に指示しないとテスト計画書に追加されないらしい。

### その他メモ書き

- Playwright Fixtureは明確に指示しないと使用されないかもしれない？
- Playwright Agentへの指示出し前にE2Eテストの構成/技術スタックはガッツリ固めたほうがいいかなー？