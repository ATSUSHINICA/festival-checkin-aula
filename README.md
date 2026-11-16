# Festival Check-in

Proyecto de aula listo para clonar. Crearás los recursos en AWS Academy, cargarás un evento y un perfil ficticio y comprobarás el pase por HTTP.

## 1. Clona y comprueba el proyecto

Usa Git Bash en Windows o Terminal en macOS. Necesitas Git, Node.js 22 y AWS CLI v2.

```bash
git clone https://github.com/albertohdezakkari/festival-checkin-01.git
cd festival-checkin-01
node --version
aws --version
npm ci
npm test
```

La prueba local pasa por los cuatro handlers y genera los comandos reales de DynamoDB Toolbox. El envío a DynamoDB se simula. Comprueba la consulta sin pase, el alta, el conflicto al repetir y la lectura posterior.

## 2. Configura tu sesión

En AWS Academy, inicia **Learner Lab → Start Lab → AWS Details → AWS CLI**. Guarda las tres credenciales temporales en un perfil de tu archivo personal `~/.aws/credentials`. Si el bloque trae `[default]` y ya usas ese perfil para otra cuenta, ponle `[academy]`. Sigue estos pasos del [cuaderno de preparación](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#iniciar-lab).

Desde la raíz del proyecto, cambia los valores de ejemplo por los de tu laboratorio. Cada equipo que comparta cuenta y región debe usar un código diferente de hasta 20 caracteres, en minúsculas, con números o guiones y empezando por una letra.

```bash
export AWS_PROFILE=academy
export AWS_REGION=us-east-1
export FCI_EQUIPO=equipo01
aws sts get-caller-identity --profile "$AWS_PROFILE" --region "$AWS_REGION"
```

Si guardaste las credenciales en `[default]`, exporta `AWS_PROFILE=default`. Si STS muestra `ExpiredToken`, renueva en AWS Details los tres valores del mismo perfil.

```bash
LAMBDA_ROLE_ARN=$(aws iam get-role --role-name LabRole \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" --query 'Role.Arn' --output text) &&
export LAMBDA_ROLE_ARN
```

Si el laboratorio deniega `iam:GetRole`, exporta `LAMBDA_ROLE_ARN` con el ARN completo de LabRole que te facilite el profesor. Si Serverless te pide iniciar sesión, ejecuta `npx serverless login` y completa el acceso en el navegador. Son dos accesos distintos. Serverless autentica su herramienta y AWS CLI utiliza la sesión de Academy.

## 3. Despliega y prueba

En la misma terminal, desde la raíz del repositorio:

```bash
npm run deploy -- --aws-profile "$AWS_PROFILE" &&
npm run aula
```

Para una instalación nueva, verás **GET 200 → POST 201 → POST 409 → GET 200**. El comando carga el evento 1 y a `usuario-02` y muestra la URL de la API al final. Si repites la prueba, ya existe el mismo pase y el POST devuelve 409.

Abre la [pantalla del festival](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#pantalla), elige **AWS**, pega la URL y consulta el evento **1** para **usuario-02**. El pase del usuario figura como **Inscrito**.

## 4. Sigue el código desde la petición hasta DynamoDB

| Abre | Qué buscar |
| --- | --- |
| `serverless.yml` | Las cuatro funciones, las rutas GET y POST, las tres tablas y el índice `PorUsuario`. Los nombres de tabla llevan el código del equipo. |
| `src/pases/consultar-pase/handler.mjs` | La entrada de API Gateway llama al caso de uso de consulta. |
| `src/pases/consultar-pase/service.mjs` | Lee el evento y después el pase. Antes de inscribirse, `registration` vale `null`. |
| `src/pases/inscribir-usuario/service.mjs` y `repository.mjs` | Comprueban las referencias y guardan la inscripción con una condición que protege frente a duplicados. |
| `src/eventos/evento.model.mjs` y `src/pases/inscripcion.model.mjs` | DynamoDB Toolbox traduce `eventId` a `EVENT_ID` y `userId` a `USER_ID` sin cambiar las claves de las tablas. |
| `src/datos/dynamo.mjs` | El cliente del SDK comparte la conexión y lee los nombres de tablas que inyecta Serverless. |

Sigue en el cuaderno los pasos [Crear con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#capas-eventos-orm), [Consultar con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#consultar-orm) e [Inscribir con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#inscribir-orm). El alta del perfil y la lectura de usuario conservan el SDK directo, tal como se muestran en el cuaderno.
