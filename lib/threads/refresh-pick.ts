import {
  getPostById,
  listRotatingPosts,
  THREADS_THEMES,
} from "@/lib/threads/content";
import { generateThreadsPost } from "@/lib/threads/generate-post";
import { getOverrideForDate, saveDateOverride } from "@/lib/threads/overrides-store";
import { dayMix, jstDayIndex } from "@/lib/threads/schedule";
import type { ThreadsPost } from "@/lib/threads/types";

function dateFromKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

async function defaultBankPick(dateKey: string): Promise<ThreadsPost | null> {
  const enabled = await listRotatingPosts();
  if (enabled.length === 0) return null;
  const index = jstDayIndex(dateFromKey(dateKey)) % enabled.length;
  return enabled[index] ?? null;
}

export async function refreshPickForDate(dateKey: string): Promise<{
  post: ThreadsPost;
  source: "bank" | "generated";
  refreshCount: number;
}> {
  const trimmed = dateKey.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new Error("date must be YYYY-MM-DD (JST)");
  }

  const existing = await getOverrideForDate(trimmed);
  const rejected = new Set(existing?.rejectedIds ?? []);
  const scheduled = await defaultBankPick(trimmed);
  const currentId = existing?.postId ?? scheduled?.id;
  if (currentId) rejected.add(currentId);

  const pool = await listRotatingPosts();
  const candidates = pool.filter((p) => !rejected.has(p.id));
  const refreshCount = (existing?.refreshCount ?? 0) + 1;

  if (candidates.length > 0) {
    const date = dateFromKey(trimmed);
    const index = dayMix(jstDayIndex(date), 31 + rejected.size) % candidates.length;
    const next = candidates[index]!;
    await saveDateOverride({
      date: trimmed,
      postId: next.id,
      themeId: next.themeId,
      text: next.text,
      rejectedIds: [...rejected],
      source: "bank",
      refreshCount,
      updatedAt: new Date().toISOString(),
    });
    return { post: next, source: "bank", refreshCount };
  }

  const theme =
    THREADS_THEMES[dayMix(jstDayIndex(dateFromKey(trimmed)), 7) % THREADS_THEMES.length]!;
  const avoidSnippets: string[] = [];
  if (existing?.text) avoidSnippets.push(existing.text);
  for (const id of rejected) {
    const hit = getPostById(id);
    if (hit?.text) avoidSnippets.push(hit.text);
  }

  const generated = await generateThreadsPost({
    themeId: theme.id,
    themeName: theme.nameJa,
    postingTips: theme.postingTips,
    avoidSnippets,
  });

  await saveDateOverride({
    date: trimmed,
    postId: generated.id,
    themeId: generated.themeId,
    text: generated.text,
    rejectedIds: [...rejected, generated.id],
    source: "generated",
    refreshCount,
    updatedAt: new Date().toISOString(),
  });

  return { post: generated, source: "generated", refreshCount };
}
