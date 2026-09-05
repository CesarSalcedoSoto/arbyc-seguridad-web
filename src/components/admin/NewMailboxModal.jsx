import { useState } from "react";

// Generador de contraseña segura aleatoria con crypto.getRandomValues
function generateSecurePassword(length = 16) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,.-=";
  const allChars = uppercase + lowercase + digits + symbols;

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);

  let password = [
    uppercase[array[0] % uppercase.length],
    lowercase[array[1] % lowercase.length],
    digits[array[2] % digits.length],
    symbols[array[3] % symbols.length],
  ];

  for (let i = 4; i < length; i++) {
    password.push(allChars[array[i] % allChars.length]);
  }

  // Mezclar
  for (let i = password.length - 1; i > 0; i--) {
    const j = array[i] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}

export default function NewMailboxModal({ isOpen, onClose, onCreated, token, domain, mailHostname }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(() => generateSecurePassword());
  const [showPassword, setShowPassword] = useState(true);
  const [quotaMb, setQuotaMb] = useState("3072"); // 3 GB por defecto
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    setPassword(generateSecurePassword());
    setCopied(false);
  };

  const handleCopyCredentials = () => {
    const fullEmail = `${username.trim().toLowerCase()}@${domain}`;
    const text = `=================================================
CREDENCIALES DE CORREO CORPORATIVO · ARBYC SEGURIDAD
=================================================
• Cuenta: ${fullEmail}
• Nombre: ${name || username}
• Contraseña: ${password}
-------------------------------------------------
DATOS DE CONFIGURACIÓN (Outlook / Teléfono):
• Servidor Entrante (IMAP): ${mailHostname}
  Puerto: 993 (Seguridad SSL/TLS)
• Servidor Saliente (SMTP): ${mailHostname}
  Puerto: 465 (Seguridad SSL/TLS) o 587 (STARTTLS)
• Nombre de usuario: ${fullEmail}
• Autenticación: Requerida con la misma contraseña
=================================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser) {
      setError("Ingrese un nombre de usuario.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/mailboxes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          username: cleanUser,
          password,
          quotaMb: parseInt(quotaMb, 10),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onCreated(data.data);
        onClose();
      } else {
        setError(data.error || "No se pudo crear la casilla.");
      }
    } catch (err) {
      setError("Error de red al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0D1635] border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 overflow-hidden relative">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6EC1E4]/10 border border-[#6EC1E4]/30 text-[#6EC1E4] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Nueva Casilla de Correo</h2>
              <p className="text-xs text-gray-400">Crear cuenta en @{domain}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre Completo */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Nombre y Apellido del Funcionario
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Rodrigo Tapia"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#6EC1E4] focus:ring-1 focus:ring-[#6EC1E4] text-sm"
            />
          </div>

          {/* Nombre de Usuario / Correo */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Dirección de Correo
            </label>
            <div className="flex items-center">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                placeholder="rodrigo.tapia"
                className="flex-1 px-3.5 py-2.5 rounded-l-xl bg-white/5 border border-r-0 border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#6EC1E4] text-sm"
              />
              <span className="px-3.5 py-2.5 bg-white/10 border border-white/10 rounded-r-xl text-gray-300 text-sm font-medium">
                @{domain}
              </span>
            </div>
          </div>

          {/* Cuota de Disco */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Cuota de Almacenamiento
            </label>
            <select
              value={quotaMb}
              onChange={(e) => setQuotaMb(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#08102B] border border-white/10 text-white focus:outline-none focus:border-[#6EC1E4] text-sm cursor-pointer"
            >
              <option value="1024">1 GB (Básica)</option>
              <option value="3072">3 GB (Estándar recomendada)</option>
              <option value="5120">5 GB (Operaciones / Ventas)</option>
              <option value="10240">10 GB (Gerencia / Dirección)</option>
              <option value="20480">20 GB (Avanzada)</option>
            </select>
          </div>

          {/* Contraseña Generada con botón de regenerar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Contraseña de la Casilla
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-xs text-[#6EC1E4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Generar otra aleatoria
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs tracking-wider focus:outline-none focus:border-[#6EC1E4]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Botón para copiar credenciales completas para el funcionario */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleCopyCredentials}
              disabled={!username}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-40 cursor-pointer"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-300 font-semibold">¡Datos de configuración copiados al portapapeles!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-[#6EC1E4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Copiar credenciales y parámetros de conexión (para enviar al usuario)</span>
                </>
              )}
            </button>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#6EC1E4] hover:bg-[#82CEF0] text-[#0D1635] font-bold text-sm tracking-wide transition-all shadow-md shadow-[#6EC1E4]/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0D1635] border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando casilla...</span>
                </>
              ) : (
                <span>Crear Casilla</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
