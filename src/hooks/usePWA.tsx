import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export const usePWA = () => {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false,
    isUpdateAvailable: false,
    installPrompt: null
  });

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      setRegistration(reg);

      console.log('✅ Service Worker registered successfully');

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, isUpdateAvailable: true }));
              console.log('🔄 New service worker available');
            }
          });
        }
      });

      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  };

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      
      setState(prev => ({ 
        ...prev, 
        isInstallable: true,
        installPrompt: promptEvent 
      }));
      
      console.log('📱 App is installable');
    };

    const handleAppInstalled = () => {
      setState(prev => ({ 
        ...prev, 
        isInstalled: true,
        isInstallable: false,
        installPrompt: null
      }));
      
      console.log('✅ App has been installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setState(prev => ({ ...prev, isOffline: !navigator.onLine }));
    };

    // Set initial status
    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Check if app is running in standalone mode
  useEffect(() => {
    const checkStandaloneMode = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');
      
      setState(prev => ({ ...prev, isInstalled: isStandalone }));
    };

    checkStandaloneMode();
  }, []);

  // Install app function
  const installApp = useCallback(async () => {
    if (!state.installPrompt) {
      console.log('❌ No install prompt available');
      return false;
    }

    try {
      await state.installPrompt.prompt();
      const { outcome } = await state.installPrompt.userChoice;
      
      console.log('Install prompt result:', outcome);
      
      if (outcome === 'accepted') {
        setState(prev => ({ 
          ...prev, 
          isInstallable: false,
          installPrompt: null
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during app installation:', error);
      return false;
    }
  }, [state.installPrompt]);

  // Update app function
  const updateApp = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [registration]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('❌ This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!registration) {
      console.log('❌ Service worker not registered');
      return null;
    }

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // Replace with your VAPID public key
          'BEl62iUYgUivxIkv69yViEuiBIa40HI80YmqTHFEAHR7gV1l6M8yDtlCNuuJZLNh'
        )
      });

      console.log('✅ Push notification subscription created');
      
      // Send subscription to server
      // await sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('❌ Failed to subscribe to push notifications:', error);
      return null;
    }
  }, [registration]);

  // Add to home screen prompt component
  const InstallPrompt = useCallback(({ onInstall, onDismiss }: {
    onInstall: () => void;
    onDismiss: () => void;
  }) => {
    if (!state.isInstallable) return null;

    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
        <div className="bg-white rounded-lg shadow-xl border p-4 animate-slide-up">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <img 
                src="/LOGO-GPR.png" 
                alt="Global Photo Rental" 
                className="w-10 h-10 rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900">
                Install Global Photo Rental
              </h3>
              <p className="text-sm text-gray-500">
                Install our app for faster access and offline browsing
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              onClick={onInstall}
              className="flex-1 bg-navy-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-navy-blue-700 transition-colors"
            >
              Install
            </button>
            <button
              onClick={onDismiss}
              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    );
  }, [state.isInstallable]);

  // Update available prompt
  const UpdatePrompt = useCallback(({ onUpdate, onDismiss }: {
    onUpdate: () => void;
    onDismiss: () => void;
  }) => {
    if (!state.isUpdateAvailable) return null;

    return (
      <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-slide-down">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">🔄</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">
                Update Available
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                A new version of the app is available
              </p>
            </div>
          </div>
          
          <div className="mt-3 flex space-x-2">
            <button
              onClick={onUpdate}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Update
            </button>
            <button
              onClick={onDismiss}
              className="text-blue-600 px-3 py-1.5 text-sm font-medium hover:text-blue-700"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    );
  }, [state.isUpdateAvailable]);

  // Offline indicator
  const OfflineIndicator = useCallback(() => {
    if (!state.isOffline) return null;

    return (
      <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white px-4 py-2 text-center text-sm font-medium z-50">
        📵 You are currently offline. Some features may be limited.
      </div>
    );
  }, [state.isOffline]);

  return {
    ...state,
    installApp,
    updateApp,
    requestNotificationPermission,
    subscribeToPush,
    InstallPrompt,
    UpdatePrompt,
    OfflineIndicator
  };
};

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

export default usePWA;
