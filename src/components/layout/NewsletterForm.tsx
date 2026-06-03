"use client";

export function NewsletterForm() {
  return (
    <form
      className="mt-5 flex items-center rounded-full bg-white pl-4 pr-2 py-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter Your Email Address"
        aria-label="Email address"
        className="min-w-0 flex-1 bg-transparent text-base text-fg-muted outline-none placeholder:text-fg-muted"
      />
      <button
        type="submit"
        className="shrink-0 whitespace-nowrap rounded-full bg-yellow px-8 py-3 text-base font-medium text-black transition-opacity hover:opacity-90"
      >
        Subscribe
      </button>
    </form>
  );
}
