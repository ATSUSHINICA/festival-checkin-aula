import { NoEncontradoError } from '../errores.mjs';
import { buscarEventoService } from '../../eventos/buscar-evento/service.mjs';
import { consultarInscripcionRepository } from './repository.mjs';

export async function consultarInscripcionService({ eventId, userId }) {
  const evento = await buscarEventoService(eventId);
  if (!evento) throw new NoEncontradoError('Evento no encontrado');

  const registration = await consultarInscripcionRepository(eventId, userId);
  return {
    eventId: evento.eventId,
    title: evento.title,
    registration
  };
}
