"use client";

import { useState, type FormEvent } from "react";

type PreviewResponse = {
  ok: boolean;
  message?: string;
  dryRunDefault?: boolean;
  date?: string;
  today?: {
    post: { id: string; themeId: string; text: string };
    theme: { id: string; nameJa: string; description: string } | null;
  } | null;
  upcoming?: Array<{
    date: string;
    postId: string;
    themeId: string;
    themeName: string;
    preview: string;
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
    length: number;
    preview: string;
  }>;
};

type PublishResponse = {
  ok: boolean;
  message?: string;
  dryRun?: boolean;
  postId?: string;
  text?: string;
  mediaId?: string;
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
    setPublishMsg(null);
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
    await loadPreview(token);
  }

  async function publish(opts: { postId?: string; dryRun: boolean }) {
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
          : `Posted — ${json.postId} (media ${json.mediaId ?? "?"})`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed");
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
            PRIME CAR WASH — テーマ確認・本日分投稿・ドライラン
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
                  {data.dryRunDefault ? (
                    <p className="mt-1 text-xs text-amber-500/90">
                      Credentials missing or THREADS_DRY_RUN — live publish needs tokens + dryRun
                      false.
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void publish({ dryRun: true })}
                    className="border border-neutral-600 px-3 py-1.5 text-xs tracking-wide hover:bg-neutral-900 disabled:opacity-40"
                  >
                    Dry-run today
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      if (!confirm("本日の投稿を Threads に公開しますか？")) return;
                      void publish({ dryRun: false });
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
                  >
                    Refresh
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
              <h2 className="text-sm tracking-wide text-neutral-400">Themes</h2>
              <ul className="space-y-3">
                {data.themes?.map((t) => (
                  <li key={t.id} className="border-b border-neutral-900 pb-3">
                    <p className="text-sm text-white">{t.nameJa}</p>
                    <p className="text-xs text-neutral-500">{t.description}</p>
                    <p className="mt-1 text-xs text-neutral-600">{t.postingTips}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm tracking-wide text-neutral-400">Next 14 days</h2>
              <ul className="space-y-2 text-sm">
                {data.upcoming?.map((u) => (
                  <li key={u.date} className="flex gap-3 border-b border-neutral-900 py-2">
                    <span className="w-24 shrink-0 text-neutral-500">{u.date}</span>
                    <span className="w-28 shrink-0 text-neutral-400">{u.themeName}</span>
                    <span className="min-w-0 flex-1 truncate text-neutral-300">{u.preview}</span>
                    <button
                      type="button"
                      disabled={loading}
                      className="shrink-0 text-xs text-neutral-500 underline hover:text-neutral-300"
                      onClick={() => {
                        if (!confirm(`${u.postId} を公開しますか？`)) return;
                        void publish({ postId: u.postId, dryRun: false });
                      }}
                    >
                      post
                    </button>
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
                  <li key={p.id} className="flex gap-2">
                    <span className="w-16 shrink-0 text-neutral-500">{p.id}</span>
                    <span className="w-28 shrink-0">{p.themeId}</span>
                    <span className="truncate">{p.preview}</span>
                    <span className="shrink-0 text-neutral-600">{p.length}字</span>
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
