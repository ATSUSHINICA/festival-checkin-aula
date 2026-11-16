# 1 · Crear un evento

**En el cuaderno web** · [Crear por capas](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#capas-eventos) · [Crear con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#capas-eventos-orm) · [Infografía de la traza](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/traza-evento/#infografia) · [Pestaña Invoke](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#invoke-crear-evento)

**Objetivo.** Invoca una Lambda desde la terminal y sigue el título hasta el ítem que se guarda en DynamoDB.

**Punto de partida.** Completa [0-conf.md](0-conf.md). Trabaja desde la raíz de `festival-checkin-01`, con el despliegue hecho y las variables `AWS_PROFILE`, `AWS_REGION` y `FCI_EQUIPO` cargadas en esa terminal.

## Sigue el código

Abre [serverless.yml](serverless.yml) y busca `functions → crearEvento`.

```yaml
crearEvento:
  name: ${self:service}-${self:provider.stage}-crearEvento
  handler: src/eventos/crear-evento/handler.handler
```

`${self:service}` lee `service` y `${self:provider.stage}` lee `stage` dentro de `provider`. Ambas referencias buscan el valor en este mismo YAML. Con el equipo `equipo01`, la función se llama `festival-check-in-equipo01-crearEvento`. En `handler.handler`, el primer `handler` es el nombre del archivo y el segundo es la función que exporta. Tú la invocarás con AWS CLI.

| Abre en este orden | Qué ocurre |
| --- | --- |
| [Handler](src/eventos/crear-evento/handler.mjs) | Recibe `eventId` y `title` y llama a `crearEventoService(eventId, title)`. |
| [Service](src/eventos/crear-evento/service.mjs) | Comprueba que el ID sea un entero positivo y que el título tenga texto. Llama a `crearEventoRepository`. |
| [Repository](src/eventos/crear-evento/repository.mjs) | Usa `PutItemCommand` de DynamoDB Toolbox. La condición de escritura protege el ID de un evento existente. |
| [Modelo Evento](src/eventos/models/evento.model.mjs) · [Explicación visual](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/traza-evento/?paso=modelo#lector) | Transforma `eventId` y `title` en `EVENT_ID` y `TITLE`. DynamoDB usa `EVENT_ID` como clave de partición numérica. |

Antes de ejecutar, señala en qué archivo se comprueba el título y en cuál se decide el nombre de cada atributo guardado. [Diagrama de capas y ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#capas-eventos-orm)

## Ejecuta la Lambda

Este bloque prepara un ID de ejemplo a partir de la hora actual en milisegundos. Guárdalo en la terminal para usar el mismo evento en los casos 2, 3 y 4.

```bash
evento_id=$(node -p 'Date.now()')
printf 'ID del evento de clase: %s\n' "$evento_id"

aws lambda invoke \
  --function-name "festival-check-in-${FCI_EQUIPO}-crearEvento" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --cli-binary-format raw-in-base64-out \
  --payload "{\"eventId\":$evento_id,\"title\":\"Concierto de aula\"}" \
  respuesta-evento.json &&
cat respuesta-evento.json
```

Comprueba que la salida de la invocación no contiene `FunctionError` y que el JSON devuelve tu `eventId` y el título. El `StatusCode: 200` de AWS CLI indica que Lambda atendió la invocación. El JSON devuelto te permite comprobar el resultado de la función.

## Busca el evento desde Lambda

Después de desplegar el proyecto, reutiliza `evento_id` en la misma terminal. En [serverless.yml](serverless.yml), `functions → buscarEvento` conecta la Lambda con [buscarEventoHandler](src/eventos/buscar-evento/handler.mjs). El handler lee el número del JSON y llama a [buscarEventoService](src/eventos/buscar-evento/service.mjs). El [repository](src/eventos/buscar-evento/repository.mjs) recupera el ítem con `GetItemCommand` y `MODELO_EVENTO`.

```bash
aws lambda invoke \
  --function-name "festival-check-in-${FCI_EQUIPO}-buscarEvento" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --cli-binary-format raw-in-base64-out \
  --payload "{\"eventId\":${evento_id:?Ejecuta antes la Lambda crearEvento}}" \
  respuesta-buscar-evento.json &&
cat respuesta-buscar-evento.json
```

Sigue el dato con `3` como ID de ejemplo.

| Paso | Qué recibe y qué entrega |
| --- | --- |
| **AWS CLI → Handler** | `--function-name` elige la Lambda. Bash pone el valor de `evento_id` en `--payload`. AWS entrega `{"eventId": 3}` como objeto JavaScript al parámetro `event`. |
| **Handler → Service** | `const { eventId } = event ?? {};` extrae la propiedad. Es como leer `event.eventId` cuando existe el objeto. Si falta el objeto, `?? {}` permite que la comprobación detecte el ID ausente. El handler comprueba que llega un entero positivo seguro y llama a `buscarEventoService(3)`. |
| **Service → Repository** | `buscarEventoRepository(3)` recibe un número. En `.key({ eventId })`, las llaves crean el objeto `{ eventId: 3 }` que espera Toolbox. |
| **Repository → DynamoDB** | `MODELO_EVENTO` traduce `eventId` a `EVENT_ID`. `.send()` envía un `GetItem` a la tabla de eventos de tu equipo con la clave numérica `EVENT_ID = 3`. Esa única clave identifica el ítem del evento. |
| **DynamoDB → Terminal** | DynamoDB devuelve el ítem con `EVENT_ID` y `TITLE`. Toolbox lo devuelve al repository como `Item: { eventId: 3, title: "Concierto de aula" }`. Service y handler devuelven el resultado, y AWS CLI lo escribe en `respuesta-buscar-evento.json`. |

**Antes de avanzar.** Comprueba que la respuesta contiene tu `eventId` y el título «Concierto de aula». Si pruebas con un ID válido que no existe, la salida es `null`.

## Comprueba el ítem

```bash
aws dynamodb get-item \
  --table-name "FCI_EVENTOS_${FCI_EQUIPO}" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --key "{\"EVENT_ID\":{\"N\":\"$evento_id\"}}" \
  --consistent-read --query 'Item' --output json
```

**Antes de avanzar.** El ítem debe contener tu `EVENT_ID` como número (`N`) y `TITLE` como texto (`S`). Anota el ID si vas a cerrar la terminal.

**Para aplicarlo a tu proyecto.** Elige qué registro vas a crear, cuál será su clave y qué dato obligatorio comprobará el service. Prepara una invocación válida y una lectura por clave que demuestre que se guardó.

[Siguiente · Crear un usuario](2-crear-usuario.md)
