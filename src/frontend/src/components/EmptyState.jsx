export function EmptyState({ icon: Icon, titulo, descripcion, accion }) {
  return (
    <div className="text-center py-12 px-6 border border-dashed border-surface-200 rounded-lg bg-white">
      {Icon && (
        <div className="mx-auto w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center text-surface-500 mb-3">
          <Icon size={22} />
        </div>
      )}
      <h3 className="text-base font-semibold text-surface-900">{titulo}</h3>
      {descripcion && <p className="text-sm text-surface-500 mt-1 max-w-md mx-auto">{descripcion}</p>}
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  );
}
