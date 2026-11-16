import { NoEncontradoError } from '../errores.mjs';
import { json, responderErrorHttp } from '../../http/respuesta.mjs';

export { json } from '../../http/respuesta.mjs';

export function leerClaveInscripcion(event) {
  const { eventId, userId } = event.pathParameters;
  return { eventId: BigInt(eventId), userId };
}

export function responderError(error) {
  if (error instanceof NoEncontradoError) {
    return json(404, { message: error.message });
  }

  return responderErrorHttp(error);
}
