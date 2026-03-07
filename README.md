# エンジニア戦闘力診断

> 「俺様が貴様の実力を測ってやろう」

宇宙の戦闘民族の王子風キャラが、対話形式でエンジニアの"技術戦闘力"を診断するネタ系 Web アプリ。
全 7 問のチャットを通じて 5 つの能力値を算出し、戦闘力・ランク・タイプを判定します。

## デモ

<!-- Vercel デプロイ後に URL を貼る -->
<!-- ![スクリーンショット](docs/screenshot.png) -->

## 特徴

- **AI 対話型診断** — Claude (Anthropic API) による自然な会話で実力をヒアリング
- **RAG で結果強化** — LangChain + Upstash Vector でナレッジベースを参照し、診断結果をより具体的に強化
- **レーダーチャート表示** — 技術力・問題解決力・学習意欲・対人力・実戦力の 5 軸で可視化
- **画像保存** — 診断結果カードを PNG でダウンロード可能
- **SNS シェア** — X (Twitter)・はてなブックマーク へのシェアボタン
- **レート制限** — Redis (グローバル) + Cookie (ユーザー単位) の 2 層制限で課金暴走を防止

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| UI | Tailwind CSS v4 |
| AI (チャット) | Anthropic API (`@anthropic-ai/sdk`) — Server Actions 経由 |
| AI (RAG 強化) | LangChain (`@langchain/anthropic` + `@langchain/core`) |
| Vector DB | Upstash Vector (組み込みエンベディング) |
| Rate Limit | Upstash Redis |
| Image Export | html2canvas-pro |
| Deploy | Vercel |

## アーキテクチャ

```
ユーザー
  │
  ▼
[チャット UI] ─── Server Action ──→ Anthropic API (Claude Sonnet 4)
  │                                        │
  │                                   全7問完了
  │                                        │
  ▼                                        ▼
[診断結果表示] ◀── RAG 強化 ◀── LangChain + Upstash Vector
  │
  ├── レーダーチャート (SVG)
  ├── 画像保存 (html2canvas)
  └── SNS シェア
```

**ポイント**: RAG はチャット中ではなく、診断結果の**後処理**で使用。ベースの診断結果をナレッジベースの情報で補強し、ロードマップと推奨スキルをより具体的にします。

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx              # ルートレイアウト
│   ├── page.tsx                # トップページ
│   ├── diagnosis/page.tsx      # 診断チャット画面
│   └── actions/
│       ├── chat.ts             # Server Action (Anthropic API)
│       └── enhance-diagnosis.ts # Server Action (RAG 強化)
├── components/
│   ├── ChatInput.tsx           # メッセージ入力
│   ├── ChatMessage.tsx         # チャット吹き出し
│   ├── DiagnosisResultCard.tsx # 診断結果カード
│   ├── EnhancingOverlay.tsx    # RAG 強化中のローディング
│   ├── RadarChart.tsx          # 5 軸レーダーチャート
│   └── ShareButtons.tsx        # SNS シェアボタン
├── lib/
│   ├── rag/
│   │   ├── enhance-chain.ts    # LangChain チェーン定義
│   │   ├── retriever.ts        # Upstash Vector 検索
│   │   └── vector-store.ts     # Vector インデックス初期化
│   ├── parse-result.ts         # JSON パース
│   ├── rate-limit.ts           # Redis レート制限
│   ├── sounds.ts               # 効果音
│   └── system-prompt.ts        # AI システムプロンプト
├── data/knowledge/             # RAG 用ナレッジ (Markdown)
└── types/diagnosis.ts          # 型定義
```

## セットアップ

### 必要要件

- Node.js 20+
- npm

### 環境変数

`.env.local` を作成し、以下を設定:

```env
# Anthropic API (必須)
ANTHROPIC_API_KEY=sk-ant-...

# Upstash Redis — グローバルレート制限用 (任意)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Upstash Vector — RAG 用 (任意)
UPSTASH_VECTOR_REST_URL=https://...
UPSTASH_VECTOR_REST_TOKEN=...
```

> Redis / Vector が未設定でも動作します。RAG 強化とグローバルレート制限がスキップされます。

### インストール & 起動

```bash
npm install
npm run dev
```

### RAG ナレッジベースの投入

Upstash Vector を使用する場合:

```bash
npm run seed
```

`src/data/knowledge/` 配下の Markdown ファイルをチャンク分割し、Upstash Vector にアップロードします。

## 診断の流れ

1. **オープニング** — 王子がユーザーに挨拶し、全 7 問の診断を宣言
2. **質問フェーズ** (7 カテゴリ)
   - 専門分野の確認
   - 技術的な深さ
   - 設計判断
   - 障害対応・修羅場
   - チーム開発の立ち回り
   - ギャグ問題 x2
3. **診断結果** — 戦闘力 (0〜9999)、ランク、タイプ、5 軸スコアを算出
4. **RAG 強化** — ナレッジベースを参照してロードマップ・推奨スキルを具体化

### ランク表

| 戦闘力 | ランク |
|--------|--------|
| 0〜999 | 下級戦士 |
| 1000〜2999 | 中級戦士 |
| 3000〜5999 | 上級戦士 |
| 6000〜7999 | エリート戦士 |
| 8000〜9999 | 伝説の戦士 |

## 開発

```bash
npm run dev      # 開発サーバー (http://localhost:3000)
npm run build    # プロダクションビルド
npm run lint     # ESLint
npm run seed     # ナレッジベース投入
```

### ブランチ運用

- ブランチ名: `feature/issue-{番号}-{概要}`
- コミット: `feat:` / `fix:` / `chore:` prefix
- PR は Issue に紐づけ、`Closes #N` で自動クローズ

## ライセンス

MIT
