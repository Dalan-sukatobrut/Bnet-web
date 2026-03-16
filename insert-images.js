import fetch from "node-fetch";

const API_BASE = "http://localhost:3001/api";
const AUTH_TOKEN = "bnet-secure-portal-key-2025";

const images = [
  {
    title: "Microsoft 365",
    url: "/images/clients/microsoft%20365%20bg%20page.png",
    category: "produk",
    order: 1,
    published: true,
  },
  {
    title: "VPS",
    url: "/images/clients/vps%20bg%20page.png",
    category: "produk",
    order: 2,
    published: true,
  },
  {
    title: "Colocation Server",
    url: "/images/clients/colocation%20server%20bg%20page.png",
    category: "produk",
    order: 3,
    published: true,
  },
  {
    title: "celebeshost",
    url: "/images/clients/celebeshost%20bg%20page.png",
    category: "produk",
    order: 4,
    published: true,
  },
];

async function insertImages() {
  for (const img of images) {
    try {
      const response = await fetch(`${API_BASE}/images/direct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-portal-key": AUTH_TOKEN,
        },
        body: JSON.stringify(img),
      });

      const data = await response.json();
      console.log(` Inserted: ${img.title}`, data);
    } catch (err) {
      console.error(` Error inserting ${img.title}:`, err.message);
    }
  }
}

insertImages();
