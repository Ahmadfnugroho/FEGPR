import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./assets/animations.css";
import App from "./App.tsx";
import "swiper/swiper-bundle.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initAllAnimations } from "./assets/animationUtils.js";

const queryClient = new QueryClient();

// Initialize animations with better timing
const initAnimationsWhenReady = () => {
  // Check if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => initAllAnimations(), 150);
    });
  } else {
    // DOM is already loaded
    setTimeout(() => initAllAnimations(), 150);
  }

  // Additional check after React has likely rendered
  setTimeout(() => {
    initAllAnimations();
  }, 500);
};

// Initialize animations
initAnimationsWhenReady();

// Fallback to ensure content is visible even if animations fail
setTimeout(() => {
  document
    .querySelectorAll(".scroll-fade-in, .stagger-fade-in, .stagger-item")
    .forEach((el) => {
      if (!el.classList.contains("visible")) {
        el.classList.add("visible");
        console.log("Fallback visibility applied to:", el);
      }
    });
}, 3000); // Wait 3 seconds before applying fallback

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
