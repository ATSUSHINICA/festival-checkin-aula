import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLA_USUARIOS_FCI } from '../../datos/dynamo.mjs';
import { MODELO_INSCRIPCION } from '../inscripcion.model.mjs';

export async function buscarUsuario(userId) {
  const { Item } = await db.send(new GetCommand({
    TableName: TABLA_USUARIOS_FCI,
    Key: { USER_ID: userId },
    ConsistentRead: true
  }));
  return Item;
}

export async function guardarInscripcion(eventId, userId, registeredAt) {
  await MODELO_INSCRIPCION.build(PutItemCommand)
    .item({ eventId, userId, registeredAt })
    .options({ condition: { attr: 'eventId', exists: false } })
    .send();
}
