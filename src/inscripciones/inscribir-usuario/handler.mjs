import { json, leerClaveInscripcion, responderError } from '../http/peticion.mjs';
import { inscribirUsuarioService } from './service.mjs';

/**
 * API Gateway llama a este handler con POST /events/{eventId}/registrations/{userId}.
 * En la invocación directa, envía los IDs de un evento y un usuario existentes como texto en pathParameters.
 * @param {{ pathParameters: { eventId: string, userId: string } }} event Clave de la inscripción.
 * @example
 * npx --no-install serverless invoke \
 *   --function inscribirUsuario \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{"pathParameters": {"eventId": "3", "userId": "usuario-aula-03"}}'
 */
export async function handler(event) {
  try {
    const clave = leerClaveInscripcion(event);
    const resultado = await inscribirUsuarioService(clave);
    return json(201, resultado);
  } catch (error) {
    return responderError(error);
  }
}
