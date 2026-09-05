/**
 * optimize-images.mjs — Genera versiones WebP de las imágenes del proyecto
 *
 * Uso: node scripts/optimize-images.mjs   (o: npm run optimize:images)
 *
 * Recorre public/images/services/ y, para cada imagen soportada
 * (.jpg / .jpeg / .png), crea un `.webp` junto al original:
 *   - Sin upscale (respeta las dimensiones máximas del original)
 *   - Calidad estándar (80) para equilibrio peso/calidad
 *   - Conserva los originales como fallback final
 */

import { readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIR = join(ROOT, "public", "images", "services");

const SUPPORTED = new Set([".jpg", ".jpeg", ".png"]);
const SKIP = new Set([".webp", ".avif"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const files = await walk(DIR);
  let converted = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (SKIP.has(ext)) continue;

    if (!SUPPORTED.has(ext)) {
      skipped += 1;
      continue;
    }

    const outFile = file.slice(0, -ext.length) + ".webp";

    try {
      const meta = await stat(file);
      await sharp(file)
        .webp({ quality: 80 })
        .toFile(outFile);
      const outMeta = await stat(outFile);
      const pct = Math.round((outMeta.size / meta.size) * 100);
      console.log(`✔ ${outFile.split(/[\\/]/).pop()}  ${meta.size} → ${outMeta.size} bytes (${pct}%)`);
      converted += 1;
    } catch (err) {
      failed += 1;
      console.error(`✖ ${file}: ${err.message}`);
    }
  }

  console.log(`\nListo: ${converted} convertidas, ${skipped} ignoradas, ${failed} con error.`);
  if (failed > 0) process.exitCode = 1;
}

main();
