import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import FallbackImage from "../components/FallbackImage";
export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Invalid Link
          </h1>
          <p className="text-gray-600 mb-6">
            The reset password link is invalid or has expired.
          </p>
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi password
    if (formData.password.length < 6) {
      setError("Password harus minimal 6 karakter");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/admin-portal/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-portal-key": "bnet-secure-portal-key-2025",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            token,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Gagal reset password");
        setLoading(false);
        return;
      }

      setSuccess(
        "✅ Password berhasil direset! Silakan login dengan password baru.",
      );
      setFormData({ password: "", confirmPassword: "" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan. Pastikan backend sudah running.");
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
          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Login
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your new password below. Make sure it's at least 6
              characters long.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
              <p className="text-sm font-medium">❌ {error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5">
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 hover:bg-white pr-10"
                  placeholder="Enter new password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 hover:bg-white pr-10"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {/* Back to Sign In */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
