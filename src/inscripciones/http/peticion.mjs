import { NoEncontradoError } from '../errores.mjs';

export function leerClaveInscripcion(event) {
  const { eventId, userId } = event.pathParameters;
  return { eventId: BigInt(eventId), userId };
}

export function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body, (_name, value) =>
      typeof value === 'bigint' ? value.toString() : value)
  };
}

export function responderError(error) {
  if (error instanceof NoEncontradoError) {
    return json(404, { message: error.message });
  }
  if (error.name === 'ConditionalCheckFailedException') {
    return json(409, { message: 'La operación no se puede aplicar a este estado' });
  }

  console.error(error.name, error.message);
  return json(500, { message: 'Revisa los logs de la función' });
}
