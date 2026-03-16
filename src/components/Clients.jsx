import React, { useState, useEffect, useMemo } from "react";
import FallbackImage from "./FallbackImage";

// Use Vite proxy - this will forward to backend
// In dev: /api -> http://localhost:3001/api
// In prod: /api -> production backend
const API_BASE = "/api";

// Helper: encode URL untuk handle spasi dan karakter khusus
const encodeUrl = (url) => {
  if (!url) return "";
  // Jika sudah ada %20 atau encoding lain, jangan encode ulang
  if (url.includes("%")) return url;

  try {
    // Encode hanya spasi dan karakter khusus yang perlu
    return url.split(" ").join("%20");
  } catch {
    return url;
  }
};

const normalizeImageUrl = (url) => {
  if (!url) return null;
  // Encode URL jika ada spasi
  const encoded = encodeUrl(url);
  return encoded.startsWith("/images/") ? encoded : encoded;
};

const Clients = () => {
  const showAll = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname === "/klien";
    }
    return false;
  }, []);

  const [clientLogos, setClientLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientLogos = async () => {
      try {
        console.log(
          "[Clients] Fetching from:",
          `${API_BASE}/images/klien?published=true`,
        );

        const res = await fetch(`${API_BASE}/images/klien?published=true`);

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        console.log("[Clients] API Response:", data);

        if (data.success && data.images && data.images.length > 0) {
          // Filter images yang published=true dan filenya ada
          const validLogos = data.images
            .filter((img) => img.published === true)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((img, idx) => ({
              name: img.title,
              url: normalizeImageUrl(img.url),
              originalIndex:
                img.order !== undefined && img.order !== null ? img.order : idx,
            }))
            .filter((logo) => logo.url);

          if (validLogos.length > 0) {
            console.log("[Clients] Using API logos:", validLogos.length);
            setClientLogos(validLogos);
          } else {
            console.log("[Clients] No valid logos found");
          }
        } else {
          console.log("[Clients] No API data found");
        }
      } catch (error) {
        console.error("[Clients] Error fetching logos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientLogos();
  }, []);

  const displayLogos = clientLogos;

  const getLogoStyle = (index) => {
    if (index === 13)
      return "w-[90px] md:w-[110px] h-auto object-contain transition-transform hover:scale-105 duration-300";
    if ([16, 17, 18, 19].includes(index))
      return "w-[130px] md:w-[160px] h-auto object-contain transition-transform hover:scale-105 duration-300";
    if (index === 20)
      return "w-[45px] md:w-[60px] h-auto object-contain transition-transform hover:scale-105 duration-300";
    if (index === 21 || index === 22)
      return "w-[65px] md:w-[85px] h-auto object-contain transition-transform hover:scale-105 duration-300";
    if ([8, 9, 12].includes(index))
      return "w-[200px] md:w-[240px] h-auto object-contain transition-transform hover:scale-105 duration-300";
    if ([6, 7].includes(index))
      return "w-[190px] md:w-[225px] h-auto object-contain transition-transform hover:scale-105 duration-300";
    if (index === 3 || index === 4)
      return "w-[170px] md:w-[215px] px-6 h-auto object-contain transition-transform hover:scale-110 duration-300";
    if (index >= 0 && index <= 2)
      return "w-[150px] md:w-[185px] px-8 h-auto object-contain transition-transform hover:scale-105 duration-300";
    return "w-[180px] md:w-[220px] h-auto object-contain transition-transform hover:scale-105 duration-300";
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative py-20 overflow-hidden border-t border-slate-100 bg-white font-sans">
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight font-['Montserrat'] uppercase mb-4 text-slate-900">
            KLIEN <span className="text-blue-600">KAMI .</span>
          </h2>
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (displayLogos.length === 0) {
    return (
      <section className="relative py-20 overflow-hidden border-t border-slate-100 bg-white font-sans">
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight font-['Montserrat'] uppercase mb-4 text-slate-900">
            KLIEN <span className="text-blue-600">KAMI .</span>
          </h2>
          <p className="text-gray-500">
            Belum ada logo klien. Silakan upload dari admin panel.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 overflow-hidden border-t border-slate-100 bg-white font-sans">
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight font-['Montserrat'] uppercase mb-4 text-slate-900">
          KLIEN <span className="text-blue-600">KAMI .</span>
        </h2>

        <p className="text-gray-500 text-base md:text-lg font-medium mb-16 max-w-2xl mx-auto">
          Beberapa perusahaan dan instansi yang menggunakan layanan kami
        </p>

        {showAll ? (
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-20">
            {displayLogos.map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-24 md:h-32 w-[45%] sm:w-1/4 lg:w-1/5"
              >
                <FallbackImage
                  src={client.url}
                  alt={client.name}
                  className={getLogoStyle(client.originalIndex)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap py-4">
              {[...displayLogos, ...displayLogos].map((client, index) => {
                return (
                  <div
                    key={index}
                    className="mx-6 flex items-center justify-center flex-shrink-0"
                  >
                    <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 h-24 md:h-28 flex items-center justify-center min-w-[240px]">
                      <FallbackImage
                        src={client.url}
                        alt={client.name}
                        className={getLogoStyle(client.originalIndex)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
          </div>
        )}
      </div>

      {!showAll && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
              .animate-marquee { display: flex; width: fit-content; animation: marquee 40s linear infinite; }
              .animate-marquee:hover { animation-play-state: paused; }
            `,
          }}
        />
      )}
    </section>
  );
};

export default Clients;
