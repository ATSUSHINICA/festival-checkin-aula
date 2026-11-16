import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLA_INSCRIPCIONES_FCI, TABLA_USUARIOS_FCI } from '../../datos/dynamo.mjs';

export async function buscarUsuario(userId) {
  const { Item } = await db.send(new GetCommand({
    TableName: TABLA_USUARIOS_FCI,
    Key: { USER_ID: userId },
    ConsistentRead: true
  }));
  return Item;
}

export async function guardarInscripcion(eventId, userId, registeredAt) {
  const inscripcion = {
    EVENT_ID: eventId,
    USER_ID: userId,
    REGISTERED_AT: registeredAt
  };

  await db.send(new PutCommand({
    TableName: TABLA_INSCRIPCIONES_FCI,
    Item: inscripcion,
    ConditionExpression: 'attribute_not_exists(EVENT_ID)'
  }));
}
