import { json, responderErrorHttp } from '../../http/respuesta.mjs';
import { crearEventoService } from './service.mjs';

/**
 * Invoca desde la terminal tras desplegar. Usa un ID de evento libre.
 * API Gateway entrega el JSON de POST /events en event.body.
 * @param {{ eventId: number, title: string }} event ID entero positivo y título con texto.
 * @example
 * npx --no-install serverless invoke \
 *   --function crearEvento \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{"eventId": 3, "title": "Concierto de aula"}'
 *
 * @example HTTP desde la terminal con la URL del despliegue en api_url.
 * curl -i -X POST "$api_url/events" \
 *   -H 'Content-Type: application/json' \
 *   -d '{"eventId": 3, "title": "Concierto de aula"}'
 */
export async function handler(event) {
  const esHttp = Boolean(event?.requestContext?.http);
  try {
    const { eventId, title } = esHttp ? JSON.parse(event.body) : (event ?? {});
    const resultado = await crearEventoService(eventId, title);
    return esHttp ? json(201, resultado) : resultado;
  } catch (error) {
    if (esHttp) return responderErrorHttp(error);
    throw error;
  }
}
