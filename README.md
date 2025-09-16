# After Camelphat - Sistema de Gestión de Tickets

Una aplicación web desarrollada con Next.js para que los usuarios puedan gestionar sus tickets para el evento After Camelphat de Key Producciones.

## Características

- **Búsqueda de órdenes**: Los usuarios pueden buscar sus órdenes usando el número de orden y email
- **Gestión de tickets**: Selección de cuántos tickets usar para el after party
- **Validación de datos**: Verificación contra la base de datos MySQL existente
- **Diseño responsivo**: Interfaz adaptada al branding de Key Producciones
- **Almacenamiento persistente**: Guarda las selecciones de after tickets

## Tecnologías Utilizadas

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 4
- **Base de datos**: MySQL (conexión con base existente de Entraste)
- **Lenguaje**: TypeScript
- **Deploy**: Optimizado para Vercel

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd after-claims
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de base de datos:
```env
DB_HOST=tu-host-mysql
DB_PORT=3306
DB_USER=tu-usuario
DB_PASSWORD=tu-contraseña
DB_NAME=entraste

NEXTAUTH_SECRET=tu-clave-secreta
NEXTAUTH_URL=http://localhost:3000
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── lookup-order/       # API para buscar órdenes
│   │   └── update-after-tickets/ # API para actualizar tickets
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Página principal
├── components/
│   ├── OrderLookupForm.tsx    # Formulario de búsqueda
│   └── TicketSelection.tsx    # Interfaz de selección de tickets
└── lib/
    └── database.ts            # Funciones de base de datos
```

## Base de Datos

### Tablas Existentes

**Tabla `orders`** (tickets originales):
- `tckid`: ID de la orden
- `userid`: ID del usuario
- `qty`: Cantidad de tickets
- `eventid`: ID del evento
- (otros campos...)

**Tabla `user`** (información de usuarios):
- `userid`: ID del usuario
- `email`: Email del usuario
- `name`: Nombre del usuario
- (otros campos...)

### Tabla Creada

**Tabla `after_tickets`** (gestión de after):
- `id`: ID autoincremental
- `tckid`: Referencia a la orden
- `after_count`: Cantidad de tickets para el after
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

## Funcionalidades

### 1. Búsqueda de Orden
- El usuario ingresa número de orden y email
- Se valida contra las tablas `orders` y `user`
- Se muestran los datos de la orden encontrada

### 2. Selección de After Tickets
- Se muestra la cantidad de tickets disponibles
- El usuario puede seleccionar de 0 a la cantidad total
- Se guarda la selección en la base de datos

### 3. Interfaz de Usuario
- Diseño basado en el branding de Key Producciones
- Colores y tipografía consistentes con la imagen corporativa
- Responsive design para móviles y desktop

## API Endpoints

### POST `/api/lookup-order`
Busca una orden por número de ticket y email.

**Request:**
```json
{
  "tckid": "952508",
  "email": "usuario@ejemplo.com"
}
```

**Response:**
```json
{
  "order": {
    "tckid": "952508",
    "qty": 2,
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "eventid": "2159"
  },
  "afterTickets": 1
}
```

### POST `/api/update-after-tickets`
Actualiza la cantidad de tickets para el after.

**Request:**
```json
{
  "tckid": "952508",
  "afterTickets": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tickets del after actualizados correctamente",
  "tckid": "952508",
  "afterTickets": 2
}
```

## Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Deploy automático en cada push

### Variables de Entorno para Producción

```env
DB_HOST=tu-host-produccion
DB_PORT=3306
DB_USER=tu-usuario-produccion
DB_PASSWORD=tu-contraseña-produccion
DB_NAME=entraste

NEXTAUTH_SECRET=clave-secreta-fuerte-para-produccion
NEXTAUTH_URL=https://tu-dominio.com
```

## Seguridad

- Validación de entrada en todas las APIs
- Sanitización de queries SQL con parámetros preparados
- Variables de entorno para credenciales sensibles
- Validación tanto en frontend como backend

## Mantenimiento

- Los logs de errores se almacenan en la consola del servidor
- Monitorear las conexiones a la base de datos
- Verificar el rendimiento de las queries SQL

## Soporte

Para reportar bugs o solicitar nuevas funcionalidades, crea un issue en el repositorio del proyecto.

---

**Key Producciones** - After Camelphat 2025
