import { NextResponse } from "next/server";
import { assertPostBank, getPostById, getThemeById, THREADS_POSTS, THREADS_THEMES } from "@/lib/threads/content";
import { authorizeThreadsRequest, threadsAuthConfigured } from "@/lib/threads/auth";
import { isThreadsDryRun } from "@/lib/threads/client";
import {
  disabledStoreConfigured,
  getDisabledPostIds,
  loadDisabledStore,
} from "@/lib/threads/disabled-store";
import { jstDateKey, peekUpcoming, pickPostForDate, shouldAutoPublishNow } from "@/lib/threads/schedule";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!threadsAuthConfigured()) {
    return NextResponse.json(
      { ok: false, message: "THREADS_PUBLISH_SECRET (or CRON_SECRET) is not configured." },
      { status: 503 },
    );
  }
  if (!authorizeThreadsRequest(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    assertPostBank();
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Invalid post bank." },
      { status: 500 },
    );
  }

  const today = await pickPostForDate();
  const theme = today ? getThemeById(today.themeId) : undefined;
  const slot = shouldAutoPublishNow();
  const disabled = await getDisabledPostIds();
  const disabledStore = await loadDisabledStore();
  const upcoming = await peekUpcoming(14);

  return NextResponse.json({
    ok: true,
    dryRunDefault: isThreadsDryRun(),
    date: jstDateKey(),
    canPersistDeletes: disabledStoreConfigured(),
    schedule: {
      window: slot.window,
      todayHourJst: slot.targetHourJst,
      todayMinuteJst: slot.targetMinuteJst,
      todayTimeLabel: slot.targetLabel,
      currentHourJst: slot.hourJst,
      currentMinuteJst: slot.minuteJst,
      note: slot.precisionNote,
    },
    today: today
      ? {
          post: today,
          theme: theme ?? null,
          hourJst: slot.targetHourJst,
          minuteJst: slot.targetMinuteJst,
          timeLabel: slot.targetLabel,
        }
      : null,
    upcoming: upcoming.map(({ date, post, hourJst, minuteJst, timeLabel }) => ({
      date,
      hourJst,
      minuteJst,
      timeLabel,
      postId: post.id,
      themeId: post.themeId,
      themeName: getThemeById(post.themeId)?.nameJa ?? post.themeId,
      preview: post.text.slice(0, 80).replace(/\n/g, " "),
    })),
    themes: THREADS_THEMES,
    posts: THREADS_POSTS.map((p) => ({
      id: p.id,
      themeId: p.themeId,
      enabled: p.enabled,
      deleted: disabled.has(p.id),
      length: p.text.length,
      preview: p.text.slice(0, 80).replace(/\n/g, " "),
    })),
    deletedIds: disabledStore.ids,
  });
}
