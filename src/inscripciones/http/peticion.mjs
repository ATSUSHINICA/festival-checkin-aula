import { NoEncontradoError } from '../errores.mjs';

class ClaveInvalidaError extends Error {}

export function leerClaveInscripcion(event) {
  const { eventId: routeId, userId } = event?.pathParameters ?? {};
  if (!/^[1-9]\d{0,18}$/.test(routeId ?? '') || typeof userId !== 'string' || !userId.trim()) {
    throw new ClaveInvalidaError('Indica un ID numérico positivo y un código de usuario');
  }

  return { eventId: BigInt(routeId), userId };
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
  if (error instanceof ClaveInvalidaError) {
    return json(400, { message: error.message });
  }
  if (error instanceof NoEncontradoError) {
    return json(404, { message: error.message });
  }
  if (error.name === 'ConditionalCheckFailedException') {
    return json(409, { message: 'La operación no se puede aplicar a este estado' });
  }

  console.error(error.name, error.message);
  return json(500, { message: 'Revisa los logs de la función' });
}
