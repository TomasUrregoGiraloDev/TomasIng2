export function Tabs({ value, onChange, items }) {
  return (
    <div className="border-b border-surface-200">
      <nav className="-mb-px flex gap-6">
        {items.map((item) => {
          const activo = value === item.value;
          return (
            <button
              key={item.value}
              onClick={() => onChange(item.value)}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activo
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
              }`}
            >
              {item.label}
              {item.count !== undefined && (
                <span className={`ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-medium ${
                  activo ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-surface-600'
                }`}>{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
