import { getPostById } from "@/lib/threads/content";
import { getOverrideForDate } from "@/lib/threads/overrides-store";
import { loadPostedStore, postedStoreConfigured } from "@/lib/threads/posted-store";
import {
  jstDateKey,
  pickPostForDate,
  pickPostForDateSkippingAired,
} from "@/lib/threads/schedule";
import type { ThreadsPost } from "@/lib/threads/types";

function dateFromKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

/** バンク・日付差し替え（AI生成含む）を解決して投稿可能な本文にする */
export async function resolvePostForPublish(opts: {
  postId?: string;
  date?: string;
}): Promise<ThreadsPost | null> {
  const dateKey = opts.date?.trim() || jstDateKey();
  const override = await getOverrideForDate(dateKey);

  if (opts.postId?.trim()) {
    const id = opts.postId.trim();
    if (override?.postId === id) {
      return {
        id: override.postId,
        themeId: override.themeId,
        text: override.text,
        enabled: true,
      };
    }
    const fromBank = getPostById(id);
    if (fromBank) return fromBank;
    return null;
  }

  if (override) {
    return {
      id: override.postId,
      themeId: override.themeId,
      text: override.text,
      enabled: true,
    };
  }

  const postedStore = postedStoreConfigured() ? await loadPostedStore() : { records: [] };
  const { post } = await pickPostForDateSkippingAired(dateFromKey(dateKey), postedStore.records);
  return post ?? pickPostForDate(dateFromKey(dateKey));
}
