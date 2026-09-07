/**
 * deploy.mjs — Genera el paquete listo para subir a HostGator
 *
 * Uso: node scripts/deploy.mjs   (o: npm run deploy)
 *
 * Hace:
 *   1. Compila el frontend (vite build → dist/)
 *   2. Copia .htaccess dentro de dist/
 *   3. Empaqueta el contenido de dist/ en arbyc-web-deploy.zip
 *
 * Luego sube ese ZIP a cPanel → File Manager → public_html/ y extrae su contenido.
 */

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
const HTACCESS = join(ROOT, ".htaccess");
const ZIP_NAME = "arbyc-web-deploy.zip";
const ZIP_PATH = join(ROOT, ZIP_NAME);

function run(cmd, args = [], options = {}) {
  const res = spawnSync(cmd, args, { stdio: "inherit", ...options });
  if (res.error) {
    console.error(`✖ Error ejecutando ${cmd}:`, res.error.message);
    process.exit(1);
  }
  if (res.status !== 0) {
    console.error(`✖ ${cmd} terminó con código ${res.status}`);
    process.exit(res.status ?? 1);
  }
}

console.log("1/3) Compilando frontend (vite build)...");
// En Windows, "npm" es un .cmd: necesita ejecutarse a través del shell.
run("npm", ["run", "build"], { shell: process.platform === "win32" });

if (!existsSync(DIST)) {
  console.error("✖ No se generó la carpeta dist/. Revisa el build.");
  process.exit(1);
}

console.log("2/3) Copiando .htaccess a dist/...");
if (existsSync(HTACCESS)) {
  cpSync(HTACCESS, join(DIST, ".htaccess"));
  console.log("   ✔ .htaccess copiado.");
} else {
  console.warn("   ⚠ No se encontró .htaccess en la raíz del proyecto.");
}

console.log(`3/3) Creando ${ZIP_NAME}...`);
if (existsSync(ZIP_PATH)) rmSync(ZIP_PATH);

const psCommand = `Compress-Archive -Path '${join(DIST, "*")}' -DestinationPath '${ZIP_PATH}' -Force`;
run("powershell.exe", ["-NoProfile", "-Command", psCommand]);

if (!existsSync(ZIP_PATH)) {
  console.error("✖ No se pudo crear el ZIP.");
  process.exit(1);
}

const sizeMb = (statSync(ZIP_PATH).size / (1024 * 1024)).toFixed(2);
console.log(`\n✅ Listo: ${ZIP_PATH} (${sizeMb} MB)`);
console.log("   Súbelo a cPanel → File Manager → public_html/ y extrae su contenido ahí.");
