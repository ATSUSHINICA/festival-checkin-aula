import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLA_EVENTOS_FCI } from '../datos/dynamo.mjs';

export async function buscarEvento(eventId) {
  const { Item } = await db.send(new GetCommand({
    TableName: TABLA_EVENTOS_FCI,
    Key: { EVENT_ID: eventId },
    ConsistentRead: true
  }));
  if (!Item) return null;
  return { eventId: Item.EVENT_ID, title: Item.TITLE };
}
