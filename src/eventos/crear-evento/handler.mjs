import { crearEventoService } from './service.mjs';

/**
 * Invoca desde la terminal tras desplegar. Usa un ID de evento libre.
 * @param {{ eventId: number, title: string }} event ID entero positivo y título con texto.
 * @example
 * npx --no-install serverless invoke \
 *   --function crearEvento \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{"eventId": 3, "title": "Concierto de aula"}'
 */
export function handler({ eventId, title } = {}) {
  return crearEventoService(eventId, title);
}
