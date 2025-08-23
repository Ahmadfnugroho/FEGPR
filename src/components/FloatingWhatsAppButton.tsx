import React, { useState, useEffect } from "react";

export default function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show button after page loads to avoid layout shift
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // WhatsApp URL from footer
  const whatsappUrl =
    "https://wa.me/6281212349564?text=Halo,%20saya%20mau%20sewa%20kamera";

  const handleClick = () => {
    // Add small click animation
    const button = document.getElementById("floating-whatsapp-btn");
    if (button) {
      button.classList.add("animate-pulse");
      setTimeout(() => {
        button.classList.remove("animate-pulse");
      }, 200);
    }
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      <div
        className={`
        absolute bottom-full right-0 mb-2
        bg-gray-800 text-white text-sm px-3 py-2 rounded-lg
        whitespace-nowrap transition-all duration-200
        ${
          isHovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }
      `}
      >
        Chat via WhatsApp
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>

      <button
        id="floating-whatsapp-btn"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          w-14 h-14 md:w-16 md:h-16
          bg-green-500 hover:bg-green-600
          text-white rounded-full
          shadow-lg hover:shadow-2xl
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          transform hover:scale-110
          ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }
          focus:outline-none focus:ring-4 focus:ring-green-300
          active:scale-95
          group
        `}
        aria-label="Chat via WhatsApp"
        title="Chat via WhatsApp"
      >
        {/* WhatsApp Icon */}
        <svg
          className="w-7 h-7 md:w-8 md:h-8 transition-transform duration-200 group-hover:scale-110"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.991c-.003 5.456-4.438 9.891-9.893 9.891m8.413-18.304A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.086c0 2.13.557 4.21 1.617 6.033L0 24l6.064-1.606a11.888 11.888 0 0 0 5.983 1.527h.005c6.554 0 11.89-5.435 11.893-12.086a11.82 11.82 0 0 0-3.48-8.591" />
        </svg>

        {/* Animated pulse ring */}
        <div
          className={`
          absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30
          ${isHovered ? "opacity-50" : "opacity-30"}
        `}
        ></div>
      </button>
    </div>
  );
}
