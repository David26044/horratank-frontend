# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Ahorra Tank — Frontend

Aplicación web para consultar y comparar precios de combustible en estaciones de servicio de Bogotá.

## Integrantes

| Nombre                  |
|-------------------------|
| Gabriela Rodriguez      |
| Lesly Parra             |
| Andres Monroy           |
| Juan David Cardenas     |
| David Carreño Parra     |
| Nicolas Diaz Cruz       |

> ⚠️ Proyecto en desarrollo — la estructura y componentes pueden cambiar.

## Tecnologías

- React 18 + Vite
- React Router v6
- Geolocation API

## Requisitos

- Node.js 18+
- Backend de Ahorra Tank corriendo en `http://localhost:8080`

## Instalación

```bash
npm install
npm run dev
```

## Páginas

| Ruta        | Descripción                               |
|-------------|-------------------------------------------|
| `/login`    | Inicio de sesión                          |
| `/register` | Registro de usuario                       |
| `/map`      | Mapa con estaciones y filtros (protegida) |

## Filtros disponibles

Zona · Tipo de combustible · Precio máximo · Solo disponibles · Cercanas a mí

## Tipos de combustible

`REGULAR` · `PREMIUM` · `DIESEL` · `GAS`