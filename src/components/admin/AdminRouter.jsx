import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminRouter() {
  const [token, setToken] = useState(() => localStorage.getItem("arbyc_admin_token"));
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar validez del token al cargar
  useEffect(() => {
    async function checkSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/admin/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.data?.user || { email: "admin@arbycseguridad.cl" });
        } else {
          // Token inválido o expirado
          localStorage.removeItem("arbyc_admin_token");
          setToken(null);
          setAdminUser(null);
        }
      } catch (err) {
        console.error("Error verificando sesión:", err);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [token]);

  const handleLoginSuccess = (newToken, user) => {
    localStorage.setItem("arbyc_admin_token", newToken);
    setToken(newToken);
    setAdminUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("arbyc_admin_token");
    setToken(null);
    setAdminUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F24] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-10 h-10 border-4 border-[#6EC1E4] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Verificando credenciales administrativas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B19] text-gray-100 font-sans selection:bg-[#6EC1E4] selection:text-[#0D1635]">
      {!token ? (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AdminDashboard admin={adminUser} token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}
