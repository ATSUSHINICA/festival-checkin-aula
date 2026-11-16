import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put';
import { MODELO_EVENTO } from '../models/evento.model.mjs';

export async function crearEventoRepository(eventId, title) {
  const evento = {
    eventId,
    title
  };

  const comando = MODELO_EVENTO.build(PutItemCommand)
    .item(evento)
    .options({
      condition: { attr: 'eventId', exists: false }
    });

  await comando.send();
}
