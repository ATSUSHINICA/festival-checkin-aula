import assert from 'node:assert/strict';
import { test } from 'node:test';

process.env.AWS_REGION = 'us-east-1';
process.env.FCI_TABLA_EVENTOS = 'EVENTOS';
process.env.FCI_TABLA_USUARIOS = 'USUARIOS';
process.env.FCI_TABLA_INSCRIPCIONES = 'INSCRIPCIONES';

const { db } = await import('../src/datos/dynamo.mjs');
const { handler: crearEvento } = await import('../src/eventos/crear-evento/handler.mjs');
const { handler: crearUsuario } = await import('../src/usuarios/crear-usuario/handler.mjs');
const { handler: consultar } = await import('../src/inscripciones/consultar-pase/handler.mjs');
const { handler: inscribir } = await import('../src/inscripciones/inscribir-usuario/handler.mjs');

test('Alta, consulta e inscripción a través de los cuatro handlers', async context => {
  const datos = new Map();
  const clave = (tabla, valores) => JSON.stringify([tabla, String(valores.EVENT_ID ?? ''), valores.USER_ID]);
  context.mock.method(db, 'send', async ({ input, constructor }) => {
    if (constructor.name === 'GetCommand') {
      return { Item: datos.get(clave(input.TableName, input.Key)) };
    }
    assert.equal(constructor.name, 'PutCommand');
    const condition = /^attribute_not_exists\(([#\w]+)\)$/.exec(input.ConditionExpression);
    assert.ok(condition);
    const atributo = input.ExpressionAttributeNames?.[condition[1]] ?? condition[1];
    assert.equal(atributo, input.TableName === 'USUARIOS' ? 'USER_ID' : 'EVENT_ID');
    const key = clave(input.TableName, input.Item);
    if (datos.has(key)) throw Object.assign(new Error('Duplicado'), { name: 'ConditionalCheckFailedException' });
    const item = { ...input.Item };
    if (typeof item.EVENT_ID === 'bigint') item.EVENT_ID = Number(item.EVENT_ID);
    datos.set(key, item);
    return {};
  });

  const peticion = { pathParameters: { eventId: '1', userId: 'usuario-02' } };
  assert.equal((await consultar({})).statusCode, 400);
  assert.equal((await consultar(peticion)).statusCode, 404);
  await assert.rejects(crearEvento({ eventId: 1, title: '' }), /título/);
  await crearEvento({ eventId: 1, title: 'Festival de otoño' });
  await assert.rejects(crearEvento({ eventId: 1, title: 'Otro título' }), { name: 'ConditionalCheckFailedException' });
  assert.equal((await inscribir(peticion)).statusCode, 404);
  await crearUsuario({
    userId: 'usuario-02', firstName: 'Leo', lastName: 'Martín',
    email: 'leo.martin@example.com', city: 'Huesca'
  });
  const antes = await consultar(peticion);
  assert.equal(antes.statusCode, 200);
  assert.equal(JSON.parse(antes.body).registration, null);
  assert.equal((await inscribir(peticion)).statusCode, 201);
  assert.equal((await inscribir(peticion)).statusCode, 409);
  const despues = await consultar(peticion);
  assert.equal(despues.statusCode, 200);
  const pase = JSON.parse(despues.body);
  assert.equal(pase.title, 'Festival de otoño');
  assert.equal(pase.registration.userId, 'usuario-02');
  assert.equal(pase.registration.eventId, 1);
  assert.deepEqual(datos.get(clave('EVENTOS', { EVENT_ID: 1 })), {
    EVENT_ID: 1, TITLE: 'Festival de otoño'
  });
  assert.deepEqual(datos.get(clave('INSCRIPCIONES', { EVENT_ID: 1, USER_ID: 'usuario-02' })), {
    EVENT_ID: 1, USER_ID: 'usuario-02', REGISTERED_AT: pase.registration.registeredAt
  });
  assert.ok(pase.registration.registeredAt);
});
