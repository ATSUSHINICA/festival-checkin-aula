# 0 · Festival Check-in en GitHub Codespaces

Abre el proyecto de la rama **`main`** en VS Code desde el navegador. Usarás la terminal de Codespaces para desplegar con **Serverless Framework 3.40.0**. Las cinco Lambdas, la API y las tres tablas DynamoDB se ejecutan en **AWS Academy**. [Configuración del proyecto](0-conf.md)

## 1. Abre el Codespace de main

1. Abre [Festival Check-in en la rama main](https://github.com/albertohdezakkari/festival-checkin-01/tree/main) con tu sesión de GitHub.
2. Pulsa **Code → Codespaces → Create codespace on main**. Espera a que se abra VS Code en el navegador. [Crear un Codespace desde una rama](https://docs.github.com/es/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository)
3. Abre **Terminal → New Terminal** en ese VS Code. Ejecuta los comandos de la guía en Bash, desde la raíz del proyecto en Codespaces.

```bash
pwd
git branch --show-current
ls package.json serverless.yml
```

**Antes de avanzar**, comprueba que la ruta termina en `/festival-checkin-01`, que la rama es `main` y que aparecen los dos archivos. Si ya tenías un Codespace abierto con este proyecto, [actualízalo primero](#si-ya-tenías-un-codespace-con-serverless-4).

## 2. Instala las herramientas

### Comprueba Node.js y AWS CLI

```bash
node --version
npm --version
aws --version
```

El proyecto admite Node.js **20 o superior**. Si tienes una versión anterior, activa Node 22 en esta terminal:

```bash
nvm install 22
nvm use 22
node --version
```

Si `aws --version` devuelve `aws: command not found` o muestra `aws-cli/1.`, instala AWS CLI v2 en el Linux del Codespace. [Instalación oficial de AWS CLI en Linux](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

```bash
curl -fsSL https://awscli.amazonaws.com/v2/install.sh | sudo bash -s -- --system
hash -r
aws --version
```

**Antes de avanzar**, comprueba que `aws --version` empieza por **`aws-cli/2.`**.

### Instala Serverless Framework desde el proyecto

```bash
npm ci --include=dev
npm run deploy -- --version
```

`npm ci` instala las versiones de `package-lock.json`. `--include=dev` incluye Serverless, que está declarado como herramienta de desarrollo. El segundo comando comprueba la versión que usará el despliegue.

**Antes de avanzar**, comprueba que aparece **`Framework Core: 3.40.0 (local)`**. Esta versión solo requiere las credenciales de AWS Academy para desplegar este proyecto. Si aparece el menú de inicio de sesión de la v4, [actualiza el Codespace](#si-ya-tenías-un-codespace-con-serverless-4).

## 3. Conecta AWS Academy con el perfil default

1. En el navegador, entra en **AWS Academy → Learner Lab → Start Lab**. Espera a que el laboratorio esté activo.
2. Abre **AWS Details → AWS CLI → Show** y copia el bloque de credenciales temporales. Incluye la clave de acceso, la clave secreta y el token de sesión.
3. Abre el archivo personal de credenciales en el Codespace:

```bash
mkdir -p ~/.aws
touch ~/.aws/credentials
chmod 600 ~/.aws/credentials
vi ~/.aws/credentials
```

Si el archivo está vacío, escribe `:set paste` en `vi`, pulsa **Intro**, después **i** y pega el bloque bajo la cabecera `[default]`. Si ya hay un bloque `[default]`, sustituye sus tres valores. Guarda con **Esc**, `:wq` e **Intro**. El archivo queda fuera del repositorio.

En la misma terminal, indica qué perfil, región y equipo vas a usar. Sustituye `equipo01` por tu código asignado. Si ya guardaste las credenciales con la cabecera `[academy]`, usa `academy` como valor de `AWS_PROFILE`.

```bash
export AWS_PROFILE=default
export AWS_REGION=us-east-1
export FCI_EQUIPO=equipo01

aws sts get-caller-identity --profile "$AWS_PROFILE" --region "$AWS_REGION"
```

**Antes de avanzar**, comprueba que aparecen `Account` y `Arn`. Si el perfil no existe, comprueba que la cabecera en el archivo coincide con `AWS_PROFILE`. Si aparece `ExpiredToken`, vuelve a **AWS Details**, sustituye los tres valores y repite la comprobación.

## 4. Configura el rol y despliega

Recupera el ARN de `LabRole`. AWS utilizará ese rol para conceder a las Lambdas acceso a los recursos del laboratorio.

```bash
LAMBDA_ROLE_ARN="$(aws iam get-role --role-name LabRole --profile "$AWS_PROFILE" --region "$AWS_REGION" --query 'Role.Arn' --output text)"
printf 'Rol de Lambda: %s\n' "$LAMBDA_ROLE_ARN"
```

Si el laboratorio deniega `iam:GetRole`, usa el ARN completo de `LabRole` de tu cuenta que te facilite el profesor. Sustituye el texto de ejemplo por ese ARN antes de ejecutar la línea.

```bash
LAMBDA_ROLE_ARN='PEGA_AQUI_EL_ARN_DE_LABROLE'
```

**Antes de desplegar**, comprueba que el ARN empieza por `arn:aws:iam::` y termina en `:role/LabRole`. En esa misma terminal, exporta el rol y ejecuta el despliegue.

```bash
export LAMBDA_ROLE_ARN
npm run deploy -- --aws-profile "$AWS_PROFILE"
```

- **`Warning` en `provider.runtime`**. Serverless 3.40.0 tiene un validador anterior a Node.js 22. Si después ves `Deploying festival-check-in`, el despliegue ha comenzado. [Aviso registrado en Serverless](https://github.com/serverless/serverless/issues/12963)
- **`Ensuring that deployment bucket exists`**. Serverless está preparando el bucket de S3 donde subirá los archivos de las Lambdas. Deja la terminal abierta hasta que termine.

**Antes de avanzar**, espera la confirmación del despliegue y busca la URL de la API en la salida. También puedes abrir **AWS → Lambda → Funciones**, elegir **N. Virginia (`us-east-1`)** y buscar `festival-check-in` junto a tu código de equipo.

## 5. Carga los datos y comprueba el resultado

En la misma terminal, ejecuta:

```bash
npm run aula
```

El comando invoca las Lambdas que crean el evento y el usuario de ejemplo. Después prueba la API desplegada.

| Petición | Resultado esperado al estrenar las tablas |
| --- | --- |
| `GET` → `200` | Puedes consultar el evento y el pase todavía está sin inscribir. |
| `POST` → `201` | Se guarda la inscripción. |
| `POST` → `409` | La inscripción ya existe. |
| `GET` → `200` | La consulta devuelve la inscripción guardada. |

Si ya ejecutaste la prueba con ese equipo, el comando indica que el pase ya estaba inscrito y pasa a comprobar el `409`. En ambos recorridos, espera el mensaje **`Pase persistido en AWS`** y la URL de la API.

Comprueba el evento directamente en DynamoDB con PartiQL:

```bash
aws dynamodb execute-statement \
  --statement "SELECT * FROM \"FCI_EVENTOS_${FCI_EQUIPO}\" WHERE EVENT_ID = 1" \
  --output json
```

**Antes de terminar**, busca **Festival de otoño** en `Items`. [Comparar GetItem y PartiQL](0-conf.md#compara-la-consulta-de-aws-con-sql) · [Abrir las invocaciones del cuaderno](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/traza-evento/#invocaciones)

## Si ya tenías un Codespace con Serverless 4

Si ves el menú de inicio de sesión de Serverless, pulsa **Ctrl+C**. Si el menú sigue abierto, usa el botón **+** del panel Terminal para abrir otro Bash en el mismo Codespace. Desde la raíz del proyecto en `main`, comprueba tu copia y trae los cambios de GitHub:

```bash
git status --short --branch
git pull --ff-only origin main
```

Si Git dice que se sobrescribiría **`package-lock.json`** porque lo modificaste al instalar dependencias, guarda ese cambio en el stash y vuelve a actualizar. El stash conserva una copia recuperable del cambio local.

```bash
git stash push -m 'Copia del package-lock antes de actualizar Serverless' -- package-lock.json
git pull --ff-only origin main
```

Después de un `pull` correcto, vuelve al paso **2** para instalar y comprobar la v3, y sigue desde el paso **3** para cargar las variables en esa terminal.
