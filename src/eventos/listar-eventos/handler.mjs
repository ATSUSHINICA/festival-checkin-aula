import { json, responderErrorHttp } from '../../http/respuesta.mjs';
import { listarEventosService } from './service.mjs';

/**
 * Envía {} para pedir la primera página. Para avanzar, envía el valor de siguienteCursor como cursor.
 * API Gateway entrega el cursor opcional en event.queryStringParameters.
 * @param {{ cursor?: string }} event El cursor se envía como texto, por ejemplo {"cursor":"3"}.
 * @example
 * npx --no-install serverless invoke \
 *   --function listarEventos \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{}'
 *
 * @example HTTP desde la terminal con la URL del despliegue en api_url.
 * curl -i "$api_url/events"
 * # Para pedir la página siguiente, usa el siguienteCursor que recibiste.
 * curl -i "$api_url/events?cursor=3"
 */
export async function listarEventosHandler(event) {
  const esHttp = Boolean(event?.requestContext?.http);
  try {
    const cursor = esHttp ? event.queryStringParameters?.cursor : event?.cursor;
    const resultado = await listarEventosService(cursor);
    return esHttp ? json(200, resultado) : resultado;
  } catch (error) {
    if (esHttp) return responderErrorHttp(error);
    throw error;
  }
}
