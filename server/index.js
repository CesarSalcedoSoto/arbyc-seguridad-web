/**
 * server/index.js — Backend API y Servidor de Aplicación
 * Arbyc Seguridad — Plataforma Web y Panel de Correos
 * Dominio: arbycseguridad.cl
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

// Configuración de rutas de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, "../../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Variables de Configuración y Entorno ────────────────────────────────────
const DOMAIN = process.env.DOMAIN || "arbycseguridad.cl";
const MAIL_HOSTNAME = process.env.MAIL_HOSTNAME || `mail.${DOMAIN}`;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || `admin@${DOMAIN}`).toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ArbycSeguridad2026!Master";
const JWT_SECRET = process.env.JWT_SECRET || "arbyc-seguridad-jwt-secret-key-2026-production";

// Directorios de persistencia (compatibles con docker-mailserver y desarrollo local)
const MAIL_CONFIG_DIR = process.env.MAIL_CONFIG_DIR || path.join(__dirname, "../data/mail-config");
const VMAIL_DIR = process.env.VMAIL_DIR || path.join(__dirname, "../data/vmail");
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../data/db");

// Archivos clave de configuración de docker-mailserver
const POSTFIX_ACCOUNTS_FILE = path.join(MAIL_CONFIG_DIR, "postfix-accounts.cf");
const DOVECOT_QUOTAS_FILE = path.join(MAIL_CONFIG_DIR, "dovecot-quotas.cf");
const METADATA_DB_FILE = path.join(DATA_DIR, "mail-admin.json");

// ─── Configuración de envío de correo (formulario de contacto) ────────────────
const CONTACT_TO_EMAIL = (process.env.CONTACT_TO_EMAIL || `ventas@${DOMAIN}`).toLowerCase();
const MAIL_FROM = process.env.MAIL_FROM || `no-reply@${DOMAIN}`;
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

// Transporter SMTP (solo si SMTP_HOST está configurado; si no, se usa respaldo local)
const transporter = SMTP_HOST
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    })
  : null;

// ─── Inicialización de Directorios y Archivos ────────────────────────────────
function initStorage() {
  [MAIL_CONFIG_DIR, VMAIL_DIR, DATA_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  if (!fs.existsSync(POSTFIX_ACCOUNTS_FILE)) {
    fs.writeFileSync(POSTFIX_ACCOUNTS_FILE, "# Formato: <email>|<hash>\n", "utf8");
  }

  if (!fs.existsSync(DOVECOT_QUOTAS_FILE)) {
    fs.writeFileSync(DOVECOT_QUOTAS_FILE, "# Formato: <email>:<quota>M\n", "utf8");
  }

  if (!fs.existsSync(METADATA_DB_FILE)) {
    fs.writeFileSync(METADATA_DB_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

initStorage();

// ─── Middlewares ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Logger HTTP básico
app.use((req, res, next) => {
  if (!req.path.startsWith("/assets/")) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ─── Helpers de Base de Datos y Correo ───────────────────────────────────────

// Leer metadatos auxiliares
function readMetadata() {
  try {
    if (!fs.existsSync(METADATA_DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(METADATA_DB_FILE, "utf8"));
  } catch (err) {
    console.error("Error leyendo mail-admin.json:", err.message);
    return [];
  }
}

// Guardar metadatos auxiliares
function saveMetadata(data) {
  try {
    fs.writeFileSync(METADATA_DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error guardando mail-admin.json:", err.message);
  }
}

// Leer cuentas de postfix-accounts.cf
function readPostfixAccounts() {
  try {
    if (!fs.existsSync(POSTFIX_ACCOUNTS_FILE)) return [];
    const lines = fs.readFileSync(POSTFIX_ACCOUNTS_FILE, "utf8").split("\n");
    const accounts = [];
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const [email, hash] = line.split("|");
      if (email && hash) {
        accounts.push({ email: email.trim().toLowerCase(), hash: hash.trim() });
      }
    }
    return accounts;
  } catch (err) {
    console.error("Error leyendo postfix-accounts.cf:", err.message);
    return [];
  }
}

// Guardar cuentas en postfix-accounts.cf
function savePostfixAccounts(accounts) {
  const content =
    "# Generado por Arbyc Mail Admin\n" +
    accounts.map((a) => `${a.email}|${a.hash}`).join("\n") +
    "\n";
  fs.writeFileSync(POSTFIX_ACCOUNTS_FILE, content, "utf8");
}

// Leer cuotas de dovecot-quotas.cf
function readDovecotQuotas() {
  try {
    if (!fs.existsSync(DOVECOT_QUOTAS_FILE)) return {};
    const lines = fs.readFileSync(DOVECOT_QUOTAS_FILE, "utf8").split("\n");
    const quotas = {};
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const [email, quota] = line.split(":");
      if (email && quota) {
        const match = quota.match(/^(\d+)([MG]?)$/i);
        let quotaMb = 3072;
        if (match) {
          const num = parseInt(match[1], 10);
          const unit = (match[2] || "M").toUpperCase();
          quotaMb = unit === "G" ? num * 1024 : num;
        }
        quotas[email.trim().toLowerCase()] = quotaMb;
      }
    }
    return quotas;
  } catch (err) {
    console.error("Error leyendo dovecot-quotas.cf:", err.message);
    return {};
  }
}

// Guardar cuotas en dovecot-quotas.cf
function saveDovecotQuotas(quotasMap) {
  const lines = Object.entries(quotasMap).map(([email, mb]) => `${email}:${mb}M`);
  const content = "# Generado por Arbyc Mail Admin\n" + lines.join("\n") + "\n";
  fs.writeFileSync(DOVECOT_QUOTAS_FILE, content, "utf8");
}

// Calcular tamaño en disco de un buzón (recursivo)
function getMailboxDiskUsage(userPart) {
  try {
    const userDir = path.join(VMAIL_DIR, DOMAIN, userPart);
    if (!fs.existsSync(userDir)) return 0;

    let totalBytes = 0;
    function calculate(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          calculate(fullPath);
        } else if (entry.isFile()) {
          const stat = fs.statSync(fullPath);
          totalBytes += stat.size;
        }
      }
    }
    calculate(userDir);
    return Number((totalBytes / (1024 * 1024)).toFixed(2)); // Retorna MB
  } catch (err) {
    return 0;
  }
}

// Crear estructura Maildir requerida por Dovecot
function createMaildir(userPart) {
  try {
    const userDir = path.join(VMAIL_DIR, DOMAIN, userPart);
    const subdirs = ["cur", "new", "tmp", ".Sent", ".Drafts", ".Trash", ".Junk"];
    subdirs.forEach((sub) => {
      const full = path.join(userDir, sub);
      if (!fs.existsSync(full)) {
        fs.mkdirSync(full, { recursive: true });
      }
    });
  } catch (err) {
    console.error("Error inicializando maildir:", err.message);
  }
}

// Formatear hash de contraseña compatible con Dovecot ({BLF-CRYPT} con bcrypt)
function generateDovecotHash(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return `{BLF-CRYPT}${hash}`;
}

// ─── Helpers de envío de correo de contacto ───────────────────────────────────
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Envía el correo de solicitud de cotización a CONTACT_TO_EMAIL.
 * Si no hay SMTP configurado, respalda el mensaje en disco (desarrollo).
 */
