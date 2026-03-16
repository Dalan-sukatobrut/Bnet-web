import React, { useState, useEffect } from "react";
import {
  Package,
  Layers,
  Users,
  Image as ImageIcon,
  TrendingUp,
  FileCheck,
  FileX,
  Calendar,
} from "lucide-react";

export default function Dashboard({ images }) {
  const [stats, setStats] = useState({
    totalImages: 0,
    activeImages: 0,
    inactiveImages: 0,
    categories: [],
  });

  const calculateStats = () => {
    let total = 0;
    let active = 0;
    let inactive = 0;
    const categoryStats = [];

    Object.entries(images).forEach(([category, imgs]) => {
      total += imgs.length;
      const activeCount = imgs.filter((img) => img.published).length;
      const inactiveCount = imgs.length - activeCount;
      active += activeCount;
      inactive += inactiveCount;

      categoryStats.push({
        category,
        total: imgs.length,
        active: activeCount,
        inactive: inactiveCount,
      });
    });

    setStats({
      totalImages: total,
      activeImages: active,
      inactiveImages: inactive,
      categories: categoryStats,
    });
  };

  useEffect(() => {
    calculateStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const categoryLabels = {
    homepage: {
      name: "Homepage Background",
      icon: ImageIcon,
      color: "from-green-400 to-green-600",
    },
    klien: {
      name: "Logo Klien",
      icon: Users,
      color: "from-orange-400 to-orange-600",
    },
  };

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Gambar</p>
              <p className="text-4xl font-bold mt-2">{stats.totalImages}</p>
              <p className="text-blue-100 text-xs mt-2">Semua kategori</p>
            </div>
            <ImageIcon size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Gambar Aktif</p>
              <p className="text-4xl font-bold mt-2">{stats.activeImages}</p>
              <p className="text-green-100 text-xs mt-2">Ditampilkan</p>
            </div>
            <FileCheck size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                Gambar Non-Aktif
              </p>
              <p className="text-4xl font-bold mt-2">{stats.inactiveImages}</p>
              <p className="text-orange-100 text-xs mt-2">Tersembunyi</p>
            </div>
            <FileX size={32} className="text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Completion Rate
              </p>
              <p className="text-4xl font-bold mt-2">
                {stats.totalImages > 0
                  ? Math.round((stats.activeImages / stats.totalImages) * 100)
                  : 0}
                %
              </p>
              <p className="text-purple-100 text-xs mt-2">Active/Total</p>
            </div>
            <TrendingUp size={32} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Statistik Per Kategori
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Breakdown gambar di setiap kategori
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {stats.categories.map((stat) => {
            const categoryInfo = categoryLabels[stat.category];
            const Icon = categoryInfo?.icon;
            const percentage =
              stat.total > 0 ? Math.round((stat.active / stat.total) * 100) : 0;

            return (
              <div
                key={stat.category}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`bg-gradient-to-br ${categoryInfo?.color} p-3 rounded-lg`}
                    >
                      {Icon && <Icon size={24} className="text-white" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {categoryInfo?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {stat.total} total gambar
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {percentage}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stat.active} dari {stat.total}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${categoryInfo?.color} h-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Total</p>
                    <p className="text-lg font-bold text-blue-600">
                      {stat.total}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Aktif</p>
                    <p className="text-lg font-bold text-green-600">
                      {stat.active}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Non-Aktif</p>
                    <p className="text-lg font-bold text-red-600">
                      {stat.inactive}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
        <div className="flex gap-4">
          <ImageIcon className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-blue-900 mb-1">
              Tips Manajemen Gambar
            </h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>✓ Gunakan URL gambar yang stabil dan responsif</li>
              <li>✓ Berikan judul dan deskripsi yang deskriptif untuk SEO</li>
              <li>✓ Atur urutan tampilan menggunakan nomor order</li>
              <li>
                ✓ Toggle status aktif/non-aktif untuk mengubah visibilitas
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
