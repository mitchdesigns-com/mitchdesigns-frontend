"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { ArrowLeftHand } from "@/components/icons/ArrowLeftHand";
import { cn } from "@/lib/cn";
import {
  getNextOutcome,
  getPreviousStep,
  getStepCount,
  isFieldVisible,
  PICKER_STAGES,
  type QuoteField,
  type QuoteFieldKey,
  type QuoteFlow,
  type QuoteFormState,
  type QuoteFormValue,
  type QuoteService,
  type QuoteStep,
} from "@/lib/quote/schema";

import { submitLead } from "@/lib/quote/submitLead";
import { CalendlyEmbed } from "./CalendlyEmbed";
import { ChoiceGroup } from "./ChoiceGroup";
import { FieldRenderer } from "./FieldRenderer";
import { FileUpload } from "./FileUpload";
import { QuoteProgressBar } from "./QuoteProgressBar";

const STORAGE_KEY = "mitchdesigns.quote.lead";
const FILE_IDS_KEY = "mitchdesigns.quote.fileIds";

type StoredLead = QuoteFormState & {
  firstName?: string;
  service?: QuoteService;
};

type ErrorMap = Partial<Record<QuoteFieldKey, string>>;

type Props = {
  service: QuoteService;
  flow: QuoteFlow;
  step: QuoteStep;
};

