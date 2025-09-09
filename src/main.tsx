import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./assets/animations.css";
import App from "./App.tsx";
import "swiper/swiper-bundle.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initAllAnimations } from "./assets/animationUtils.js";
import axios from "axios";
import debugLogger from "./utils/debugLogger";
import { attachDebugCommands } from "./utils/debugCache";

// Enhanced QueryClient configuration
// TEMPORARY: Disabled cache for fresh migrate testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry logic
      retry: (failureCount, error: any) => {
        // Don't retry if request was cancelled
        if (axios.isCancel(error) || error.name === 'AbortError') {
          debugLogger.logCancellation(
            error.config?.method || 'unknown',
            error.config?.url || 'unknown',
            'Query cancelled'
          );
          return false;
        }
        
        // Don't retry for 4xx errors (client errors)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          return false;
        }
        
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // TEMPORARY: Disable cache to ensure fresh data after migrate
      staleTime: 0,              // Data immediately stale
      gcTime: 0,                 // Cache immediately garbage collected
      
      // Always refetch to ensure fresh data
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

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

// Attach debug commands for development
if (process.env.NODE_ENV === 'development') {
  attachDebugCommands(queryClient);
}

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
