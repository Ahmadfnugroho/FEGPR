import { useEffect } from "react";

type Props = {
  /** kalau true, mainkan animasi keluar lalu panggil onExited */
  closing?: boolean;
  onExited?: () => void;
};

const EXIT_MS = 700; // samakan dengan durasi animate-fadeOut

export default function FullScreenLoader({ closing = false, onExited }: Props) {
  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => onExited?.(), EXIT_MS);
    return () => clearTimeout(t);
  }, [closing, onExited]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center
         bg-navy-blue-950 text-gray-100
         ${closing ? "animate-fadeOut pointer-events-none" : ""}`}
      aria-busy={!closing}
      aria-live="polite"
    >
      {/* container 80x50 ala spesifikasi kamu */}
      <div className="relative w-20 h-[50px] flex items-center justify-center">
        {/* .loader-text */}
        <span className="absolute top-0 text-navy-blue-800 text-[1.5rem] tracking-[1px] animate-textPulse">
          loading
        </span>

        {/* .load (progress bar) */}
        <span className="absolute bottom-0 left-0 right-0 h-[4px] bg-navy-blue-900 overflow-hidden rounded">
          <span className="block h-full w-1/2 bg-navy-blue-800 animate-loaderSlide" />
        </span>
      </div>
    </div>
  );
}
