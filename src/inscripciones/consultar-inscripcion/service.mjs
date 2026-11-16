import { json } from '../http/peticion.mjs';
import { buscarEventoService } from '../../eventos/buscar-evento/service.mjs';
import { consultarInscripcionRepository } from './repository.mjs';

export async function consultarInscripcionService({ eventId, userId }) {
  const evento = await buscarEventoService(eventId);
  if (!evento) return json(404, { message: 'Evento no encontrado' });

  const registration = await consultarInscripcionRepository(eventId, userId);
  return json(200, {
    eventId: evento.eventId,
    title: evento.title,
    registration
  });
}
