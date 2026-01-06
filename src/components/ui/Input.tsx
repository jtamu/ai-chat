import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, required, error, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-[var(--error)]"> *</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "input-field",
            error && "border-[var(--error)] focus:border-[var(--error)]",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-[var(--error)] mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, required, error, id, showCount, maxLength, value, ...props },
    ref
  ) => {
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-[var(--error)]"> *</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          value={value}
          maxLength={maxLength}
          className={clsx(
            "input-field min-h-[120px] resize-y",
            error && "border-[var(--error)] focus:border-[var(--error)]",
            className
          )}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error && <p className="text-sm text-[var(--error)]">{error}</p>}
          {showCount && maxLength && (
            <p className="text-xs text-gray-500 ml-auto">
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
export type { InputProps, TextareaProps };
