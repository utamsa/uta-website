(function () {
  const SESSION_KEY = "msa_visited";
  const MIN_DISPLAY_TIME = 2500;
  const PAGE_TRANSITION_MS = 220;
  let isNavigating = false;

  function createLoader(isTransition) {
    const loader = document.createElement("div");
    loader.id = "msa-loader";
    if (isTransition) loader.classList.add("page-transition");

    const logo = document.createElement("img");
    logo.src = "../assets/msa-logo.png";
    logo.alt = "MSA Logo";
    logo.className = "loader-logo";
    if (isTransition) logo.classList.add("loader-logo-fast");

    loader.appendChild(logo);
    document.body.appendChild(loader);
    return loader;
  }

  function shouldHandleLinkClick(event, link) {
    if (!link) return false;
    if (event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.hasAttribute("download") || link.dataset.noTransition !== undefined) return false;

    const target = (link.getAttribute("target") || "").toLowerCase();
    if (target && target !== "_self") return false;

    const rawHref = (link.getAttribute("href") || "").trim();
    if (!rawHref) return false;
    if (
      rawHref.startsWith("#") ||
      rawHref.startsWith("mailto:") ||
      rawHref.startsWith("tel:") ||
      rawHref.startsWith("javascript:")
    ) {
      return false;
    }

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;

    // Let in-page hash jumps stay instant.
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      return false;
    }

    return true;
  }

  function setupPageTransitions() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!shouldHandleLinkClick(event, link)) return;
      if (isNavigating) {
        event.preventDefault();
        return;
      }

      isNavigating = true;
      event.preventDefault();

      const destination = link.href;
      document.body.classList.add("page-transitioning");

      const loader = createLoader(true);
      requestAnimationFrame(() => {
        loader.classList.add("active");
      });

      setTimeout(() => {
        window.location.href = destination;
      }, PAGE_TRANSITION_MS);
    });
  }

  setupPageTransitions();

  if (sessionStorage.getItem(SESSION_KEY)) {
    return;
  }

  const loader = createLoader(false);
  document.body.style.overflow = "hidden";
  sessionStorage.setItem(SESSION_KEY, "true");

  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.style.overflow = "";

    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 800);
  }, MIN_DISPLAY_TIME);
})();
