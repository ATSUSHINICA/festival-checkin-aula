import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLA_USUARIOS_FCI } from '../../datos/dynamo.mjs';

export async function handler({ userId, firstName, lastName, email, city } = {}) {
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
    USER_ID: userId.trim(),
    FIRST_NAME: firstName.trim(),
    LAST_NAME: lastName.trim(),
    EMAIL: email.trim(),
    CITY: city
  };

  await db.send(new PutCommand({
    TableName: TABLA_USUARIOS_FCI,
    Item: perfil,
    ConditionExpression: 'attribute_not_exists(USER_ID)'
  }));

  return { userId: perfil.USER_ID };
}
