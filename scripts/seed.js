const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // ユーザー作成
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      name: "テストユーザー1",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      name: "テストユーザー2",
    },
  });

  // Google認証データ
  await prisma.googleUser.create({
    data: {
      userId: user1.uuid,
      refreshToken: "dummy_refresh_token_1",
      accessToken: "dummy_access_token_1",
      thumbnail: "https://example.com/avatar1.jpg",
    },
  });

  // チャンネル作成
  const channel1 = await prisma.channel.create({
    data: {
      channelId: "UC1234567890123456",
      channelName: "テスト配信チャンネル",
      handle: "@test-channel",
      thumbnail: "https://example.com/channel1.jpg",
    },
  });

  const channel2 = await prisma.channel.create({
    data: {
      channelId: "UC9876543210987654",
      channelName: "サンプルゲーミング",
      handle: "@sample-gaming",
      thumbnail: "https://example.com/channel2.jpg",
    },
  });

  // 動画・配信作成
  const video1 = await prisma.video.create({
    data: {
      videoId: "dQw4w9WgXcQ",
      channelId: channel1.channelId,
      title: "【生放送】今日の雑談配信",
      description: "今日もまったり雑談していきます！コメントお待ちしています。",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      startAt: new Date("2025-07-03T20:00:00Z"),
      liveStatus: "upcoming",
    },
  });

  const video2 = await prisma.video.create({
    data: {
      videoId: "abc123def456",
      channelId: channel2.channelId,
      title: "【Minecraft】新しい建築プロジェクト開始！",
      description: "今回は巨大な城を建設していきます。設計図から考えていこう。",
      url: "https://www.youtube.com/watch?v=abc123def456",
      thumbnail: "https://img.youtube.com/vi/abc123def456/maxresdefault.jpg",
      startAt: new Date("2025-07-02T19:00:00Z"),
      endAt: new Date("2025-07-02T22:30:00Z"),
      liveStatus: "completed",
    },
  });

  const video3 = await prisma.video.create({
    data: {
      videoId: "xyz789uvw012",
      channelId: channel1.channelId,
      title: "【告知】来週の特別企画について",
      description: "来週予定している特別企画の詳細をお話しします。",
      url: "https://www.youtube.com/watch?v=xyz789uvw012",
      thumbnail: "https://img.youtube.com/vi/xyz789uvw012/maxresdefault.jpg",
      liveStatus: "video",
    },
  });

  // チャンネル登録
  await prisma.subscription.create({
    data: {
      userId: user1.uuid,
      channelId: channel1.channelId,
    },
  });

  await prisma.subscription.create({
    data: {
      userId: user1.uuid,
      channelId: channel2.channelId,
    },
  });

  await prisma.subscription.create({
    data: {
      userId: user2.uuid,
      channelId: channel1.channelId,
    },
  });

  // 通知設定
  await prisma.userSchedule.create({
    data: {
      userId: user1.uuid,
      videoId: video1.videoId,
      isNoticed: false,
    },
  });

  await prisma.userSchedule.create({
    data: {
      userId: user2.uuid,
      videoId: video1.videoId,
      isNoticed: true,
    },
  });

  console.log("シードデータの投入が完了しました");
  console.log(`作成されたユーザー: ${user1.name}, ${user2.name}`);
  console.log(
    `作成されたチャンネル: ${channel1.channelName}, ${channel2.channelName}`
  );
  console.log(
    `作成された動画: ${video1.title}, ${video2.title}, ${video3.title}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
