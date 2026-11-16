import { buscarEventoService } from './service.mjs';

/**
 * Lambda entrega el JSON de --data como objeto. El ejemplo usa el evento de npm run aula.
 * @param {{ eventId: number }} event ID entero positivo del evento que quieres leer.
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
