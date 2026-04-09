import React from "react";
import { Zap, ShieldCheck, Headphones, Tag } from "lucide-react";

const Features = () => {
  const dataFeatures = [
    {
      title: "Internet Cepat",
      desc: "Koneksi internet berkecepatan tinggi dengan teknologi fiber optik terbaru.",
      icon: (
        <Zap
          className="text-blue-600 group-hover:text-white transition-colors"
          size={24}
        />
      ),
    },
    {
      title: "Legal & Terpercaya",
      desc: "Didukung oleh izin resmi dari Dirjen PPI dan memiliki NIB resmi.",
      icon: (
        <ShieldCheck
          className="text-blue-600 group-hover:text-white transition-colors"
          size={24}
        />
      ),
    },
    {
      title: "Harga Terbaik",
      desc: "Paket internet kompetitif dengan berbagai pilihan sesuai kebutuhan bisnis Anda.",
      icon: (
        <Tag
          className="text-blue-600 group-hover:text-white transition-colors"
          size={24}
        />
      ),
    },
    {
      title: "Support 24/7",
      desc: "Tim support profesional siap membantu menangani kendala Anda kapan saja.",
      icon: (
        <Headphones
          className="text-blue-600 group-hover:text-white transition-colors"
          size={24}
        />
      ),
    },
  ];

  return (
    /* font-sans (Inter) untuk keterbacaan teks panjang yang luar biasa */
    <section
      id="keunggulan"
      className="relative h-auto w-full flex items-center justify-center bg-[#f0f9ff] overflow-hidden py-16 px-6 sm:px-8 md:px-12 font-sans"
    >
      {/* SMOOTH EDGE SEAMLESS */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10" />

      <div className="container mx-auto max-w-7xl relative z-20">
        {/* JUDUL - Montserrat untuk kesan geometris dan kokoh */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[900] text-[#0f172a] mb-4 tracking-tighter leading-tight font-['Montserrat']">
            Mengapa Memilih <br />
            <span className="text-blue-600 italic">
              Celebes Media Jaringan?
            </span>
          </h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataFeatures.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-5 p-6 rounded-[30px] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Ikon (Kiri) */}
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                {item.icon}
              </div>

              {/* Teks (Kanan) */}
              <div className="flex flex-col gap-1">
                <h3 className="text-lg md:text-xl font-[800] text-slate-900 font-['Montserrat'] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[14px] md:text-[15px] leading-relaxed font-medium text-slate-500 group-hover:text-slate-600 transition-colors">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
