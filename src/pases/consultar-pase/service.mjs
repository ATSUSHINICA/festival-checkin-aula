import { json } from '../peticion.mjs';
import { buscarEvento } from '../../eventos/eventos.repository.mjs';
import { buscarInscripcion } from './repository.mjs';

export async function consultarPase({ eventId, userId }) {
  const evento = await buscarEvento(eventId);
  if (!evento) return json(404, { message: 'Evento no encontrado' });

  const registration = await buscarInscripcion(eventId, userId);
  return json(200, {
    eventId: evento.eventId,
    title: evento.title,
    registration
  });
}
