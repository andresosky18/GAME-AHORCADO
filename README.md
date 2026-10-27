<div align="center">

# 🎯 Ahorcado Live

**Juego multijugador de palabras en tiempo real para exposiciones, clases y reuniones entre amigos.**

[![Demo en Vivo](https://img.shields.io/badge/🚀_Demo_en_Vivo-ahorcado.exposicion--ia.workers.dev-84D846?style=for-the-badge& labelColor=14451F)](https://ahorcado.exposicion-ia.workers.dev)
[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-A9F06A?style=for-the-badge&labelColor=14451F)](./LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=14451F)](https://react.dev)
[![Cloudflare Workers + D1](https://img.shields.io/badge/Cloudflare-Workers_%2B_D1-F38020?style=for-the-badge&logo=cloudflare&logoColor=white&labelColor=14451F)](https://workers.cloudflare.com)

<br />

[**👉 Jugar Demo en Vivo**](https://ahorcado.exposicion-ia.workers.dev) · [**✨ Características**](#-características-principales) · [**🚀 Instalación Local**](#-instalación-y-uso-local) · [**☁️ Despliegue en Cloudflare**](#️-despliegue-en-cloudflare-workers--d1)

</div>

---

## 📖 Descripción

**Ahorcado Live** es una plataforma web interactiva y *open-source* tipo *Kahoot!* pero diseñada específicamente para el clásico juego de **El Ahorcado**. Permite que un anfitrión proyecte una sala en vivo con código QR y clasificación en tiempo real, mientras hasta **20 participantes** compiten simultáneamente desde sus teléfonos móviles descubriendo conceptos y subiendo al podio.

Ideal para:
- 🎓 **Exposiciones universitarias y escolares:** Evalúa la atención del público con conceptos clave de tu presentación.
- 🎉 **Noches de juegos entre amigos:** Juega con plantillas listas de cultura pop, cine, música o ciencia.
- 🧑‍🏫 **Dinámicas de clase y capacitaciones:** Crea partidas personalizadas en segundos sin necesidad de registro.

---

## ✨ Características Principales

- ✍️ **Estudio de Preguntas 100% Editable:**
  - Crea partidas desde cero escribiendo tus propias palabras secretas y pistas.
  - Configura el **título del evento**, la **cantidad de rondas** y el **tiempo por palabra** (`30s`, `45s`, `60s` o `90s`).
  - **Modo Pegado Rápido (`⚡ Pegar lista`):** Importa múltiples palabras y definiciones de golpe en formato `PALABRA : Pregunta`.
  - **Edición en vivo desde el Lobby:** Ajusta o añade preguntas incluso después de haber creado la sala mientras los jugadores se van uniendo.
  - **Plantillas integradas:** *Entre Amigos*, *Cultura General*, *Cine y Música* y *Dinámica de Exposición*.
- 🎨 **12 Avatares Vectoriales Ilustrados:**
  - Personajes originales en SVG con estilo moderno y anillos de color.
  - Los participantes pueden elegir su personaje al entrar y **cambiarlo en tiempo real** dentro de la sala de espera o durante la partida.
- 🏆 **Ceremonia de Podio 3D al Final del Juego:**
  - Animación escalonada de revelación (`3° lugar → 2° lugar → 1° lugar`) con caída de corona dorada, rayos de luz giratorios, confeti y tarjetas de **"Mejor de cada ronda"**.
  - El podio final se muestra tanto en la pantalla del anfitrión como en los teléfonos de todos los jugadores.
- 📱 **Experiencia Mobile-First + Vista de Presentador:**
  - **Modo Anfitrión (Proyector / PC):** Código QR instantáneo, enlace copiable en 1 clic, tabla de posiciones animada (FLIP) y muro de reacciones en vivo.
  - **Modo Jugador (Móvil):** Flujo limpio por pasos, teclado táctil QWERTY optimizado, barra de progreso de tiempo e indicadores de vidas.
- 🔊 **Efectos de Sonido Sintetizados (Web Audio API):**
  - Sonidos al acertar letras, fallar, completar una ronda y fanfarria triunfal al revelar el podio (con botón de silencio `🔊 / 🔇` integrado).
- ⚡ **Sincronización Confiable con Control de Concurrencia:**
  - Basado en control optimista de revisiones sobre SQLite/Cloudflare D1, garantizando que 20 jugadores simultáneos nunca sobrescriban el estado de la sala.

---

## 🏗️ Arquitectura del Proyecto

```text
ahorcado/
├── app/
│   ├── api/game/
│   │   ├── engine.ts        # Lógica pura del juego, puntaje, desempates y sanitización de palabras
│   │   ├── handler.ts       # Controlador HTTP con concurrencia optimista sobre D1 (create, configure, join, start, guess)
│   │   └── route.ts         # Endpoint POST /api/game
│   ├── avatars.tsx          # 12 retratos vectoriales SVG ilustrados a medida
│   ├── game-options.ts      # Catálogo de avatares y reacciones rápidas
│   ├── globals.css          # Sistema de diseño (Lime #A9F06A + Forest #14451F) y animaciones 3D
│   ├── live-ranking.tsx     # Podio 3D animado, clasificación en vivo (FLIP) y ganadores por ronda
│   ├── page.tsx             # Interfaz principal (Modo Anfitrión, Modo Jugador y navegación móvil)
│   ├── question-studio.tsx  # Editor público de preguntas, plantillas e importación rápida
│   ├── social.tsx           # Generador de código QR y chat/reacciones en tiempo real
│   └── sound.ts             # Sintetizador de audio Web Audio API sin archivos externos
├── drizzle/
│   └── 0000_rooms.sql       # Esquema SQL de la tabla `rooms` para Cloudflare D1
└── scripts/
    └── test-game.mjs        # Suite de pruebas automatizadas (20 jugadores concurrentes, rondas, tiempos y chat)
```

---

## 🧮 Sistema de Puntuación

Cada jugador recibe las mismas palabras de la partida pero en **orden aleatorio individual** para evitar copias entre pantallas cercanas:

- **Tiempo por ronda:** Configurable (`30s`, `45s`, `60s`, `90s`).
- **Vidas por palabra:** `6` intentos antes de completar la figura del ahorcado.
- **Puntaje por palabra descubierta:**
  $$\text{Puntos de Ronda} = 100 - (10 \times \text{errores cometidos})$$
- **Criterio de desempate:** En caso de empate en puntos totales, gana el jugador que haya acumulado el **menor tiempo total de resolución**.

---

## 🚀 Instalación y Uso Local

### Requisitos previos
- **Node.js** `>= 22.13.0`
- **pnpm** (o npm)

### 1. Clonar el repositorio

```bash
git clone https://github.com/andresosky18/GAME-AHORCADO.git
cd GAME-AHORCADO
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Iniciar el servidor de desarrollo

```bash
pnpm run dev
```

Abre `http://localhost:5173` en tu navegador. Puedes abrir una pestaña como **Anfitrión** para crear la sala y abrir otra pestaña (o tu celular en la misma red) para unirte como **Jugador**.

### 4. Ejecutar las pruebas automatizadas

```bash
node scripts/test-game.mjs
```

---

## ☁️ Despliegue en Cloudflare (Workers + D1)

El proyecto está listo para desplegarse gratis en **Cloudflare Workers** junto con una base de datos serverless **Cloudflare D1**:

1. Crea una base de datos D1 en tu cuenta de Cloudflare:
   ```bash
   pnpm exec wrangler d1 create ahorcado-db
   ```
2. Aplica la migración inicial de la tabla `rooms`:
   ```bash
   pnpm exec wrangler d1 execute ahorcado-db --remote --file drizzle/0000_rooms.sql
   ```
3. Compila y despliega a producción:
   ```bash
   pnpm run build
   pnpm exec wrangler deploy --config dist/server/wrangler.json
   ```

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para nuevas plantillas de preguntas, nuevos avatares ilustrados o modos de juego:

1. Haz un **Fork** del proyecto.
2. Crea una rama para tu mejora (`git checkout -b feat/nueva-mejora`).
3. Haz commit de tus cambios (`git commit -m 'feat: agrega nueva plantilla'`).
4. Haz push a tu rama (`git push origin feat/nueva-mejora`) y abre un **Pull Request**.

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [`LICENSE`](./LICENSE) para más información.
