# ai-chat 実行計画

## 概要

AIチャットボットアプリケーションの構築手順。各フェーズを順番に実施する。

---

## フェーズ1: プロジェクト初期化

- [x] **1.1** Next.jsプロジェクトの作成
  - App Router、TypeScript、ESLint有効
  - `npx create-next-app@latest . --typescript --eslint --app --src-dir --tailwind --import-alias "@/*"`

- [x] **1.2** 必要なパッケージのインストール
  ```bash
  # Hono
  npm install hono

  # Prisma
  npm install prisma @prisma/client

  # Mastra
  npm install @mastra/core@beta @mastra/ai-sdk@beta

  # AI SDK (Vercel)
  npm install ai @ai-sdk/react @ai-sdk/google

  # UI関連
  npm install clsx tailwind-merge

  # Zod (Mastra依存)
  npm install zod@^4
  ```

- [x] **1.3** 開発用パッケージのインストール
  ```bash
  npm install -D @types/node  # create-next-appで自動インストール済み
  ```

---

## フェーズ2: 基本設定

- [x] **2.1** 環境変数ファイルの作成
  - `.env.local` - ローカル開発用
  - `.env.example` - サンプル（Git管理用）
  - 必要な変数: `GOOGLE_GENERATIVE_AI_API_KEY`

- [x] **2.2** Prismaの初期化
  ```bash
  npx prisma init --datasource-provider sqlite
  ```

- [x] **2.3** `.gitignore`の確認・更新
  - `.env.local`が除外されていることを確認

---

## フェーズ3: バックエンド実装

### 3.1 Prisma設定

- [x] **3.1.1** `prisma/schema.prisma`の作成
  - 今回はセッション中のみなのでDB不要だが、将来拡張用に設定のみ

### 3.2 Mastra設定

- [x] **3.2.1** Mastraインスタンスの作成 (`src/lib/mastra/index.ts`)
  - Mastraの初期化

- [x] **3.2.2** キャラクターエージェントの作成 (`src/lib/mastra/agents/character-agent.ts`)
  - Geminiモデルの設定 (`google/gemini-2.0-flash`)
  - 動的なシステムプロンプト（キャラクター設定を反映）
  - 最大トークン: 500

### 3.3 Hono APIルート

- [x] **3.3.1** Honoアプリの設定 (`src/lib/hono/app.ts`)
  - ベースパス: `/api`

- [x] **3.3.2** APIルートの作成 (`src/app/api/[[...route]]/route.ts`)
  - Honoハンドラーのエクスポート

- [x] **3.3.3** チャットエンドポイントの実装
  - `POST /api/chat` - ストリーミングチャット
  - リクエスト: `{ messages, character: { name, personality } }`
  - レスポンス: ストリーミング

---

## フェーズ4: フロントエンド実装

### 4.1 共通設定

- [x] **4.1.1** グローバルスタイルの設定 (`src/app/globals.css`)
  - ポップ・カラフルなカラーパレット
  - 基本的なレイアウトスタイル

- [x] **4.1.2** レイアウトの作成 (`src/app/layout.tsx`)
  - メタデータ設定
  - フォント設定

### 4.2 キャラクター作成画面

- [x] **4.2.1** ページ作成 (`src/app/page.tsx`)
  - キャラクター作成フォーム
  - テンプレート選択UI
  - カスタム入力フィールド（名前、性格・口調）
  - 「会話を始める」ボタン

- [x] **4.2.2** テンプレートデータの作成 (`src/constants/character-templates.ts`)
  - ツンデレ幼馴染
  - クールな執事
  - 元気な妖精
  - ミステリアスな占い師
  - 熱血スポーツコーチ

### 4.3 会話画面

- [x] **4.3.1** ページ作成 (`src/app/chat/page.tsx`)
  - AI SDKの`useChat`フック使用
  - ストリーミング表示
  - メッセージ一覧
  - 入力フォーム

- [x] **4.3.2** キャラクター情報の受け渡し
  - URLパラメータまたはセッションストレージで管理

- [x] **4.3.3** 往復数カウンターの実装
  - 20往復制限の表示
  - 制限到達時のUI

---

## フェーズ5: UIコンポーネント

