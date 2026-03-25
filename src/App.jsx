import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
  Outlet,
} from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { MapPin } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FallbackImage from "./components/FallbackImage";
import AboutUs from "./components/AboutUs";
import Features from "./components/Features";
import Solutions from "./components/Solutions";
import Packages from "./components/Packages";
import Collaboration from "./components/Collaboration";
import ContactCTA from "./components/ContactCTA";
import Clients from "./components/Clients";
import ImageGallery from "./components/ImageGallery";
import SEO from "./components/SEO";

import Login from "./Login/Login.jsx";
import Register from "./Login/Register.jsx";
import ForgotPassword from "./Login/ForgotPassword.jsx";
import ResetPassword from "./Login/ResetPassword.jsx";
import AuthLayout from "./Login/AuthLayout.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const FullHomePage = () => {
  return (
    <>
      <SEO
        title="Beranda"
        description="BNet.id - Celebes Media Jaringan. Penyedia layanan WiFi industri dan bisnis terbaik di Makassar, Sulawesi Selatan. Layanan internet fiber optic, VPS, colocation, dan solusi jaringan profesional dengan SLA 99% dan support 24/7."
        keywords="wifi industri makassar, internet bisnis sulawesi, layanan ISP makassar, wifi kantor, fiber optic makassar, VPS makassar, colocation server, internet industri, jaringan komputer, BNet id"
        ogType="website"
      />
      <div id="beranda" className="scroll-mt-20">
        <Hero />
      </div>
      <div id="keunggulan" className="scroll-mt-20">
        <Features />
      </div>
      <div id="produk" className="scroll-mt-20">
        <Solutions />
      </div>
      <div id="layanan" className="scroll-mt-20">
        <Packages />
      </div>
      <div id="kolaborasi" className="scroll-mt-20">
        <Collaboration />
      </div>
      <div id="kontak" className="scroll-mt-20">
        <ContactCTA />
      </div>
      <div id="klien" className="scroll-mt-20">
        <Clients />
      </div>
    </>
  );
};

