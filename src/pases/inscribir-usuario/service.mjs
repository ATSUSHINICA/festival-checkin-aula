import { json } from '../peticion.mjs';
import { buscarEvento } from '../../eventos/eventos.repository.mjs';
import { buscarUsuario, guardarInscripcion } from './repository.mjs';

export async function inscribirUsuario({ eventId, userId }) {
  const evento = await buscarEvento(eventId);
  if (!evento) return json(404, { message: 'Evento no encontrado' });

  const usuario = await buscarUsuario(userId);
  if (!usuario) return json(404, { message: 'Usuario no encontrado' });

  const registeredAt = new Date().toISOString();
  await guardarInscripcion(eventId, userId, registeredAt);
  return json(201, { message: 'Inscripción creada' });
}
