import { useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
    as?: 'input';
  };

type TextareaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
    as: 'textarea';
  };

type FormFieldProps = InputProps | TextareaProps;

const baseField =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-burgundy/40 focus:border-burgundy disabled:bg-cream disabled:text-charcoal/50';

export function FormField(props: FormFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const { label, hint, error, required, ...rest } = props;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-charcoal">
        {label}
        {required ? <span aria-hidden="true" className="text-burgundy"> *</span> : null}
      </label>
      {props.as === 'textarea' ? (
        <textarea
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          rows={4}
          className={`${baseField} ${error ? 'border-burgundy' : 'border-soft-border'} resize-y`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          className={`${baseField} ${error ? 'border-burgundy' : 'border-soft-border'}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-charcoal/70">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-burgundy">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormGroup({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}
