import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLA_INSCRIPCIONES_FCI } from '../../datos/dynamo.mjs';

export async function buscarInscripcion(eventId, userId) {
  const { Item } = await db.send(new GetCommand({
    TableName: TABLA_INSCRIPCIONES_FCI,
    Key: { EVENT_ID: eventId, USER_ID: userId },
    ConsistentRead: true
  }));
  if (!Item) return null;

  return {
    eventId: Item.EVENT_ID,
    userId: Item.USER_ID,
    registeredAt: Item.REGISTERED_AT,
    checkedInAt: Item.CHECKED_IN_AT
  };
}
