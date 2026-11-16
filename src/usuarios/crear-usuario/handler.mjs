import { json, responderErrorHttp } from '../../http/respuesta.mjs';
import { crearUsuarioService } from './service.mjs';

/**
 * Invoca desde la terminal con un código de usuario libre.
 * API Gateway entrega el JSON de POST /users en event.body.
 * @param {{ userId: string, firstName: string, lastName: string, email: string, city?: string }} event
 * Perfil con código, nombre, apellidos, correo y ciudad opcional.
 * @example
 * npx --no-install serverless invoke \
 *   --function crearUsuario \
 *   --aws-profile "$AWS_PROFILE" \
 *   --data '{"userId": "usuario-aula-03", "firstName": "Leo", "lastName": "Martin", "email": "leo.martin@example.com", "city": "Huesca"}'
 *
 * @example HTTP desde la terminal con la URL del despliegue en api_url.
 * curl -i -X POST "$api_url/users" \
 *   -H 'Content-Type: application/json' \
 *   -d '{"userId":"usuario-aula-03","firstName":"Leo","lastName":"Martin","email":"leo.martin@example.com","city":"Huesca"}'
 */
export async function handler(event) {
  const esHttp = Boolean(event?.requestContext?.http);
  try {
    const { userId, firstName, lastName, email, city } = esHttp ? JSON.parse(event.body) : (event ?? {});
    const resultado = await crearUsuarioService({ userId, firstName, lastName, email, city });
    return esHttp ? json(201, resultado) : resultado;
  } catch (error) {
    if (esHttp) return responderErrorHttp(error);
    throw error;
  }
}
