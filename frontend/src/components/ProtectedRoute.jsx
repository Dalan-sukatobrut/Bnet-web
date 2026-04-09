import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiCall } from "../config/api.js";

export function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiCall("/admin-portal/me", { method: "GET" });
        if (mounted) {
          // Semua user yang login bisa akses admin panel
          const ok = !!res?.success;
          setAllowed(ok);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setAllowed(false);
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;

  if (!allowed) {
    // Bersihkan token lama jika ada (kompat dengan versi lama yang menyimpan token di localStorage)
    try {
      localStorage.removeItem("token");
    } catch {
      // ignore
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
