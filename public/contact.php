<?php
/**
 * contact.php — Endpoint del formulario "Solicitar cotización"
 * Arbyc Seguridad — https://arbycseguridad.cl
 *
 * Reemplaza el antiguo endpoint Node (/api/contact) para poder correr en
 * HostGator (hosting compartido, solo PHP). Recibe JSON y responde JSON con
 * el mismo formato que espera el frontend:
 *   { "success": true,  "message": "..." }
 *   { "success": false, "error":   "..." }
 */

// ─── Configuración ─────────────────────────────────────────────────────────
// Cambia estos valores si el dominio o las casillas cambian.
// IMPORTANTE: crea estas casillas en cPanel → Email Accounts.
$CONTACT_TO_EMAIL = "ventas@arbycseguridad.cl";   // Destino de la cotización
$MAIL_FROM        = "no-reply@arbycseguridad.cl"; // Remitente (casilla del dominio)

// ─── Respuesta JSON ────────────────────────────────────────────────────────
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");

if (($_SERVER["REQUEST_METHOD"] ?? "") !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido."]);
    exit;
}

// ─── Leer datos (JSON; con fallback a formulario estándar) ─────────────────
$input = json_decode(file_get_contents("php://input"), true);
if (!is_array($input)) {
    $input = $_POST;
}

$clean = function ($value) {
    return is_string($value) ? trim($value) : "";
};

// Limitar longitudes (mismas reglas que el backend original)
$nombre   = mb_substr($clean($input["nombre"]   ?? ""), 0, 120);
$email    = mb_strtolower($clean($input["email"] ?? ""));
$telefono = mb_substr($clean($input["telefono"] ?? ""), 0, 40);
$mensaje  = mb_substr($clean($input["mensaje"]  ?? ""), 0, 5000);

// ─── Validación ────────────────────────────────────────────────────────────
if ($nombre === "" || $email === "" || $telefono === "" || $mensaje === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Todos los campos son obligatorios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Ingrese un correo electrónico válido."]);
    exit;
}

// Sanitizar contra inyección de cabeceras (evitar CR/LF en cabeceras)
$safeNombre = str_replace(["\r", "\n"], " ", $nombre);
$safeEmail  = str_replace(["\r", "\n"], "", $email);

// ─── Construir correo ──────────────────────────────────────────────────────
$asunto = "Nueva cotización desde arbycseguridad.cl";
$cuerpo =
    "Nueva solicitud de cotización recibida desde el sitio web.\n\n"
    . "Nombre:   {$nombre}\n"
    . "Correo:   {$email}\n"
    . "Teléfono: {$telefono}\n"
    . "Mensaje:\n{$mensaje}\n";

$cabeceras =
    "From: Arbyc Seguridad <{$MAIL_FROM}>\r\n"
    . "Reply-To: {$safeNombre} <{$safeEmail}>\r\n"
    . "MIME-Version: 1.0\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n"
    . "X-Mailer: PHP/" . phpversion();

// ─── Envío ─────────────────────────────────────────────────────────────────
// mail() usa el servidor de correo del hosting. En HostGator el remitente
// debe ser una casilla real del dominio para mejorar la entregabilidad.
$enviado = @mail($CONTACT_TO_EMAIL, $asunto, $cuerpo, $cabeceras, "-f {$MAIL_FROM}");

if ($enviado) {
    echo json_encode([
        "success" => true,
        "message" => "Cotización enviada correctamente. Te contactaremos a la brevedad.",
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "No se pudo enviar la cotización. Inténtalo nuevamente más tarde.",
    ]);
}
