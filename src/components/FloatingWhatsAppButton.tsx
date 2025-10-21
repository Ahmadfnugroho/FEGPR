import React, { useState, useEffect, useRef, useCallback } from "react";

export default function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const DRAG_THRESHOLD = 5; // pixels
  const positionRef = useRef(position); // Add this line

  useEffect(() => {
    positionRef.current = position; // Update ref whenever position changes
  }, [position]);

  // Show button after page loads to avoid layout shift
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // WhatsApp URL from footer
  const whatsappUrl =
    "https://wa.me/6281212349564?text=Halo%20admin,%20saya%20mau%20sewa,%0A%0ANama%20Lengkap:%0AAkan%20sewa%20alat:%0A1.%0A2.%0A%0ATanggal%20Pengambilan:%20%0AJam:%20%0A%0ATanggal%20Kembali:%20%0AJam:%20%0A%0AUntuk%20keperluan%20(wajib%20diisi):%20%0A%0AApakah%20tersedia%3F";
  const handleClick = () => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
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

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    initialMousePos.current = { x: e.clientX, y: e.clientY };
    const initialButtonX = positionRef.current.x; // Use ref
    const initialButtonY = positionRef.current.y; // Use ref

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - initialMousePos.current.x;
      const deltaY = e.clientY - initialMousePos.current.y;

      const newX = initialButtonX + deltaX;
      const newY = initialButtonY + deltaY;

      setPosition({ x: newX, y: newY });

      const dx = Math.abs(deltaX);
      const dy = Math.abs(deltaY);
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        hasDragged.current = true;
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, []); // Empty dependency array as position is accessed via ref

  return (
    <div
      className="fixed bottom-40 right-6 z-50"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      {/* Tooltip */}

      <button
        id="floating-whatsapp-btn"
        ref={buttonRef}
        onMouseDown={onMouseDown}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          px-4 py-3 md:px-5 md:py-4
          bg-green-500 hover:bg-green-600
          text-white rounded-full
          shadow-lg hover:shadow-2xl
          flex items-center justify-center gap-2
          transition-all duration-300 ease-in-out
          transform hover:scale-110 animate-bounce-soft
          ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }
          focus:outline-none focus:ring-4 focus:ring-green-300
          active:scale-95
          group
        `}
        aria-label="Hubungi Kami via WhatsApp"
      >
        {/* WhatsApp Icon */}
        <svg
          className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:scale-110 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.991c-.003 5.456-4.438 9.891-9.893 9.891m8.413-18.304A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.086c0 2.13.557 4.21 1.617 6.033L0 24l6.064-1.606a11.888 11.888 0 0 0 5.983 1.527h.005c6.554 0 11.89-5.435 11.893-12.086a11.82 11.82 0 0 0-3.48-8.591" />
        </svg>

        {/* Text */}
        <span className="text-xs md:text-sm font-extralight whitespace-nowrap">
          Hubungi Kami
        </span>

        {/* Animated pulse ring */}
        <div
          className={`
          absolute inset-0 rounded-full opacity-30
          ${isHovered ? "opacity-50" : "opacity-30"}
        `}
        ></div>
      </button>
    </div>
  );
}
