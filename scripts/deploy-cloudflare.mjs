import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const wranglerBin = resolve(root, "node_modules/wrangler/bin/wrangler.js");
const dbName = "ahorcado-db";

// Account ID visible in user's Cloudflare Dashboard URL
process.env.CLOUDFLARE_ACCOUNT_ID ??= "6e60ee000d980768a9ff4335a2b29229";

function runWrangler(args, options = {}) {
  return spawnSync(process.execPath, [wranglerBin, ...args], {
    cwd: root,
    env: process.env,
    encoding: "utf8",
    ...options,
  });
}

console.log("==================================================");
console.log("  PUBLICANDO AHORCADO EN CLOUDFLARE (GRATIS)");
console.log("==================================================\n");

// 1. Verificar sesión en Cloudflare
console.log("[1/5] Verificando sesión en Cloudflare...");
const whoami = runWrangler(["whoami"], { stdio: "pipe" });
if (whoami.status !== 0) {
  console.log("No hay sesión iniciada. Se abrirá tu navegador para autorizar a Cloudflare...");
  console.log("Por favor haz clic en 'Allow' (Permitir) en la página que se abrirá.\n");
  const login = runWrangler(["login"], { stdio: "inherit" });
  if (login.status !== 0) {
    console.error("\nNo se pudo completar el inicio de sesión en Cloudflare.");
    process.exit(1);
  }
} else {
  console.log("✓ Sesión activa en Cloudflare.\n");
}

// 2. Buscar o crear la base de datos D1
console.log(`[2/5] Configurando base de datos D1 (${dbName})...`);
let databaseId = null;

function findDbId() {
  const listRes = runWrangler(["d1", "list", "--json"], { stdio: "pipe" });
  if (listRes.status === 0 && listRes.stdout) {
    try {
      const dbs = JSON.parse(listRes.stdout);
      const found = dbs.find((d) => d.name === dbName) || dbs.find((d) => d.name === "site-creator-d1");
      if (found?.uuid) return found.uuid;
    } catch {
      // ignore parse error
    }
  }
  return null;
}

databaseId = findDbId();

if (!databaseId) {
  console.log(`Creando base de datos '${dbName}' en Cloudflare D1...`);
  const createRes = runWrangler(["d1", "create", dbName], { stdio: "pipe" });
  const combinedOutput = `${createRes.stdout || ""}\n${createRes.stderr || ""}`;
  console.log(combinedOutput);
  const match = combinedOutput.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (match) {
    databaseId = match[0];
  } else {
    databaseId = findDbId();
  }
}

if (!databaseId) {
  console.error("✗ No se pudo obtener el ID de la base de datos D1.");
  process.exit(1);
}

console.log(`✓ Base de datos D1 lista (ID: ${databaseId}).\n`);

// 3. Actualizar vite.config.ts con el ID real de D1
console.log("[3/5] Actualizando configuración con tu base de datos D1...");
const viteConfigPath = resolve(root, "vite.config.ts");
let viteConfig = readFileSync(viteConfigPath, "utf8");
viteConfig = viteConfig.replace(
  /const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =\s*"[^"]+";/,
  `const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =\n  "${databaseId}";`
);
viteConfig = viteConfig.replace(
  /database_name:\s*"[^"]+"/,
  `database_name: "${dbName}"`
);
writeFileSync(viteConfigPath, viteConfig, "utf8");
console.log("✓ vite.config.ts actualizado.\n");

// 4. Compilar el proyecto
console.log("[4/5] Compilando aplicación para producción...");
const buildRes = spawnSync(process.execPath, [resolve(root, "scripts/run-framework.mjs"), "build"], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
});
if (buildRes.status !== 0) {
  console.error("\n✗ Error al compilar el proyecto.");
  process.exit(1);
}

// Crear la tabla rooms en la base de datos D1 remota
console.log("\nInicializando tabla 'rooms' en Cloudflare D1...");
const migrateRes = runWrangler(
  [
    "d1",
    "execute",
    "DB",
    "--remote",
    "--config",
    "dist/server/wrangler.json",
    "--command",
    "CREATE TABLE IF NOT EXISTS `rooms` (`code` text PRIMARY KEY NOT NULL, `state` text NOT NULL, `revision` integer DEFAULT 0 NOT NULL);",
  ],
  { stdio: "inherit" }
);
if (migrateRes.status !== 0) {
  console.error("\n✗ Error al crear la tabla 'rooms' en D1.");
  process.exit(1);
}
console.log("✓ Tabla 'rooms' verificada en D1.\n");

// 5. Desplegar el Worker a Cloudflare
console.log("[5/5] Subiendo tu juego a Cloudflare Workers...");
const deployRes = runWrangler(["deploy", "--config", "dist/server/wrangler.json"], {
  stdio: "inherit",
});
if (deployRes.status !== 0) {
  console.error("\n✗ Error al desplegar en Cloudflare Workers.");
  process.exit(1);
}

console.log("\n==================================================");
console.log("  ¡LISTO! TU JUEGO YA ESTÁ PUBLICADO EN INTERNET");
console.log("  Copia el enlace https://ahorcado...workers.dev de arriba");
console.log("==================================================\n");
