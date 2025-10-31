# DenunciaYa - Frontend

Angular frontend for the DenunciaYa citizen reporting platform.

## Overview

DenunciaYa is a web application that allows citizens to register, track, and consult complaints, while authorities can manage and assign cases. Built with Angular 20, it features multilingual support, external API integration, and advanced UI components.

## Key Features

- **Multilingual**: English and Spanish support with `@ngx-translate/core`
- **Dynamic Lists**: Complaints, responsible parties, and communities with pagination and filters
- **Map Integration**: `@angular/google-maps` for complaint location visualization
- **Advanced UI**: PrimeNG and Syncfusion components for tables, panels, and grids
- **Responsive Design**: Adapts to various screen sizes
- **External APIs**: Integration with services like Clearbit Logo API

## Tech Stack

- Angular 20
- @ngx-translate/core & @ngx-translate/http-loader
- @angular/google-maps
- PrimeNG
- Syncfusion (@syncfusion/ej2-angular-grids, @syncfusion/ej2-angular-layouts)
- @angular/material

## Quick Start

1. **Install dependencies:**
   ```cmd
   npm install
   ```

2. **Start mock API (Terminal 1):**
   ```cmd
   cd server
   npx json-server --watch db.json --routes routes.json --port 3000
   ```

3. **Start Angular app (Terminal 2):**
   ```cmd
   npm run start
   ```

4. **Access the application:**
  - App: http://localhost:4200
  - Mock API: http://localhost:3000

## Available Scripts

- `npm run start` - Development server (http://localhost:4200)
- `npm run build` - Production build
- `npm run watch` - Watch mode for development
- `npm run test` - Run unit tests


## Development

The project uses a mock API (`json-server`) for development. Ensure both the mock server and Angular app are running simultaneously.

## Author

ProDevs Team - 2025
