if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Get a reference to the loading overlay
const loadingOverlay = document.getElementById('loading-overlay');

// Function to hide the loading overlay
function hideLoadingOverlay() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        // Optional: Remove the element from the DOM after the transition for cleanliness
        loadingOverlay.addEventListener('transitionend', () => {
            loadingOverlay.style.display = 'none';
        }, { once: true }); // Ensure this listener runs only once
    }
}

// Service Worker Registration (your existing code, slightly modified)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);

        // Check if a service worker is already controlling the page (i.e., not a fresh install)
        if (navigator.serviceWorker.controller) {
          // If a SW is already active, hide the loader immediately.
          // This handles subsequent visits where resources are likely already cached.
          hideLoadingOverlay();
        } else {
          // First visit or new SW installation, wait for it to become ready (installed and active)
          // `registration.installing` and `registration.waiting` refer to specific states
          // `navigator.serviceWorker.ready` waits until an active SW is controlling the page.
          navigator.serviceWorker.ready.then(() => {
              console.log('Service Worker is ready and controlling the page. Hiding overlay.');
              hideLoadingOverlay();
          });
        }
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
        // If SW fails to register, you might want to hide the overlay anyway
        // or show a different message indicating offline functionality won't work.
        hideLoadingOverlay();
      });
  });
} else {
    // If Service Workers are not supported by the browser, hide the overlay immediately
    console.log('Service Workers not supported. Hiding overlay.');
    hideLoadingOverlay();
}