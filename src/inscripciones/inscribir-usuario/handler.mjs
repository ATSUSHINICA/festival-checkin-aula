import { json, responderError } from '../http/peticion.mjs';
import { inscribirUsuarioService } from './service.mjs';

/**
 * API Gateway llama a este handler con POST /events/{eventId}/registrations.
 * El ID del evento llega en la ruta y el usuario en el JSON de event.body.
 * @param {{ pathParameters: { eventId: string, userId?: string }, body?: string }} event Petición de inscripción.
 * @example
 * npx --no-install serverless invoke \
 *   --function inscribirUsuario \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{"pathParameters":{"eventId":"3"},"body":"{\"userId\":\"usuario-aula-03\"}"}'
 */
export async function handler(event) {
  try {
    const { eventId, userId: usuarioEnRuta } = event.pathParameters;
    // La ruta anterior también puede aportar el usuario.
    const userId = usuarioEnRuta ?? JSON.parse(event.body).userId;
    const resultado = await inscribirUsuarioService({ eventId: BigInt(eventId), userId });
    return json(201, resultado);
  } catch (error) {
    return responderError(error);
  }
}
