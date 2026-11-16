import { crearUsuarioService } from './service.mjs';

/**
 * Invoca desde la terminal con un código de usuario libre.
 * @param {{ userId: string, firstName: string, lastName: string, email: string, city?: string }} event
 * Perfil con código, nombre, apellidos, correo y ciudad opcional.
 * @example
 * npx --no-install serverless invoke \
 *   --function crearUsuario \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{"userId": "usuario-aula-03", "firstName": "Leo", "lastName": "Martin", "email": "leo.martin@example.com", "city": "Huesca"}'
 */
export function handler({ userId, firstName, lastName, email, city } = {}) {
  return crearUsuarioService({ userId, firstName, lastName, email, city });
}
