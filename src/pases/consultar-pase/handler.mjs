import { handleRequest } from '../peticion.mjs';
import { consultarPase } from './service.mjs';

export function handler(event) {
  return handleRequest(event, consultarPase);
}
