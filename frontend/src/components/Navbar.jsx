import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import FallbackImage from "./FallbackImage";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Daftar navigasi utama
  const navItems = [
    { name: "Beranda", path: "/", id: "beranda" },
    { name: "Layanan", path: "/layanan", id: "layanan" },
    { name: "Produk", path: "/produk", id: "produk" },
    { name: "Klien", path: "/klien", id: "klien" },
    { name: "Kontak", path: "/kontak", id: "kontak" },
  ];

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setOpen(false);

    document.title =
      item.name === "Beranda"
        ? "BNet | Celebes Media Jaringan"
        : `BNet | Celebes Media Jaringan - ${item.name}`;

    if (location.pathname === item.path) {
      const element = document.getElementById(item.id);
      if (element) {
        const offset = 80;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    } else {
      navigate(item.path);
    }
  };

  useEffect(() => {
    if (location.pathname === "/tentang-kami") {
      document.title = "BNet | Celebes Media Jaringan - Tentang Kami";
    }
  }, [location]);

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl font-sans">
      <div className="w-full h-20 px-6 md:px-10 flex items-center justify-between">
        {/* Logo - Bnet ID */}
        <div
          onClick={(e) => handleNavClick(e, navItems[0])}
          className="flex items-center cursor-pointer group"
        >
          <FallbackImage
            src="/images/clients/logo-bnet.png"
            alt="BNet Logo"
            className="h-12 md:h-16 w-auto transition-transform group-hover:scale-105"
          />
        </div>

        {/* Desktop Menu - Menghapus class 'uppercase' */}
        <div className="hidden md:flex items-center space-x-8 text-[15px] lg:text-[16px] font-semibold tracking-wide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative px-2 py-1 transition-all duration-300
                  ${isActive ? "text-yellow-400" : "text-white/90 hover:text-yellow-400"}
                `}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-yellow-400 transition-all duration-300
                    ${isActive ? "w-full" : "w-0 hover:w-full"}
                  `}
                />
              </a>
            );
          })}

          {/* Link Khusus Tentang Kami - Menghapus class 'uppercase' */}
          <Link
            to="/tentang-kami"
            onClick={() => setOpen(false)}
            className={`relative px-4 py-2 rounded-lg border border-white/10 transition-all duration-300 ${
              location.pathname === "/tentang-kami"
                ? "text-yellow-400 border-yellow-400/50 bg-yellow-400/5"
                : "text-white/90 hover:text-yellow-400 hover:border-yellow-400/50"
            }`}
          >
            Tentang Kami
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu - Menghapus class 'uppercase' */}
      <div
        className={`md:hidden absolute top-20 inset-x-0 bg-[#0f172a] border-t border-white/10 transition-all duration-300 shadow-2xl
          ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
        `}
      >
        <div className="flex flex-col py-6">
          {[
            ...navItems,
            { name: "Tentang Kami", path: "/tentang-kami", id: "tentang-kami" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.path}
              onClick={(e) => handleNavClick(e, item)}
              className={`px-8 py-3 text-sm sm:text-base font-semibold tracking-wide transition-all
                  ${
                    location.pathname === item.path
                      ? "text-yellow-400 bg-white/5 border-l-4 border-yellow-400"
                      : "text-white/80 hover:text-yellow-400 hover:bg-white/5"
                  }
                `}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
