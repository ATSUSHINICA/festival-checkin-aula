import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get';
import { MODELO_USUARIO } from '../models/usuario.model.mjs';

export async function buscarUsuarioRepository(userId) {
  const { Item } = await MODELO_USUARIO.build(GetItemCommand)
    .key({ userId })
    .options({ consistent: true, attributes: ['userId'] })
    .send();

  return Item ?? null;
}
