"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";
import examples from "libphonenumber-js/mobile/examples";

import { ChevronDown } from "@/components/icons/ChevronDown";
import { cn } from "@/lib/cn";

/** Shown first in the list: where most leads come from. */
const PINNED: CountryCode[] = ["EG", "SA", "AE", "KW", "QA", "BH", "OM", "JO", "GB", "US", "DE", "CA", "AU"];

/** Time zones that tell us the visitor's country better than their browser
 *  language does (an English browser in Riyadh still says "en-US"). */
const TZ_COUNTRY: Record<string, CountryCode> = {
  "Africa/Cairo": "EG",
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Asia/Kuwait": "KW",
  "Asia/Qatar": "QA",
  "Asia/Bahrain": "BH",
  "Asia/Muscat": "OM",
  "Asia/Amman": "JO",
  "Asia/Beirut": "LB",
  "Asia/Baghdad": "IQ",
  "Africa/Casablanca": "MA",
  "Africa/Tunis": "TN",
  "Africa/Algiers": "DZ",
  "Africa/Tripoli": "LY",
  "Europe/London": "GB",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Amsterdam": "NL",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
};

const ALL = getCountries();
const noopSubscribe = () => () => {};

function guessCountry(): CountryCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TZ_COUNTRY[tz]) return TZ_COUNTRY[tz];
    if (tz.startsWith("America/")) return "US";
    for (const lang of navigator.languages ?? []) {
      const region = lang.split("-")[1]?.toUpperCase();
      if (region && (ALL as string[]).includes(region)) return region as CountryCode;
    }
  } catch {
    /* fall through */
  }
  return "EG";
}

/** 🇪🇬 from "EG". */
function flag(code: CountryCode) {
  return String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

/** A complete number in its country's grouping, without the dial code
 *  (which sits in the picker): "50 123 4567", "10 1443 0669". A number still
 *  being typed is left as typed. */
function pretty(text: string, code: CountryCode) {
  const parsed = parsePhoneNumberFromString(text, code);
  return parsed?.isValid() ? parsed.formatInternational().replace(/^\+\d+\s*/, "") : text;
}

/** The country to show for a dial code: the usual one for leads first
 *  (+1 → United States, +44 → United Kingdom), then the number's own. */
function countryForCallingCode(calling: string, own?: CountryCode): CountryCode | undefined {
  const pinned = PINNED.find((c) => getCountryCallingCode(c) === calling);
  return pinned ?? own ?? ALL.find((c) => getCountryCallingCode(c) === calling);
}

type Country = { code: CountryCode; name: string; dial: string };

function useCountryList(): Country[] {
  return useMemo(() => {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    const all = ALL.map((code) => ({ code, name: names.of(code) ?? code, dial: `+${getCountryCallingCode(code)}` }));
    const byCode = new Map(all.map((c) => [c.code, c]));
    const pinned = PINNED.map((c) => byCode.get(c)).filter(Boolean) as Country[];
    const rest = all.filter((c) => !PINNED.includes(c.code)).sort((a, b) => a.name.localeCompare(b.name));
    return [...pinned, ...rest];
  }, []);
}

type Props = {
  id?: string;
  invalid?: boolean;
  searchPlaceholder?: string;
  /** Called with the number in international form (+201014430669) and
   *  whether it is a valid number for its country. */
  onChange: (e164: string, valid: boolean) => void;
};

/**
 * International phone field: a searchable country picker (every country,
 * the region's usual ones first, the visitor's own guessed from their time
 * zone) and a number box that formats as you type. Pasting a full
 * "+44 7700 900123" switches the country by itself.
 */
export function PhoneInput({ id, invalid, searchPlaceholder = "Search", onChange }: Props) {
  const listId = useId();
  const countries = useCountryList();
  const guessed = useSyncExternalStore(noopSubscribe, guessCountry, () => "EG" as CountryCode);
  const [picked, setPicked] = useState<CountryCode | null>(null);
  const country = picked ?? guessed;
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const numberBox = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.slice(1).startsWith(q) || c.code.toLowerCase() === q,
    );
  }, [countries, query]);

  useEffect(() => {
    if (!open) return;
    search.current?.focus();
    const close = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function emit(raw: string, code: CountryCode) {
    const parsed = parsePhoneNumberFromString(raw, code);
    onChange(parsed?.number ?? raw.trim(), !!parsed?.isValid());
  }

  function typeNumber(raw: string) {
    let code = country;
    let local = raw;
    // A pasted or typed "+44 …" carries its own country.
    if (raw.trim().startsWith("+")) {
      const dial = new AsYouType();
      dial.input(raw);
      const calling = dial.getCallingCode();
      if (calling) {
        code = countryForCallingCode(calling, parsePhoneNumberFromString(raw)?.country) ?? code;
        local = raw.trim().replace(new RegExp(`^\\+${calling}\\s*`), "");
        setPicked(code);
      }
    }
    const shown = pretty(local, code);
    setText(shown);
    emit(shown, code);
  }

  function choose(code: CountryCode) {
    setPicked(code);
    setOpen(false);
    setQuery("");
    const shown = pretty(text, code);
    setText(shown);
    emit(shown, code);
    numberBox.current?.focus();
  }

  function onSearchKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) choose(filtered[active].code);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const current = countries.find((c) => c.code === country);
  const example = getExampleNumber(country, examples)?.formatInternational().replace(/^\+\d+\s*/, "");

  return (
    <div ref={root} className="relative">
      <div
        data-invalid={invalid || undefined}
        className="flex h-14 w-full items-center rounded border border-grey-200 bg-bg transition-colors duration-200 focus-within:border-fg data-[invalid=true]:border-orderbase-red"
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={current ? `${current.name} ${current.dial}` : "Country"}
          onClick={() => {
            setActive(0);
            setOpen((v) => !v);
          }}
          className="flex h-full shrink-0 items-center gap-2 pl-5 pr-3 text-base font-medium text-fg"
        >
          <span className="text-xl leading-none" aria-hidden>
            {flag(country)}
          </span>
          {current?.dial}
          <ChevronDown size={14} className={cn("text-fg-muted transition-transform", open && "rotate-180")} />
        </button>
        <span className="h-6 w-px shrink-0 bg-grey-200" aria-hidden />
        <input
          ref={numberBox}
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={text}
          placeholder={example}
          onChange={(e) => typeNumber(e.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-base text-fg outline-none placeholder:text-fg-muted"
        />
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-card-sm border border-grey-200 bg-bg shadow-ob-sm">
          <input
            ref={search}
            type="search"
            value={query}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            aria-controls={listId}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onSearchKey}
            className="h-12 w-full border-b border-grey-200 bg-transparent px-4 text-base text-fg outline-none placeholder:text-fg-muted"
          />
          <ul id={listId} role="listbox" className="max-h-72 overflow-y-auto py-1">
            {filtered.map((c, i) => (
              <li
                key={c.code}
                role="option"
                aria-selected={c.code === country}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(c.code)}
                ref={i === active ? (el) => el?.scrollIntoView({ block: "nearest" }) : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm text-fg",
                  i === active && "bg-bg-alt",
                  c.code === country && "font-bold",
                  i === PINNED.length - 1 && !query && "border-b border-grey-200",
                )}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {flag(c.code)}
                </span>
                <span className="min-w-0 flex-1 truncate">{c.name}</span>
                <span className="text-fg-muted">{c.dial}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
