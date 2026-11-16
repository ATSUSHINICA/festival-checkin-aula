import { handleRequest } from '../http/peticion.mjs';
import { consultarInscripcionService } from './service.mjs';

export function handler(event) {
  return handleRequest(event, consultarInscripcionService);
}
