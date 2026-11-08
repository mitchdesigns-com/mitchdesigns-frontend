#!/usr/bin/env node
// Removes em/en dashes from every text field in Strapi (Malak's rule: no "—"
// in site copy), rewriting them with undash(). Reads the content model from
// the backend repo's schema files, loads each entry fully populated, and sends
// back only the attributes that changed (whole components, media as ids).
// Skips entries whose draft differs from the published version, and any
// component holding relations (reported, left as is).
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-undash.mjs [--dry] [--only=blog,faq] [--entries=slug,…] [--without=seo]
//   BACKEND=../backend (default)
import fs from "node:fs";
import path from "node:path";
import { undash } from "./undash.mjs";

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) ?? "").slice(7).split(",").filter(Boolean);
// --entries=slug,slug limits to those entries; --without=seo leaves those fields as they are
// (e.g. an SEO block that already breaks a Strapi length rule can't be saved).
const ENTRIES = (process.argv.find((a) => a.startsWith("--entries=")) ?? "").slice(10).split(",").filter(Boolean);
const WITHOUT = new Set((process.argv.find((a) => a.startsWith("--without=")) ?? "").slice(10).split(",").filter(Boolean));
const BACKEND = process.env.BACKEND ?? path.resolve(process.cwd(), "../backend");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
// Lead/funnel data is submitted by visitors, not site copy.
const SKIP_TYPES = new Set(["lead", "funnel-session", "staging-lead", "staging-funnel-session"]);
const TITLE_FIELDS = new Set(["metaTitle", "ogTitle", "seoTitle"]);

// ── Content model ───────────────────────────────────────────────────────────
const components = {};
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".json")) components[`${path.basename(dir)}.${e.name.replace(/\.json$/, "")}`] = JSON.parse(fs.readFileSync(p, "utf8"));
  }
})(path.join(BACKEND, "src/components"));
const types = fs.readdirSync(path.join(BACKEND, "src/api")).flatMap((api) => {
  const dir = path.join(BACKEND, "src/api", api, "content-types");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((ct) => JSON.parse(fs.readFileSync(path.join(dir, ct, "schema.json"), "utf8")));
});

