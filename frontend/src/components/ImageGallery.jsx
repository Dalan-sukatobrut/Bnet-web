import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Clock,
  MapPin,
  FolderOpen,
  Edit2,
  Trash2,
} from "lucide-react";
import FallbackImage from "./FallbackImage";

// Direct backend URL
const API_BASE = "http://localhost:3001/api";

export default function ImageGallery() {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const categories = [
    {
      id: "homepage",
      name: "Homepage Background",
      icon: "🏠",
      color: "from-green-400 to-green-600",
    },
    {
      id: "layanan",
      name: "Layanan",
      icon: "⚙️",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: "produk",
      name: "Produk Kami",
      icon: "🛍️",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "klien",
      name: "Logo Klien",
      icon: "👥",
      color: "from-orange-400 to-orange-600",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAllImages = async () => {
      setLoading(true);
      try {
        const allImages = {};
        for (const cat of categories) {
          const res = await fetch(`${API_BASE}/images/${cat.id}`);

          if (!res.ok) {
            console.error(
              `[ImageGallery] API error for ${cat.id}:`,
              res.status,
            );
            allImages[cat.id] = [];
            continue;
          }

          const data = await res.json();
          allImages[cat.id] = data.images || [];
        }
        setImages(allImages);
      } catch (error) {
        console.error("[ImageGallery] Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllImages();
  }, []);

  const displayedImages = filteredCategory
    ? images[filteredCategory] || []
    : Object.values(images).flat();

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getCategoryInfo = (catId) => categories.find((c) => c.id === catId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📸 Galeri Gambar Portal
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>Update terakhir: {formatTime(currentTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FolderOpen size={18} />
              <span>{displayedImages.length} gambar ditampilkan</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Filter Kategori
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setFilteredCategory(null)}
              className={`p-4 rounded-lg font-medium transition ${
                filteredCategory === null
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ✓ Semua Kategori ({Object.values(images).flat().length})
            </button>
            {categories.map((cat) => {
              const count = (images[cat.id] || []).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilteredCategory(cat.id)}
                  className={`p-4 rounded-lg font-medium transition ${
                    filteredCategory === cat.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {displayedImages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FolderOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              Belum ada gambar di kategori ini
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedImages.map((image) => {
              const categoryInfo = getCategoryInfo(image.category);
              return (
                <div
                  key={image.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
                >
                  <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
                    <FallbackImage
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      fallback="/images/clients/beranda.png"
                    />
                    {!image.published && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          HIDDEN
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      Order: {image.order}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-2 truncate">
                      {image.title}
                    </h3>

                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center gap-1 bg-gradient-to-r ${categoryInfo?.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                      >
                        {categoryInfo?.icon} {categoryInfo?.name}
                      </span>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={14}
                          className="text-blue-600 flex-shrink-0 mt-0.5"
                        />
                        <div className="text-xs text-blue-700">
                          <p className="font-semibold">Lokasi Gambar:</p>
                          <p className="mt-1">
                            📌 {categoryInfo?.name || "Tidak terdefinisi"}
                          </p>
                          <p className="text-blue-600 text-xs mt-1">
                            ID: {image.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {image.published ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          <Eye size={12} /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                          <EyeOff size={12} /> Non-Aktif
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-600 mb-3">
                      {image.description && (
                        <p className="line-clamp-2 mb-2 italic">
                          {image.description}
                        </p>
                      )}
                      <p className="text-gray-500">
                        Upload:{" "}
                        {new Date(image.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <h3 className="font-bold text-gray-900 mb-2">💡 Informasi Galeri</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Gambar diperbarui secara real-time dari admin panel</li>
            <li>✓ Setiap gambar memiliki penanda lokasi kategorinya</li>
            <li>✓ Jam update ditampilkan untuk referensi perubahan</li>
            <li>
              ✓ Klik gambar untuk melihat detail atau edit dari admin panel
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
