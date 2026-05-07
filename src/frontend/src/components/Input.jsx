import { forwardRef } from 'react';

export const Input = forwardRef(function Input({ label, error, hint, id, className = '', ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div>
      {label && <label className="label" htmlFor={inputId}>{label}</label>}
      <input ref={ref} id={inputId} className={`input ${className}`} {...rest} />
      {hint && !error && <p className="text-xs text-surface-500 mt-1">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, id, className = '', ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div>
      {label && <label className="label" htmlFor={inputId}>{label}</label>}
      <textarea ref={ref} id={inputId} className={`input min-h-[96px] ${className}`} {...rest} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select({ label, error, options = [], placeholder, id, className = '', children, ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div>
      {label && <label className="label" htmlFor={inputId}>{label}</label>}
      <select ref={ref} id={inputId} className={`input ${className}`} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
        {children}
      </select>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});
