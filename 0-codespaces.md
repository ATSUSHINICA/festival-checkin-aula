# 0 · Festival Check-in en GitHub Codespaces

Abre el proyecto de la rama **`main`** en VS Code desde el navegador. La terminal de Codespaces ejecuta los comandos y **AWS Academy aloja las Lambdas, la API y las tablas DynamoDB**. [Configuración del proyecto](0-conf.md)

## 1. Abre el Codespace de main

1. Abre [Festival Check-in en la rama main](https://github.com/albertohdezakkari/festival-checkin-01/tree/main).
2. Pulsa **Code → Codespaces → Create codespace on main**. Espera a que aparezca VS Code en el navegador. GitHub descarga el repositorio en el Codespace.
3. Abre **Terminal → New Terminal** en ese VS Code y comprueba la rama y la carpeta. [Crear un Codespace desde una rama](https://docs.github.com/es/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository)

```bash
git branch --show-current
ls package.json serverless.yml
```

**Antes de avanzar**, debes ver `main` y los dos archivos.

## 2. Comprueba las herramientas

```bash
node --version
npm --version
aws --version
```

El proyecto admite Node **20 o superior**. Si tu Codespace tiene una versión anterior, usa Node 22 durante esta práctica:

```bash
nvm install 22
nvm use 22
```

### Instala AWS CLI v2 en el Codespace

Si `aws --version` devuelve **`aws: command not found`** o muestra `aws-cli/1.`, copia este comando en la terminal de Codespaces. El instalador oficial añade el comando `aws` al entorno Linux del Codespace. [Instalación de AWS CLI en Linux](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

```bash
curl -fsSL https://awscli.amazonaws.com/v2/install.sh | sudo bash -s -- --system
```

Cuando termine, comprueba qué versión responde:

```bash
aws --version
```

**Antes de avanzar**, la salida debe empezar por **`aws-cli/2.`**. En el paso 3 usarás este comando para comprobar que tu perfil `academy` se conecta al laboratorio.

### Instala las dependencias del proyecto

Desde la raíz del repositorio, instala las dependencias fijadas en el proyecto:

```bash
npm ci
npm ls serverless --depth=0
```

**Antes de avanzar**, busca `serverless@3.40.0` en la salida de npm.

## 3. Conecta AWS Academy desde el Codespace

En el navegador, abre **AWS Academy → Learner Lab → Start Lab**. Cuando el laboratorio esté activo, abre **AWS Details → AWS CLI → Show** y copia el bloque de credenciales temporales. En la terminal del Codespace, abre el archivo personal de AWS:

```bash
mkdir -p ~/.aws
touch ~/.aws/credentials
chmod 600 ~/.aws/credentials
vi ~/.aws/credentials
```

En `vi`, escribe `:set paste` y pulsa Intro. Pulsa `i`, pega el bloque bajo la cabecera **`[academy]`** y guarda con **Esc**, `:wq` e Intro. Si el bloque copiado empieza por `[default]`, cambia esa cabecera a `[academy]`. Si el perfil ya existe, sustituye sus tres valores en esa sección. Guarda las credenciales solo en este archivo personal, fuera del repositorio. [Pasos de AWS Academy en la guía original](0-conf.md#3-activa-aws-academy-y-guarda-las-credenciales)

En la misma terminal, exporta el perfil, la región de tu laboratorio y el código de equipo asignado. Ajusta `equipo01` a tu código.

```bash
export AWS_PROFILE=academy
export AWS_REGION=us-east-1
export FCI_EQUIPO=equipo01

aws sts get-caller-identity
```

**Antes de avanzar**, busca `Account` y `Arn` en la respuesta. Si ves `ExpiredToken`, actualiza las tres credenciales desde Learner Lab y repite la comprobación.

## 4. Prepara Serverless y despliega

Recupera el identificador del rol que ejecutará las Lambdas:

```bash
LAMBDA_ROLE_ARN="$(aws iam get-role --role-name LabRole --query 'Role.Arn' --output text)"
printf '%s\n' "$LAMBDA_ROLE_ARN"
```

Si ves un ARN que termina en `:role/LabRole`, expórtalo:

```bash
export LAMBDA_ROLE_ARN
```

Si el laboratorio deniega `iam:GetRole`, usa el ARN completo de LabRole que te facilite el profesor.

En esa misma terminal, despliega:

```bash
npm run deploy -- --aws-profile "$AWS_PROFILE"
```

**Antes de avanzar**, espera a que Serverless confirme el despliegue y muestre la URL de la API.

## 5. Carga los datos y comprueba el resultado

```bash
npm run aula
```

En una instalación nueva, espera **GET 200 → POST 201 → POST 409 → GET 200**. El último GET comprueba que la inscripción quedó guardada. Si ya hiciste el recorrido con ese equipo, verás que el perfil de ejemplo ya está inscrito. Guarda la URL que imprime el comando.

Para comprobar el evento directamente en DynamoDB, ejecuta el `SELECT` de PartiQL desde esa misma terminal:

```bash
aws dynamodb execute-statement \
  --statement "SELECT * FROM \"FCI_EVENTOS_${FCI_EQUIPO}\" WHERE EVENT_ID = 1" \
  --output json
```

Busca **Festival de otoño** en `Items`. [Comparar GetItem y PartiQL](0-conf.md#compara-la-consulta-de-aws-con-sql) · [Abrir las invocaciones del cuaderno](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/traza-evento/#invocaciones)
