import { Entity } from 'dynamodb-toolbox/entity';
import { Table } from 'dynamodb-toolbox/table';
import { item } from 'dynamodb-toolbox/schema/item';
import { string } from 'dynamodb-toolbox/schema/string';
import { any } from 'dynamodb-toolbox/schema/any';
import { db, TABLA_USUARIOS_FCI } from '../../datos/dynamo.mjs';

const TABLA_MODELO_USUARIO = new Table({
  name: TABLA_USUARIOS_FCI,
  documentClient: db,
  partitionKey: { name: 'USER_ID', type: 'string' }
});

export const MODELO_USUARIO = new Entity({
  name: 'Usuario',
  table: TABLA_MODELO_USUARIO,
  entityAttribute: false,
  timestamps: false,
  schema: item({
    userId: string().key().savedAs('USER_ID'),
    firstName: string().savedAs('FIRST_NAME'),
    lastName: string().savedAs('LAST_NAME'),
    email: string().savedAs('EMAIL'),
    city: any().optional().savedAs('CITY')
  })
});
