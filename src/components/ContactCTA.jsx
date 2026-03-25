import React from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  Headphones,
  ArrowUp,
  Sparkles,
  MapPin,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import FallbackImage from "./FallbackImage";

const ContactCTA = () => {
  return (
    <section
      id="kontak"
      className="min-h-screen w-full bg-[#0f172a] overflow-x-hidden font-['Inter',sans-serif] relative flex flex-col"
    >
      {/* Background Glow */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full hidden lg:block"></div>

      <div className="w-full flex flex-col lg:flex-row flex-grow">
        {/* SISI KIRI: GAMBAR */}
        <div className="w-full lg:w-[45%] h-[40vh] lg:h-auto relative shrink-0">
          <FallbackImage
            src="/images/clients/aset bg kontak kami.png"
            alt="Contact Support"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0f172a]"></div>
        </div>

        {/* SISI KANAN: KONTEN */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-20 bg-[#0f172a] relative z-10 lg:min-h-screen">
          {/* Header */}
          <div className="mb-6 lg:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-400/30 text-yellow-400 text-[11px] font-bold mb-4 uppercase tracking-[0.2em] bg-yellow-400/5 font-['Montserrat']">
              <Sparkles size={10} />
              Let's Connect
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tighter font-['Montserrat'] font-normal">
              Tertarik dengan <br />
              <span className="text-yellow-400">layanan kami?</span>
            </h2>
          </div>

          {/* Kontak & Lokasi Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-10">
            {/* Kolom 1: Kontak */}
            <div className="space-y-6">
              <div>
                <h3 className="text-yellow-400 font-bold text-[12px] uppercase tracking-[0.3em] mb-4 opacity-80 border-b border-white/5 pb-2 font-['Montserrat']">
                  Kantor Pusat
                </h3>
                <div className="space-y-3 text-[14px] lg:text-[15px]">
                  <p className="text-white/90 font-semibold flex items-center gap-3">
                    <Mail size={16} className="text-slate-500" /> info@b-net.id
                  </p>
                  <p className="text-white/90 font-semibold flex items-center gap-3">
                    <Phone size={16} className="text-slate-500" /> 0811 4440
                    0721
                  </p>
                  <p className="text-white/90 font-semibold flex items-center gap-3">
                    <MessageSquare size={16} className="text-slate-500" />{" "}
                    0811-4430-2898
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-yellow-400 font-bold text-[12px] uppercase tracking-[0.3em] mb-4 opacity-80 border-b border-white/5 pb-2 font-['Montserrat']">
                  Marketing
                </h3>
                <div className="space-y-3 text-[14px] lg:text-[15px]">
                  <p className="text-white/90 font-semibold flex items-center gap-3">
                    <Mail size={16} className="text-slate-500" /> info@b-net.id
                  </p>
                  <p className="text-white/90 font-semibold flex items-center gap-3">
                    <Phone size={16} className="text-slate-500" />{" "}
                    0811-4440-0723{" "}
                    <span className="text-slate-500 font-medium">(Aly)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Kolom 2: Lokasi */}
            <div>
              <h3 className="text-yellow-400 font-bold text-[12px] uppercase tracking-[0.3em] mb-4 opacity-80 border-b border-white/5 pb-2 font-['Montserrat']">
                Lokasi Kantor
              </h3>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Menara+Bosowa+Jl.+Jend.+Sudirman+No.5+Makassar"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-yellow-400/20 transition-all">
                    <MapPin
                      size={20}
                      className="text-slate-500 group-hover:text-yellow-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="font-[800] text-lg lg:text-xl text-white group-hover:text-yellow-400 transition-colors leading-tight font-['Montserrat']">
                      Menara Bosowa Lt.15 Unit H
                    </p>
                    <p className="text-[13px] lg:text-[14px] font-medium text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">
                      Jl. Jend. Sudirman No.7 Pisang Utara, <br />
                      Kota Makassar, Sulawesi Selatan, <br />
                      Indonesia.{" "}
                      <span className="text-yellow-400/80 font-bold ml-1">
                        90115
                      </span>
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* CTA & Socials */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 pb-10 lg:pb-0">
            <button
              onClick={() =>
                window.open(
                  "https://wa.me/6281144400723?text=Halo%20BNet%2C%20saya%20tertarik%20untuk%20konsultasi%20gratis%20mengenai%20layanan%20internet.",
                  "_blank",
                )
              }
              className="w-full sm:w-auto bg-yellow-400 hover:bg-white text-[#0f172a] font-[900] py-4 px-10 rounded-xl flex items-center justify-center gap-3 text-[12px] tracking-[0.15em] uppercase transition-all shadow-xl shadow-yellow-400/10 active:scale-95 font-['Montserrat']"
            >
              Hubungi kami <ArrowUp size={16} className="rotate-0" />
            </button>
            <div className="flex items-center gap-3">
              {[
                {
                  icon: <Linkedin size={18} />,
                  link: "https://www.linkedin.com/in/bnet-id-b29587136",
                },
                {
                  icon: <Instagram size={18} />,
                  link: "https://www.instagram.com/bnetid",
                },
                {
                  icon: <Facebook size={18} />,
                  link: "https://www.facebook.com/BNetIDInfo",
                },
                {
                  icon: <Youtube size={18} />,
                  link: "https://www.youtube.com/channel/UCE34BvmZ3-BiXeJ4fsF03Nw",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-yellow-400/10 text-slate-400 hover:text-yellow-400 rounded-xl flex items-center justify-center border border-white/10 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
