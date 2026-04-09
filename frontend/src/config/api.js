// Gunakan proxy Vite di development (bukan direct ke backend)
// Ini menghindari masalah CORS
const isDev = import.meta.env.DEV;
let API_BASE_URL;

if (isDev) {
  // ⚠️ GUNAKAN PROXY VITE (relative path) - tidak direct ke localhost:3001
  API_BASE_URL = "/api";
} else {
  API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
}

console.log("[API Config] DEV mode:", isDev);
console.log("[API Config] Using API_BASE_URL:", API_BASE_URL);

const PORTAL_TOKEN =
  import.meta.env.VITE_PORTAL_TOKEN || "bnet-secure-portal-key-2025";

console.log("[API Config] Portal token configured: YES");
async function parseResponseJSON(response, url) {
  const contentType = response.headers.get("content-type");

  // Cek apakah response adalah JSON
  if (!contentType || !contentType.includes("application/json")) {
    // Ambil teks sebagai fallback untuk debugging
    const text = await response.text();
    console.error("Response bukan JSON dari URL:", url);
    console.error("Content-Type:", contentType);
    console.error("Response text:", text.substring(0, 500));
    throw new Error(
      `Backend mengembalikan respons non-JSON dari ${url}. Response: ${text.substring(0, 200)}`,
    );
  }

  try {
    return await response.json();
  } catch (error) {
    console.error("Gagal parse JSON:", error);
    throw new Error("Respons server tidak valid sebagai JSON");
  }
}

// Backend health check - perlu direct ke backend (tidak bisa lewat proxy)
export async function checkBackendHealth() {
  try {
    // Di dev, langsung ke backend (bukan proxy) karena checkHealth perlu root path
    const healthUrl = isDev
      ? "http://localhost:3001/"
      : API_BASE_URL.replace("/api", "");
    const response = await fetch(healthUrl, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.warn("Backend health check failed:", error.message);
    return false;
  }
}

export async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    // Cek response sebelum parsing JSON
    if (!response.ok) {
      const data = await parseResponseJSON(response, url);
      return data;
    }

    const data = await parseResponseJSON(response, url);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(
      error.message ||
        "Backend tidak dapat diakses. Pastikan server running di port 3001",
    );
  }
}

// Khusus untuk panggilan API yang butuh akses admin (portal key + cookie)
export async function adminApiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    "x-portal-key": PORTAL_TOKEN, // Token proteksi portal
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Wajib untuk kirim cookie
    });

    // Cek response sebelum parsing JSON
    if (!response.ok) {
      const data = await parseResponseJSON(response, url);
      return data;
    }

    const data = await parseResponseJSON(response, url);
    return data;
  } catch (error) {
    console.error("Admin API Error:", error);
    throw new Error(
      error.message ||
        "Backend tidak dapat diakses. Pastikan server running di port 3001",
    );
  }
}

// Khusus untuk login & register (dengan portal protection) - dengan retry mechanism
export async function authApiCall(endpoint, options = {}, retries = 2) {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("[AuthAPI] Full URL:", url);

  const headers = {
    "Content-Type": "application/json",
    "x-portal-key": PORTAL_TOKEN, // Token proteksi portal
    ...options.headers,
  };

  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`[AuthAPI] Attempt ${attempt + 1}: ${url}`);

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });

      console.log("[AuthAPI] Response status:", response.status);

      // Cek response sebelum parsing JSON
      const data = await parseResponseJSON(response, url);

      if (
        !response.ok &&
        attempt < retries &&
        data.error?.includes("Portal access denied")
      ) {
        // Retry if portal access denied (might be timing issue)
        console.warn(`[AuthAPI] Retrying... attempt ${attempt + 1}`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1)),
        );
        continue;
      }

      return data;
    } catch (error) {
      console.error(`[AuthAPI] Error attempt ${attempt + 1}:`, error.message);
      lastError = error;

      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1)),
        );
      }
    }
  }

  // Return a structured error if all retries failed
  throw (
    lastError ||
    new Error(
      "Backend tidak dapat diakses. Pastikan server running di port 3001",
    )
  );
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function removeUser() {
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  removeToken();
  removeUser();
}
