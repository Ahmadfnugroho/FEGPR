import React, { useEffect, useCallback, useRef, useState } from 'react';

// Custom hook for keyboard navigation
export const useKeyboardNavigation = (
  items: string[],
  onSelect: (index: number) => void,
  enabled: boolean = true
) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (activeIndex >= 0) {
          onSelect(activeIndex);
        }
        break;
      
      case 'Escape':
        event.preventDefault();
        setActiveIndex(-1);
        break;
      
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        break;
    }
  }, [enabled, items.length, activeIndex, onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  // Reset active index when items change
  useEffect(() => {
    setActiveIndex(-1);
  }, [items]);

  return {
    activeIndex,
    containerRef,
    setActiveIndex
  };
};

// Custom hook for focus management
export const useFocusManagement = () => {
  const focusedElementRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    focusedElementRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (focusedElementRef.current && typeof focusedElementRef.current.focus === 'function') {
      focusedElementRef.current.focus();
    }
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  return {
    saveFocus,
    restoreFocus,
    trapFocus
  };
};

// Custom hook for screen reader announcements
export const useScreenReader = () => {
  const announcementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create aria-live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    
    document.body.appendChild(liveRegion);
    announcementRef.current = liveRegion;

    return () => {
      if (liveRegion.parentNode) {
        liveRegion.parentNode.removeChild(liveRegion);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.textContent = message;
      
      // Clear after announcement to allow repeated announcements
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
};

// Custom hook for reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Custom hook for high contrast mode detection
export const useHighContrast = () => {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return highContrast;
};

// Utility function to generate unique IDs for ARIA attributes
export const generateId = (prefix: string = 'element') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Utility function for accessible form validation
export const getAriaDescribedBy = (
  inputId: string,
  hasError: boolean,
  hasHelp: boolean
) => {
  const describedBy: string[] = [];
  
  if (hasError) {
    describedBy.push(`${inputId}-error`);
  }
  
  if (hasHelp) {
    describedBy.push(`${inputId}-help`);
  }
  
  return describedBy.length > 0 ? describedBy.join(' ') : undefined;
};

// Custom hook for accessible modal/dialog
export const useAccessibleModal = (isOpen: boolean) => {
  const { saveFocus, restoreFocus, trapFocus } = useFocusManagement();
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previouslyFocused.current = document.activeElement as HTMLElement;
      
      // Trap focus in modal
      if (modalRef.current) {
        const cleanupFocusTrap = trapFocus(modalRef.current);
        
        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';
        
        return () => {
          cleanupFocusTrap();
          document.body.style.overflow = '';
          
          // Restore focus when modal closes
          if (previouslyFocused.current) {
            previouslyFocused.current.focus();
          }
        };
      }
    }
  }, [isOpen, trapFocus]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        // This should trigger the modal close logic in the parent component
        const escapeEvent = new CustomEvent('modal-escape');
        window.dispatchEvent(escapeEvent);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return { modalRef };
};

// SkipLink component moved to separate file: /components/SkipLink.tsx
