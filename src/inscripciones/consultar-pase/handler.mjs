import { handleRequest } from '../http/peticion.mjs';
import { consultarPaseService } from './service.mjs';

export function handler(event) {
  return handleRequest(event, consultarPaseService);
}