- [ ] **5.1** 共通コンポーネントの作成
  - `src/components/ui/Button.tsx` - ボタン
  - `src/components/ui/Input.tsx` - 入力フィールド
  - `src/components/ui/Card.tsx` - カード

- [ ] **5.2** キャラクター関連コンポーネント
  - `src/components/character/TemplateCard.tsx` - テンプレート選択カード
  - `src/components/character/CharacterForm.tsx` - 作成フォーム

- [ ] **5.3** チャット関連コンポーネント
  - `src/components/chat/MessageBubble.tsx` - メッセージ吹き出し
  - `src/components/chat/ChatInput.tsx` - 入力欄
  - `src/components/chat/ChatHeader.tsx` - ヘッダー（キャラ名表示）

---

## フェーズ6: 機能実装

- [ ] **6.1** トークン制限の実装
  - Mastraエージェントの`maxTokens`設定: 500

- [ ] **6.2** 往復数制限の実装
  - フロントエンドでカウント管理
  - 20往復で入力無効化
  - 「新しい会話を始める」ボタン表示

- [ ] **6.3** エラーハンドリング
  - API エラー時のUI表示
  - ネットワークエラー対応

- [ ] **6.4** ローディング状態
  - ストリーミング中のインジケーター
  - ボタンの無効化

---

## フェーズ7: テスト・最適化

- [ ] **7.1** 動作確認
  - キャラクター作成フロー
  - 会話フロー
  - ストリーミング動作
  - 制限動作

- [ ] **7.2** レスポンシブ対応
  - モバイル表示の確認・調整

- [ ] **7.3** パフォーマンス確認
  - 初期読み込み速度
  - ストリーミングの滑らかさ

---

## フェーズ8: デプロイ準備

- [ ] **8.1** 本番用環境変数の準備
  - `GOOGLE_GENERATIVE_AI_API_KEY`

- [ ] **8.2** ビルド確認
  ```bash
  npm run build
  ```

- [ ] **8.3** PM2設定ファイルの作成 (`ecosystem.config.js`)
  ```javascript
  module.exports = {
    apps: [{
      name: 'ai-chat',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }]
  }
  ```

---

## フェーズ9: AWS EC2デプロイ

- [ ] **9.1** EC2インスタンスの準備
  - t2.micro または t3.micro
  - Amazon Linux 2 または Ubuntu
  - セキュリティグループ: ポート22, 80, 443, 3000

- [ ] **9.2** サーバー環境構築
  ```bash
  # Node.jsインストール
  curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
  sudo yum install -y nodejs

  # PM2インストール
  sudo npm install -g pm2
  ```

- [ ] **9.3** アプリケーションデプロイ
  ```bash
  # リポジトリクローン
  git clone <repository-url>
  cd ai-chat

  # 依存関係インストール
  npm install

  # ビルド
  npm run build

  # PM2で起動
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup
  ```

- [ ] **9.4** Nginx設定（オプション）
  - リバースプロキシ設定
  - SSL証明書（Let's Encrypt）

---

## 完了チェックリスト

- [ ] キャラクター作成画面が動作する
- [ ] テンプレートからキャラクターを選択できる
- [ ] カスタムキャラクターを作成できる
- [ ] 会話画面でストリーミングチャットができる
- [ ] 20往復で制限がかかる
- [ ] ポップなUIデザインになっている
- [ ] EC2にデプロイされている
- [ ] 本番環境で動作確認済み

---

## 技術メモ

### Mastra + Gemini設定例

```typescript
import { Agent } from "@mastra/core/agent";

const agent = new Agent({
  id: "character-agent",
  name: "Character Agent",
  instructions: `あなたは${characterName}です。${personality}`,
  model: "google/gemini-2.0-flash"
});

const stream = await agent.stream(messages, {
  maxTokens: 500
});
```

### Hono + Next.js App Router設定例

```typescript
// src/app/api/[[...route]]/route.ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app.post('/chat', async (c) => {
  // チャット処理
})

export const GET = handle(app)
export const POST = handle(app)
```

### AI SDK useChat使用例

```typescript
import { useChat } from 'ai/react';

const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  body: {
    character: { name, personality }
  }
});
```
