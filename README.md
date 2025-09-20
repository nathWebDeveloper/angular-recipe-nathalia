# Recetario por Ingredientes

## Reto Elegido y Alcance. Mejoras posibles: Sass más detallado con estructura de carpetas 7+1. Animaciones con GSAP.

**Reto:** Recetario
**Alcance:** 
- Selección de 2-5 ingredientes predefinidos
- Búsqueda de recetas basada en JSON local (5 recetas base)
- Gráfico de barras de calorías por ingrediente
- Lista de compras completamente editable
- Persistencia de favoritos en Firestore

**Supuestos :**
- Usuario casual que cocina en casa
- Base de datos local suficiente para demo
- Un solo usuario por sesión
- Ingredientes con valores calóricos fijos

## URLs de Acceso a la APP

- **Hosting URL:** https://angular-recipe-app-nathalia.web.app
- **Repositorio:** https://github.com/tu-usuario/angular-recipe-app

## Arquitectura y Dependencias

### Stack Tecnológico
- **Frontend:** Angular 17 (Standalone Components)
- **Backend:** Firebase Firestore
- **Estilos:** SCSS con metodología BEM
- **Build:** Angular CLI
- **Deploy:** Firebase Hosting

### Estructura del Proyecto
```
src/app/
├── models/                    # Interfaces TypeScript
│   └── recipe.interface.ts
├── services/                  # Servicios de negocio
│   ├── firebase.service.ts    # Gestión de favoritos
│   └── shopping.service.ts    # Lista de compras
├── components/                # Componentes standalone
│   ├── ingredient-selector/   # Selección de ingredientes
│   └── shopping-list/         # Lista editable
├── app.component.ts           # Componente raíz
└── main.ts                   # Bootstrap con Firebase
```

### Dependencias Principales
```json
{
  "@angular/fire": "^17.0.0",
  "firebase": "^10.7.0",
  "@angular/forms": "^17.0.0"
}
```

## Modelo de Datos

### Interfaces Principales
```typescript
interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  calories: number;
  cookingTime: number;
  instructions: string[];
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  completed: boolean;
  editing?: boolean;
}
```

### Colecciones Firestore
- **favorites/user-favorites:** `{ recipeIds: string[] }`

### Reglas de Seguridad (Resumidas)
- Lectura/escritura abierta para favoritos (demo)
- Sin autenticación requerida
- Validación básica de tipos

## Estado y Navegación

### Estrategia de Estado
- **Servicios con BehaviorSubject** para estado reactivo
- **LocalStorage** para lista de compras
- **Firestore** para favoritos
- **Event-driven** comunicación entre componentes

### Navegación
- **SPA monolítica** - sin routing adicional
- **Modal** para detalles de receta
- **Responsive** design para móvil/desktop

## Decisiones Técnicas

1. **Standalone Components vs Modules**
   - *Justificación:* Angular 17+ recomienda standalone para apps nuevas, menos boilerplate

2. **JSON Local vs API Externa**
   - *Justificación:* Control total de datos, sin dependencias externas, demo más estable

3. **BEM Methodology**
   - *Justificación:* CSS escalable y mantenible, nombres descriptivos, evita conflictos

4. **Event-driven Communication**
   - *Justificación:* Desacople entre componentes, fácil testing, arquitectura limpia

5. **Firestore para Favoritos + LocalStorage para Shopping**
   - *Justificación:* Demo de Firebase real, pero lista local para mejor UX offline

## Escalabilidad y Mantenimiento

### Cómo Crecería
```
Actual: 5 recetas locales
→ Próximo: TheMealDB API (1000+ recetas)
→ Futuro: Backend propio con ML recommendations

Actual: Sin autenticación
→ Próximo: Firebase Auth
→ Futuro: Perfiles de usuario y preferencias

Actual: Componentes monolíticos
→ Próximo: Feature modules
→ Futuro: Micro-frontends
```

### Separación de Capas
- **Presentación:** Components (UI pura)
- **Lógica:** Services (business logic)
- **Datos:** Interfaces + Firebase/LocalStorage
- **Estilos:** SCSS con BEM (mantenible)

### Migrabilidad
- Interfaces TypeScript facilitan cambio de backend
- Servicios abstraen persistencia
- Standalone components = fácil refactoring

## Seguridad y Validaciones

### Reglas Firebase
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /favorites/{userId} {
      allow read, write: if true; // Demo - en prod: auth required
    }
  }
}
```

### Manejo de Secretos
- Firebase config en environment.ts
- No se exponen API keys sensibles
- Reglas de Firestore controlan acceso

### Validación de Inputs
- Required validators en formularios
- Type safety con TypeScript
- Sanitización automática de Angular

## Rendimiento

### Optimizaciones Implementadas
- **OnPush Change Detection** en componentes futuros
- **Lazy loading** preparado para routing
- **TrackBy functions** en *ngFor
- **Async pipe** para observables

### Optimizaciones Pendientes
- Virtual scrolling para listas grandes
- Image lazy loading
- Service worker para PWA
- Pagination para resultados

## Accesibilidad

### Implementado
- **Labels** descriptivos en formularios
- **ARIA attributes** en botones
- **Keyboard navigation** básica
- **Focus visible** en elementos interactivos
- **Color contrast** adecuado (WCAG AA)

### Por Implementar
- Screen reader testing
- Aria-live regions
- Focus trap en modales
- Skip navigation links

## Uso de IA

### Dónde se Usó IA
1. **Generación de estructura inicial** - Claude ayudó con arquitectura Angular
2. **Valores calóricos** - IA proporcionó datos nutricionales base
3. **Debugging** - Resolución de errores de compilación
4. **Documentación** - Generación de este README

### Prompts Principales Usados
- "Implementa lista de compras editable con BEM methodology"
- "Genera README completo para entrega académica"

### Riesgos y Mitigación
- **Mitigación:** Revisión manual, testing, refactoring propio


### Limitaciones Actuales
- Solo 5 recetas hardcodeadas
- Sin autenticación de usuarios
- Búsqueda muy básica (1 ingrediente match)
- Sin tests unitarios
- Sin PWA capabilities

### Roadmap Técnico
1. **Corto Plazo (1-2 semanas)**
   - Integrar TheMealDB API
   

2. **Mediano Plazo (1-2 meses)**
   - Algoritmo de búsqueda inteligente
   - Recommendations con ML
   - PWA con service workers
   - Performance optimizations

3. **Largo Plazo (3-6 meses)**
   - Backend propio con Node.js
   - Base de datos nutricional completa
   - Social features (compartir recetas)
   - Mobile app con Ionic

## Instalación y Ejecución

### Prerrequisitos
- Node.js 20+ LTS
- Angular CLI 17+
- Firebase CLI
- Git

### Setup Local
```bash

# Instalar dependencias
npm install

# Configurar Firebase
# 1. Crear proyecto en Firebase Console
# 2. Actualizar credenciales en src/main.ts
# 3. Habilitar Firestore

# Ejecutar en desarrollo
ng serve
# App disponible en http://localhost:4200
```

### Deploy a Producción
```bash
# Build optimizado
ng build --configuration production

# Deploy a Firebase
firebase login
firebase deploy

# URL pública generada automáticamente
```

### Variables de Entorno
Actualizar en `src/main.ts`:
```typescript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  // ... resto de configuración
};
```

## Contribuir

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

MIT License - ver archivo LICENSE para detalles.

---

**Desarrollado como proyecto académico - 2024**
# AngularRecipeApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
