import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Wifi, WifiOff, Loader2 } from "lucide-react";
import {
  authApiCall,
  setUser,
  setToken,
  checkBackendHealth,
} from "../config/api";
import FallbackImage from "../components/FallbackImage";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");

  // Check backend status on mount
  useEffect(() => {
    const checkBackend = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? "online" : "offline");
    };
    checkBackend();

    // Recheck every 10 seconds
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Double check backend status before login
    const isBackendOnline = await checkBackendHealth();
    if (!isBackendOnline) {
      setError(
        "❌ Backend tidak dapat diakses! Pastikan server sudah running (port 3001)",
      );
      setLoading(false);
      return;
    }

    try {
      console.log("[Login] Attempting login to:", formData.email);

      const data = await authApiCall("/admin-portal/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!data.success) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Simpan token dan user ke localStorage
      if (data.token) {
        setToken(data.token);
      }
      setUser(data.user);

      alert("✅ Login berhasil!");
      navigate("/admin/panel");
    } catch (error) {
      console.error("[Login] Error:", error);

      // Provide more specific error messages
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        setError(
          "❌ Tidak dapat terhubung ke backend. Pastikan server running di http://localhost:3001",
        );
      } else if (error.message.includes("Backend tidak dapat diakses")) {
        setError(
          "❌ Backend tidak dapat diakses. Restart server dengan `npm run server`",
        );
      } else {
        setError(`❌ Terjadi kesalahan: ${error.message}`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Blue Background with Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative Waves */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute bottom-0 left-0 w-full h-full"
            viewBox="0 0 1200 1200"
            preserveAspectRatio="none"
          >
            <path
              d="M0,400 Q300,300 600,400 T1200,400 L1200,1200 L0,1200 Z"
              fill="white"
            />
            <path
              d="M0,600 Q300,500 600,600 T1200,600 L1200,1200 L0,1200 Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Logo and Tagline */}
        <div className="relative z-10 text-center text-white max-w-md">
          <FallbackImage
            src="/images/clients/logo-bnet.png"
            alt="BNet Logo"
            className="h-32 w-auto mx-auto mb-8"
          />

          <div className="mt-8 w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Admin Panel.
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your email and password to access your account
            </p>
            {/* Backend Status Indicator */}
            <div className="mt-3 flex items-center gap-2">
              {backendStatus === "checking" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-xs text-gray-400">
                    Checking backend...
                  </span>
                </>
              ) : backendStatus === "online" ? (
                <>
                  <Wifi className="sr-only" />
                  <span className="sr-only">Backend Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">
                    Backend Offline - Login may fail
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
              <p className="text-sm font-medium">❌ {error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 hover:bg-white"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 hover:bg-white pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