/** Populate tree for a set of attributes (components, zones, media). */
function populateFor(attrs, depth = 0) {
  const out = {};
  for (const [k, a] of Object.entries(attrs)) {
    if (a.type === "media") out[k] = true;
    else if (a.type === "component") {
      const sub = populateFor(components[a.component].attributes, depth + 1);
      out[k] = Object.keys(sub).length ? { populate: sub } : true;
    } else if (a.type === "dynamiczone") {
      const on = {};
      for (const c of a.components) {
        const sub = populateFor(components[c].attributes, depth + 1);
        on[c] = Object.keys(sub).length ? { populate: sub } : true;
      }
      out[k] = { on };
    }
  }
  return out;
}
function qs(obj, prefix) {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}[${k}]` : k;
    return v && typeof v === "object" ? qs(v, key) : [`${key}=${encodeURIComponent(v)}`];
  }).join("&");
}

// ── Rewriting ───────────────────────────────────────────────────────────────
const hasDash = (v) => typeof v === "string" && /[—–]/.test(v);
const samples = [];
function fixText(v, field) {
  if (!hasDash(v)) return v;
  const next = undash(v, { title: TITLE_FIELDS.has(field) });
  if (samples.length < 400) samples.push([v, next]);
  return next;
}
function fixBlocks(nodes) {
  if (!Array.isArray(nodes)) return nodes;
  return nodes.map((n) => {
    if (!n || typeof n !== "object") return n;
    if (Array.isArray(n.children)) {
      const kids = n.children;
      return {
        ...n,
        children: kids.map((c) => {
          if (c?.type === "text" && hasDash(c.text)) {
            const next = undash(c.text, { inline: kids.length > 1 });
            if (samples.length < 400) samples.push([c.text, next]);
            return { ...c, text: next };
          }
          return Array.isArray(c?.children) ? fixBlocks([c])[0] : c;
        }),
      };
    }
    return n;
  });
}
let blocked = [];
/** Rebuilds a component value for PUT; returns [value, changed]. */
function fixComponent(value, attrs, where) {
  if (value == null) return [value, false];
  let changed = false;
  const out = value.id != null ? { id: value.id } : {};
  if (value.__component) out.__component = value.__component;
  for (const [k, a] of Object.entries(attrs)) {
    const v = value[k];
    if (a.type === "relation") {
      if (v != null) blocked.push(`${where}.${k}`);
      continue;
    }
    const [nv, ch] = fixAttr(v, a, k, `${where}.${k}`);
    if (ch) changed = true;
    out[k] = nv;
  }
  return [out, changed];
}
function fixAttr(v, a, k, where) {
  if (v === undefined) return [undefined, false];
  switch (a.type) {
    case "string": case "text": case "richtext": {
      if (a.type === "string" && /slug|url|href|email|key/i.test(k)) return [v, false];
      const nv = fixText(v, k);
      return [nv, nv !== v];
    }
    case "blocks": {
      const before = JSON.stringify(v);
      const nv = fixBlocks(v);
      return [nv, JSON.stringify(nv) !== before];
    }
    case "media":
      return [Array.isArray(v) ? v.map((m) => m.id) : v ? v.id : null, false];
    case "component": {
      const attrs = components[a.component].attributes;
      if (a.repeatable) {
        let ch = false;
        const nv = (v ?? []).map((item, i) => { const [x, c] = fixComponent(item, attrs, `${where}[${i}]`); ch ||= c; return x; });
        return [nv, ch];
      }
      return fixComponent(v, attrs, where);
    }
    case "dynamiczone": {
      let ch = false;
      const nv = (v ?? []).map((item, i) => { const [x, c] = fixComponent(item, components[item.__component].attributes, `${where}[${i}]`); ch ||= c; return x; });
      return [nv, ch];
    }
    default:
      return [v, false];
  }
}

// ── Run ─────────────────────────────────────────────────────────────────────
async function api(p, init = {}) {
  const res = await fetch(`${STRAPI}${p}`, { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${p} → ${res.status} ${JSON.stringify(body?.error ?? body).slice(0, 300)}`);
  return body;
}
const report = { updated: [], skippedDraft: [], blockedRelations: [], failed: [] };
for (const t of types) {
  const name = t.info.singularName;
  if (SKIP_TYPES.has(name) || (ONLY.length && !ONLY.includes(name))) continue;
  const single = t.kind === "singleType";
  const base = `/api/${single ? name : t.info.pluralName}`;
  const pop = qs({ populate: populateFor(t.attributes) });
  const draftable = t.options?.draftAndPublish !== false;
  const list = async (status) => {
    if (single) { const r = await api(`${base}?${pop}${draftable ? `&status=${status}` : ""}`).catch(() => null); return r?.data ? [r.data] : []; }
    const all = [];
    for (let page = 1; ; page++) {
      const r = await api(`${base}?${pop}&pagination[page]=${page}&pagination[pageSize]=50${draftable ? `&status=${status}` : ""}`);
      all.push(...r.data);
      if (page >= (r.meta?.pagination?.pageCount ?? 1)) break;
    }
    return all;
  };
  let drafts;
  try { drafts = await list("draft"); } catch (e) { report.failed.push(`${name}: ${e.message}`); continue; }
  const published = draftable ? await list("published").catch(() => []) : [];
  for (const entry of drafts) {
    if (ENTRIES.length && !ENTRIES.includes(entry.slug)) continue;
    const label = `${name}${single ? "" : `:${entry.slug ?? entry.title ?? entry.question ?? entry.documentId}`}`;
    const data = {};
    blocked = [];
    for (const [k, a] of Object.entries(t.attributes)) {
      if (a.type === "relation" || a.type === "uid" || WITHOUT.has(k)) continue;
      const [nv, ch] = fixAttr(entry[k], a, k, label);
      if (ch) data[k] = nv;
    }
    if (!Object.keys(data).length) continue;
    if (blocked.length) { report.blockedRelations.push(`${label} (${blocked.join(", ")})`); continue; }
    const pub = published.find((p) => p.documentId === entry.documentId);
    if (draftable && pub && pub.updatedAt !== entry.updatedAt) { report.skippedDraft.push(label); continue; }
    report.updated.push(`${label}: ${Object.keys(data).join(", ")}`);
    if (DRY) continue;
    const target = single ? base : `${base}/${entry.documentId}`;
    const status = draftable && pub ? "?status=published" : "";
    try { await api(`${target}${status}`, { method: "PUT", body: JSON.stringify({ data }) }); }
    catch (e) { report.failed.push(`${label}: ${e.message}`); }
  }
}
fs.writeFileSync(path.join(process.env.REPORT_DIR ?? ".", "cms-undash-samples.json"), JSON.stringify(samples, null, 1));
console.log(JSON.stringify({ ...report, updated: report.updated.length, updatedList: report.updated }, null, 1));
