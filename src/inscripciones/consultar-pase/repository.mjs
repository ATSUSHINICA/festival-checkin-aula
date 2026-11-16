import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get';
import { MODELO_INSCRIPCION } from '../models/inscripcion.model.mjs';

export async function consultarPaseRepository(eventId, userId) {
  const { Item } = await MODELO_INSCRIPCION.build(GetItemCommand)
    .key({ eventId, userId })
    .options({ consistent: true })
    .send();

  return Item ?? null;
}
