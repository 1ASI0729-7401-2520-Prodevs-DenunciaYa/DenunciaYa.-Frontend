# DenunciaYa - Frontend

Angular frontend for the DenunciaYa citizen reporting platform.

## Overview 🌍

DenunciaYa is a web application that allows citizens to register, track, and consult complaints, while authorities can manage and assign cases. Built with **Angular 20**, this frontend consumes the **DenunciaYa Backend API** (alojada en Render). Cuenta con soporte multilingüe, integración de API externas y componentes de UI avanzados.

---

## Key Features ✨

- **Multilingual**: English and Spanish support with `@ngx-translate/core`.
- **Dynamic Lists**: Complaints, responsible parties, and communities with pagination and filters.
- **Map Integration**: `@angular/google-maps` for complaint location visualization.
- **Advanced UI**: PrimeNG and Syncfusion components for tables, panels, and grids.
- **Responsive Design**: Adapts to various screen sizes.
- **External APIs**: Integration with services like Clearbit Logo API.

---

## Tech Stack 💻

- **Framework**: Angular 20
- **Internacionalización**: @ngx-translate/core & @ngx-translate/http-loader
- **Mapas**: @angular/google-maps
- **UI Components**: PrimeNG, Syncfusion (@syncfusion/ej2-angular-grids, @syncfusion/ej2-angular-layouts)
- **Estilos**: @angular/material

---

## Project Structure (Frontend) 📁

La aplicación sigue una estructura modular, enfocándose en la separación de responsabilidades:

* **`/src/app/core`**: Servicios de autenticación, *interceptors* y lógica de negocio central.
* **`/src/app/shared`**: Módulos, *pipes* y componentes reutilizables (ej. *layout*, navegación).
* **`/src/app/features`**: Módulos específicos de la aplicación (ej. `complaints`, `admin`).
* **`/src/environments`**: Configuración de variables de entorno para desarrollo y producción.

---

## Configuration ⚙️

### 1. Variables de Entorno

El proyecto gestiona la URL de la API a través de `src/environments/`:

* **Desarrollo (`environment.ts`):** Apunta a la API mock local.
* **Producción (`environment.prod.ts`):** Debe apuntar a la URL pública del backend desplegado.

> **Importante:** Para producción, la variable `apiUrl` debe ser: `https://denunciayaa.onrender.com/api/v1`

---

## Deployment & CI/CD Status 🟢

| Aspecto | Herramienta/Plataforma | Estado |
| :--- | :--- | :--- |
| **Alojamiento** | Firebase Hosting | ✅ Desplegado |
| **URL Pública** | `https://denuncia-ya-frontend.web.app` | ✅ Activa |
| **CI/CD** | GitHub Actions | ✅ Configurado |
| **Rama de Despliegue** | `main` | ✅ Automático al *merge* |

---

## Quick Start (Desarrollo Local) 🚀

Para trabajar con la API mock localmente:

1.  **Instalar dependencias:**
    ```cmd
    npm install
    ```

2.  **Iniciar Mock API (Terminal 1):**
    ```cmd
    cd server
    npx json-server --watch db.json --routes routes.json --port 3000
    ```

3.  **Iniciar Aplicación Angular (Terminal 2):**
    ```cmd
    npm run start
    ```

4.  **Acceso:**
  * App: `http://localhost:4200`
  * Mock API: `http://localhost:3000`

---

## Available Scripts

- `npm run start` - Development server (http://localhost:4200)
- `npm run build` - Production build (genera la carpeta `dist/denunciaya-frontend/browser`)
- `npm run watch` - Watch mode for development
- `npm run test` - Run unit tests

---

## Development

El proyecto usa una API mock (`json-server`) para el desarrollo local. Asegúrate de que **ambos servidores estén corriendo** simultáneamente.

---

## Author & License

* **Autor:** ProDevs Team - 2025
