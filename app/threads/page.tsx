"use client";

import { useState, type FormEvent } from "react";

type PreviewResponse = {
  ok: boolean;
  message?: string;
  dryRunDefault?: boolean;
  canPersistDeletes?: boolean;
  date?: string;
  schedule?: {
    window: { start: number; end: number };
    todayHourJst: number;
    todayMinuteJst?: number;
    todayTimeLabel?: string;
    currentHourJst: number;
    currentMinuteJst?: number;
    note: string;
  };
  today?: {
    post: { id: string; themeId: string; text: string };
    theme: { id: string; nameJa: string; description: string } | null;
    hourJst?: number;
    minuteJst?: number;
    timeLabel?: string;
    refreshCount?: number;
    pickSource?: "schedule" | "bank" | "generated";
  } | null;
  upcoming?: Array<{
    date: string;
    hourJst?: number;
    minuteJst?: number;
    timeLabel?: string;
    postId: string;
    themeId: string;
    themeName: string;
    text: string;
    preview: string;
    refreshCount?: number;
    pickSource?: "schedule" | "bank" | "generated";
  }>;
  themes?: Array<{
    id: string;
    nameJa: string;
    description: string;
    postingTips: string;
  }>;
  posts?: Array<{
    id: string;
    themeId: string;
    enabled: boolean;
    deleted?: boolean;
    length: number;
    preview: string;
  }>;
  deletedIds?: string[];
  canTrackPosted?: boolean;
  canRefreshPosts?: boolean;
  publish?: {
    postedToday: {
      date: string;
      postId: string;
      mediaId?: string;
      publishedAt: string;
      source: "cron" | "catch_up" | "manual";
    } | null;
    eligibleNow: boolean;
    mode: "on_time" | "catch_up" | null;
    skipReason: string | null;
    catchUpEnabled: boolean;
  };
};

type PublishResponse = {
  ok: boolean;
  message?: string;
  dryRun?: boolean;
  postId?: string;
  text?: string;
  mediaId?: string;
  extraPost?: boolean;
};

