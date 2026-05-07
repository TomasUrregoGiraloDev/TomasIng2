import { Loader2 } from 'lucide-react';

export function Button({
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}) {
  const cls = `btn ${variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : variant === 'danger' ? 'btn-danger' : 'btn-ghost'} ${className}`;
  return (
    <button type={type} className={cls} disabled={disabled || loading} {...rest}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
