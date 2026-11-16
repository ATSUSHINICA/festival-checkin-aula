import { json } from '../http/peticion.mjs';
import { buscarEventoService } from '../../eventos/buscar-evento/service.mjs';
import { consultarPaseRepository } from './repository.mjs';

export async function consultarPaseService({ eventId, userId }) {
  const evento = await buscarEventoService(eventId);
  if (!evento) return json(404, { message: 'Evento no encontrado' });

  const registration = await consultarPaseRepository(eventId, userId);
  return json(200, {
    eventId: evento.eventId,
    title: evento.title,
    registration
  });
}
