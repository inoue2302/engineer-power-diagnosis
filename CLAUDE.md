# CLAUDE.md — エンジニア戦闘力診断

## プロジェクト概要

宇宙の戦闘民族の王子風キャラがエンジニアの「技術戦闘力」を診断するネタ系Webアプリ。
固有名詞（作品名・キャラ名・技名）は一切使用しない。

## 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: shadcn/ui + Tailwind CSS v4
- **AI**: Anthropic API (Claude) — Server Actions 経由
- **Deploy**: Vercel

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run lint     # ESLint 実行
```

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # トップページ
│   ├── diagnosis/page.tsx   # 診断チャット画面
│   └── actions/chat.ts      # Server Action (API呼び出し)
├── components/              # UIコンポーネント
│   └── ui/                  # shadcn/ui コンポーネント
├── lib/                     # ユーティリティ・定数
│   └── system-prompt.ts     # AIシステムプロンプト
└── types/                   # 型定義
```

## コーディング規約

### TypeScript

- **strict mode 必須** — `any` 禁止、型推論に頼りすぎない
- **型アサーション (`as Type`) 禁止** — type guard 関数（`value is T`）で型を絞り込む。`as const` は OK
- Props・状態・APIレスポンスには必ず **型定義（type / interface）** を書く
- 外部データ（JSON.parse / API レスポンス等）は type guard で検証してから使用する
- 型定義は `src/types/` に集約するか、コンポーネントと同ファイルに colocate
- Union 型やリテラル型を活用し、不正な状態を型レベルで排除する

```typescript
// Good: 状態を型で制約
type DiagnosisPhase = "idle" | "chatting" | "result";
type Message = { role: "user" | "assistant"; content: string };
```

### コンポーネント設計

- **shadcn/ui をベースにカスタマイズ** — 車輪の再発明をしない
- **宣言的に実装する** — 命令的な DOM 操作を避け、状態駆動で UI を表現
- Server Components をデフォルトとし、`"use client"` は必要最小限に
- コンポーネントは単一責任、Props は明示的に型定義

```typescript
// Good: 宣言的
{messages.map((msg) => (
  <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
))}
```

### スタイリング

- **Tailwind CSS v4** を使用（`@import "tailwindcss"` 形式）
- カスタムアニメーション・CSS変数は `globals.css` に定義
- インラインスタイルは動的な値（JS計算値）のみ許可
- shadcn/ui の `cn()` ユーティリティで条件付きクラス結合

### Server Actions / API

- API キーはサーバーサイドのみ — クライアントに絶対露出させない
- Server Actions (`"use server"`) 経由で Anthropic API を呼び出す
- エラーハンドリングは必ず行い、ユーザーフレンドリーなメッセージを返す
- 会話状態はクライアント側（useState）で保持、DB 不要

### Git / ブランチ運用

- ブランチ名: `feature/issue-{番号}-{概要}`
- コミットメッセージ: `feat:` / `fix:` / `chore:` prefix
- PR は Issue に紐づけ、`Closes #N` で自動クローズ

## 注意事項

- **著作権**: 固有名詞（作品名・キャラ名・技名）は一切使用しない
- **課金防止**: 追加課金が発生しない設計を厳守
- **プライバシー**: ユーザーの回答は保存しない（セッション内のみ）
