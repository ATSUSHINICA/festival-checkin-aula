import { handleRequest } from '../peticion.mjs';
import { inscribirUsuario } from './service.mjs';

export function handler(event) {
  return handleRequest(event, inscribirUsuario);
}
