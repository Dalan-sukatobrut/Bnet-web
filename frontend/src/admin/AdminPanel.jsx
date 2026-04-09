import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Search,
  MoreVertical,
  BarChart3,
  Package,
  Layers,
  Users,
  Image as ImageIcon,
  Home,
} from "lucide-react";
import Dashboard from "./Dashboard";

// Use Vite proxy in development
const API_BASE = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export default function AdminPanel() {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  // default to homepage so layout shows homepage first
  const [activeTab, setActiveTab] = useState("homepage");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  // progress percentage when uploading files
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    alt: "",
    order: 0,
    published: true,
    file: null,
    previewUrl: null,
  });

  const PORTAL_TOKEN = "bnet-secure-portal-key-2025";
  // order: homepage, layanan, produk, klien
  const categories = [
    {
      id: "homepage",
      name: "Homepage",
      icon: ImageIcon,
      bg: "bg-green-50",
    },

    { id: "klien", name: "Logo Klien", icon: Users, bg: "bg-orange-50" },
  ];

  // Fetch gambar berdasarkan kategori
  const fetchImages = async (category) => {
    try {
      console.log(`[AdminPanel] Fetching images for category: ${category}`);
      const res = await fetch(`${API_BASE}/images/${category}`);
      const data = await res.json();
      console.log(`[AdminPanel] Response for ${category}:`, data);
      setImages((prev) => ({
        ...prev,
        [category]: data.images || [],
      }));
    } catch (error) {
      console.error(`[AdminPanel] Error fetching ${category}:`, error);
    }
  };

  // Load semua kategori saat component mount
  useEffect(() => {
    setLoading(true);
    Promise.all(categories.map((cat) => fetchImages(cat.id))).then(() =>
      setLoading(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter gambar berdasarkan search
  const filteredImages = (images[activeTab] || []).filter(
    (img) =>
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.alt?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle tambah/edit gambar
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.title) {
      alert("❌ Judul gambar harus diisi");
      return;
    }

    if (!editingId && !formData.file) {
      alert("❌ Pilih file gambar untuk diunggah");
      return;
    }

    try {
      setUploading(true);

      if (editingId) {
        // Update mode - hanya update metadata
        const payload = {
          title: formData.title,
          description: formData.description,
          alt: formData.alt,
          order: formData.order,
          published: formData.published,
        };

        console.log(`[AdminPanel] Updating image ${editingId}:`, payload);
        const res = await fetch(`${API_BASE}/images/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-portal-key": PORTAL_TOKEN,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Failed to update image");
        }

        const data = await res.json();
        console.log("[AdminPanel] Update response:", data);
        alert("✅ Gambar berhasil diupdate!");
      } else {
        // Upload mode - upload file baru ke endpoint /upload
        const formDataObj = new FormData();
        formDataObj.append("file", formData.file);
        formDataObj.append("title", formData.title);
        formDataObj.append("description", formData.description);
        formDataObj.append("alt", formData.alt);
        formDataObj.append("order", formData.order);
        formDataObj.append("published", formData.published); // Tambah published field
        formDataObj.append("category", activeTab);
        formDataObj.append("key", PORTAL_TOKEN); // Tambah portal key ke FormData sebagai fallback

        console.log(`[AdminPanel] Uploading image to category: ${activeTab}`);
        console.log(`[AdminPanel] Published: ${formData.published}`);
        console.log(`[AdminPanel] Portal token: ${PORTAL_TOKEN}`);
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            // progress tracking silently
          }
        });

        // Handle completion
        await new Promise((resolve, reject) => {
          xhr.addEventListener("load", () => {
            console.log("[AdminPanel] Upload response status:", xhr.status);
            console.log("[AdminPanel] Upload response:", xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error("Upload failed: " + xhr.responseText));
            }
          });
          xhr.addEventListener("error", () =>
            reject(new Error("Network error")),
          );
          // POST to /api/images endpoint with portal key in header AND query string
          const uploadUrl = `${API_BASE}/images?key=${encodeURIComponent(PORTAL_TOKEN)}`;
          xhr.open("POST", uploadUrl);
          xhr.setRequestHeader("x-portal-key", PORTAL_TOKEN);
          xhr.send(formDataObj);
        });

        alert("✅ Gambar berhasil diupload!");
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        alt: "",
        order: 0,
        published: true,
        file: null,
        previewUrl: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await fetchImages(activeTab);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Gagal menyimpan gambar: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle hapus gambar
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;

    try {
      console.log(`[AdminPanel] Deleting image: ${id}`);
      const deleteUrl = `${API_BASE}/images/${id}?key=${encodeURIComponent(PORTAL_TOKEN)}`;
      const res = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "x-portal-key": PORTAL_TOKEN,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete image");
      }

      const data = await res.json();
      console.log("[AdminPanel] Delete response:", data);
      alert("✅ Gambar berhasil dihapus!");

      await fetchImages(activeTab);
      setActiveMenu(null);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Gagal menghapus gambar");
    }
  };

  // Handle toggle publish
  const handleTogglePublish = async (image) => {
    try {
      console.log(`[AdminPanel] Toggle publish for image: ${image.id}`);
      const res = await fetch(`${API_BASE}/images/${image.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-portal-key": PORTAL_TOKEN,
        },
        body: JSON.stringify({
          published: !image.published,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update image");
      }

      const data = await res.json();
      console.log("[AdminPanel] Toggle response:", data);
      alert(`✅ Gambar sekarang ${!image.published ? "aktif" : "non-aktif"}!`);

      await fetchImages(activeTab);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Gagal mengubah status gambar");
    }
  };

  // Handle edit gambar
  const handleEdit = (image) => {
    setFormData({
      title: image.title,
      description: image.description || "",
      alt: image.alt,
      order: image.order,
      published: image.published,
      file: null,
      previewUrl: image.url,
    });
    setEditingId(image.id);
    setShowModal(true);
    setActiveMenu(null);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      alt: "",
      order: 0,
      published: true,
      file: null,
      previewUrl: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type,
        )
      ) {
        alert("❌ Hanya file gambar yang diizinkan (JPG, PNG, WebP, GIF)");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("❌ Ukuran file terlalu besar (max 10MB)");
        return;
      }
      setFormData({
        ...formData,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }
  };

  const currentCategory = categories.find((cat) => cat.id === activeTab);
  const currentImages = images[activeTab] || [];
  const totalImages = currentImages.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-blue-300 mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-bold text-lg">BNetID</h1>
              <p className="text-xs text-gray-400">Admin Bnet</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => {
              setActiveView("dashboard");
              setSearchQuery("");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
              activeView === "dashboard"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </button>

          <div className="my-4 border-t border-gray-700"></div>

          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveView("images");
                  setActiveTab(cat.id);
                  setSearchQuery("");
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                  activeView === "images" && activeTab === cat.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon size={20} />
                <span>{cat.name}</span>
                <span className="ml-auto text-sm bg-gray-700/50 px-2 py-0.5 rounded">
                  {(images[cat.id] || []).length}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400 text-center">
            <p>© 2026 BNetID Portal</p>
            <p className="mt-1">Admin Dashboard v1.0</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Selamat Datang, Admin!
                </h1>
                <p className="text-blue-100 text-lg">
                  {activeView === "dashboard"
                    ? "Overview Portal"
                    : currentCategory?.name}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center font-bold">
                    👤
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Role: Admin</p>
                    <p className="text-sm text-blue-100">Akses Penuh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {activeView === "dashboard" ? (
              <Dashboard images={images} />
            ) : (
              <>
                {/* Search & Add Button */}
                <div className="flex gap-4 mb-8">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search gambar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        title: "",
                        description: "",
                        alt: "",
                        order: 0,
                        published: true,
                        file: null,
                        previewUrl: null,
                      });
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      setShowModal(true);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition"
                  >
                    <Plus size={20} /> Tambah Gambar
                  </button>
                </div>

                {/* Count Card */}
                <div className="mb-8 grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                    <ImageIcon className="text-blue-500 mb-2" size={24} />
                    <p className="text-gray-600 text-sm">Total Gambar</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalImages}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                    <Eye className="text-green-500 mb-2" size={24} />
                    <p className="text-gray-600 text-sm">Yang Aktif</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {currentImages.filter((img) => img.published).length}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
                    <EyeOff className="text-orange-500 mb-2" size={24} />
                    <p className="text-gray-600 text-sm">Non-Aktif</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {currentImages.filter((img) => !img.published).length}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
                    <BarChart3 className="text-purple-500 mb-2" size={24} />
                    <p className="text-gray-600 text-sm">Search Result</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {filteredImages.length}
                    </p>
                  </div>
                </div>

                {/* Images List */}
                <div className="bg-white rounded-lg shadow-lg overflow-visible">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Daftar Gambar - {currentCategory?.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Kategori: {activeTab} | Total: {totalImages} gambar
                    </p>
                  </div>

                  {filteredImages.length === 0 ? (
                    <div className="p-12 text-center">
                      <ImageIcon
                        className="mx-auto text-gray-300 mb-4"
                        size={48}
                      />
                      <p className="text-gray-500 text-lg">
                        {searchQuery
                          ? "Tidak ada gambar yang cocok dengan pencarian"
                          : `Belum ada gambar untuk kategori ${currentCategory?.name}`}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Silakan klik "Tambah Gambar" untuk mengupload gambar
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredImages.map((image) => (
                        <div
                          key={image.id}
                          className="p-4 hover:bg-gray-50 transition flex items-center gap-4"
                        >
                          {/* Image Thumbnail */}
                          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/96?text=No+Image";
                              }}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {image.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {currentCategory?.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {image.url}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Order: {image.order} | ID:{" "}
                              {image.id.substring(0, 8)}...
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {image.published ? (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                ✓ Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                ✗ Tidak Aktif
                              </span>
                            )}
                          </div>

                          {/* Menu Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveMenu(
                                  activeMenu === image.id ? null : image.id,
                                )
                              }
                              className="p-2 hover:bg-gray-200 rounded-lg transition"
                            >
                              <MoreVertical
                                size={20}
                                className="text-gray-600"
                              />
                            </button>

                            {activeMenu === image.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <button
                                  onClick={() => handleTogglePublish(image)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2 border-b border-gray-100"
                                >
                                  {image.published ? (
                                    <>
                                      <EyeOff size={16} /> Sembunyikan
                                    </>
                                  ) : (
                                    <>
                                      <Eye size={16} /> Tampilkan
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleEdit(image)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-blue-600 flex items-center gap-2 border-b border-gray-100"
                                >
                                  <Edit2 size={16} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(image.id)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-red-600 flex items-center gap-2"
                                >
                                  <Trash2 size={16} /> Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH/EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? "✏️ Edit Gambar" : "➕ Tambah Gambar Baru"}
                </h2>
                <p className="text-sm text-gray-500">
                  Kategori: {currentCategory?.name} ({activeTab})
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Gambar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Masukkan judul gambar"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* File Upload */}
              {!editingId && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📁 Pilih Gambar untuk Diunggah *
                  </label>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploading}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="text-blue-600 font-medium hover:text-blue-700 disabled:opacity-50"
                    >
                      {formData.file
                        ? "✓ File dipilih"
                        : "Klik untuk pilih file atau drag & drop"}
                    </button>
                    {formData.file && (
                      <p className="text-sm text-gray-600 mt-2">
                        {formData.file.name} (
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Masukkan deskripsi gambar"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                ></textarea>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) =>
                    setFormData({ ...formData, alt: e.target.value })
                  }
                  placeholder="Deskripsi alternatif gambar"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Urutan Tampil
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Published */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Publikasikan
                </label>
              </div>

              {/* Preview */}
              {formData.previewUrl && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={formData.previewUrl}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {editingId ? "Simpan Perubahan" : "Unggah Gambar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
