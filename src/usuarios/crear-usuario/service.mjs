import { crearUsuarioRepository } from './repository.mjs';

export async function crearUsuarioService({ userId, firstName, lastName, email, city }) {
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Indica el código de usuario');
  }
  if (typeof firstName !== 'string' || !firstName.trim() ||
      typeof lastName !== 'string' || !lastName.trim()) {
    throw new Error('Indica el nombre y los apellidos');
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new Error('Indica un correo con formato válido');
  }

  const perfil = {
    userId: userId.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    city
  };

  await crearUsuarioRepository(perfil);
  return { userId: perfil.userId };
}
