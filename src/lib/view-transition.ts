/**
 * View Transitions helper for Next.js App Router.
 *
 * Problem: document.startViewTransition(cb) captures the NEW state right when
 * the callback returns. With router.push(), React renders the new page async,
 * so the capture happens before the new DOM exists — the browser just sees the
 * same old page twice and no morph occurs.
 *
 * Fix: keep the transition promise open by storing a resolve function, then
 * call resolveViewTransition() from the destination page's useEffect so the
 * browser captures the new state only after React has committed.
 */

let pendingResolve: (() => void) | null = null;

/** Call this from the destination page's useEffect to signal "new DOM is ready". */
export function resolveViewTransition() {
  pendingResolve?.();
  pendingResolve = null;
}

/**
 * Navigate with a view transition.
 * Falls back to plain navigate() on browsers without support.
 */
export function navigateWithTransition(navigate: () => void) {
  if (typeof document === "undefined" || !("startViewTransition" in document)) {
    navigate();
    return;
  }

  (document as Document & { startViewTransition(cb: () => Promise<void>): void })
    .startViewTransition(async () => {
      await new Promise<void>((resolve) => {
        pendingResolve = resolve;
        navigate();
      });
    });
}
