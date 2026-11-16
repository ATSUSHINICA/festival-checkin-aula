import { guardarEvento } from './repository.mjs';

export async function crearEvento(eventId, title) {
  if (!Number.isSafeInteger(eventId) || eventId < 1) {
    throw new Error('Indica un ID de evento entero positivo');
  }
  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error('Escribe un título para el evento');
  }

  await guardarEvento(eventId, title);
  return { eventId, title };
}