async function sendContactEmail({ nombre, email, telefono, mensaje }) {
  const subject = `Nueva solicitud de cotización — ${nombre}`;

  const textBody = [
    "Nueva solicitud de cotización recibida desde el sitio web:",
    "",
    `Nombre:    ${nombre}`,
    `Correo:    ${email}`,
    `Teléfono:  ${telefono}`,
    "",
    "Mensaje:",
    mensaje,
  ].join("\n");

  const htmlBody = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0D1635;">
      <h2 style="margin:0 0 16px;font-size:18px;">Nueva solicitud de cotización</h2>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 12px 4px 0;color:#54595F;">Nombre:</td><td style="padding:4px 0;"><strong>${escapeHtml(nombre)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#54595F;">Correo:</td><td style="padding:4px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#6EC1E4;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#54595F;">Teléfono:</td><td style="padding:4px 0;">${escapeHtml(telefono)}</td></tr>
      </table>
      <p style="margin:16px 0 8px;color:#54595F;">Mensaje:</p>
      <p style="white-space:pre-wrap;margin:0;">${escapeHtml(mensaje)}</p>
    </div>
  `;

  if (!transporter) {
    // Respaldo local cuando no hay SMTP configurado (entorno de desarrollo)
    const filePath = path.join(DATA_DIR, "contact-messages.json");
    let list = [];
    try {
      if (fs.existsSync(filePath)) {
        list = JSON.parse(fs.readFileSync(filePath, "utf8"));
      }
    } catch (err) {
      list = [];
    }
    list.push({
      to: CONTACT_TO_EMAIL,
      from: MAIL_FROM,
      replyTo: email,
      subject,
      nombre,
      email,
      telefono,
      mensaje,
      receivedAt: new Date().toISOString(),
    });
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
    console.log(`[CONTACT] SMTP no configurado → mensaje respaldado localmente para ${CONTACT_TO_EMAIL}`);
    return { delivered: false };
  }

  await transporter.sendMail({
    from: MAIL_FROM,
    to: CONTACT_TO_EMAIL,
    replyTo: email,
    subject,
    text: textBody,
    html: htmlBody,
  });

  return { delivered: true };
}

// ─── Middleware de Autenticación de Administrador ────────────────────────────
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Acceso no autorizado. Se requiere token de sesión.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Acceso denegado. Rol de administrador requerido.",
      });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Sesión expirada o token inválido.",
    });
  }
}

// ─── ENDPOINTS DE AUTENTICACIÓN ─────────────────────────────────────────────

/**
 * POST /api/admin/login
 * Inicia sesión del Administrador Maestro
 */
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Debe ingresar correo y contraseña maestra.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Validación contra credenciales maestras configuradas en .env
  const isEmailMatch = normalizedEmail === ADMIN_EMAIL;
  let isPassMatch = false;

  if (isEmailMatch) {
    // Si la contraseña maestra en .env está en formato hash bcrypt
    if (ADMIN_PASSWORD.startsWith("$2a$") || ADMIN_PASSWORD.startsWith("$2b$") || ADMIN_PASSWORD.startsWith("$2y$")) {
      isPassMatch = bcrypt.compareSync(password, ADMIN_PASSWORD);
    } else {
      isPassMatch = password === ADMIN_PASSWORD;
    }
  }

  if (!isEmailMatch || !isPassMatch) {
    return res.status(401).json({
      success: false,
      error: "Credenciales maestras inválidas. Verifique su correo y clave.",
    });
  }

  // Generación de JWT (vigencia: 12 horas)
  const token = jwt.sign(
    {
      sub: "master-admin",
      email: ADMIN_EMAIL,
      role: "ADMIN",
      domain: DOMAIN,
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

  return res.json({
    success: true,
    data: {
      token,
      user: {
        email: ADMIN_EMAIL,
        role: "ADMIN",
        domain: DOMAIN,
      },
    },
    message: "Inicio de sesión administrativo exitoso.",
  });
});

/**
 * GET /api/admin/me
 * Obtiene los datos del administrador en sesión
 */
app.get("/api/admin/me", requireAdminAuth, (req, res) => {
  return res.json({
    success: true,
    data: {
      user: req.admin,
      domain: DOMAIN,
      mailHostname: MAIL_HOSTNAME,
    },
  });
});

// ─── ENDPOINTS DE GESTIÓN DE CASILLAS DE CORREO ─────────────────────────────

/**
 * GET /api/admin/mailboxes
 * Lista todas las casillas activas, cuota asignada y uso en disco
 */
app.get("/api/admin/mailboxes", requireAdminAuth, (req, res) => {
  try {
    const accounts = readPostfixAccounts();
    const quotas = readDovecotQuotas();
    const metadataList = readMetadata();
    const metaMap = new Map(metadataList.map((m) => [m.email.toLowerCase(), m]));

    const mailboxes = accounts.map((acc) => {
      const [username] = acc.email.split("@");
      const meta = metaMap.get(acc.email) || {};
      const quotaMb = quotas[acc.email] || meta.quotaMb || 3072;
      const usedMb = getMailboxDiskUsage(username);
      const usagePercent = quotaMb > 0 ? Math.min(100, Number(((usedMb / quotaMb) * 100).toFixed(1))) : 0;

      return {
        email: acc.email,
        username,
        domain: DOMAIN,
        name: meta.name || username,
        active: meta.active !== false,
        quotaMb,
        usedMb,
        usagePercent,
        createdAt: meta.createdAt || new Date().toISOString(),
        updatedAt: meta.updatedAt || null,
      };
    });

    return res.json({
      success: true,
      data: mailboxes,
      total: mailboxes.length,
      serverConfig: {
        domain: DOMAIN,
        mailHostname: MAIL_HOSTNAME,
        imapPort: 993,
        smtpPort: 465,
        submissionPort: 587,
      },
    });
  } catch (err) {
    console.error("Error al listar casillas:", err);
    return res.status(500).json({
      success: false,
      error: "Error interno al obtener casillas de correo.",
    });
  }
});

/**
 * POST /api/admin/mailboxes
 * Crea una nueva casilla de correo corporativo
 */
app.post("/api/admin/mailboxes", requireAdminAuth, (req, res) => {
  const { username, password, name, quotaMb } = req.body;

  // Validaciones
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Se requiere nombre de usuario y contraseña.",
    });
  }

  // Sanitización de username (solo a-z, 0-9, puntos, guiones y guiones bajos)
  const cleanUsername = username.toLowerCase().trim();
  const usernameRegex = /^[a-z0-9]+([._-][a-z0-9]+)*$/;
  if (!usernameRegex.test(cleanUsername)) {
    return res.status(400).json({
      success: false,
      error: "El prefijo solo puede tener letras minúsculas, números, puntos y guiones.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      error: "La contraseña debe tener al menos 8 caracteres.",
    });
  }

  const fullEmail = `${cleanUsername}@${DOMAIN}`;
  const accounts = readPostfixAccounts();

  // Verificar si la casilla ya existe
  if (accounts.some((a) => a.email.toLowerCase() === fullEmail)) {
    return res.status(409).json({
      success: false,
      error: `La casilla ${fullEmail} ya existe.`,
    });
  }

  const quota = parseInt(quotaMb, 10) || 3072; // Default 3 GB
  const displayName = name ? name.trim() : cleanUsername;

  // Generar hash Dovecot
  const dovecotHash = generateDovecotHash(password);

  // 1. Guardar en postfix-accounts.cf
  accounts.push({ email: fullEmail, hash: dovecotHash });
  savePostfixAccounts(accounts);

  // 2. Guardar en dovecot-quotas.cf
  const quotas = readDovecotQuotas();
  quotas[fullEmail] = quota;
  saveDovecotQuotas(quotas);

  // 3. Crear estructura maildir en el almacenamiento
  createMaildir(cleanUsername);

  // 4. Guardar metadatos
  const metadataList = readMetadata().filter((m) => m.email.toLowerCase() !== fullEmail);
  const now = new Date().toISOString();
  metadataList.push({
    email: fullEmail,
    name: displayName,
    quotaMb: quota,
    active: true,
    createdAt: now,
    updatedAt: now,
  });
  saveMetadata(metadataList);

  return res.status(201).json({
    success: true,
    data: {
      email: fullEmail,
      username: cleanUsername,
      domain: DOMAIN,
      name: displayName,
      quotaMb: quota,
      usedMb: 0,
      usagePercent: 0,
      active: true,
      createdAt: now,
    },
    message: `Casilla ${fullEmail} creada correctamente.`,
  });
});

/**
 * PATCH /api/admin/mailboxes/:email
 * Actualiza la contraseña de una casilla
 */
app.patch("/api/admin/mailboxes/:email", requireAdminAuth, (req, res) => {
  const targetEmail = req.params.email.toLowerCase().trim();
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      error: "La nueva contraseña debe tener al menos 8 caracteres.",
    });
  }

  const accounts = readPostfixAccounts();
  const accountIndex = accounts.findIndex((a) => a.email.toLowerCase() === targetEmail);

  if (accountIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `La casilla ${targetEmail} no existe.`,
    });
  }

  // Actualizar hash
  accounts[accountIndex].hash = generateDovecotHash(newPassword);
  savePostfixAccounts(accounts);

  // Actualizar metadatos
  const metadataList = readMetadata();
  const metaIndex = metadataList.findIndex((m) => m.email.toLowerCase() === targetEmail);
  if (metaIndex !== -1) {
    metadataList[metaIndex].updatedAt = new Date().toISOString();
    saveMetadata(metadataList);
  }

  return res.json({
    success: true,
    message: `Contraseña de ${targetEmail} actualizada correctamente.`,
  });
});

/**
 * DELETE /api/admin/mailboxes/:email
 * Elimina la casilla y purga o archiva su almacenamiento
 */
app.delete("/api/admin/mailboxes/:email", requireAdminAuth, (req, res) => {
  const targetEmail = req.params.email.toLowerCase().trim();
  const { purgeMessages = true } = req.body;

  const accounts = readPostfixAccounts();
  const accountIndex = accounts.findIndex((a) => a.email.toLowerCase() === targetEmail);

  if (accountIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `La casilla ${targetEmail} no existe.`,
    });
  }

  const [username] = targetEmail.split("@");

  // 1. Eliminar de postfix-accounts.cf
  const updatedAccounts = accounts.filter((a) => a.email.toLowerCase() !== targetEmail);
  savePostfixAccounts(updatedAccounts);

  // 2. Eliminar de dovecot-quotas.cf
  const quotas = readDovecotQuotas();
  delete quotas[targetEmail];
  saveDovecotQuotas(quotas);

  // 3. Eliminar de metadatos
  const metadataList = readMetadata().filter((m) => m.email.toLowerCase() !== targetEmail);
  saveMetadata(metadataList);

  // 4. Gestión del almacenamiento en disco
  try {
    const userDir = path.join(VMAIL_DIR, DOMAIN, username);
    if (fs.existsSync(userDir)) {
      if (purgeMessages) {
        fs.rmSync(userDir, { recursive: true, force: true });
      } else {
        const archiveDir = path.join(VMAIL_DIR, "archive");
        if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
        const dest = path.join(archiveDir, `${username}_${Date.now()}`);
        fs.renameSync(userDir, dest);
      }
    }
  } catch (err) {
    console.warn("Advertencia al gestionar carpeta vmail:", err.message);
  }

  return res.json({
    success: true,
    message: `Casilla ${targetEmail} eliminada correctamente.`,
    archived: !purgeMessages,
  });
});

// ─── ENDPOINT PÚBLICO: ENVÍO DE COTIZACIÓN ─────────────────────────────────
/**
 * POST /api/contact
 * Recibe los datos del formulario "Solicitar cotización" y envía un correo
 * a CONTACT_TO_EMAIL (ventas@arbycseguridad.cl por defecto).
 */
app.post("/api/contact", async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body || {};

  const clean = (value) => (typeof value === "string" ? value.trim() : "");

  const nombreClean = clean(nombre);
  const emailClean = clean(email).toLowerCase();
  const telefonoClean = clean(telefono);
  const mensajeClean = clean(mensaje);

  if (!nombreClean || !emailClean || !telefonoClean || !mensajeClean) {
    return res.status(400).json({
      success: false,
      error: "Todos los campos son obligatorios.",
    });
  }

  if (nombreClean.length > 120) {
    return res.status(400).json({ success: false, error: "El nombre es demasiado largo." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailClean)) {
    return res.status(400).json({ success: false, error: "Ingrese un correo electrónico válido." });
  }

  if (telefonoClean.length > 40) {
    return res.status(400).json({ success: false, error: "El teléfono es demasiado largo." });
  }

  if (mensajeClean.length > 5000) {
    return res.status(400).json({ success: false, error: "El mensaje es demasiado largo." });
  }

  try {
    await sendContactEmail({
      nombre: nombreClean,
      email: emailClean,
      telefono: telefonoClean,
      mensaje: mensajeClean,
    });

    return res.json({
      success: true,
      message: "Cotización enviada correctamente. Te contactaremos a la brevedad.",
    });
  } catch (err) {
    console.error("Error enviando correo de contacto:", err);
    return res.status(500).json({
      success: false,
      error: "No se pudo enviar la cotización. Inténtalo nuevamente más tarde.",
    });
  }
});

// ─── Servir Frontend Estático en Producción ─────────────────────────────────
const clientDistPath = path.join(__dirname, "../dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Cualquier ruta no-API (incluyendo /admin y /admin/correos) entrega index.html
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api/")) {
      res.sendFile(path.join(clientDistPath, "index.html"));
    } else {
      res.status(404).json({ success: false, error: "Endpoint API no encontrado" });
    }
  });
}

// ─── Iniciar Servidor ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Arbyc Seguridad Web & Mail Server API`);
  console.log(`📍 Servidor escuchando en: http://localhost:${PORT}`);
  console.log(`🌐 Dominio configurado: ${DOMAIN}`);
  console.log(`📧 Host de correo: ${MAIL_HOSTNAME}`);
  console.log(`🔒 Administrador maestro: ${ADMIN_EMAIL}`);
  console.log(`📁 Config Mail: ${MAIL_CONFIG_DIR}`);
  console.log(`📁 Almacenamiento VMail: ${VMAIL_DIR}`);
  console.log(`=======================================================`);
});
