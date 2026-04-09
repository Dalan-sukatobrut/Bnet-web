import React, { useEffect } from "react";
import { ShieldCheck, Globe, Zap } from "lucide-react";
import FallbackImage from "./FallbackImage";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative w-full min-h-[100svh] flex items-center overflow-hidden bg-slate-900 isolate -mt-16 md:-mt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0 min-h-[100svh]">
        <FallbackImage
          src="/images/clients/kami.png"
          alt="Tentang Kami Background"
          className="w-full h-full object-cover scale-105 md:scale-110 lg:scale-120 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-black/40"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-20 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* LEFT */}
          <div className="lg:w-1/2 flex flex-col items-start text-left">
            <h1
              className="
              text-white 
              text-4xl sm:text-5xl md:text-6xl lg:text-8xl 
              font-black tracking-tighter leading-none drop-shadow-2xl
            "
            >
              Tentang <br />
              <span className="text-white opacity-90">Kami</span>
              <span className="text-white inline-block animate-pulse ml-2">
                .
              </span>
            </h1>
            <div className="h-1.5 w-20 sm:w-24 bg-yellow-400 mt-5 sm:mt-6 rounded-full"></div>
          </div>

          {/* RIGHT CARD */}
          <div className="lg:w-1/2 w-full max-w-xl">
            <div className="relative group cursor-default">
              <div
                className="
                relative bg-white/10 backdrop-blur-lg lg:backdrop-blur-none
                p-5 sm:p-7 md:p-10 
                rounded-[28px] sm:rounded-[32px]
                text-white border border-white/20 shadow-2xl
                transition-all duration-500
              "
              >
                <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-5 sm:mb-6 flex items-center gap-3">
                  <span className="w-6 sm:w-8 h-1 bg-yellow-400 rounded-full"></span>
                  BNetid
                </h2>

                <div className="space-y-4 sm:space-y-5 text-slate-200 font-medium leading-snug text-[13px] sm:text-sm md:text-base">
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <Zap className="text-yellow-400 shrink-0 mt-1" size={18} />
                    <p>
                      <strong className="text-white">
                        PT Celebes Media Jaringan
                      </strong>{" "}
                      adalah ISP yang fokus pada inovasi infrastruktur digital
                      terkini.
                    </p>
                  </div>

                  <div className="flex gap-3 sm:gap-4 items-start">
                    <ShieldCheck
                      className="text-blue-400 shrink-0 mt-1"
                      size={18}
                    />
                    <p>
                      Beroperasi resmi dengan{" "}
                      <strong className="text-white">
                        Izin JARTAPLOK No. 249/TEL.01.02/2020
                      </strong>{" "}
                      dari Kominfo Republik Indonesia.
                    </p>
                  </div>

                  <div className="flex gap-3 sm:gap-4 items-start">
                    <Globe className="text-cyan-400 shrink-0 mt-1" size={18} />
                    <p>
                      Anggota resmi{" "}
                      <strong className="text-white">APJII</strong>, berkomitmen
                      memajukan ekosistem internet Indonesia yang stabil.
                    </p>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex items-center justify-between opacity-60 text-[9px] sm:text-[10px] tracking-widest font-black uppercase">
                  <span>Trust & Reliable</span>
                  <span>Est. 2017</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
