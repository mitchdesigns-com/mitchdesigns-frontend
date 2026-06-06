"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { TelInput } from "@/components/ui/TelInput";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { MarketsSelect } from "@/components/ui/MarketsSelect";
import type { QuoteField, QuoteFormValue } from "@/lib/quote/schema";
import { ChoiceGroup } from "./ChoiceGroup";

type Props = {
  field: QuoteField;
  value: QuoteFormValue | undefined;
  error?: string;
  onChange: (value: QuoteFormValue) => void;
  /** Free-text companion for a selected "Other" option. */
  otherValue?: string;
  onOtherChange?: (value: string) => void;
};

/** Inline "please specify" input shown when an "Other" option is chosen. */
function OtherInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Please specify"
      aria-label="Please specify"
      className="mt-3 h-11 px-4"
    />
  );
}

export function FieldRenderer({
  field,
  value,
  error,
  onChange,
  otherValue = "",
  onOtherChange,
}: Props) {
  const label = (
    <span className="text-base font-medium">
      {field.label}{" "}
      {field.required ? <span className="text-orderbase-red">*</span> : null}
    </span>
  );

  if (field.type === "textarea") {
    const textValue = typeof value === "string" ? value : "";
    return (
      <div>
        <label className="block">
          {label}
          <Textarea
            value={textValue}
            onChange={(event) => onChange(event.target.value)}
            placeholder={field.placeholder}
            maxLength={field.validation?.maxLength}
            invalid={Boolean(error)}
            className="mt-2 min-h-[176px] rounded-[3px] border-grey-200"
          />
        </label>
        <div className="mt-2 flex items-center justify-between text-sm text-fg-muted">
          {error ? <p className="text-orderbase-red">{error}</p> : <span />}
          {field.validation?.maxLength ? (
            <span>
              {textValue.length} / {field.validation.maxLength}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  if (field.type === "radio" && field.options) {
    return (
      <div>
        <p>{label}</p>
        {field.helperText ? (
          <p className="mt-1 text-base text-fg-muted">{field.helperText}</p>
        ) : null}
        <div className="mt-3">
          <ChoiceGroup
            name={field.id}
            options={field.options}
            value={value}
            error={error}
            variant="radio"
            compact
            onChange={onChange}
          />
        </div>
        {value === "other" && onOtherChange ? (
          <OtherInput value={otherValue} onChange={onOtherChange} />
        ) : null}
      </div>
    );
  }

  if (field.type === "checkbox-group" && field.options) {
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <div>
        <p>{label}</p>
        {field.helperText ? (
          <p className="mt-1 text-base text-fg-muted">{field.helperText}</p>
        ) : null}
        <div className="mt-5 space-y-5 flex flex-col">
          {field.options.map((option) => (
            <Checkbox
              key={option.value}
              id={`${field.id}-${option.value}`}
              label={option.label}
              checked={selectedValues.includes(option.value)}
              onChange={(event) => {
                const nextValues = event.target.checked
                  ? [...selectedValues, option.value]
                  : selectedValues.filter((item) => item !== option.value);
                onChange(nextValues);
              }}
            />
          ))}
        </div>
        {selectedValues.includes("other") && onOtherChange ? (
          <OtherInput value={otherValue} onChange={onOtherChange} />
        ) : null}
        {error ? (
          <p className="mt-2 text-sm text-orderbase-red">{error}</p>
        ) : null}
      </div>
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <div>
        <label htmlFor={`field-${field.id}`} className="block text-base font-medium">
          {field.label}{" "}
          {field.required ? <span className="text-orderbase-red">*</span> : null}
        </label>
        <CountrySelect
          id={`field-${field.id}`}
          value={typeof value === "string" ? value : (field.defaultValue ?? "")}
          options={field.options as { label: string; value: string }[]}
          onChange={(v) => onChange(v)}
          invalid={Boolean(error)}
          className="mt-2"
        />
        {error ? (
          <p className="mt-2 text-sm text-orderbase-red">{error}</p>
        ) : null}
      </div>
    );
  }

  if (field.type === "markets") {
    const selectedMarkets = Array.isArray(value) ? value : [];
    return (
      <div>
        <label htmlFor={`field-${field.id}`} className="block text-base font-medium">
          {field.label}{" "}
          {field.required ? <span className="text-orderbase-red">*</span> : null}
        </label>
        {field.helperText ? (
          <p className="mt-1 text-base text-fg-muted">{field.helperText}</p>
        ) : null}
        <MarketsSelect
          id={`field-${field.id}`}
          value={selectedMarkets}
          onChange={(v) => onChange(v)}
          invalid={Boolean(error)}
          className="mt-2"
        />
        {error ? (
          <p className="mt-2 text-sm text-orderbase-red">{error}</p>
        ) : null}
      </div>
    );
  }

  if (field.type === "tel") {
    return (
      <div>
        <label htmlFor={`field-${field.id}`} className="block text-base font-medium">
          {field.label}{" "}
          {field.required ? <span className="text-orderbase-red">*</span> : null}
        </label>
        <TelInput
          id={`field-${field.id}`}
          value={typeof value === "string" ? value : (field.defaultValue ?? "")}
          onChange={(v) => onChange(v)}
          placeholder={field.placeholder}
          invalid={Boolean(error)}
          className="mt-2"
        />
        {error ? <p className="mt-2 text-sm text-orderbase-red">{error}</p> : null}
      </div>
    );
  }

  return (
    <label className="block">
      {label}
      <Input
        type={field.type}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        invalid={Boolean(error)}
        className="mt-2 h-11 px-4"
      />
      {error ? <p className="mt-2 text-sm text-orderbase-red">{error}</p> : null}
    </label>
  );
}
