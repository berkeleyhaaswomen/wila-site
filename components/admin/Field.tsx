/** Shared form primitives for the admin site. Plain server components. */

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-ink " +
  "outline-none transition placeholder:text-ink/35 focus:border-berkeley-blue " +
  "focus:ring-2 focus:ring-berkeley-blue/20 disabled:bg-black/5 disabled:text-ink/50";

export function Label({
  children,
  hint,
  required
}: {
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <span className="block">
      <span className="text-sm font-semibold text-ink">
        {children}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </span>
      {hint && <span className="ml-2 text-xs text-ink/50">{hint}</span>}
    </span>
  );
}

export function TextField({
  name,
  label,
  hint,
  required,
  type = "text",
  defaultValue,
  placeholder,
  maxLength
}: {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  type?: string;
  defaultValue?: string | null;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <Label hint={hint} required={required}>
        {label}
      </Label>
      <input
        className={inputClass}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </label>
  );
}

export function TextArea({
  name,
  label,
  hint,
  required,
  rows = 4,
  defaultValue,
  placeholder,
  maxLength
}: {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  rows?: number;
  defaultValue?: string | null;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <Label hint={hint} required={required}>
        {label}
      </Label>
      <textarea
        className={inputClass}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </label>
  );
}

export function SelectField({
  name,
  label,
  hint,
  required,
  options,
  defaultValue,
  includeBlank
}: {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  options: readonly string[];
  defaultValue?: string | null;
  includeBlank?: string;
}) {
  return (
    <label className="block">
      <Label hint={hint} required={required}>
        {label}
      </Label>
      <select
        className={inputClass}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
      >
        {includeBlank !== undefined && <option value="">{includeBlank}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      {message}
    </div>
  );
}

export function FormNotice({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      {message}
    </div>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card md:p-8">
      {children}
    </div>
  );
}
