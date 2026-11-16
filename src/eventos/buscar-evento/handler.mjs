import { buscarEventoService } from './service.mjs';

/**
 * AWS Lambda entrega el JSON enviado en --payload como un objeto JavaScript.
 * @param {{ eventId: number }} event ID numérico enviado en el JSON.
 * @example
 * aws lambda invoke \
 *   --function-name festival-check-in-equipo01-buscarEvento \
 *   --profile default \
 *   --region us-east-1 \
 *   --cli-binary-format raw-in-base64-out \
 *   --payload '{"eventId": 1}' \
 *   respuesta-buscar-evento.json
 */
export function buscarEventoHandler(event) {
  const { eventId } = event ?? {};
  if (!Number.isSafeInteger(eventId) || eventId < 1) {
    throw new Error('Indica un ID de evento entero positivo');
  }

  return buscarEventoService(eventId);
}
