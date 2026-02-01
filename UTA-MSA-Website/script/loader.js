(function() {
  const SESSION_KEY = 'msa_visited';
  const MIN_DISPLAY_TIME = 2500; // 2.5 seconds minimum display

  // Check if already visited in this session
  if (sessionStorage.getItem(SESSION_KEY)) {
    return; // Do nothing if already visited
  }

  // Create Loader Elements
  const loader = document.createElement('div');
  loader.id = 'msa-loader';
  
  const logo = document.createElement('img');
  logo.src = '../assets/msa-logo.png'; // Adjust path if needed relative to page, usually ../ works for pages/
  logo.alt = 'MSA Logo';
  logo.className = 'loader-logo';
  
  loader.appendChild(logo);
  document.body.appendChild(loader);

  // Lock Scroll
  document.body.style.overflow = 'hidden';

  // Mark as visited immediately so refreshes/navigation don't trigger it again
  sessionStorage.setItem(SESSION_KEY, 'true');

  // Remove Loader after delay
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    
    // Completely remove from DOM after transition
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 800); // Wait for CSS transition (0.8s)
  }, MIN_DISPLAY_TIME);

})();
