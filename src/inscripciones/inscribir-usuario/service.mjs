import { NoEncontradoError } from '../errores.mjs';
import { buscarEventoService } from '../../eventos/buscar-evento/service.mjs';
import { buscarUsuarioRepository } from '../../usuarios/buscar-usuario/repository.mjs';
import { inscribirUsuarioRepository } from './repository.mjs';

export async function inscribirUsuarioService({ eventId, userId }) {
  const evento = await buscarEventoService(eventId);
  if (!evento) throw new NoEncontradoError('Evento no encontrado');

  const usuario = await buscarUsuarioRepository(userId);
  if (!usuario) throw new NoEncontradoError('Usuario no encontrado');

  const registeredAt = new Date().toISOString();
  await inscribirUsuarioRepository(eventId, userId, registeredAt);
  return { message: 'Inscripción creada' };
}