export function StepRenderer({ service, flow, step }: Props) {
  const router = useRouter();
  const [state, setState] = useState<StoredLead>({});
  const [errors, setErrors] = useState<ErrorMap>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    const stored = readStoredLead();
    if (
      (step.kind === "radio" || step.kind === "completion-choice") &&
      step.defaultValue &&
      isEmptyValue(stored[step.id])
    ) {
      const seeded = { ...stored, [step.id]: step.defaultValue };
      writeStoredLead(seeded);
      setState(seeded);
    } else {
      setState(stored);
    }
    setErrors({});
    setUploadedFile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, step.step]);

  const hydratedTitle = useMemo(
    () => personalize(step.title, state.firstName),
    [state.firstName, step.title],
  );

  const visibleFields = useMemo(
    () => (step.kind === "form" ? step.fields.filter((f) => isFieldVisible(f, state)) : []),
    [step, state],
  );

  function updateValue(key: QuoteFieldKey, value: QuoteFormValue) {
    setState((current) => {
      const next = { ...current, [key]: value };
      writeStoredLead(next);
      return next;
    });
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function updateOther(fieldId: QuoteFieldKey, value: string) {
    setState((current) => {
      const next = { ...current, [`${fieldId}Other`]: value };
      writeStoredLead(next);
      return next;
    });
  }

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    const previousStep = getPreviousStep(service, step.step);
    router.push(previousStep ? `/quote/${service}/${previousStep}` : "/quote");
  }

  const finalizeAndSubmit = useCallback(() => {
    // Fire-and-forget — don't block navigation on Strapi being slow/down
    submitLead({
      firstName:        toString(state.firstName),
      lastName:         toString(state.lastName),
      email:            toString(state.email),
      mobileNumber:     toString(state.mobileNumber),
      service,
      companyName:      toString(state.companyName),
      companyCountry:   toString(state.companyCountry),
      companyStage:     state.companyStage,
      industry:         toString(state.industry),
      websiteLanguages: toString(state.websiteLanguages),
      websitePurpose:   state.websitePurpose,
      websiteSections:  state.websiteSections,
      specialFeatures:  state.specialFeatures,
      hasSitemap:       toString(state.hasSitemap),
      additionalNotes:  toString(state.additionalNotes),
      budget:           toString(state.budget),
      timeline:         toString(state.timeline),
      nextAction:       toString(state.nextAction),
      rawFormData:      state,
      sitemapFileId:    readFileId("sitemapFile"),
      companyProfileId: readFileId("companyProfile"),
      briefFileId:      readFileId("briefFile"),
    }).catch((err) => console.error("Lead submission error:", err));

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(FILE_IDS_KEY);
    }
  }, [service, state]);

  function navigate(outcome: ReturnType<typeof getNextOutcome>) {
    if (outcome.type === "route") {
      if (outcome.href.startsWith("/quote/thank-you")) finalizeAndSubmit();
      router.push(outcome.href);
      return;
    }
    router.push(`/quote/${service}/${outcome.step}`);
  }

  async function submitStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateStep(step, state, uploadedFile);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    navigate(getNextOutcome(service, step.step, state));
  }

  const handleScheduled = useCallback(() => {
    finalizeAndSubmit();
    router.push("/quote/thank-you");
  }, [finalizeAndSubmit, router]);

  return (
    <>
      <QuoteProgressBar
        currentStep={step.step + PICKER_STAGES}
        totalSteps={getStepCount(service) + PICKER_STAGES}
      />

      <section className="container-page flex min-h-[calc(100dvh-6rem)] items-center justify-center py-8 md:py-12">
        <form
          onSubmit={submitStep}
          className="relative w-full max-w-[790px] rounded-card-sm bg-bg px-6 py-9 shadow-soft-lg ring-1 ring-border md:px-12 md:py-11"
        >
          {/* Back button */}
          <button
            type="button"
            aria-label="Back"
            onClick={goBack}
            className="absolute left-6 top-11 flex h-9 w-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-bg-alt md:left-10"
          >
            <ArrowLeftHand />
          </button>

          {/* Screen-reader progress */}
          <p className="sr-only">
            {flow.label} quote — step {step.step} of {getStepCount(service)}
          </p>

          {/* Title */}
          <div className="mx-auto text-center">
            <h1 className="text-hero-5 font-bold text-black text-center mx-auto md:px-10 text-pretty">
              {hydratedTitle}
            </h1>
            {step.description ? (
              <p className="mt-4 text-lg text-fg md:text-xl text-balance">
                {personalize(step.description, state.firstName)}
              </p>
            ) : null}
          </div>

          {/* Step body */}
          <div className="mt-10">
            {step.kind === "form" && (
              <div className="space-y-8">
                {visibleFields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={withPersonalizedLabel(field, state.firstName)}
                    value={state[field.id]}
                    error={errors[field.id]}
                    onChange={(value) => updateValue(field.id, value)}
                    otherValue={otherText(state, field.id)}
                    onOtherChange={(value) => updateOther(field.id, value)}
                  />
                ))}
              </div>
            )}

            {(step.kind === "radio" || step.kind === "completion-choice") && (
              <ChoiceGroup
                name={step.id}
                options={step.options}
                value={state[step.id]}
                error={errors[step.id]}
                variant={step.kind}
                onChange={(value) => updateValue(step.id, value)}
              />
            )}

            {step.kind === "file-upload" && (
              <FileUpload
                helperText={step.helperText}
                uploadLabel={step.uploadLabel}
                currentFile={uploadedFile}
                maxFileSizeMb={step.validation?.maxFileSizeMb}
                acceptedFileTypes={step.validation?.acceptedFileTypes}
                error={errors[step.id]}
                onChange={(file) => {
                  setUploadedFile(file);
                  updateValue(
                    step.id,
                    file ? { name: file.name, size: String(file.size), type: file.type } : null,
                  );
                  if (!file) { writeFileId(step.id, null); return; }

                  // Upload immediately so the ID is ready before final submit
                  const fd = new FormData();
                  fd.append("files", file, file.name);
                  fetch("/api/upload", { method: "POST", body: fd })
                    .then((r) => r.json())
                    .then((data) => { if (data.id) writeFileId(step.id, data.id); })
                    .catch((err) => console.error("File upload error:", err));
                }}
              />
            )}

            {step.kind === "schedule" && (
              <div>
                <CalendlyEmbed onScheduled={handleScheduled} />
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={handleScheduled}
                    className="text-base font-medium text-fg-muted underline-offset-4 transition-colors hover:text-black hover:underline"
                  >
                    I&apos;ll book later — finish up
                  </button>
                </div>
              </div>
            )}

            {step.kind === "summary" && (
              <p className="mx-auto max-w-[660px] text-center text-lg text-fg">
                {step.description}
              </p>
            )}
          </div>

          {/* Submit (hidden for the schedule step, which advances on booking) */}
          {step.kind !== "schedule" && (
            <div className="mt-10 flex justify-end">
              <Button
                type="submit"
                size="lg"
                className={cn(
                  "h-[68px] min-w-[200px] text-base",
                  step.kind !== "summary" && "uppercase",
                  step.kind === "summary" && "w-full",
                )}
              >
                {step.kind === "summary"
                  ? step.submitLabel
                  : (step.nextLabel ?? "Next")}
              </Button>
            </div>
          )}
        </form>
      </section>
    </>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function otherText(state: StoredLead, fieldId: QuoteFieldKey): string {
  const value = state[`${fieldId}Other`];
  return typeof value === "string" ? value : "";
}

