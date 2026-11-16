import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put';
import { MODELO_USUARIO } from '../models/usuario.model.mjs';

export async function crearUsuarioRepository(perfil) {
  await MODELO_USUARIO.build(PutItemCommand)
    .item(perfil)
    .options({ condition: { attr: 'userId', exists: false } })
    .send();
}
