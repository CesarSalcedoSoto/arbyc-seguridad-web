import { useState, useEffect, useMemo } from "react";
import NewMailboxModal from "./NewMailboxModal";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteMailboxModal from "./DeleteMailboxModal";

export default function AdminDashboard({ admin, token, onLogout }) {
  const [mailboxes, setMailboxes] = useState([]);
  const [serverConfig, setServerConfig] = useState({
    domain: "arbycseguridad.cl",
    mailHostname: "mail.arbycseguridad.cl",
    imapPort: 993,
    smtpPort: 465,
    submissionPort: 587,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);

  // Estados de Modales
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedMailboxForPass, setSelectedMailboxForPass] = useState(null);
  const [selectedMailboxForDelete, setSelectedMailboxForDelete] = useState(null);
  const [copiedSettings, setCopiedSettings] = useState(false);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchMailboxes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/mailboxes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMailboxes(data.data || []);
        if (data.serverConfig) {
          setServerConfig(data.serverConfig);
        }
      } else {
        showNotification(data.error || "Error al cargar casillas.", "error");
      }
    } catch (err) {
      showNotification("Error de conexión con la API.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMailboxes();
  }, []);

  // Filtrado de casillas
  const filteredMailboxes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mailboxes;
    return mailboxes.filter(
      (m) =>
        m.email.toLowerCase().includes(q) ||
        (m.name && m.name.toLowerCase().includes(q))
    );
  }, [mailboxes, search]);

  // Cálculos estadísticos
  const totalUsedMb = useMemo(() => {
    return mailboxes.reduce((acc, m) => acc + (m.usedMb || 0), 0);
  }, [mailboxes]);

  const criticalCount = useMemo(() => {
    return mailboxes.filter((m) => m.usagePercent >= 90).length;
  }, [mailboxes]);

  const formatSize = (mb) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  // Copiar parámetros de configuración estándar para compartir con los usuarios
  const handleCopyStandardSettings = () => {
    const text = `=================================================
PARÁMETROS DE CONFIGURACIÓN DE CORREO · ARBYC SEGURIDAD
Dominio Corporativo: @${serverConfig.domain}
=================================================
• Servidor Entrante (IMAP): ${serverConfig.mailHostname}
  - Puerto: ${serverConfig.imapPort}
  - Seguridad: SSL/TLS
• Servidor Saliente (SMTP): ${serverConfig.mailHostname}
  - Puerto: ${serverConfig.smtpPort} (SSL/TLS) o ${serverConfig.submissionPort} (STARTTLS)
  - Autenticación: Requerida (mismo usuario y contraseña)
• Formato de usuario: tu.nombre@${serverConfig.domain}
• Webmail corporativo: https://${serverConfig.mailHostname}
=================================================`;

    navigator.clipboard.writeText(text);
    setCopiedSettings(true);
    setTimeout(() => setCopiedSettings(false), 3000);
    showNotification("Parámetros copiados al portapapeles");
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-gray-100 flex flex-col">
      
      {/* ── Barra Superior (Header) ── */}
      <header className="border-b border-white/10 bg-[#0D1635]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo y Título */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0D1635] to-[#162758] border border-[#6EC1E4]/40 flex items-center justify-center text-[#6EC1E4] shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">Arbyc Seguridad</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6EC1E4]/20 text-[#6EC1E4] border border-[#6EC1E4]/30 uppercase">
                  Admin Panel
                </span>
              </div>
              <p className="text-xs text-gray-400">Administración de Correos · @{serverConfig.domain}</p>
            </div>
          </div>

          {/* Acciones de la derecha */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{admin?.email || "admin@arbycseguridad.cl"}</span>
            </div>

            {/* Botón Ver Sitio Web */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", "/");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="text-xs px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
              title="Volver a la landing web pública"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">Ver Sitio Web</span>
            </a>

            {/* Botón Cerrar Sesión */}
            <button
              onClick={onLogout}
              className="text-xs px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Salir</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── Notificación Toast Flotante ── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border text-sm flex items-center gap-2.5 ${
            notification.type === "error"
              ? "bg-red-950 border-red-500 text-red-200"
              : "bg-[#0D1635] border-[#6EC1E4] text-[#6EC1E4]"
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* ── Contenido Principal ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* ── Fila de Métricas y Estadísticas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-[#0D1635]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Casillas Activas</span>
              <div className="w-8 h-8 rounded-lg bg-[#6EC1E4]/10 text-[#6EC1E4] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">{mailboxes.length}</p>
            <p className="text-[11px] text-gray-400 mt-1">En el dominio @{serverConfig.domain}</p>
          </div>

          <div className="bg-[#0D1635]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Almacenamiento Usado</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">{formatSize(totalUsedMb)}</p>
            <p className="text-[11px] text-gray-400 mt-1">Almacenamiento en volumen local /vmail</p>
          </div>

          <div className="bg-[#0D1635]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alerta de Cuota (≥90%)</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${criticalCount > 0 ? "bg-red-500/20 text-red-400" : "bg-white/5 text-gray-400"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">{criticalCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">{criticalCount > 0 ? "Cuentas requieren ampliación" : "Todas las cuentas en rango seguro"}</p>
          </div>

        </div>

        {/* ── Cuadro de Datos de Conexión Estándar para el Personal ── */}
        <div className="bg-gradient-to-r from-[#0D1635] via-[#101C46] to-[#0D1635] border border-[#6EC1E4]/30 rounded-2xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6EC1E4]"></span>
                <h2 className="text-sm font-bold text-white tracking-wide uppercase">Parámetros de Conexión de Correo</h2>
              </div>
              <p className="text-xs text-gray-300">
                Datos oficiales para configurar Outlook, iPhone, Android o Thunderbird del personal de la empresa:
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs">
                <span className="text-gray-400">Servidor (Host): <strong className="text-white font-mono">{serverConfig.mailHostname}</strong></span>
                <span className="text-gray-400">IMAP (Entrante): <strong className="text-[#6EC1E4] font-mono">{serverConfig.imapPort} SSL/TLS</strong></span>
                <span className="text-gray-400">SMTP (Saliente): <strong className="text-[#6EC1E4] font-mono">{serverConfig.smtpPort} SSL/TLS</strong></span>
                <span className="text-gray-400">Webmail: <a href={`https://${serverConfig.mailHostname}`} target="_blank" rel="noreferrer" className="text-[#6EC1E4] hover:underline font-mono">https://{serverConfig.mailHostname}</a></span>
              </div>
            </div>

            <button
              onClick={handleCopyStandardSettings}
              className="px-4 py-2.5 rounded-xl bg-[#6EC1E4]/10 hover:bg-[#6EC1E4]/20 border border-[#6EC1E4]/40 text-[#6EC1E4] hover:text-white text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              {copiedSettings ? (
                <>
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-300">¡Copiado!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Copiar Parámetros para Usuarios</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Barra de Búsqueda y Botón Nueva Casilla ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por correo o funcionario..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#6EC1E4] text-xs"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchMailboxes}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Actualizar lista de casillas"
            >
              <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#6EC1E4] hover:bg-[#82CEF0] text-[#0D1635] font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#6EC1E4]/20 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Crear Nueva Casilla</span>
            </button>
          </div>

        </div>

        {/* ── Tabla de Casillas ── */}
        <div className="bg-[#0D1635]/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Casilla / Correo</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Funcionario</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 w-52">Uso de Cuota</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-gray-200">
                {loading && mailboxes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#6EC1E4] border-t-transparent rounded-full animate-spin"></div>
                        <span>Cargando casillas del servidor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredMailboxes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400">
                      No se encontraron casillas que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredMailboxes.map((mbox) => {
                    const isOverLimit = mbox.usagePercent >= 90;
                    const isWarning = mbox.usagePercent >= 70;

                    return (
                      <tr key={mbox.email} className="hover:bg-white/[0.02] transition-colors">
                        
                        {/* Correo */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#6EC1E4]/10 text-[#6EC1E4] font-bold flex items-center justify-center text-xs shrink-0 border border-[#6EC1E4]/20 uppercase">
                              {mbox.username.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-white font-mono">{mbox.email}</p>
                              <p className="text-[11px] text-gray-400 md:hidden">{mbox.name}</p>
                            </div>
                          </div>
                        </td>

                        {/* Nombre del Funcionario */}
                        <td className="py-3.5 px-4 hidden md:table-cell text-gray-300">
                          {mbox.name}
                        </td>

                        {/* Estado */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Activa
                          </span>
                        </td>

                        {/* Barra de Cuota */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                              <span>{formatSize(mbox.usedMb)}</span>
                              <span>{formatSize(mbox.quotaMb)} ({mbox.usagePercent}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isOverLimit
                                    ? "bg-red-500"
                                    : isWarning
                                    ? "bg-amber-400"
                                    : "bg-[#6EC1E4]"
                                }`}
                                style={{ width: `${Math.min(mbox.usagePercent, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Cambiar Contraseña */}
                            <button
                              onClick={() => setSelectedMailboxForPass(mbox)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#6EC1E4] hover:bg-white/5 transition-colors cursor-pointer"
                              title="Cambiar contraseña de esta casilla"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                              </svg>
                            </button>

                            {/* Eliminar */}
                            <button
                              onClick={() => setSelectedMailboxForDelete(mbox)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Eliminar casilla"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
          </div>
        </div>

      </main>

      {/* ── Pie de Página ── */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-gray-500">
        Arbyc Seguridad · Servidor de Correo Corporativo ({serverConfig.domain}) · v2.0
      </footer>

      {/* ── Modales ── */}
      <NewMailboxModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={(newBox) => {
          setMailboxes((prev) => [newBox, ...prev]);
          showNotification(`Casilla ${newBox.email} creada con éxito`);
        }}
        token={token}
        domain={serverConfig.domain}
        mailHostname={serverConfig.mailHostname}
      />

      <ChangePasswordModal
        isOpen={!!selectedMailboxForPass}
        mailbox={selectedMailboxForPass}
        onClose={() => setSelectedMailboxForPass(null)}
        onUpdated={(email) => {
          showNotification(`Contraseña de ${email} actualizada`);
        }}
        token={token}
      />

      <DeleteMailboxModal
        isOpen={!!selectedMailboxForDelete}
        mailbox={selectedMailboxForDelete}
        onClose={() => setSelectedMailboxForDelete(null)}
        onDeleted={(email) => {
          setMailboxes((prev) => prev.filter((m) => m.email !== email));
          showNotification(`Casilla ${email} eliminada correctamente`);
        }}
        token={token}
      />

    </div>
  );
}
