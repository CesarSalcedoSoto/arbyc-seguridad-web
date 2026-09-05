import { useState } from "react";

export default function DeleteMailboxModal({ isOpen, onClose, mailbox, onDeleted, token }) {
  const [confirmText, setConfirmText] = useState("");
  const [purgeMessages, setPurgeMessages] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !mailbox) return null;

  const expectedUsername = mailbox.username;
  const isMatch = confirmText.trim().toLowerCase() === expectedUsername.toLowerCase();

  const handleDelete = async () => {
    if (!isMatch) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/mailboxes/${encodeURIComponent(mailbox.email)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ purgeMessages }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onDeleted(mailbox.email);
        onClose();
      } else {
        setError(data.error || "No se pudo eliminar la casilla.");
      }
    } catch (err) {
      setError("Error de red al eliminar la casilla.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0D1635] border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 sm:p-8">
        
        {/* Cabecera de Alerta */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">¿Eliminar casilla corporativa?</h2>
            <p className="text-xs text-red-300/80 font-mono mt-0.5">{mailbox.email}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-4 text-sm text-gray-300">
          <p className="text-xs text-gray-400">
            Esta acción revocará de inmediato el acceso al correo y eliminará las credenciales del servidor.
          </p>

          {/* Opción de purga vs archivo */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-gray-200 cursor-pointer">
              <input
                type="radio"
                name="purgeOption"
                checked={purgeMessages}
                onChange={() => setPurgeMessages(true)}
                className="text-red-500 focus:ring-red-500"
              />
              <span><strong>Purgar completamente:</strong> Borrar los correos del disco.</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-gray-200 cursor-pointer">
              <input
                type="radio"
                name="purgeOption"
                checked={!purgeMessages}
                onChange={() => setPurgeMessages(false)}
                className="text-red-500 focus:ring-red-500"
              />
              <span><strong>Conservar copia:</strong> Mover correos a la carpeta de archivo del servidor.</span>
            </label>
          </div>

          {/* Confirmación escribiendo el usuario */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Escriba <span className="font-mono text-white font-bold">{expectedUsername}</span> para confirmar:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedUsername}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono text-sm"
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isMatch || loading}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
          >
            {loading ? "Eliminando..." : "Eliminar Definitivamente"}
          </button>
        </div>

      </div>
    </div>
  );
}
