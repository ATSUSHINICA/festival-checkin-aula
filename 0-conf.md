# 0 · Configura Festival Check-in desde cero

Usa **Git Bash** en Windows o **Terminal** en macOS. Ejecuta los bloques en orden y conserva la misma terminal para que las variables sigan disponibles.

## 1. Comprueba tus herramientas

```bash
git --version
node --version
npm --version
aws --version
```

Necesitas Git, **Node.js 20 o superior** y AWS CLI v2. Si tu versión de Node cumple el mínimo, usa la que ya tienes instalada. Si es anterior, instala una versión compatible y vuelve a abrir la terminal. Node 22 es la versión que ejecuta Lambda en AWS. [Git](https://git-scm.com/install) · [Node.js](https://nodejs.org/en/download) · [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## 2. Clona e instala el proyecto

Desde la carpeta donde guardas tus prácticas, ejecuta:

```bash
git clone https://github.com/albertohdezakkari/festival-checkin-01.git &&
cd festival-checkin-01
```

Si ya lo clonaste, entra en la carpeta existente y actualízala:

```bash
cd festival-checkin-01 &&
git pull --ff-only
```

Desde la raíz de `festival-checkin-01`:

```bash
pwd
npm ci && npm test
```

La ruta debe terminar en `festival-checkin-01` y la prueba local debe mostrar **`pass 1` y `fail 0`**. La prueba recorre los cuatro handlers con DynamoDB simulado.

## 3. Activa AWS Academy y guarda las credenciales

En **AWS Academy → Learner Lab**, pulsa **Start Lab**. Cuando el laboratorio esté activo, abre **AWS Details → AWS CLI → Show** y copia el bloque de la sesión.

```bash
mkdir -p ~/.aws &&
touch ~/.aws/credentials &&
chmod 600 ~/.aws/credentials &&
vi ~/.aws/credentials
```

En `vi`, escribe `:set paste` y pulsa Intro. Si el perfil es nuevo, sitúate en una línea libre, pulsa `i` y pega el bloque. Usa la cabecera `[academy]` en minúsculas. Si el bloque copiado trae `[default]`, cambia esa cabecera en el bloque que vas a pegar. Si el perfil ya existe, sustituye sus tres valores en esa misma sección. Guarda con **Esc**, `:wq` e Intro.

La sección debe contener `aws_access_key_id`, `aws_secret_access_key` y `aws_session_token`. Usa los tres valores de la misma sesión y guárdalos solo en el archivo personal `~/.aws/credentials`.

```bash
aws configure list-profiles
```

La lista debe incluir `academy`. Si ya tenías la sesión del laboratorio guardada en `[default]`, puedes usar `default` en el paso siguiente. [Preparación visual en el cuaderno](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#iniciar-lab)

## 4. Configura y comprueba tu despliegue

Desde la raíz del proyecto, usa `academy` tal como aparece en la cabecera `[academy]`. Si usas `[default]`, cambia la primera línea a `export AWS_PROFILE=default`. Ajusta la región a la del laboratorio y usa el código de equipo asignado. Si varios equipos comparten cuenta y región, cada uno utiliza un código distinto. El código empieza por una letra minúscula y admite hasta veinte caracteres entre minúsculas, números y guiones.

```bash
export AWS_PROFILE=academy
export AWS_REGION=us-east-1
export FCI_EQUIPO=equipo01

aws sts get-caller-identity --profile "$AWS_PROFILE" --region "$AWS_REGION"
```

Avanza cuando la salida muestre `Account` y `Arn`. Si aparece `ExpiredToken`, recupera los tres valores vigentes de AWS Details, sustituye los anteriores y repite la comprobación.

```bash
LAMBDA_ROLE_ARN="$(aws iam get-role --role-name LabRole \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --query 'Role.Arn' --output text)" &&
export LAMBDA_ROLE_ARN &&
printf 'Rol de Lambda: %s\n' "$LAMBDA_ROLE_ARN"
```

Debe aparecer un ARN que termine en `:role/LabRole`. Si tu cuenta deniega `iam:GetRole`, pide el ARN completo del rol al profesor y sustitúyelo en este comando:

```bash
export LAMBDA_ROLE_ARN="ARN_COMPLETO_DEL_ROL"
```

En `serverless.yml`, el código de equipo se convierte en el entorno de Serverless y se añade al nombre de las tablas. Con `equipo01`, el stack será `festival-check-in-equipo01` y la tabla de eventos será `FCI_EVENTOS_equipo01`.

## 5. Despliega y carga los datos de ejemplo

Desde la raíz de `festival-checkin-01`, en la misma terminal del paso 4. Si abriste otra, vuelve a ejecutar el paso 4 para recuperar las cuatro variables. El bloque comprueba que tengan valor antes de arrancar Serverless.

```bash
: "${AWS_PROFILE:?Vuelve al paso 4 y exporta AWS_PROFILE}" &&
: "${AWS_REGION:?Vuelve al paso 4 y exporta AWS_REGION}" &&
: "${FCI_EQUIPO:?Vuelve al paso 4 y exporta FCI_EQUIPO}" &&
: "${LAMBDA_ROLE_ARN:?Vuelve al paso 4 y exporta LAMBDA_ROLE_ARN}" &&
npm run deploy -- --aws-profile "$AWS_PROFILE" &&
npm run aula
```

Si Serverless Framework solicita su propio inicio de sesión, ejecuta `npx serverless login`, completa el acceso en el navegador y repite el bloque de despliegue.

`npm run aula` carga el evento **1** y el perfil ficticio **`usuario-02`**. En un entorno nuevo debe mostrar **GET 200 → POST 201 → POST 409 → GET 200**. El 409 confirma que se bloqueó la segunda inscripción. Al repetir una prueba ya completada, el pase existente se conserva. Guarda la URL de la API que aparece al final.

## 6. Comprueba el resultado

Lee el evento directamente desde DynamoDB:

```bash
aws dynamodb get-item \
  --table-name "FCI_EVENTOS_${FCI_EQUIPO}" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --key '{"EVENT_ID":{"N":"1"}}' \
  --consistent-read --query 'Item' --output json
```

Comprueba que el ítem contiene **`EVENT_ID = 1`** y **`TITLE = Festival de otoño`**. En la pantalla del festival, elige **AWS**, pega la URL del paso anterior y consulta el evento **1** para **`usuario-02`**. Debe aparecer **Inscrito**. [Abrir la pantalla del festival](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#pantalla)
