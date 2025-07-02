# livetable-db

LiveTable アプリケーションのデータベーススキーマとマイグレーション管理

## 概要

YouTube 配信通知アプリのための MySQL + Prisma スキーマ

## 主要エンティティ

- User: ユーザー情報
- GoogleUser: Google OAuth 認証データ
- Channel: YouTube チャンネル
- Video: YouTube 動画・ライブ配信
- Subscription: ユーザーのチャンネル登録
- UserSchedule: 動画通知設定

## セットアップ

```bash
# Docker環境の起動
pnpm run docker:up

# 依存関係インストール
pnpm install

# マイグレーション実行
pnpm run migrate
```

## 主要コマンド

- `pnpm run migrate` - マイグレーション適用
- `pnpm run migrate:dev` - 開発用マイグレーション作成
- `pnpm run studio` - データベース管理画面
- `pnpm run validate` - スキーマ検証
- `pnpm run docker:up/down` - Docker 環境操作
