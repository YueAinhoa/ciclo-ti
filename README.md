# CicloTI – Sistema de Gestión del Ciclo de Vida de Equipos Tecnológicos

## 1. Descripción del proyecto

CicloTI es un sistema web desarrollado para gestionar el ciclo de vida de los equipos tecnológicos de una organización. Permite administrar la información de los equipos, usuarios, áreas, perfiles de puesto, roles, tipos de equipo y asignaciones.

El proyecto incluye un módulo administrativo para centralizar la gestión de la información y controlar el acceso mediante autenticación y permisos según el rol del usuario.

## 2. Tecnologías utilizadas

### Backend
- Python 3.13
- Django 6.1
- Django REST Framework
- PostgreSQL
- Neon (base de datos en la nube)
- Simple JWT para autenticación
- django-cors-headers
- Gunicorn

### Frontend
- Angular 22
- TypeScript
- HTML5
- SCSS
- RxJS

### Herramientas
- Visual Studio Code
- Git y GitHub
- Node.js 24 LTS
- npm

## 3. Estructura del proyecto

```text
ciclo-ti/
│
├── backend/
│   ├── config/
│   ├── equipos/
│   ├── usuarios/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       ├── layout/
│   │       ├── models/
│   │       └── pages/
│   ├── angular.json
│   └── package.json
│
├── .gitignore
└── README.md
```

## 4. Módulos administrativos

El sistema cuenta con los siguientes módulos:

- **Roles:** administración de los roles de usuario.
- **Áreas:** gestión de las áreas de la organización.
- **Perfiles de puesto:** administración de los perfiles laborales.
- **Usuarios:** registro y administración de usuarios.
- **Tipos de equipo:** gestión de las categorías de equipos tecnológicos.
- **Equipos:** registro y administración de los equipos.
- **Asignaciones:** administración de las asignaciones de equipos a colaboradores.

## 5. Seguridad y validaciones

El módulo administrativo incorpora:

- Autenticación mediante tokens JWT.
- Control de acceso para usuarios con rol Administrador TI.
- Protección de rutas administrativas.
- Contraseñas almacenadas mediante hash.
- Validación de información desde el backend antes de guardar los registros.
- Validación de códigos de inventario únicos y con formato establecido.
- Validación de costos, fechas de adquisición y estado de batería.
- Validación de disponibilidad y estado de los equipos antes de asignarlos.
- Listas desplegables para seleccionar relaciones entre entidades.
- Filtros dependientes para seleccionar colaboradores por área y equipos por tipo.

## 6. Requisitos previos

Para ejecutar el proyecto se necesita:

- Python 3.13 o compatible.
- Node.js 24 LTS.
- npm.
- Git.
- Visual Studio Code (recomendado).
- Acceso a una base de datos PostgreSQL.

## 7. Configuración del backend

### 7.1. Clonar el repositorio

```bash
git clone https://github.com/YueAinhoa/ciclo-ti.git
cd ciclo-ti
```

### 7.2. Crear el entorno virtual

Desde la carpeta raíz del proyecto:

```powershell
cd backend
py -3.13 -m venv venv
```

### 7.3. Activar el entorno virtual

En Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 7.4. Instalar dependencias

```powershell
pip install -r requirements.txt
```

### 7.5. Configurar las variables de entorno

Crear un archivo `.env` dentro de la carpeta `backend`.

Agregar la variable de conexión a PostgreSQL:

```env
DATABASE_URL=URL_DE_CONEXION_DE_POSTGRESQL
```

Reemplazar el valor de ejemplo por la URL de conexión proporcionada por Neon.

**Importante:** El archivo `.env` contiene información privada y no debe subirse al repositorio.

### 7.6. Ejecutar migraciones

```powershell
python manage.py migrate
```

### 7.7. Crear un superusuario

```powershell
python manage.py createsuperuser
```

Este comando permite crear una cuenta administrativa para acceder a Django.

### 7.8. Iniciar el servidor

```powershell
python manage.py runserver
```

El backend estará disponible en:

http://127.0.0.1:8000/

## 8. Configuración del frontend

Abrir una segunda terminal desde la raíz del proyecto.

### 8.1. Ingresar a la carpeta frontend

```powershell
cd frontend
```

### 8.2. Instalar dependencias

```powershell
npm install
```

### 8.3. Iniciar Angular

```powershell
npm start
```

El frontend estará disponible en:

http://localhost:4200/

## 9. API REST

El backend expone sus servicios bajo la ruta `/api/`.

| Recurso | Endpoint |
|---|---|
| Roles | `/api/roles/` |
| Áreas | `/api/areas/` |
| Perfiles de puesto | `/api/perfiles-puesto/` |
| Usuarios | `/api/usuarios/` |
| Tipos de equipo | `/api/tipos-equipo/` |
| Equipos | `/api/equipos/` |
| Asignaciones | `/api/asignaciones/` |
| Obtener token | `/api/token/` |
| Renovar token | `/api/token/refresh/` |

Los endpoints administrativos requieren autenticación y permisos correspondientes.

## 10. Base de datos

El proyecto utiliza PostgreSQL como sistema de gestión de base de datos, con alojamiento en Neon.

La conexión se configura mediante la variable de entorno `DATABASE_URL`.

## 11. Repositorio

Código fuente del proyecto:

https://github.com/YueAinhoa/ciclo-ti

## 12. Ejecución del sistema

Para trabajar con el sistema localmente se deben mantener activos dos servidores:

1. Backend Django en el puerto 8000.
2. Frontend Angular en el puerto 4200.

Una vez iniciados ambos servidores, ingresar desde el navegador a:

http://localhost:4200/

El acceso al módulo administrativo está destinado a usuarios con rol Administrador TI.