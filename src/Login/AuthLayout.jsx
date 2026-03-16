import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);

  return null;
};

export default function AuthLayout({ children }) {
  return (
    <div className="antialiased font-sans bg-white selection:bg-blue-100 selection:text-blue-600">
      <ScrollToTop />
      {children}
    </div>
  );
}
