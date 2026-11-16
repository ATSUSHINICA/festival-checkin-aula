import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLA_EVENTOS_FCI } from '../../datos/dynamo.mjs';

export async function guardarEvento(eventId, title) {
  const itemEvento = {
    EVENT_ID: eventId,
    TITLE: title
  };

  const comando = new PutCommand({
    TableName: TABLA_EVENTOS_FCI,
    Item: itemEvento,
    ConditionExpression: 'attribute_not_exists(EVENT_ID)'
  });

  await db.send(comando);
}
