"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { quoteServiceOptions, getStepCount, PICKER_STAGES, type QuoteService } from "@/lib/quote/schema";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { QuoteProgressBar } from "./QuoteProgressBar";
import { ArrowLeftHand } from "@/components/icons/ArrowLeftHand";

const STORAGE_KEY = "mitchdesigns.quote.lead";

type PickerStage = "name" | "service";

export function ServicePicker() {
  const router = useRouter();
  const [stage, setStage] = useState<PickerStage>("name");
  const [firstName, setFirstName] = useState("");
  const [selectedService, setSelectedService] = useState<QuoteService | null>(
    null,
  );
  const [showServiceError, setShowServiceError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.firstName) setFirstName(data.firstName);
        if (data.service) setSelectedService(data.service);
      } catch (e) {
        console.error("Failed to parse lead data", e);
      }
    }
  }, []);

  const canContinueFromName = firstName.trim().length > 0;

  const selectedHref = useMemo(() => {
    return quoteServiceOptions.find(
      (option) => option.service === selectedService,
    )?.href;
  }, [selectedService]);

  function saveLead(nextService?: QuoteService) {
    if (typeof window === "undefined") return;

    const existingRaw = window.localStorage.getItem(STORAGE_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : {};

    const next = {
      ...existing,
      firstName: firstName.trim() || existing.firstName,
      service: nextService ?? selectedService ?? existing.service,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleNameSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinueFromName) return;
    saveLead();
    setStage("service");
  }

  function handleServiceSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedHref || !selectedService) {
      setShowServiceError(true);
      return;
    }

    saveLead(selectedService);
    router.push(selectedHref);
  }

  const pickerStep = stage === "name" ? 1 : 2;
  const totalSteps = PICKER_STAGES + (selectedService ? getStepCount(selectedService) : 6);

  return (
    <>
      <QuoteProgressBar currentStep={pickerStep} totalSteps={totalSteps} />
    <section className="container-page flex min-h-[calc(100dvh-4rem)] items-start justify-center py-8 md:items-center md:py-12">
      <div className="relative w-full max-w-195 rounded-card-sm bg-bg px-6 py-9 shadow-soft-lg ring-1 ring-border md:px-10 md:py-10">
        <button
          type="button"
          aria-label={stage === "name" ? "Back to homepage" : "Back"}
          onClick={() => {
            if (stage === "service") {
              setStage("name");
              return;
            }
            router.push("/");
          }}
          className="absolute left-6 top-9 h-9 w-9 place-items-center rounded-full text-fg transition-colors hover:bg-bg-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:left-10 cursor-pointer flex items-center justify-center"
        >
          <ArrowLeftHand/>
        </button>

        {stage === "name" ? (
          <form onSubmit={handleNameSubmit} className="mx-auto">
            <div className="text-center">
              <h1 className="text-hero-5 font-bold md:text-hero-4 text-pretty">
                Glad you’re here. Let’s get to know you.
              </h1>
              <p className="mt-4 text-lg text-fg md:text-xl text-balance">
                A few quick questions, and our team will send your personalized
                estimate within 48 hours.
              </p>
            </div>

            <div className="mt-11">
              <label htmlFor="quote-first-name" className="text-base font-medium">
                First Name <span className="text-orderbase-red">*</span>
              </label>
              <Input
                id="quote-first-name"
                name="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="mt-2 h-11 px-4"
                autoComplete="given-name"
                required
              />
              <p className="mt-2 text-base text-fg-muted text-balance">
                We’ll use this to personalize the questions ahead.
              </p>
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={!canContinueFromName}
                className="h-[68px] text-base uppercase w-[200px] font-medium"
              >
                <span>
                  Next
                </span>
                <ArrowRight />
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleServiceSubmit}>
            <div className="mx-auto text-center">
              <h1 className="text-hero-5 font-bold md:text-hero-5 text-pretty">
                So, what are we building together?
              </h1>
              <p className="mt-4 text-lg text-fg md:text-lg text-balance">
                Pick what fits, we’ll shape the rest of the questions around your
                project.
              </p>
            </div>

            <div className="mt-11">
              <p
                className={cn(
                  "mb-1 text-base text-orderbase-red",
                  !showServiceError ? "invisible" : "",
                )}
              >
                Please choose a service to proceed
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {quoteServiceOptions.map((option) => (
                  <label
                    key={option.service}
                    className={cn(
                      "flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-card-sm border border-grey-500 bg-bg px-6 text-center transition-colors cursor-pointer",
                      selectedService === option.service &&
                        "border-fg bg-fg text-bg",
                    )}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={option.service}
                      checked={selectedService === option.service}
                      onChange={() => {
                        setSelectedService(option.service);
                        setShowServiceError(false);
                      }}
                      onClick={() => {
                        if (selectedService === option.service) {
                          setSelectedService(null);
                        }
                      }}
                      className="sr-only"
                    />
                    <span className="text-lg font-medium md:text-xl">
                      {option.label}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-normal text-balance",
                        selectedService === option.service
                          ? "text-bg/80"
                          : "text-fg-muted",
                      )}
                    >
                      {option.tagline}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="h-[68px] min-w-[200px] text-base uppercase md:min-w-[200px]"
              >
                Next
                <Icon size={22}>
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </Icon>
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
    </>
  );
}
