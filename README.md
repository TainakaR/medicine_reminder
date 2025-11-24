# MedicineReminder

**課題**: 薬剤師は、患者の服用状況や副作用の確認のために、一定期間後に電話等でリマインドを行うことがありますが、現在、そのための効率的な管理ツールがありません。その結果、重篤な副作用リスクの高い患者など、一部の患者にしかリマインドが行き届いていないのが現状です。

**本アプリの目的と機能**: そこで、本アプリは薬剤師のリマインド業務を効率化し、より多くの患者への適切なフォローアップを実現するために開発されました。患者ごとに設定したリマインド期日になると、薬剤師に一覧表示でお知らせします。これにより、患者の服薬状況や異変を漏れなく、かつタイムリーに把握し、医療の質の向上に貢献します。


**主な機能**
- **リマインダー登録**: 薬名、服薬時間、繰り返し間隔などを登録できます。
- **一覧表示**: 未来のリマインダー、未完了（リマインド済みでない）リマインダー、完了済みの履歴をページごとに確認できます。
- **操作性**: 登録/削除、完了チェック機能を備えています。

**動作環境（開発用）**
- Node.js

アプリの使い方（概略）
- `RemindPage`：新しいリマインダーの登録フォーム。
- `FuturePage`：これから来るリマインダーの一覧。
- `OverduePage`：期限切れ（予定時刻を過ぎた未完了）リマインダー。
- `CompletedPage`：服薬済み、または手動で完了にした履歴。
- `RegisterPage`：必要なアカウント登録や初期設定（本リポジトリではローカルシンプル実装）。

プロジェクト構成（主なファイル）
- `src/`：ソースコード
	- `App.tsx`：アプリのルート
	- `main.tsx`：エントリーポイント
	- `initReminders.ts`：初期データ生成ロジック
	- `components/ReminderItems.tsx`：リマインダー一覧のコンポーネント
	- `pages/`：各画面コンポーネント
	- `utils/`：ユーティリティ関数（`actionUtils.ts`, `reminderUtils.ts`）

工夫点
1. リマインドの優先度と視認性の向上
**服薬リスクに応じた視覚的な分類**:
新規の薬剤（初服薬） は、長期処方の薬剤に比べて副作用リスクが高いため、リマインドの必要性が高いと判断し、一覧画面で色分けして表示しています。これにより、薬剤師は緊急性の高い患者を一目で識別し、優先的に対応できます。

2. 医療現場に即したデータ保持と安全性
**長期的な履歴確認への対応**:
リマインドが完了した後も、100件まで保存し、過去のフォローアップ履歴として確認できるように設計しています。

**操作ミスの防止（誤タップ対策）**:
リマインド完了などの重要な操作を行う「ボタン」には、必ず確認用のモーダルウィンドウを表示するようにしています。これにより、誤タップによるリマインド情報の意図しない消失を防ぎ、データの正確性と信頼性を確保しています。

3. データ登録時の入力支援とバリデーション
**患者IDの入力チェック**:
患者IDの登録画面では、必須入力チェックや桁数チェックを厳格に行っています。これにより、データの入力漏れや誤った形式の登録を防ぎ、正確な患者管理をサポートします。

## 開発履歴

- 2025年11月17日：プロジェクト開始

## ライセンス

MIT License

Copyright (c) 2025 Ryunosuke Tainaka

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.