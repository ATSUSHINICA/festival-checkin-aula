import { listarEventosService } from './service.mjs';

/**
 * Envía {} para pedir la primera página. Para avanzar, envía el valor de siguienteCursor como cursor.
 * @param {{ cursor?: string }} event El cursor se envía como texto, por ejemplo {"cursor":"3"}.
 * @example
 * npx --no-install serverless invoke \
 *   --function listarEventos \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{}'
 */
export function listarEventosHandler({ cursor } = {}) {
  return listarEventosService(cursor);
}
