import React from "react";
// Tetap menggunakan import dari folder assets
import logoKominfo from "../assets/kominfo.png";
import logoApjii from "../assets/apjii.png";
import FallbackImage from "./FallbackImage";

const Collaboration = () => {
  const partners = [
    {
      name: "KOMINFO",
      logo: logoKominfo,
      desc: `Layanan BNet didukung oleh izin resmi dari Dirjen PPI dengan Nomor Izin Jartaplok: 249/TEL.01.02/2020.
PT Celebes Media Jaringan sebagai badan hukum terdaftar memiliki NIB: 9120205822526.`,
    },
    {
      name: "APJII",
      logo: logoApjii,
      desc: "Celebes Media Jaringan bergabung dan menjadi anggota resmi APJII sejak tahun 2017 untuk membangun jangkauan akses internet cepat khususnya di Indonesia Timur",
    },
  ];

  return (
    /* font-sans (Inter) digunakan sebagai dasar untuk kenyamanan mata pembaca senior */
    <section className="bg-[#0f172a]/5 py-24 px-6 border-t border-slate-200/50 font-['Inter',sans-serif]">
      <div className="container mx-auto">
        {/* Judul Section - Ukuran font sedikit diperkecil untuk keseimbangan visual */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-[900] text-[#0f172a] mb-4 tracking-tighter font-['Montserrat'] uppercase">
            Kolaborasi dan <span className="text-blue-600">Keanggotaan</span>
            <span className="text-blue-600">.</span>
          </h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Grid Kartu Kolaborasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {partners.map((item, index) => (
            <div
              key={index}
              className="bg-white p-10 md:p-14 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500"
            >
              {/* Logo Container */}
              <div className="h-32 flex items-center justify-center mb-10">
                <FallbackImage
                  src={item.logo}
                  alt={item.name}
                  className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Deskripsi - Tetap ramah bagi mata senior */}
              <p className="text-slate-500 text-[16px] md:text-[18px] font-medium leading-relaxed max-w-md italic border-t border-slate-100 pt-8">
                "{item.desc}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collaboration;
