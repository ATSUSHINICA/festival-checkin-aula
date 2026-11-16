# 2 · Crear un usuario

**En el cuaderno web** · [Programar Lambda](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#archivo-lambda) (elige **Usuarios · handler.mjs**) · [Invocar crearUsuario](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#sembrar-usuarios)

**Objetivo.** Guarda el perfil ficticio que se inscribirá al evento del paso anterior.

**Punto de partida.** Sigue en `festival-checkin-01`, en la misma terminal del [caso 1](1-crear-evento.md). Si abriste otra, recupera las variables del [paso 4 de configuración](0-conf.md#4-configura-y-comprueba-tu-despliegue) y asigna a `evento_id` el ID que anotaste.

## Sigue el código

En [serverless.yml](serverless.yml), `functions → crearUsuario` apunta a `src/usuarios/crear-usuario/handler.handler`. La invocas directamente con AWS CLI.

En este caso, el [handler de usuario](src/usuarios/crear-usuario/handler.mjs) reúne la validación y el acceso a datos. Comprueba el código, el nombre, los apellidos y el correo. Construye el ítem con `USER_ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL` y `CITY`. Después escribe con `PutCommand` del SDK y protege `USER_ID` con una condición de escritura.

Localiza las dos responsabilidades dentro del archivo. Para explicar qué llevarías a un service y qué llevarías a un repository, usa como referencia el alta de evento del caso 1.

## Crea el perfil

El código de ejemplo reutiliza el ID del evento para identificar el perfil de esta demostración. Conserva `usuario_id` para consultar e inscribir.

```bash
usuario_id="usuario-aula-${evento_id:?Completa el caso 1 y recupera evento_id}"
printf 'ID del usuario de clase: %s\n' "$usuario_id"

aws lambda invoke \
  --function-name "festival-check-in-${FCI_EQUIPO}-crearUsuario" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --cli-binary-format raw-in-base64-out \
  --payload "{\"userId\":\"$usuario_id\",\"firstName\":\"Leo\",\"lastName\":\"Martin\",\"email\":\"leo.martin@example.com\",\"city\":\"Huesca\"}" \
  respuesta-usuario.json &&
cat respuesta-usuario.json
```

Comprueba que la invocación no contiene `FunctionError` y que el JSON devuelve el `userId` que has enviado.

## Lee el perfil por su clave

```bash
aws dynamodb get-item \
  --table-name "FCI_USUARIOS_${FCI_EQUIPO}" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --key "{\"USER_ID\":{\"S\":\"$usuario_id\"}}" \
  --consistent-read --query 'Item' --output json
```

**Antes de avanzar.** Comprueba que el perfil tiene tu `USER_ID` y que nombre, apellidos y correo están en campos distintos. Anota `usuario_id` si vas a cerrar la terminal.

**Para aplicarlo a tu proyecto.** Identifica qué segundo registro necesita tu caso de uso y qué clave emplearás para recuperarlo al crear la relación.

[Siguiente · Consultar un pase](3-consultar-pase.md)
