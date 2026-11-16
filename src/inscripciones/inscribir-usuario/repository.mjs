import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put';
import { MODELO_INSCRIPCION } from '../models/inscripcion.model.mjs';

export async function inscribirUsuarioRepository(eventId, userId, registeredAt) {
  await MODELO_INSCRIPCION.build(PutItemCommand)
    .item({ eventId, userId, registeredAt })
    .options({ condition: { attr: 'eventId', exists: false } })
    .send();
}
