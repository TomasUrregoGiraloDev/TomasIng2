import { env } from '../config/env.js';
import { HttpError } from '../middlewares/error.js';
import { obtenerEstadisticas } from './AdminService.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function buildPrompt(stats) {
  return `Eres un analista que escribe informes ejecutivos cortos en espanol neutro para una plataforma de voluntariado en Colombia.
Genera un informe profesional (sin emojis) de maximo 250 palabras con esta estructura:

1. Resumen general (1 parrafo)
2. Indicadores clave (lista breve)
3. Categoria con mayor actividad
4. Recomendaciones (3 puntos accionables)

Datos:
- Actividades publicadas: ${stats.total_actividades}
- Inscripciones totales: ${stats.total_inscripciones}
- Inscripciones aprobadas: ${stats.total_aprobadas}
- Asistencias confirmadas: ${stats.total_asistencias}
- Organizaciones registradas: ${stats.total_organizaciones}
- Voluntarios registrados: ${stats.total_voluntarios}
- Distribucion por categoria: ${JSON.stringify(stats.actividades_por_categoria)}

Devuelve unicamente el informe en texto plano, sin titulos en mayusculas decorativas.`;
}

export async function generarReporte() {
  const stats = await obtenerEstadisticas();

  if (!env.groq.apiKey) {
    throw new HttpError(503, 'No hay GROQ_API_KEY configurada. Pega la clave en el archivo .env y reinicia el backend.');
  }

  const respuesta = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.groq.apiKey}`,
    },
    body: JSON.stringify({
      model: env.groq.model,
      messages: [
        { role: 'system', content: 'Eres un analista de impacto social. Respondes en espanol neutro, sin emojis.' },
        { role: 'user', content: buildPrompt(stats) },
      ],
      temperature: 0.4,
      max_tokens: 600,
    }),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new HttpError(502, `Groq respondio ${respuesta.status}: ${detalle.slice(0, 200)}`);
  }

  const data = await respuesta.json();
  const contenido = data.choices?.[0]?.message?.content?.trim();
  if (!contenido) throw new HttpError(502, 'Groq devolvio una respuesta vacia');

  return {
    generado_en: new Date().toISOString(),
    modelo: env.groq.model,
    estadisticas: stats,
    informe: contenido,
  };
}