const MainLayout = () => {
  return (
    <div className="antialiased font-sans bg-white selection:bg-blue-100 selection:text-blue-600">
      <ScrollToTop />
      <Navbar />
      <main className="pt-16 md:pt-20 min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />

      <div className="fixed bottom-6 right-6 z-50 flex flex-row items-center gap-4">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Menara+Bosowa+Jl.+Jend.+Sudirman+No.5+Makassar"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-blue-600 transition-all duration-500 text-blue-600 hover:text-white"
        >
          <MapPin
            size={24}
            className="group-hover:rotate-12 transition-transform"
          />
        </a>

        <a
          href="https://wa.me/6281144400723"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-[#25D366] transition-all duration-500 text-[#25D366] hover:text-white"
        >
          <svg
            className="w-7 h-7 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-[#0f172a] text-white pt-10 pb-6 px-6 border-t border-slate-800">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        <div className="space-y-4">
          <FallbackImage
            src="/images/clients/logo-bnet2.png"
            alt="BNet Logo Footer"
            className="h-12 w-auto object-contain"
          />
          <div className="text-slate-400 text-sm space-y-1">
            <p className="font-bold text-yellow-400 text-base">
              0811 4440 0721
            </p>
            <p className="hover:text-white transition-colors cursor-pointer">
              info@b-net.id
            </p>
            <div className="pt-2 opacity-80 text-xs">
              <p className="font-semibold text-white">
                Menara Bosowa Lt 15, Unit H
              </p>
              <p>Jl. Jend. Sudirman No.7, Makassar</p>
              <p>Sulawesi Selatan, Indonesia. 90115</p>
            </div>
          </div>
        </div>

        <div className="md:pl-10">
          <h4 className="font-bold text-white text-base mb-4 border-l-4 border-yellow-400 pl-3">
            Tautan lainnya
          </h4>
          <ul className="text-sm space-y-2 text-slate-400 font-medium flex flex-col">
            <HashLink
              smooth
              to="/#beranda"
              className="hover:text-yellow-400 transition-colors w-fit"
            >
              Beranda
            </HashLink>
            <HashLink
              smooth
              to="/#layanan"
              className="hover:text-yellow-400 transition-colors w-fit"
            >
              Layanan
            </HashLink>
            <HashLink
              smooth
              to="/#produk"
              className="hover:text-yellow-400 transition-colors w-fit"
            >
              Produk
            </HashLink>
            <HashLink
              smooth
              to="/#klien"
              className="hover:text-yellow-400 transition-colors w-fit"
            >
              Klien
            </HashLink>
            <Link
              to="/tentang-kami"
              className="hover:text-yellow-400 transition-colors w-fit"
            >
              Tentang Kami
            </Link>
            <HashLink
              smooth
              to="/#kontak"
              className="hover:text-yellow-400 transition-colors w-fit"
            >
              Kontak
            </HashLink>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-base mb-4 border-l-4 border-yellow-400 pl-3">
            Terhubung kami
          </h4>
          <ul className="text-sm space-y-2 text-slate-400 font-medium">
            <li>
              <a
                href="https://www.linkedin.com/in/bnet-id-b29587136"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/bnetid"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/BNetIDInfo"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/channel/UCE34BvmZ3-BiXeJ4fsF03Nw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 pt-4 text-center">
        <p className="text-[12px] md:text-xs text-slate-300 font-bold tracking-widest">
          © 2026 PT Celebes Media Jaringan
        </p>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<FullHomePage />} />
          <Route
            path="/layanan"
            element={
              <>
                <SEO
                  title="Layanan"
                  description="Layanan WiFi industri dan bisnis dari BNet.id. Kami menyediakan internet fiber optic, VPS, colocation, dan solusi jaringan profesional untuk perusahaan di Makassar dan Sulawesi."
                  keywords="layanan wifi makassar, internet bisnis, fiber optic, VPS makassar, colocation server, jaringan komputer, internet industri"
                />
                <Packages />
              </>
            }
          />
          <Route
            path="/produk"
            element={
              <>
                <SEO
                  title="Produk"
                  description="Produk dan solusi teknologi dari BNet.id. Temukan berbagai produk internet dan jaringan yang sesuai dengan kebutuhan bisnis dan industri Anda."
                  keywords="produk wifi, solusi jaringan, internet bisnis, teknologi makassar, produk ISP"
                />
                <Solutions />
              </>
            }
          />
          <Route
            path="/klien"
            element={
              <>
                <SEO
                  title="Klien"
                  description="Portfolio klien BNet.id - various companies and organizations that trust us for their internet and networking solutions in Makassar and across Sulawesi."
                  keywords="klien BNet, portfolio, perusahaan mitra, referensi klien, portfolio ISP makassar"
                />
                <Clients />
              </>
            }
          />
          <Route
            path="/kontak"
            element={
              <>
                <SEO
                  title="Kontak"
                  description="Hubungi BNet.id untuk konsultasi layanan WiFi dan jaringan. Kami siap membantu kebutuhan internet bisnis dan industri Anda di Makassar, Sulawesi Selatan."
                  keywords="kontak BNet, hubungi kami, layanan wifi makassar, konsultasi internet"
                />
                <ContactCTA />
              </>
            }
          />
          <Route
            path="/tentang-kami"
            element={
              <>
                <SEO
                  title="Tentang Kami"
                  description="Tentang BNet.id - Celebes Media Jaringan. Kami adalah penyedia layanan WiFi dan internet industri terbaik di Makassar, Sulawesi Selatan dengan pengalaman bertahun-tahun."
                  keywords="tentang BNet, tentang kami, Celebes Media Jaringan, perusahaan ISP makassar, sejarah BNet"
                />
                <AboutUs />
              </>
            }
          />
          <Route
            path="/galeri"
            element={
              <>
                <SEO
                  title="Galeri"
                  description="Galeri proyek dan aktivitas BNet.id. Lihat portofolio layanan WiFi dan jaringan kami untuk berbagai klien di industri."
                  keywords="galeri BNet, portofolio proyek, gallery, proyek jaringan makassar"
                />
                <ImageGallery />
              </>
            }
          />
        </Route>

        <Route
          path="/LoginAdminPanel"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />

        <Route
          path="/admin/panel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
