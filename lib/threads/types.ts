export type ThreadsTheme = {
  id: string;
  nameJa: string;
  description: string;
  /** 運用メモ: どんな切り口で書くか */
  postingTips: string;
};

export type ThreadsPost = {
  id: string;
  themeId: string;
  /** Threads 本文（500文字以内） */
  text: string;
  enabled: boolean;
};

export type ThreadsPublishResult = {
  dryRun: boolean;
  postId: string;
  themeId: string;
  text: string;
  containerId?: string;
  mediaId?: string;
  permalink?: string;
  mediaVerified?: boolean;
};
