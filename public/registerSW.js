// Service Worker registration script for Dala Virtual City PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Optional registration logging in dev
        if (registration.installing) {
          console.debug('[Dala PWA] Service worker installing');
        } else if (registration.waiting) {
          console.debug('[Dala PWA] Service worker installed & waiting');
        } else if (registration.active) {
          console.debug('[Dala PWA] Service worker active');
        }
      })
      .catch((error) => {
        // Graceful handling of service worker errors without breaking the app
        console.warn('[Dala PWA] Service worker registration ignored:', error);
      });
  });
}
