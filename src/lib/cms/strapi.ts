/**
 * Strapi client — Strapi v4/v5 REST API
 *
 * Env:
 *   NEXT_PUBLIC_STRAPI_URL   e.g. https://cms.mitchdesigns.com
 *   STRAPI_API_TOKEN         read-only token (server only)
 *
 * All fetches are server-side. Pages call these directly from RSC.
 * ISR is configured per-call via `revalidate` (seconds).
 */

import "server-only";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN && process.env.NODE_ENV === "production") {
  // Fail loud in prod, quiet in dev
  console.warn("STRAPI_API_TOKEN is not set");
}

type StrapiCollection<T> = {
  data: Array<{ id: number; attributes: T } | T>;
  meta: {
    pagination?: { page: number; pageSize: number; pageCount: number; total: number };
  };
};

type StrapiSingle<T> = {
  data: { id: number; attributes: T } | T;
  meta: Record<string, unknown>;
};

type FetchOpts = {
  /** ISR revalidation in seconds. Defaults to 60. Set to 0 for no cache. */
  revalidate?: number;
  /** Strapi query string params (filters[], populate, sort, etc.) */
  query?: Record<string, string | number | boolean | undefined>;
};

function buildQuery(query: FetchOpts["query"]): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined) continue;
    params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function strapiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const url = `${STRAPI_URL}/api${path}${buildQuery(opts.query)}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    next: { revalidate: opts.revalidate ?? 60 },
  });
  if (!res.ok) {
    throw new Error(`Strapi ${res.status} ${res.statusText} — ${url}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Strapi v4 nests data inside { data: { attributes } }. v5 flattens it.
 * This helper normalizes both shapes into plain entities with an `id`.
 */
function flatten<T>(item: { id: number; attributes: T } | (T & { id?: number })): T & { id: number } {
  if (typeof item === "object" && item !== null && "attributes" in item) {
    const { id, attributes } = item as { id: number; attributes: T };
    return { id, ...attributes } as T & { id: number };
  }
  return item as T & { id: number };
}

export async function getCollection<T>(
  path: string,
  opts?: FetchOpts,
): Promise<Array<T & { id: number }>> {
  const json = await strapiFetch<StrapiCollection<T>>(path, opts);
  return json.data.map((item) =>
    flatten<T>(item as { id: number; attributes: T }),
  );
}

/**
 * Fetch every page of a collection. Strapi caps pageSize (default max 100),
 * so for collections larger than one page we loop until all pages are pulled.
 */
export async function getCollectionAll<T>(
  path: string,
  opts?: FetchOpts,
): Promise<Array<T & { id: number }>> {
  const pageSize = 100;
  const out: Array<T & { id: number }> = [];
  let page = 1;
  let pageCount = 1;

  do {
    const json = await strapiFetch<StrapiCollection<T>>(path, {
      ...opts,
      query: {
        ...opts?.query,
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
      },
    });
    for (const item of json.data) {
      out.push(flatten<T>(item as { id: number; attributes: T }));
    }
    pageCount = json.meta.pagination?.pageCount ?? 1;
    page++;
  } while (page <= pageCount);

  return out;
}

export async function getSingle<T>(
  path: string,
  opts?: FetchOpts,
): Promise<(T & { id: number }) | null> {
  try {
    const json = await strapiFetch<StrapiSingle<T>>(path, opts);
    if (!json.data) return null;
    return flatten<T>(json.data as { id: number; attributes: T });
  } catch {
    return null;
  }
}
