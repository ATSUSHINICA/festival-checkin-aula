import { json, leerClaveInscripcion, responderError } from '../http/peticion.mjs';
import { consultarInscripcionService } from './service.mjs';

/**
 * API Gateway llama a este handler con GET /events/{eventId}/registrations/{userId}.
 * En la invocación directa, envía los dos valores de la ruta como texto dentro de pathParameters.
 * @param {{ pathParameters: { eventId: string, userId: string } }} event Clave de la inscripción.
 * @example
 * npx --no-install serverless invoke \
 *   --function consultarInscripcion \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{"pathParameters": {"eventId": "3", "userId": "usuario-aula-03"}}'
 *
 * @example HTTP desde la terminal con la URL del despliegue en api_url.
 * curl -i "$api_url/events/3/registrations/usuario-aula-03"
 */
export async function handler(event) {
  try {
    const clave = leerClaveInscripcion(event);
    const resultado = await consultarInscripcionService(clave);
    return json(200, resultado);
  } catch (error) {
    return responderError(error);
  }
}