export default function ThreadsOpsPage() {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PreviewResponse | null>(null);
  const [publishMsg, setPublishMsg] = useState<string | null>(null);

  async function loadPreview(token: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/threads/preview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as PreviewResponse;
      if (!res.ok || !json.ok) {
        setError(json.message ?? `HTTP ${res.status}`);
        setData(null);
        return;
      }
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function onUnlock(e: FormEvent) {
    e.preventDefault();
    const token = secret.trim();
    if (!token) return;
    setPublishMsg(null);
    await loadPreview(token);
  }

  async function publish(opts: {
    postId?: string;
    date?: string;
    dryRun: boolean;
  }) {
    setPublishMsg(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/threads/publish", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(opts),
      });
      const json = (await res.json()) as PublishResponse;
      if (!res.ok || !json.ok) {
        setError(json.message ?? `HTTP ${res.status}`);
        return;
      }
      setPublishMsg(
        json.dryRun
          ? `Dry-run OK — ${json.postId}\n\n${json.text ?? ""}`
          : `Posted${json.extraPost ? "（追加投稿）" : ""} — ${json.postId} (media ${json.mediaId ?? "?"})`,
      );
      await loadPreview(secret.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setLoading(false);
    }
  }

  async function refreshPost(date: string, forceGenerate = false) {
    setError(null);
    setPublishMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/threads/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, forceGenerate }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        message?: string;
        note?: string;
        postId?: string;
        source?: string;
        text?: string;
      };
      if (!res.ok || !json.ok) {
        setError(json.message ?? `HTTP ${res.status}`);
        return;
      }
      setPublishMsg(
        `${json.note ?? "Refreshed"} — ${json.postId} (${json.source})\n\n${json.text ?? ""}`,
      );
      await loadPreview(secret.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setLoading(false);
    }
  }

  async function removeFromRotation(postId: string) {
    if (
      !confirm(
        `${postId} をローテーションから削除しますか？\n以降の予定が繰り上がります（本文ファイル自体は残ります）。`,
      )
    ) {
      return;
    }
    setError(null);
    setPublishMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/threads/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string; note?: string };
      if (!res.ok || !json.ok) {
        setError(json.message ?? `HTTP ${res.status}`);
        return;
      }
      setPublishMsg(json.note ?? `Deleted ${postId} from rotation`);
      await loadPreview(secret.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  async function restoreToRotation(postId: string) {
    setError(null);
    setPublishMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/threads/posts", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${secret.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) {
        setError(json.message ?? `HTTP ${res.status}`);
        return;
      }
      setPublishMsg(`Restored ${postId}`);
      await loadPreview(secret.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Restore failed");
    } finally {
      setLoading(false);
    }
  }

  const unlocked = data !== null;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2 border-b border-neutral-800 pb-6">
          <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase">Internal</p>
          <h1 className="font-serif text-2xl tracking-wide text-white">Threads Ops</h1>
          <p className="text-sm text-neutral-400">
            PRIME CAR WASH — テーマ確認・投稿・削除（繰り上げ）
          </p>
        </header>

        {!unlocked ? (
          <form onSubmit={onUnlock} className="space-y-4">
            <label className="block space-y-2 text-sm">
              <span className="text-neutral-400">THREADS_PUBLISH_SECRET</span>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100 outline-none focus:border-neutral-500"
                autoComplete="off"
              />
            </label>
            <button
              type="submit"
              disabled={loading || !secret.trim()}
              className="border border-neutral-600 px-4 py-2 text-sm tracking-wide hover:bg-neutral-900 disabled:opacity-40"
            >
              Unlock
            </button>
          </form>
        ) : (
          <>
            <section className="space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-neutral-500">Today (JST {data.date})</p>
                  <h2 className="text-lg text-white">
                    {data.today?.theme?.nameJa ?? "—"} · {data.today?.post.id}
                  </h2>
                  {data.schedule ? (
                    <p className="mt-1 text-xs text-neutral-400">
                      自動投稿の目安: 今日{" "}
                      {data.schedule.todayTimeLabel ??
                        `${data.schedule.todayHourJst}:00`}{" "}
                      JST（窓 {data.schedule.window.start}–{data.schedule.window.end}
                      時／いま {String(data.schedule.currentHourJst).padStart(2, "0")}:
                      {String(data.schedule.currentMinuteJst ?? 0).padStart(2, "0")}）
                    </p>
                  ) : null}
                  {data.schedule?.note ? (
                    <p className="mt-1 text-xs text-neutral-600">{data.schedule.note}</p>
                  ) : null}
                  {data.publish?.postedToday ? (
                    <p className="mt-1 text-xs text-emerald-400/90">
                      本日投稿済み: {data.publish.postedToday.postId}（
                      {data.publish.postedToday.source}）— 手動 Publish / AI生成で
                      <span className="text-neutral-300"> 追加投稿できます</span>
                    </p>
                  ) : data.publish?.eligibleNow ? (
                    <p className="mt-1 text-xs text-sky-400/90">
                      次の Cron で投稿予定
                      {data.publish.mode === "catch_up" ? "（取りこぼし追いかけ）" : "（定刻）"}
                    </p>
                  ) : data.publish?.skipReason ? (
                    <p className="mt-1 text-xs text-neutral-500">
                      自動投稿: {data.publish.skipReason}
                      {data.publish.catchUpEnabled ? "" : "（投稿記録ストア未設定）"}
                    </p>
                  ) : null}
                  {data.canPersistDeletes === false ? (
                    <p className="mt-1 text-xs text-amber-500/90">
                      削除の永続化には Vercel Blob（BLOB_READ_WRITE_TOKEN）が必要です。
                    </p>
                  ) : null}
                  {data.canRefreshPosts === false ? (
                    <p className="mt-1 text-xs text-amber-500/90">
                      「別の案」には Vercel Blob の接続が必要です（Storage → このプロジェクトに接続 → Redeploy）。
                    </p>
                  ) : null}
                  {data.today?.refreshCount ? (
                    <p className="mt-1 text-xs text-neutral-500">
                      差し替え {data.today.refreshCount} 回
                      {data.today.pickSource === "generated" ? " · AI生成" : ""}
                    </p>
                  ) : null}
                  {data.dryRunDefault ? (
                    <p className="mt-1 text-xs text-amber-500/90">
                      いまは練習モード（DRY_RUN=true、または USER_ID/TOKEN未設定）。
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={loading || !data.today?.post.id}
                    onClick={() => {
                      const id = data.today?.post.id;
                      if (!id) return;
                      void removeFromRotation(id);
                    }}
                    className="border border-red-900/80 px-3 py-1.5 text-xs tracking-wide text-red-300 hover:bg-red-950/40 disabled:opacity-40"
                  >
                    Delete today
                  </button>
                  <button
                    type="button"
                    disabled={loading || !data.canRefreshPosts || !data.date}
                    onClick={() => {
                      if (!data.date) return;
                      void refreshPost(data.date, true);
                    }}
                    className="border border-violet-900/80 px-3 py-1.5 text-xs tracking-wide text-violet-300 hover:bg-violet-950/40 disabled:opacity-40"
                    title="Gemini で新規文面を生成（何度でも）"
                  >
                    AIで生成
                  </button>
                  <button
                    type="button"
                    disabled={loading || !data.canRefreshPosts || !data.date}
                    onClick={() => {
                      if (!data.date) return;
                      void refreshPost(data.date);
                    }}
                    className="border border-sky-900/80 px-3 py-1.5 text-xs tracking-wide text-sky-300 hover:bg-sky-950/40 disabled:opacity-40"
                    title="別の投稿案に差し替え（バンク→AI）"
                  >
                    別の案
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      void publish({
                        postId: data.today?.post.id,
                        date: data.date,
                        dryRun: true,
                      })
                    }
                    className="border border-neutral-600 px-3 py-1.5 text-xs tracking-wide hover:bg-neutral-900 disabled:opacity-40"
                  >
                    Dry-run today
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      const msg = data.publish?.postedToday
                        ? "本日は既に投稿済みです。プレビュー文を追加で Threads に公開しますか？"
                        : "本日の投稿を Threads に公開しますか？";
                      if (!confirm(msg)) return;
                      void publish({
                        postId: data.today?.post.id,
                        date: data.date,
                        dryRun: false,
                      });
                    }}
                    className="border border-white/70 bg-white px-3 py-1.5 text-xs tracking-wide text-neutral-950 hover:bg-neutral-200 disabled:opacity-40"
                  >
                    Publish today
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void loadPreview(secret.trim())}
                    className="border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:bg-neutral-900 disabled:opacity-40"
                    title="画面の表示だけ更新（投稿文は変わりません）"
                  >
                    再読込
                  </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap border border-neutral-800 bg-neutral-900/60 p-4 text-sm leading-relaxed text-neutral-200">
                {data.today?.post.text ?? "（投稿なし）"}
              </pre>
            </section>

            {publishMsg ? (
              <pre className="whitespace-pre-wrap border border-emerald-900/50 bg-emerald-950/30 p-4 text-sm text-emerald-100">
                {publishMsg}
              </pre>
            ) : null}

            <section className="space-y-3">
              <h2 className="text-sm tracking-wide text-neutral-400">Next 14 days（明日以降）</h2>
              <p className="text-xs text-neutral-600">
                「別の案」でバンクから差し替え、「AIで生成」で Gemini
                新規文面（何度でも）。投稿済みの日も手動 Publish で追加投稿できます。
              </p>
              <ul className="space-y-4 text-sm">
                {data.upcoming?.map((u) => (
                  <li key={u.date} className="space-y-2 border-b border-neutral-900 pb-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-neutral-500">{u.date}</span>
                      <span className="text-neutral-500">
                        {u.timeLabel ?? (u.hourJst != null ? `${u.hourJst}:00` : "—")}
                      </span>
                      <span className="text-neutral-400">{u.themeName}</span>
                      <span className="text-neutral-600">{u.postId}</span>
                      {u.refreshCount ? (
                        <span className="text-xs text-neutral-600">
                          差替×{u.refreshCount}
                          {u.pickSource === "generated" ? " AI" : ""}
                        </span>
                      ) : null}
                      <span className="ml-auto flex shrink-0 gap-2">
                        <button
                          type="button"
                          disabled={loading || !data.canRefreshPosts}
                          className="text-xs text-violet-400/90 underline hover:text-violet-300 disabled:opacity-40"
                          title="Gemini で新規文面を生成"
                          onClick={() => void refreshPost(u.date, true)}
                        >
                          AI生成
                        </button>
                        <button
                          type="button"
                          disabled={loading || !data.canRefreshPosts}
                          className="text-xs text-sky-400/90 underline hover:text-sky-300 disabled:opacity-40"
                          title="別の投稿案に差し替え"
                          onClick={() => void refreshPost(u.date)}
                        >
                          別の案
                        </button>
                        <button
                          type="button"
                          disabled={loading}
                          className="text-xs text-neutral-500 underline hover:text-neutral-300"
                          onClick={() => {
                            if (!confirm(`${u.postId} を公開しますか？`)) return;
                            void publish({ postId: u.postId, date: u.date, dryRun: false });
                          }}
                        >
                          post
                        </button>
                        <button
                          type="button"
                          disabled={loading}
                          className="text-xs text-red-400/90 underline hover:text-red-300"
                          onClick={() => void removeFromRotation(u.postId)}
                        >
                          delete
                        </button>
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap border border-neutral-800/80 bg-neutral-900/40 p-3 text-sm leading-relaxed text-neutral-200">
                      {u.text}
                    </pre>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm tracking-wide text-neutral-400">
                Post bank ({data.posts?.length ?? 0})
              </h2>
              <ul className="max-h-80 space-y-2 overflow-y-auto text-xs text-neutral-400">
                {data.posts?.map((p) => (
                  <li
                    key={p.id}
                    className={`flex gap-2 ${p.deleted ? "opacity-40 line-through" : ""}`}
                  >
                    <span className="w-16 shrink-0 text-neutral-500">{p.id}</span>
                    <span className="w-28 shrink-0">{p.themeId}</span>
                    <span className="min-w-0 flex-1 truncate">{p.preview}</span>
                    {p.deleted ? (
                      <button
                        type="button"
                        disabled={loading}
                        className="shrink-0 text-neutral-400 underline"
                        onClick={() => void restoreToRotation(p.id)}
                      >
                        restore
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={loading}
                        className="shrink-0 text-red-400/80 underline"
                        onClick={() => void removeFromRotation(p.id)}
                      >
                        delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <button
              type="button"
              className="text-xs text-neutral-600 underline"
              onClick={() => {
                setData(null);
                setPublishMsg(null);
                setError(null);
              }}
            >
              Lock
            </button>
          </>
        )}

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {loading ? <p className="text-xs text-neutral-600">Working…</p> : null}
      </div>
    </main>
  );
}
