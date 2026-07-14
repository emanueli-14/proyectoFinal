# VIMILEA - Tech Store

**Frontend:** https://vimilea.onrender.com

**Backend API:** https://proyectofinal-96ln.onrender.com

# VIMILEA - Tech Store

VIMILEA es una tienda online de tecnología desarrollada como proyecto final de 4Geeks Academy.

La aplicación permite a los usuarios registrarse, iniciar sesión, navegar por un catálogo de productos, añadir artículos al carrito, crear pedidos y realizar pagos seguros mediante Stripe.

El proyecto está desarrollado con una arquitectura Full Stack utilizando React para el frontend y Flask para el backend, con una base de datos PostgreSQL desplegada en Render.

---

## Tecnologías utilizadas

### Frontend

- React
- React Router
- Bootstrap 5
- Vite

### Backend

- Python
- Flask
- SQLAlchemy
- Flask-JWT-Extended
- Flask-Migrate

### Base de datos

- PostgreSQL

### Pasarela de pago

- Stripe Checkout
- Stripe Webhooks

### Despliegue

- Render
- GitHub

---

## Funcionalidades

- Registro de usuarios
- Inicio de sesión con autenticación JWT
- Gestión del perfil del usuario
- Catálogo de productos
- Carrito de compra
- Gestión de pedidos
- Pago seguro con Stripe
- Actualización automática del estado del pedido mediante Webhooks
- Panel de administración con Flask-Admin
- Base de datos PostgreSQL

---

## Estructura del proyecto

```
proyectoFinal/
│
├── src/
│   ├── front/          # Frontend React
│   ├── api/            # Backend Flask
│   ├── app.py
│   └── wsgi.py
│
├── migrations/
├── public/
├── README.md
└── requirements.txt
```

---

## Instalación

### Clonar el repositorio

```bash
git clone https://github.com/emanueli-14/proyectoFinal.git
```

Entrar en el proyecto

```bash
cd proyectoFinal
```

Instalar dependencias del backend

```bash
pipenv install
```

Instalar dependencias del frontend

```bash
npm install
```

---

## Ejecutar el proyecto

### Backend

```bash
pipenv run start
```

### Frontend

```bash
npm run start
```

---

## Variables de entorno

Backend

```
DATABASE_URL=
JWT_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=
```

Frontend

```
VITE_BACKEND_URL=
VITE_BASENAME=/
```

---

## Despliegue

Frontend desplegado en Render.

Backend desplegado en Render.

Base de datos PostgreSQL alojada en Render.

---

## Autor

**Emanueli Cristina Godoy**

Proyecto Final Full Stack desarrollado para **4Geeks Academy**.
