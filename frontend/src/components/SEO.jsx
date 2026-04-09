import { Helmet } from "react-helmet";

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  canonicalUrl,
  noIndex = false,
}) => {
  const siteName = "BNet.id - Celebes Media Jaringan";
  const defaultDescription =
    "Penyedia layanan WiFi industri dan bisnis terbaik di Makassar, Sulawesi Selatan. Layanan internet fiber optic, VPS, colocation, dan solusi jaringan profesional.";
  const defaultKeywords =
    "wifi industri makassar, internet bisnis sulawesi, layanan ISP makassar, wifi kantor, fiber optic makassar, VPS makassar, colocation server, internet industri, jaringan komputer makassar, BNet id";
  const defaultOgImage = "/images/clients/logo-bnet2.png";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="author" content="PT Celebes Media Jaringan" />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title || siteName} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteName} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "PT Celebes Media Jaringan",
          alternateName: "BNet.id",
          url: "https://b-net.id",
          logo: "https://b-net.id/images/clients/logo-bnet.png",
          description: defaultDescription,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+6281144400721",
            contactType: "customer service",
            areaServed: "ID",
            availableLanguage: ["Indonesian", "English"],
          },
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Menara Bosowa Lt 15, Unit H, Jl. Jend. Sudirman No.7",
            addressLocality: "Makassar",
            addressRegion: "Sulawesi Selatan",
            postalCode: "90115",
            addressCountry: "ID",
          },
          sameAs: [
            "https://www.linkedin.com/in/bnet-id-b29587136",
            "https://www.instagram.com/bnetid",
            "https://www.facebook.com/BNetIDInfo",
            "https://www.youtube.com/channel/UCE34BvmZ3-BiXeJ4fsF03Nw",
          ],
        })}
      </script>

      {/* Structured Data - LocalBusiness */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "BNet.id - Celebes Media Jaringan",
          image: "https://b-net.id/images/clients/logo-bnet.png",
          telephone: "+6281144400721",
          email: "info@b-net.id",
          url: "https://b-net.id",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Menara Bosowa Lt 15, Unit H, Jl. Jend. Sudirman No.7",
            addressLocality: "Makassar",
            addressRegion: "Sulawesi Selatan",
            postalCode: "90115",
            addressCountry: "ID",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "-5.1429",
            longitude: "119.4122",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
              opens: "08:00",
              closes: "17:00",
            },
          ],
          serviceType: [
            "Internet Service Provider",
            "WiFi Solutions",
            "VPS Hosting",
            "Colocation",
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