function personalize(text: string, firstName?: string): string {
  const name =
    typeof firstName === "string" && firstName.trim()
      ? firstName.trim()
      : "there";
  return text.replace("{firstName}", name);
}

function withPersonalizedLabel(field: QuoteField, firstName?: string): QuoteField {
  if (!field.label.includes("{firstName}")) return field;
  return { ...field, label: personalize(field.label, firstName) };
}

function validateStep(
  step: QuoteStep,
  state: StoredLead,
  uploadedFile: File | null,
): ErrorMap {
  const errors: ErrorMap = {};

  if (step.kind === "form") {
    for (const field of step.fields) {
      if (!isFieldVisible(field, state)) continue;

      const value = state[field.id];
      const rule = field.validation;

      if (field.required && isEmptyValue(value)) {
        errors[field.id] = "This field is required.";
        continue;
      }

      if (Array.isArray(value) && rule?.minSelected && value.length < rule.minSelected) {
        errors[field.id] = `Choose at least ${rule.minSelected}.`;
      }

      if (Array.isArray(value) && rule?.maxSelected && value.length > rule.maxSelected) {
        errors[field.id] = `Choose no more than ${rule.maxSelected}.`;
      }

      if (typeof value === "string" && rule?.maxLength && value.length > rule.maxLength) {
        errors[field.id] = `Keep this under ${rule.maxLength} characters.`;
      }
    }
  }

  if (
    (step.kind === "radio" || step.kind === "completion-choice") &&
    step.validation?.required &&
    isEmptyValue(state[step.id])
  ) {
    errors[step.id] = "Please choose an option.";
  }

  if (step.kind === "file-upload" && uploadedFile) {
    const maxMb = step.validation?.maxFileSizeMb;
    if (maxMb && uploadedFile.size > maxMb * 1024 * 1024) {
      errors[step.id] = `File must be ${maxMb} MB or smaller.`;
    }
  }

  return errors;
}

function isEmptyValue(value: QuoteFormValue | undefined): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function readStoredLead(): StoredLead {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredLead) : {};
  } catch {
    return {};
  }
}

function writeStoredLead(state: StoredLead) {
  if (typeof window === "undefined") return;
  const existing = readStoredLead();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...state }));
}

function readFileId(field: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(FILE_IDS_KEY);
    return raw ? (JSON.parse(raw)[field] ?? null) : null;
  } catch { return null; }
}

function writeFileId(field: string, id: number | null) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(FILE_IDS_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    if (id === null) delete existing[field];
    else existing[field] = id;
    window.localStorage.setItem(FILE_IDS_KEY, JSON.stringify(existing));
  } catch { /* ignore */ }
}

function toString(value: QuoteFormValue | undefined): string | undefined {
  if (typeof value === "string") return value || undefined;
  return undefined;
}
