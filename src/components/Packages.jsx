import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Building2,
  CheckCircle2,
  Calendar,
  Home,
  ArrowRight,
} from "lucide-react";
import FallbackImage from "./FallbackImage";

const API_BASE = "/api";

// Helper function untuk normalisasi URL gambar
const normalizeImageUrl = (url) => {
  if (!url) return null;

  // Jika sudah URL absolut, langsung return
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Jika URL gambar dari uploads (database API) → langsung gunakan /images/uploads/
  // Server sudah diset untuk serve /images/uploads dari src/public/images/uploads
  if (url.startsWith("/images/uploads/")) {
    return url;
  }

  // Untuk gambar statis di public folder → langsung gunakan dari Vite dev server
  return url;
};

const Packages = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [plans, setPlans] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  // Default plans sebagai fallback - memoized
  const defaultPlans = useMemo(
    () => [
      {
        title: "2BeHome",
        image: "/images/clients/layanan4.png",
        desc: "Produk internet Fiber to the home untuk klien ritel dengan harga yang terjangkau dan kecepatan yang stabil.",
        features: ["Fiber to home", "Unlimited quota", "Free instalasi"],
        link: "https://mywifi.b-net.id/",
      },
      {
        title: "FourNet",
        image: "/images/clients/layanan1.png",
        desc: "Layanan enterprise untuk solusi bisnis dengan kecepatan, performa internet stabil, SLA, dan dukungan teknis 24 jam.",
        features: [
          "Bandwidth sesuai permintaan",
          "CIR Ratio 1:1",
          "Service Level Agreement",
          "IP Public & Support 24/7",
        ],
        link: "https://wa.me/6281144400723?text=Halo%20Admin,%20saya%20ingin%20daftar%20layanan%20FourNet",
      },
      {
        title: "FourNet Lite",
        image: "/images/clients/layanan2.png",
        desc: "Layanan broadband untuk solusi bisnis small & middle dengan performa stabil dan dukungan teknis 24 jam.",
        features: [
          "Bandwidth sesuai permintaan",
          "CIR Ratio 1:4",
          "Service Level Agreement",
          "Support 24 jam",
        ],
        link: "https://wa.me/6281144400723?text=Halo%20Admin,%20saya%20ingin%20daftar%20layanan%20FourNet%20Lite",
      },
      {
        title: "Bandwidth On Demand",
        image: "/images/clients/layanan3.png",
        desc: "Layanan internet harian untuk solusi event online/streaming dengan kapasitas tinggi dan performa stabil.",
        features: [
          "Bandwidth sesuai permintaan",
          "CIR Ratio 1:1",
          "IP Public",
          "SLA 99% & Support 24 jam",
        ],
        link: "https://wa.me/6281144400723?text=Halo%20Admin,%20saya%20ingin%20daftar%20layanan%20Bandwidth%20On%20Demand",
      },
    ],
    [],
  );

  const specialLinks = {
    "2BeHome": "https://mywifi.b-net.id/",
    // Add more special cases here as needed
  };

  // rest of code same as read_file
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch gambar dari API
  useEffect(() => {
    const fetchLayananImages = async () => {
      try {
        console.log(
          "[Packages] Fetching from:",
          `${API_BASE}/images/layanan?published=true`,
        );
        const res = await fetch(`${API_BASE}/images/layanan?published=true`);
        const data = await res.json();
        console.log("[Packages] API Response:", data);

        if (data.success && data.images && data.images.length > 0) {
          // Urutkan berdasarkan field order
          const sortedImages = data.images.sort((a, b) => a.order - b.order);

          // Map API images ke format plans - gunakan normalizeImageUrl
          // Hanya gunakan gambar yang file-nya ada di server
          const apiPlans = sortedImages
            .filter((img) => img.fileExists !== false) // Filter file yang ada
            .map((img) => ({
              title: img.title,
              image: normalizeImageUrl(img.url),
              desc:
                img.description ||
                "Layanan internet berkualitas tinggi dari BNetID.",
              features: img.alt
                ? img.alt.split(",").map((f) => f.trim())
                : ["Layanan Profesional", "Support 24/7"],
              link:
                specialLinks[img.title] ||
                `https://wa.me/6281144400723?text=Halo%20Admin,%20saya%20ingin%20daftar%20layanan%20${encodeURIComponent(img.title || "BNetID")}`,
            }));

          console.log("[Packages] Using API plans:", apiPlans);

          // Hanya gunakan API plans jika ada yang valid
          if (apiPlans.length > 0) {
            setPlans(apiPlans);
          } else {
            console.log("[Packages] No valid files, using defaults");
            setPlans(defaultPlans);
          }
        } else {
          console.log("[Packages] Using default plans - no API data");
          // Jika API kosong, gunakan default
          setPlans(defaultPlans);
        }
      } catch (error) {
        console.error("[Packages] Error fetching images:", error);
        setPlans(defaultPlans);
      } finally {
        setLoading(false);
      }
    };

    fetchLayananImages();
  }, [defaultPlans]);

  // Render plans - prioritize API with specials first, then defaults
  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <section
      ref={sectionRef}
      id="layanan"
      // PERBAIKAN: Mengganti lg:h-screen menjadi min-h-screen agar tidak terpotong
      className="bg-[#f8fafc] min-h-screen w-full flex flex-col items-center py-12 md:py-20 px-4 sm:px-8 md:px-12 relative font['Inter',sans-serif]"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .reveal-card { opacity: 0; }
        .reveal-card.active {
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        /* Card tanpa gambar - gunakan min-height untuk jaga konsistensi */
        .reveal-card.no-image .p-5 {
          padding-top: 1.5rem !important;
        }
      `,
        }}
      />

      <div className="container mx-auto max-w-[1400px] flex flex-col h-full">
        {/* Header */}
        <div
          className={`text-center mb-10 shrink-0 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight font-['Montserrat'] uppercase">
            Layanan <span className="text-blue-600">Kami .</span>
          </h2>
          <div
            className={`w-16 md:w-20 h-1.5 bg-blue-600 mx-auto mt-3 rounded-full transition-all duration-1000 delay-300 ${
              isVisible ? "w-16 md:w-20 opacity-100" : "w-0 opacity-0"
            }`}
          ></div>
        </div>

        {/* Grid - Menggunakan auto-rows-fr agar tinggi kartu seragam secara otomatis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayPlans.map((plan, index) => (
            <div
              key={index}
              className={`reveal-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xl flex flex-col group transition-all duration-300 min-h-[480px] ${
                isVisible ? "active" : ""
              }`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              {/* Image Section - Selalu render container untuk menjaga konsistensi tinggi */}
              <div
                className={`relative aspect-[16/10] overflow-hidden shrink-0 ${!plan.image ? "bg-slate-100" : ""}`}
              >
                {plan.image ? (
                  <>
                    <FallbackImage
                      src={plan.image}
                      alt={plan.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      fallback={
                        defaultPlans[index]?.image ||
                        "/images/clients/layanan1.png"
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur p-2 rounded-xl shadow-lg">
                      {index === 0 ? (
                        <Home size={16} className="text-blue-600" />
                      ) : index === 3 ? (
                        <Calendar size={16} className="text-blue-600" />
                      ) : (
                        <Building2 size={16} className="text-blue-600" />
                      )}
                    </div>
                  </>
                ) : (
                  // Placeholder tetap visible tapi tanpa gambar
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <Building2 size={40} className="text-slate-300" />
                  </div>
                )}
              </div>

              {/* Konten - Menggunakan flex-grow untuk mendorong tombol ke bawah */}
              <div className="p-5 md:p-6 flex flex-col flex-grow bg-white">
                <div className="mb-4">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 uppercase tracking-tight font-['Montserrat'] group-hover:text-blue-600 transition-colors">
                    {plan.title}
                  </h3>
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      {plan.desc}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col flex-grow border-t border-slate-100 pt-4 mt-auto">
                  <span className="text-[11px] md:text-[12px] font-black text-slate-900 uppercase tracking-widest mb-3 block font-['Montserrat']">
                    DETAIL PAKET
                  </span>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-slate-700 font-bold text-xs md:text-sm tracking-wide"
                      >
                        <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="opacity-95 leading-tight group-hover:text-slate-900 transition-colors">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tombol - Menggunakan mt-auto agar selalu sejajar di paling bawah */}
                  <a
                    href={plan.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-4 px-4 bg-slate-900 text-white rounded-xl font-bold text-xs md:text-sm hover:bg-blue-600 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 group/btn mt-auto"
                  >
                    Daftar {plan.title}
                    <ArrowRight
                      size={16}
                      className="ml-2 transform group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
