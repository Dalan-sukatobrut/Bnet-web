import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import FallbackImage from "../components/FallbackImage";
import { authApiCall } from "../config/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authApiCall("/admin-portal/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!data.success) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Setelah registrasi berhasil, arahkan ke halaman login
      alert("✅ Registrasi berhasil! Silakan login untuk melanjutkan.");
      navigate("/login");
    } catch (err) {
      console.error("Register Error:", err);
      setError(`Terjadi kesalahan: ${err.message}`);
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create Account.
            </h1>
            <p className="text-gray-600 text-sm">
              Sign up to get started with BNetID
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
              <p className="text-sm font-medium">❌ {error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 hover:bg-white"
                placeholder="Username or Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

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
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 hover:bg-white pr-10"
                  placeholder="Minimum 6 characters"
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

            {/* Terms Checkbox */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <Link to="#" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </Link>
              </span>
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{" "}
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
