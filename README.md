# LiveTable Database Schema

このリポジトリはLiveTableアプリケーションのデータベーススキーマとマイグレーションファイルを管理します。

## Overview

LiveTableはMySQL + Prisma ORMを使用してデータベースを管理しています。このリポジトリは以下の要素の中央管理を行います：

- データベーススキーマ定義
- マイグレーションスクリプト
- データベースドキュメント
- シードデータ（必要に応じて）

## Database Structure

### Core Entities

- **User**: メール認証を使用した基本ユーザー情報
- **GoogleUser**: Google OAuthトークンを含む拡張ユーザーデータ
- **Channel**: YouTubeチャンネル情報
- **Video**: メタデータ付きのYouTube動画・ライブ配信
- **Subscription**: ユーザー・チャンネル登録関係
- **UserSchedule**: 特定動画に対するユーザー通知設定

### Entity Relationships

```
User (1) ←→ (1) GoogleUser
User (1) ←→ (n) Subscription ←→ (1) Channel
User (1) ←→ (n) UserSchedule ←→ (1) Video
Channel (1) ←→ (n) Video
```

## Files

- `prisma/schema.prisma` - 完全なPrismaスキーマ定義
- `prisma/migrations/` - マイグレーション履歴
- `scripts/` - データベースユーティリティスクリプト
- `docs/` - データベースドキュメントとER図
  - `schema.drawio.svg` - データベーススキーマ図
- `docker/` - Docker開発環境
  - `Dockerfile` - MySQLコンテナ設定
  - `docker-compose.yml` - 開発用Docker構成
  - `my.cnf` - MySQL設定ファイル

## Usage

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- pnpm

### Setup

#### Option 1: Docker使用（推奨）

```bash
# Dockerでデータベースを起動
cd docker
docker-compose up -d

# 環境変数を設定
cp .env.example .env
# DATABASE_URL="mysql://livetable:password@localhost:58923/livetable"

# 依存関係をインストール
pnpm install

# マイグレーションを実行
pnpm run migrate

# オプション: 開発用データを投入
pnpm run seed
```

#### Option 2: ローカルMySQL使用

```bash
# 依存関係をインストール
pnpm install

# データベース接続を設定
cp .env.example .env
# .envファイルにデータベース認証情報を記載

# マイグレーションを実行
pnpm run migrate

# オプション: 開発用データを投入
pnpm run seed
```

### Development Workflow

#### スキーマ変更を行う場合

1. `prisma/schema.prisma`を更新
2. マイグレーション生成: `pnpm run migrate:dev --name 変更内容の説明`
3. 開発用データベースでマイグレーションをテスト
4. スキーマとマイグレーションファイルをコミット

#### 本番デプロイ

```bash
# 本番環境にマイグレーションをデプロイ
pnpm run migrate:deploy

# Prismaクライアントを生成（アプリケーションで使用する場合）
pnpm run generate
```

### Scripts

- `pnpm run migrate` - データベースにマイグレーションをデプロイ
- `pnpm run migrate:dev` - 新しいマイグレーションを作成・適用
- `pnpm run migrate:reset` - データベースをリセットし全マイグレーションを適用
- `pnpm run generate` - Prismaクライアントを生成
- `pnpm run studio` - データベース閲覧用Prisma Studioを起動
- `pnpm run seed` - シードスクリプトを実行
- `pnpm run validate` - スキーマ形式を検証

## Integration

### Backend API Server

APIサーバーは依存関係またはサブモジュールとしてこのリポジトリを参照し、スキーマの一貫性を保つ必要があります。

### Frontend

このスキーマからフロントエンド用のTypeScript型を生成し、スタック全体で型安全性を維持できます。

### CI/CD Integration

- プルリクエストでのスキーマ検証
- テストデータベースでのマイグレーションテスト
- 依存リポジトリでの自動クライアント生成

## Schema Design Principles

1. **正規化**: 外部キーを使用した適切なリレーショナル設計
2. **インデックス**: クエリパフォーマンス向上のための戦略的インデックス
3. **データ整合性**: データベースレベルでの制約と検証
4. **タイムスタンプ**: 作成・更新の監査フィールド
5. **柔軟性**: 外部APIからのオプションデータ用のnullable フィールド

## Migration Guidelines

1. **後方互換性**: 既存アプリケーションを破壊しないマイグレーション
2. **データ安全性**: 本番マイグレーション前の必須バックアップ
3. **テスト**: 本番相当データでのマイグレーションテスト
4. **ロールバック計画**: 複雑なマイグレーション用のロールバック戦略
5. **ドキュメント**: 破壊的変更と必要なアプリケーション更新の文書化

## Contributing

1. スキーマ変更用のフィーチャーブランチを作成
2. schema.prismaを変更内容に応じて更新
3. 説明的な名前でマイグレーションを生成
4. ローカルでマイグレーションをテスト
5. 必要に応じてドキュメントを更新
6. スキーマとマイグレーション変更のプルリクエストを作成
