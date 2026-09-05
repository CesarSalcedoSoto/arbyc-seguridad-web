import { useState } from "react";

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

  for (let i = password.length - 1; i > 0; i--) {
    const j = array[i] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}

export default function ChangePasswordModal({ isOpen, onClose, mailbox, onUpdated, token }) {
  const [newPassword, setNewPassword] = useState(() => generateSecurePassword());
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !mailbox) return null;

  const handleGenerate = () => {
    setNewPassword(generateSecurePassword());
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/mailboxes/${encodeURIComponent(mailbox.email)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onUpdated(mailbox.email);
        onClose();
      } else {
        setError(data.error || "No se pudo actualizar la contraseña.");
      }
    } catch (err) {
      setError("Error de red al actualizar contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0D1635] border border-white/15 rounded-2xl w-full max-w-md shadow-2xl p-6 sm:p-8">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Cambiar Contraseña</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{mailbox.email}</p>
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
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Nueva Contraseña
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="text-xs text-[#6EC1E4] hover:underline cursor-pointer"
                >
                  Generar
                </button>
                <span className="text-gray-600">|</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs text-[#6EC1E4] hover:underline cursor-pointer"
                >
                  {copied ? "¡Copiada!" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <p className="text-[11px] text-gray-400">
            La contraseña se actualizará de inmediato en el servidor de correo. El usuario deberá actualizarla en su cliente (Outlook/Móvil).
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#6EC1E4] hover:bg-[#82CEF0] text-[#0D1635] font-bold text-sm tracking-wide transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Actualizando..." : "Guardar Contraseña"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
