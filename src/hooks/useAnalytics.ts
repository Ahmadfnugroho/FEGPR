import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  page?: string;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: AnalyticsEvent[];
  referrer?: string;
  userAgent: string;
  viewport: { width: number; height: number };
  device: 'mobile' | 'tablet' | 'desktop';
}

interface ConversionGoal {
  name: string;
  category: 'view' | 'engagement' | 'conversion';
  value?: number;
  metadata?: Record<string, any>;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export const useAnalytics = () => {
  const location = useLocation();
  const sessionRef = useRef<UserSession | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  // Initialize session
  useEffect(() => {
    initializeSession();
    
    return () => {
      // Cleanup: send session data before unmount
      if (sessionRef.current) {
        sendSessionData(sessionRef.current);
      }
    };
  }, []);

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  // Initialize analytics session
  const initializeSession = () => {
    const sessionId = generateSessionId();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    sessionRef.current = {
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: [],
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
      viewport,
      device: getDeviceType()
    };

    console.log('📊 Analytics session initialized:', sessionId);
  };

  // Generate unique session ID
  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Detect device type
  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  // Track page view
  const trackPageView = useCallback((page: string) => {
    if (!sessionRef.current) return;

    sessionRef.current.pageViews++;
    sessionRef.current.lastActivity = Date.now();

    const event: AnalyticsEvent = {
      name: 'page_view',
      parameters: {
        page,
        referrer: document.referrer,
        title: document.title
      },
      timestamp: Date.now(),
      sessionId: sessionRef.current.sessionId,
      page
    };

    sessionRef.current.events.push(event);
    console.log('📄 Page view tracked:', page);

    // Send real-time page view data
    sendEvent(event);
  }, []);

  // Track custom event
  const trackEvent = useCallback((name: string, parameters?: Record<string, any>) => {
    if (!sessionRef.current) return;

    sessionRef.current.lastActivity = Date.now();

    const event: AnalyticsEvent = {
      name,
      parameters,
      timestamp: Date.now(),
      sessionId: sessionRef.current.sessionId,
      page: location.pathname
    };

    sessionRef.current.events.push(event);
    console.log('🎯 Event tracked:', name, parameters);

    // Send event data
    sendEvent(event);
  }, [location.pathname]);

  // Track conversion goal
  const trackConversion = useCallback((goal: ConversionGoal) => {
    trackEvent('conversion', {
      goalName: goal.name,
      category: goal.category,
      value: goal.value,
      ...goal.metadata
    });

    console.log('💰 Conversion tracked:', goal.name);
  }, [trackEvent]);

  // Track user interaction
  const trackInteraction = useCallback((element: string, action: string, value?: string) => {
    trackEvent('user_interaction', {
      element,
      action,
      value,
      timestamp: Date.now()
    });
  }, [trackEvent]);

  // Track scroll depth
  const trackScrollDepth = useCallback((depth: number) => {
    trackEvent('scroll_depth', {
      depth,
      page: location.pathname
    });
  }, [trackEvent, location.pathname]);

  // Track performance metrics
  const trackPerformance = useCallback(() => {
    if (!('performance' in window)) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const metrics: PerformanceMetrics = {
      pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
      timeToFirstByte: navigation.responseStart - navigation.requestStart,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: 0, // Would need observer
      cumulativeLayoutShift: 0, // Would need observer
      firstInputDelay: 0 // Would need observer
    };

    trackEvent('performance_metrics', metrics);
    console.log('⚡ Performance metrics tracked:', metrics);
  }, [trackEvent]);

  // Track search query
  const trackSearch = useCallback((query: string, results: number, filters?: Record<string, any>) => {
    trackEvent('search', {
      query,
      results,
      filters,
      timestamp: Date.now()
    });
  }, [trackEvent]);

  // Track product view
  const trackProductView = useCallback((productId: string, productName: string, category?: string, price?: number) => {
    trackEvent('product_view', {
      productId,
      productName,
      category,
      price
    });
    
    // Also track as conversion goal
    trackConversion({
      name: 'product_view',
      category: 'view',
      metadata: { productId, productName }
    });
  }, [trackEvent, trackConversion]);

  // Track add to cart/wishlist
  const trackAddToWishlist = useCallback((productId: string, productName: string, price?: number) => {
    trackEvent('add_to_wishlist', {
      productId,
      productName,
      price
    });

    trackConversion({
      name: 'add_to_wishlist',
      category: 'engagement',
      value: price,
      metadata: { productId }
    });
  }, [trackEvent, trackConversion]);

  // Track booking start
  const trackBookingStart = useCallback((productId: string, productName: string, rentalDates: { start: string; end: string }) => {
    trackEvent('booking_start', {
      productId,
      productName,
      rentalDates
    });

    trackConversion({
      name: 'booking_start',
      category: 'conversion',
      metadata: { productId, rentalDates }
    });
  }, [trackEvent, trackConversion]);

  // Track booking complete
  const trackBookingComplete = useCallback((bookingId: string, productId: string, totalAmount: number, rentalDays: number) => {
    trackEvent('booking_complete', {
      bookingId,
      productId,
      totalAmount,
      rentalDays
    });

    trackConversion({
      name: 'booking_complete',
      category: 'conversion',
      value: totalAmount,
      metadata: { bookingId, productId, rentalDays }
    });
  }, [trackEvent, trackConversion]);

  // Track error
  const trackError = useCallback((error: string, context?: Record<string, any>) => {
    trackEvent('error', {
      error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }, [trackEvent]);

  // Send event to analytics service
  const sendEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      // In a real implementation, this would send to your analytics service
      // For demo purposes, we'll store in localStorage and log
      
      const stored = localStorage.getItem('gpr_analytics_events') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      // Keep only last 100 events in localStorage
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('gpr_analytics_events', JSON.stringify(events));

      // In production, send to your analytics endpoint:
      /*
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      */
      
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }, []);

  // Send session data
  const sendSessionData = useCallback(async (session: UserSession) => {
    try {
      const sessionData = {
        ...session,
        duration: Date.now() - session.startTime,
        bounceRate: session.pageViews <= 1 ? 1 : 0
      };

      // Store session data
      const stored = localStorage.getItem('gpr_analytics_sessions') || '[]';
      const sessions = JSON.parse(stored);
      sessions.push(sessionData);
      
      // Keep only last 10 sessions
      if (sessions.length > 10) {
        sessions.splice(0, sessions.length - 10);
      }
      
      localStorage.setItem('gpr_analytics_sessions', JSON.stringify(sessions));

      console.log('📊 Session data sent:', sessionData);

      // In production:
      /*
      await fetch('/api/analytics/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      */
      
    } catch (error) {
      console.error('Failed to send session data:', error);
    }
  }, []);

  // Get analytics data for debugging
  const getAnalyticsData = useCallback(() => {
    const events = JSON.parse(localStorage.getItem('gpr_analytics_events') || '[]');
    const sessions = JSON.parse(localStorage.getItem('gpr_analytics_sessions') || '[]');
    
    return {
      currentSession: sessionRef.current,
      events,
      sessions,
      summary: {
        totalEvents: events.length,
        totalSessions: sessions.length,
        avgSessionDuration: sessions.reduce((acc: number, s: any) => acc + s.duration, 0) / sessions.length || 0
      }
    };
  }, []);

  // Clear analytics data
  const clearAnalyticsData = useCallback(() => {
    localStorage.removeItem('gpr_analytics_events');
    localStorage.removeItem('gpr_analytics_sessions');
    console.log('🗑️ Analytics data cleared');
  }, []);

  // Setup scroll tracking
  useEffect(() => {
    let lastScrollDepth = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      const threshold = scrollThresholds.find(t => scrollPercent >= t && t > lastScrollDepth);
      if (threshold) {
        lastScrollDepth = threshold;
        trackScrollDepth(threshold);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);

  // Setup performance tracking
  useEffect(() => {
    // Track performance after page load
    if (document.readyState === 'complete') {
      setTimeout(trackPerformance, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(trackPerformance, 1000);
      });
    }
  }, [trackPerformance]);

  return {
    trackEvent,
    trackConversion,
    trackInteraction,
    trackScrollDepth,
    trackPerformance,
    trackSearch,
    trackProductView,
    trackAddToWishlist,
    trackBookingStart,
    trackBookingComplete,
    trackError,
    getAnalyticsData,
    clearAnalyticsData
  };
};

export default useAnalytics;
