import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
const siteUrl = readFileSync(join(root, "lib/site-url.ts"), "utf8");
const nextConfig = readFileSync(join(root, "next.config.ts"), "utf8");

const HSTS = "max-age=63072000; includeSubDomains; preload";
const APEX_HOST = "xn--79q753awyk7z6a.jp";
const WWW_HOST = `www.${APEX_HOST}`;
const APEX_ORIGIN = `https://${APEX_HOST}`;

describe("GSC canonical host config", () => {
  it("sends HSTS preload from Vercel edge (covers www redirects)", () => {
    const values = (vercel.headers ?? [])
      .flatMap((rule) => rule.headers ?? [])
      .filter((header) => header.key === "Strict-Transport-Security")
      .map((header) => header.value);
    assert.deepEqual(values, [HSTS]);
  });

  it("permanently redirects punycode www to HTTPS apex", () => {
    const www = (vercel.redirects ?? []).find((rule) =>
      rule.has?.some((condition) => condition.value === WWW_HOST),
    );
    assert.ok(www, "missing www punycode host redirect");
    assert.equal(www.destination, `${APEX_ORIGIN}/:path*`);
    assert.equal(www.permanent, true);
  });

  it("permanently redirects unicode www to HTTPS apex", () => {
    const www = (vercel.redirects ?? []).find((rule) =>
      rule.has?.some((condition) => condition.value === "www.出張洗車.jp"),
    );
    assert.ok(www, "missing unicode www host redirect");
    assert.equal(www.destination, `${APEX_ORIGIN}/:path*`);
    assert.equal(www.permanent, true);
  });

  it("keeps sitemap/canonical helper on HTTPS apex with matching HSTS", () => {
    assert.match(siteUrl, new RegExp(`CANONICAL_ORIGIN = "${APEX_ORIGIN}"`));
    assert.match(siteUrl, new RegExp(`HSTS_HEADER_VALUE =\\s*"${HSTS}"`));
    assert.match(nextConfig, /HSTS_HEADER_VALUE/);
    assert.doesNotMatch(siteUrl, /https:\/\/www\./);
  });
});
