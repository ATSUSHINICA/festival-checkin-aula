import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get';
import { MODELO_EVENTO } from './evento.model.mjs';

export async function buscarEvento(eventId) {
  const { Item } = await MODELO_EVENTO.build(GetItemCommand)
    .key({ eventId })
    .options({ consistent: true })
    .send();

  return Item ?? null;
}
