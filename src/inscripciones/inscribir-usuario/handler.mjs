import { handleRequest } from '../http/peticion.mjs';
import { inscribirUsuarioService } from './service.mjs';

export function handler(event) {
  return handleRequest(event, inscribirUsuarioService);
}
