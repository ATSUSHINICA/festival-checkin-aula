import { handleRequest } from '../http/peticion.mjs';
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
 */
export function handler(event) {
  return handleRequest(event, consultarInscripcionService);
}
