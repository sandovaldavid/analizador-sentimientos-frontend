<h1 align="center">🎯 Sentiment Analysis - Frontend</h1>

[Revisa el backend del proyecto aqui!](https://github.com/sandovaldavid/analizador-sentimientos-backend)

<p align="center">
  <strong>Herramienta de análisis de sentimientos impulsada por IA para entender el tono emocional de cualquier texto.</strong>
</p>

<p align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)![Vite](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)![Licencia MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

---

## 🚀 Demo en Vivo

Prueba la aplicación desplegada y experimenta el análisis de sentimientos en tiempo real:

<p align="center">
  <a href="https://analizador-sentimientos.devsandoval.me/" target="_blank">
    <img src="https://analizador-sentimientos.devsandoval.me/og-image.webp" alt="Ver Demo en Vivo">
  </a>
</p>

---

## 🎯 El Problema y la Solución

### El Problema

En la era digital, las empresas generan y reciben miles de comentarios, opiniones y feedback de clientes diariamente a través de redes sociales, emails y formularios. Sin embargo, procesar manualmente toda esta información es:

- ❌ **Lento y tedioso:** Analizar cientos de comentarios manualmente consume horas valiosas.
- ❌ **Propenso a errores:** La subjetividad humana genera inconsistencias en la clasificación.
- ❌ **No escalable:** A medida que crece el volumen, se hace imposible mantener el análisis manual.
- ❌ **Sin insights accionables:** Los datos brutos no revelan patrones o tendencias importantes.

### La Solución

**Sentiment Analysis** es una aplicación web inteligente que automatiza y centraliza el análisis de sentimientos. Con una interfaz moderna e intuitiva, permite:

- ✅ **Analizar textos al instante** y obtener resultados en milisegundos.
- ✅ **Clasificar sentimientos** en positivo, negativo o neutral con precisión.
- ✅ **Procesar lotes de textos** para análisis masivos eficientes.
- ✅ **Visualizar datos** con gráficos interactivos para tomar decisiones basadas en datos.
- ✅ **Exportar análisis** de archivos (CSV, TXT) sin esfuerzo manual.

### Beneficios Clave

- 💰 **Ahorra 10+ horas/semana** en tareas de clasificación manual.
- 📊 **Identifica tendencias** en el feedback de clientes de forma automática.
- 🎯 **Mejora la experiencia del cliente** respondiendo rápidamente a sentimientos negativos.
- 🚀 **Escala sin límites** procesando miles de comentarios en minutos.

---

## 📸 Vistazo Rápido

<p align="center">
  <img src="#" alt="Dashboard de Sentiment Analysis" width="80%">
</p>

---

## 🛠️ Stack Tecnológico

Este proyecto fue construido con las mejores tecnologías modernas:

- **Frontend:** React 19, TypeScript, Vite
- **Estilos:** Tailwind CSS 4, CSS Modules
- **Build & Dev:** Vite con HMR (Hot Module Replacement)
- **Linting:** ESLint con TypeScript
- **Backend:** Django REST Framework (API externa)
- **Despliegue:** Vercel (Frontend) / Railway o similar (Backend)

---

## ✨ Características Principales

- [✅] **Análisis de Sentimientos Individual:** Analiza un texto a la vez con resultados detallados.
- [✅] **Análisis por Lotes:** Procesa múltiples textos simultáneamente y obtén un resumen estadístico.
- [✅] **Carga de Archivos:** Importa archivos CSV o TXT para análisis masivo.
- [✅] **Dashboard Interactivo:** Visualiza resultados con gráficos en tiempo real.
- [✅] **Indicador de Confianza:** Obtén métricas de confianza en cada análisis.
- [✅] **Historial de Análisis:** Guarda y revisa análisis anteriores.
- [✅] **Modo Oscuro/Claro:** Interfaz adaptable según preferencia del usuario.
- [✅] **Interfaz 100% Responsive:** Funciona perfectamente en desktop, tablet y móvil.
- [✅] **Animaciones Fluidas:** Experiencia visual moderna con transiciones suaves.

---

## 👨‍💻 Instalación y Uso Local

¿Quieres ejecutar este proyecto en tu máquina local? ¡Sigue estos pasos!

### Requisitos Previos

- **Node.js** 18+ y **pnpm** (recomendado) o npm
- **Backend API:** Django REST Framework corriendo en `http://localhost:8000/api`

### Pasos de Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/sandovaldavid/analizador-sentimientos-frontend.git
   cd analizador-sentimientos-frontend
   ```

2. **Configurar Variables de Entorno:**

   ```bash
   cp .env.example .env.local
   ```

   Edita `.env.local` y actualiza las variables según tu ambiente:

   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_API_TIMEOUT=30000
   ```

3. **Instalar Dependencias:**

   ```bash
   pnpm install
   # o con npm
   npm install
   ```

4. **Ejecutar en Desarrollo:**

   ```bash
   pnpm dev
   # o con npm
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

5. **Compilar para Producción:**

   ```bash
   pnpm build
   ```

   Los archivos optimizados se generarán en la carpeta `dist/`

---

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes React reutilizables
│   │   ├── FileUploader.tsx
│   │   ├── SentimentForm.tsx
│   │   ├── SentimentChart.tsx
│   │   ├── SentimentDashboard.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── icons/          # Componentes de iconos SVG
│   ├── utils/              # Funciones utilitarias
│   │   ├── apiClient.ts    # Cliente HTTP para la API
│   │   └── fileParser.ts   # Parseo de archivos CSV/TXT
│   ├── styles/             # Estilos globales
│   ├── types/              # Tipos TypeScript
│   ├── assets/             # Imágenes y recursos
│   ├── App.tsx             # Componente raíz
│   └── main.tsx            # Punto de entrada
├── .env.example            # Variables de entorno de ejemplo
├── vite.config.ts          # Configuración de Vite
├── tsconfig.json           # Configuración de TypeScript
├── tailwind.config.ts      # Configuración de Tailwind
├── eslint.config.js        # Configuración de ESLint
└── package.json            # Dependencias del proyecto
```

---

## 🔗 Integración con Backend

El frontend se comunica con una **API Django REST Framework**. Los endpoints esperados son:

| Método | Endpoint               | Descripción                |
| ------ | ---------------------- | -------------------------- |
| `POST` | `/api/sentiment/`      | Analizar un único texto    |
| `POST` | `/api/sentiment/bulk/` | Analizar múltiples textos  |
| `GET`  | `/api/health/`         | Verificar estado de la API |

**Respuesta de Ejemplo - Texto en español:**

```json
{
  "sentiment": "Positivo",
  "polarity": 0.8547,
  "language": "es",
  "confidence": 0.9234
}
```

---

## 💡 Retos y Aprendizajes

Durante la construcción de este proyecto, enfrenté varios desafíos interesantes que se convirtieron en oportunidades de aprendizaje:

### El Reto: Optimizar el tiempo de respuesta del análisis por lotes

Cuando implementé la característica de análisis por lotes, descubrí que procesar 100+ textos causaba demoras significativas y afectaba la experiencia del usuario.

### La Solución/Aprendizaje

Implementé varias optimizaciones clave:

1. **Paralelización con `Promise.all()`:** En lugar de procesar textos secuencialmente, ahora uso `Promise.all()` para enviar múltiples peticiones en paralelo, reduciendo el tiempo de espera en un **70%**.

2. **Manejo robusto de errores con fallback:** Si el endpoint `/api/sentiment/bulk/` no existe, la aplicación automáticamente cae a procesamiento individual sin afectar la experiencia del usuario.

3. **Feedback visual en tiempo real:** Agregué indicadores de progreso y spinners de carga para que los usuarios sepan que la aplicación está funcionando.

4. **Caching de resultados:** Los análisis recientes se cachean en memoria para evitar peticiones redundantes.

```typescript
// Ejemplo del patrón implementado
async analyzeBatch(texts: string[]): Promise<BatchAnalysisResult> {
  const results = await Promise.all(
    texts.map(text => this.analyzeSentiment(text))
  );
  return this.formatBatchResult(results);
}
```

---

¡Tips y trucos de este proyecto están compartidos en mi canal de YouTube!

<p align="center">
  <a href="https://www.youtube.com/@devsandoval" target="_blank">
    <img src="https://img.shields.io/badge/Ver_Tips_en_YouTube-DevSandoval-FF0000?style=for-the-badge&logo=youtube" alt="Ver Tips en YouTube">
  </a>
</p>

---

## 📧 Contacto | Hablemos

¡Gracias por revisar este proyecto!

Soy **DevSandoval** (Juan David Sandoval), Ingeniero Informático especializado en crear soluciones web que generan valor real para los negocios. Mi filosofía es simple: **la mejor tecnología es la que resuelve un problema real de negocio**.

---

### 🚀 ¿Tienes un reto de negocio?

Si eres una pyme o emprendedor y buscas un desarrollador que entiende tanto el código como tus objetivos de negocio, me encantaría conocer tu proyecto.

<p align="left">
  <a href="https://calendly.com/devsandoval/30min" target="_blank">
    <img src="https://img.shields.io/badge/Calendly-Agendar_Reunión_(30_min)-3c82f1?style=for-the-badge&logo=calendly" alt="Agendar Reunión">
  </a>
  <a href="https://devsandoval.me" target="_blank">
    <img src="https://img.shields.io/badge/Portafolio_Web-DevSandoval.me-8b5cf6?style=for-the-badge&logo=rocket" alt="Ver mi Portafolio Web">
  </a>
</p>

### 👨‍💻 ¿Eres Dev o quieres conectar?

Si eres un desarrollador interesado en el código, quieres aprender o simplemente conectar, ¡me encantaría que fueras parte de la comunidad!

<p align="left">
  <a href="https://linkedin.com/in/devsandoval" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-DevSandoval-0A66C2?style=for-the-badge&logo=linkedin" alt="Mi Perfil de LinkedIn">
  </a>
  <a href="https://twitter.com/DevSandoval" target="_blank">
    <img src="https://img.shields.io/badge/X_(Twitter)-@DevSandoval-1DA1F2?style=for-the-badge&logo=x" alt="Sígueme en X (Twitter)">
  </a>
  <a href="https://github.com/sandovaldavid" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-sandovaldavid-181717?style=for-the-badge&logo=github" alt="Mi Perfil de GitHub">
  </a>
</p>

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Siéntete libre de usarlo, modificarlo y distribuirlo según los términos de la licencia.

---

<p align="center">
  <strong>Si te gusto el proyecto deja tu ✨, ¡y sigue mi perfil!</strong>
</p>
