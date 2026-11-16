import { json, responderErrorHttp } from '../../http/respuesta.mjs';
import { buscarEventoService } from './service.mjs';

/**
 * Lambda entrega el JSON de --data como objeto. El ejemplo usa el evento de npm run aula.
 * API Gateway entrega el ID de GET /events/{eventId} en event.pathParameters.
 * @param {{ eventId: number }} event ID entero positivo del evento que quieres leer.
 * @example
 * npx --no-install serverless invoke \
 *   --function buscarEvento \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{"eventId": 1}'
 *
 * @example HTTP desde la terminal con la URL del despliegue en api_url.
 * curl -i "$api_url/events/1"
 */
export async function buscarEventoHandler(event) {
  const esHttp = Boolean(event?.requestContext?.http);
  try {
    const eventId = esHttp ? Number(event.pathParameters.eventId) : event?.eventId;
    if (!Number.isSafeInteger(eventId) || eventId < 1) {
      throw new Error('Indica un ID de evento entero positivo');
    }

    const evento = await buscarEventoService(eventId);
    if (esHttp && !evento) return json(404, { message: 'Evento no encontrado' });
    return esHttp ? json(200, evento) : evento;
  } catch (error) {
    if (esHttp) return responderErrorHttp(error);
    throw error;
  }
}
