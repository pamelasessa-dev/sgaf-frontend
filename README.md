# SGAF — Sistema de Gestión Académica y Financiera

Aplicación web frontend para la gestión académica y administrativa de una institución educativa. Permite administrar estudiantes, matrículas, actividades académicas y operaciones financieras desde una interfaz organizada por roles.

## Descripción del proyecto

El SGAF (Sistema de Gestión Académica y Financiera) centraliza los procesos académicos y administrativos de una institución educativa.

El frontend se comunica con una API REST desarrollada con NestJS y Prisma, que gestiona la información y la persistencia de datos.

### Funcionalidades principales

- Autenticación y acceso según el rol del usuario.
- Gestión académica de estudiantes, profesores, materias, grupos y períodos.
- Gestión de matrículas y consulta de grupos disponibles.
- Aula Virtual para publicación de actividades, entregas y calificaciones.
- Control financiero: consulta de obligaciones, registro y validación de pagos.
- Manejo de mora y avisos sobre restricciones por obligaciones vencidas.
- Gestión de perfiles y paneles diferenciados según el usuario.

### Roles del sistema

- **ADMIN:** administración general del sistema.
- **RECEPCIONISTA:** gestión administrativa y validación de pagos.
- **PROFESOR:** gestión de actividades académicas y calificaciones.
- **ESTUDIANTE:** consulta de información académica, matrículas, entregas y estado financiero.

## Tecnologías utilizadas

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Zustand
- Axios
- React Hook Form
- Zod

### Backend

- NestJS
- Prisma ORM
- Base de datos gestionada desde el backend.
- API REST documentada con Swagger.

## Requisitos previos

Para ejecutar el proyecto localmente necesitás:

- Node.js (versión compatible con Vite 8).
- npm.
- Git.
- Acceso a la API del SGAF.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/pamelasessa-dev/sgaf-frontend.git
   ```

2. Ingresar a la carpeta:

   ```bash
   cd sgaf-frontend
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Crear un archivo `.env` en la raíz del proyecto.

5. Configurar la variable de entorno:

   ```env
   VITE_API_URL=https://sistema-academico-avh7.onrender.com
   ```

   Esta variable indica la URL base del backend. No es necesario incluir la ruta de Swagger.

6. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador.

## Variables de entorno

| Variable       | Descripción                      |
| -------------- | -------------------------------- |
| `VITE_API_URL` | URL base de la API REST del SGAF |

La variable debe configurarse tanto en el entorno local como en el servicio de despliegue.

No se deben subir archivos `.env` con información privada al repositorio.

## API del SGAF

El frontend consume una API REST desarrollada con NestJS.

**Backend desplegado:**

https://sistema-academico-avh7.onrender.com

**Documentación Swagger:**

https://sistema-academico-avh7.onrender.com/api

La API centraliza las operaciones de autenticación, usuarios, gestión académica, matrículas, Aula Virtual y finanzas.

Entre las operaciones financieras disponibles para el frontend se encuentran:

| Método | Endpoint              | Descripción                                           |
| ------ | --------------------- | ----------------------------------------------------- |
| GET    | `/obligaciones/me`    | Consultar las obligaciones del estudiante autenticado |
| GET    | `/obligaciones/:id`   | Consultar una obligación por identificador            |
| GET    | `/pagos`              | Consultar pagos para gestión administrativa           |
| POST   | `/pagos`              | Registrar un pago                                     |
| PATCH  | `/pagos/:id/aprobar`  | Aprobar un pago                                       |
| PATCH  | `/pagos/:id/rechazar` | Rechazar un pago                                      |

Las operaciones están protegidas mediante autenticación y permisos según el rol correspondiente.

Para consultar el resto de los endpoints, parámetros y respuestas, revisar Swagger.

## Estructura del proyecto

La aplicación organiza sus funcionalidades por módulos:

```text
src/
├── components/
│   └── ui/
├── features/
│   ├── academico/
│   ├── administracion/
│   ├── aula-virtual/
│   ├── auth/
│   └── finanzas/
├── hooks/
├── lib/
├── routes/
├── services/
├── stores/
├── types/
├── App.tsx
└── main.tsx
```

- `components/`: componentes reutilizables de interfaz.
- `features/`: funcionalidades agrupadas por módulo.
- `hooks/`: hooks personalizados.
- `lib/`: utilidades compartidas.
- `routes/`: configuración y protección de rutas.
- `services/`: comunicación con la API.
- `stores/`: estado global de la aplicación.
- `types/`: definiciones de tipos TypeScript.

## Compilación y validación

Para generar la versión de producción:

```bash
npm run build
```

Para ejecutar el análisis estático:

```bash
npm run lint
```

Para previsualizar localmente la versión compilada:

```bash
npm run preview
```

## Despliegue

El frontend está preparado para desplegarse en Vercel.

Configuración recomendada:

- **Framework Preset:** Vite.
- **Build Command:** `npm run build`.
- **Output Directory:** `dist`.
- **Install Command:** `npm install`.

Configurar en Vercel la variable de entorno:

```env
VITE_API_URL=https://sistema-academico-avh7.onrender.com
```

La aplicación utiliza React Router, por lo que el despliegue debe incluir una regla de reescritura para que las rutas internas funcionen también al refrescar el navegador.

La URL pública del frontend se agregará una vez finalizado el despliegue:

**Frontend en producción:** pendiente de publicación.

## Credenciales de demostración

Las credenciales de prueba para cada rol se proporcionarán por separado y deberán corresponder a usuarios de demostración creados en el entorno de pruebas.

No almacenar contraseñas reales ni tokens de acceso en este repositorio.

## Autoría

Proyecto desarrollado como parte del trabajo práctico de frontend del Sistema de Gestión Académica y Financiera (SGAF).
