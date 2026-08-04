import {
  getPostById,
  listAutoThemes,
  listRotatingPosts,
} from "@/lib/threads/content";
import { generateThreadsPost } from "@/lib/threads/generate-post";
import {
  getOverrideForDate,
  saveDateOverride,
  type DateOverride,
} from "@/lib/threads/overrides-store";
import { dayMix, jstDayIndex } from "@/lib/threads/schedule";
import type { ThreadsPost } from "@/lib/threads/types";

const MAX_RECENT_TEXTS = 20;

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

function collectAvoidSnippets(
  existing: DateOverride | null,
  rejected: Set<string>,
): string[] {
  const snippets = new Set<string>();
  if (existing?.text) snippets.add(existing.text);
  for (const t of existing?.recentTexts ?? []) {
    if (t.trim()) snippets.add(t);
  }
  for (const id of rejected) {
    const hit = getPostById(id);
    if (hit?.text) snippets.add(hit.text);
  }
  return [...snippets].slice(-MAX_RECENT_TEXTS);
}

function appendRecentTexts(existing: DateOverride | null, nextText: string): string[] {
  const recent = [...(existing?.recentTexts ?? [])];
  if (existing?.text?.trim()) recent.push(existing.text);
  if (nextText.trim()) recent.push(nextText);
  return recent.slice(-MAX_RECENT_TEXTS);
}

async function generateAndSave(
  dateKey: string,
  existing: DateOverride | null,
  rejected: Set<string>,
  refreshCount: number,
): Promise<{ post: ThreadsPost; refreshCount: number }> {
  const date = dateFromKey(dateKey);
  const themes = listAutoThemes();
  const theme = themes[dayMix(jstDayIndex(date), 7 + refreshCount) % themes.length]!;

  const generated = await generateThreadsPost({
    themeId: theme.id,
    themeName: theme.nameJa,
    postingTips: theme.postingTips,
    avoidSnippets: collectAvoidSnippets(existing, rejected),
    variationSeed: refreshCount,
  });

  await saveDateOverride({
    date: dateKey,
    postId: generated.id,
    themeId: generated.themeId,
    text: generated.text,
    rejectedIds: [...rejected, generated.id],
    recentTexts: appendRecentTexts(existing, generated.text),
    source: "generated",
    refreshCount,
    updatedAt: new Date().toISOString(),
  });

  return { post: generated, refreshCount };
}

export async function refreshPickForDate(
  dateKey: string,
  options?: { forceGenerate?: boolean },
): Promise<{
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

  const refreshCount = (existing?.refreshCount ?? 0) + 1;

  if (options?.forceGenerate) {
    const result = await generateAndSave(trimmed, existing, rejected, refreshCount);
    return { post: result.post, source: "generated", refreshCount: result.refreshCount };
  }

  const pool = await listRotatingPosts();
  const candidates = pool.filter((p) => !rejected.has(p.id));

  if (candidates.length > 0) {
    const date = dateFromKey(trimmed);
    const index = dayMix(jstDayIndex(date), 31 + refreshCount) % candidates.length;
    const next = candidates[index]!;
    await saveDateOverride({
      date: trimmed,
      postId: next.id,
      themeId: next.themeId,
      text: next.text,
      rejectedIds: [...rejected],
      recentTexts: appendRecentTexts(existing, next.text),
      source: "bank",
      refreshCount,
      updatedAt: new Date().toISOString(),
    });
    return { post: next, source: "bank", refreshCount };
  }

  const result = await generateAndSave(trimmed, existing, rejected, refreshCount);
  return { post: result.post, source: "generated", refreshCount: result.refreshCount };
}
