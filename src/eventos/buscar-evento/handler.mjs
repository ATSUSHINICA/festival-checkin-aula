import { buscarEventoService } from './service.mjs';

/**
 * AWS Lambda entrega el JSON enviado en --data como un objeto JavaScript.
 * @param {{ eventId: number }} event ID numérico enviado en el JSON.
 * @example
 * npx --no-install serverless invoke \
 *   --function buscarEvento \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{"eventId": 1}'
 */
export function buscarEventoHandler(event) {
  const { eventId } = event ?? {};
  if (!Number.isSafeInteger(eventId) || eventId < 1) {
    throw new Error('Indica un ID de evento entero positivo');
  }

  return buscarEventoService(eventId);
}
