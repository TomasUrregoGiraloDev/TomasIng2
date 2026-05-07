import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Input } from './Input.jsx';
import { Button } from './Button.jsx';

const MAX_BYTES = 800 * 1024; // 800 KB

function archivoABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Solo se aceptan imagenes');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`La imagen pesa ${(file.size / 1024).toFixed(0)} KB. Maximo 800 KB.`);
      return;
    }
    setCargando(true);
    try {
      const dataUri = await archivoABase64(file);
      onChange(dataUri);
    } catch (err) {
      setError('No se pudo leer la imagen');
    } finally {
      setCargando(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const limpiar = () => onChange('');

  const tienePreview = value && value.length > 0;

  return (
    <div className="space-y-2">
      <label className="label">Imagen (opcional)</label>
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="flex-1 space-y-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            loading={cargando}
            data-testid="btn-subir-imagen"
          >
            <Upload size={14} /> Subir desde tu computador
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            className="hidden"
            onChange={onFile}
          />
          <p className="text-xs text-surface-500">Maximo 800 KB. Tambien podes pegar una URL publica:</p>
          <Input
            type="url"
            value={value && !value.startsWith('data:') ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
          />
        </div>
        {tienePreview && (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border border-surface-200"
            />
            <button
              type="button"
              onClick={limpiar}
              className="absolute -top-2 -right-2 bg-white border border-surface-200 rounded-full p-1 hover:bg-surface-50"
              aria-label="Quitar imagen"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
