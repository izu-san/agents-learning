# AWS Bedrockのセキュリティについて

## 前提条件

Claude CodeをAWS Bedrock経由で呼び出したときのセキュリティについて考える。

## 免責事項

あくまでも個人的に調査した程度の内容なので、実際に業務適用する場合は改めて調査すべき。

## 目的

この資料は以下を説明することを目的とします。

1. **AWS Bedrock（Claude Code を含む）でのデータ利用方針**
2. **Playwright Agent に入力したデータの学習への影響**
3. **ビジネス利用における機密データ・顧客情報の取り扱いと注意点**
4. **参照可能な公式ソースリンク**

---

## 1. AWS Bedrock のデータ保護ポリシー

### データ利用に関する基本方針

* **Amazon Bedrock は、ユーザーが入力したプロンプトや生成された出力をモデルのトレーニングには使用しません。**

  > *“Amazon Bedrock doesn't use your prompts and completions to train any AWS models or distribute them to third parties.”* ([AWS ドキュメント][1])

* 同様に、**ユーザー入力とモデル出力は標準的なオペレーションや不正検知プロセスで保存・ログされません。**

  > *“Bedrock does not store customer input data or model output data as part of standard operations.”* ([Repost][2])

---

### セキュリティ・プライバシーの基本

**Amazon Bedrock のドキュメントより：**

* データは AWS 内で暗号化され、**外部プロバイダーと共有されません**。
* モデルプロバイダー側でユーザーデータにアクセスすることはありません。

  > *“Customer inputs provided to and outputs generated from FMs on Amazon Bedrock are not shared with third-party model providers.”* ([Amazon Web Services, Inc.][4])

---

## 2. Playwright Agent とデータの学習について

### Playwright Agent の内部処理

Playwright Agent（Planner / Generator / Healer）は以下を行います：

* アプリ仕様の分析 → 仕様書生成（Planner）
* 自動テストコード生成（Generator）
* 失敗したテストの修正（Healer）

これらは **Claude（Bedrock）をプロンプトとして呼び出し、返答を受け取る処理** ですが、
**そのやり取りは Bedrock 側の継続学習には使用されません。**

→ したがって、Playwright Agent のプロンプトや応答がベースモデルに学習されることはありません。
（Bedrock 側のデータ保護ポリシーが適用されるため）

---

## 3. ビジネス利用における注意点

### 機密データ・顧客情報の取り扱い

#### モデル学習とは別に注意すべき点

AWS 側では学習に使われませんが、**入力されたテキストはログに残る可能性がある。**

* AWS CloudTrail などで API 呼び出しのログにプロンプトが残る可能性
* アプリケーションログに顧客データが含まれる可能性

 **ログには個人識別可能な情報（PII）を含めない設計が重要。** ([AWS ドキュメント][1])

 → この件については、[ログ調査.md](ログ調査.md) に詳細を記載した。

---

### 機密データ保護の実装例

AWS の推奨策

| 対策                | 内容                        |                                  |
| ----------------- | ------------------------- | -------------------------------- |
| IAM 管理            | 利用権限を最小限に設定               |                                  |
| VPC / PrivateLink | モデル呼び出しをプライベートネットワーク経由に限定 |                                  |
| CloudTrail        | API 呼び出しの監査ログを有効化         |                                  |
| マスキング             | 機密情報をプロンプト送信前に変換・削除       |                                  |
| ガードレール            | PII の検出・マスキング機能を利用        | ([Amazon Web Services, Inc.][5]) |


---

## 4. 参考リンク

### AWS ドキュメント

*  **Bedrock データ保護ポリシー** — AWS公式
  [https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html](https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html) ([AWS ドキュメント][1])
*  **Bedrock セキュリティ・プライバシー全体像** — AWS公式
  [https://aws.amazon.com/jp/bedrock/security-privacy-responsible-ai/](https://aws.amazon.com/jp/bedrock/security-privacy-responsible-ai/) ([Amazon Web Services, Inc.][6])
*  **Bedrock ガードレール（PII マスキング等）** — AWS公式
  [https://aws.amazon.com/jp/bedrock/guardrails/](https://aws.amazon.com/jp/bedrock/guardrails/) ([Amazon Web Services, Inc.][5])
*  **Bedrock よくある質問（FAQ）** — AWS公式
  [https://aws.amazon.com/jp/bedrock/faqs/](https://aws.amazon.com/jp/bedrock/faqs/) ([Amazon Web Services, Inc.][7])

###  AWS Re:Post（コミュニティ Q&A）

*  **Bedrock は入力を保存・学習に使うか？**
  [https://repost.aws/questions/QUyLgwu2E4Tsm5BmFr1ThDLg/in-the-abuse-detection-process-of-aws-bedrock-are-the-user-s-inputs-and-outputs-stored?sc_ichannel=ha](https://repost.aws/questions/QUyLgwu2E4Tsm5BmFr1ThDLg/in-the-abuse-detection-process-of-aws-bedrock-are-the-user-s-inputs-and-outputs-stored?sc_ichannel=ha) ([Repost][2])

---


[1]: https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html?utm_source=chatgpt.com "Data protection - Amazon Bedrock"
[2]: https://repost.aws/ja/questions/QUyLgwu2E4Tsm5BmFr1ThDLg/in-the-abuse-detection-process-of-aws-bedrock-are-the-user-s-inputs-and-outputs-stored?sc_ichannel=ha&sc_icontent=QUyLgwu2E4Tsm5BmFr1ThDLg&sc_ilang=en&sc_iplace=hp&sc_ipos=2&sc_isite=repost&utm_source=chatgpt.com "In the abuse detection process of AWS Bedrock, are the user's inputs and outputs stored? | AWS re:Post"
[3]: https://repost.aws/questions/QUyLgwu2E4Tsm5BmFr1ThDLg/in-the-abuse-detection-process-of-aws-bedrock-are-the-user-s-inputs-and-outputs-stored?utm_source=chatgpt.com "In the abuse detection process of AWS Bedrock, are the user's inputs and outputs stored? | AWS re:Post"
[4]: https://aws.amazon.com/documentation-overview/bedrock/?utm_source=chatgpt.com "Amazon Bedrock"
[5]: https://aws.amazon.com/jp/bedrock/guardrails/?utm_source=chatgpt.com "生成 AI データガバナンス – Amazon Bedrock のガードレール – AWS"
[6]: https://aws.amazon.com/jp/bedrock/security-privacy-responsible-ai/?utm_source=chatgpt.com "セキュリティ、プライバシー、責任ある AI – Amazon Bedrock – AWS"
[7]: https://aws.amazon.com/jp/bedrock/faqs/?utm_source=chatgpt.com "基盤モデルを使用した生成系 AI アプリケーションの構築 – Amazon Bedrock に関するよくある質問 – AWS"
