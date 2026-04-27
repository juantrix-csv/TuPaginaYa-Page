const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".main-nav");
const metricsConfig = window.TUPAGINAYA_METRICS || {};

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

function loadMetaPixel(pixelId) {
  if (!pixelId || typeof window.fbq === "function") {
    return;
  }

  (function initPixel(windowObject, documentObject, tagName, scriptUrl) {
    if (windowObject.fbq) {
      return;
    }

    const fbq = function trackPixel() {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, arguments);
      } else {
        fbq.queue.push(arguments);
      }
    };

    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    windowObject.fbq = fbq;

    const script = documentObject.createElement(tagName);
    script.async = true;
    script.src = scriptUrl;

    const firstScript = documentObject.getElementsByTagName(tagName)[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
  window.fbq("track", "ViewContent", {
    content_name: document.title,
    content_category: "landing_page"
  });
}

function trackMetric(eventName, params = {}) {
  if (typeof window.fbq !== "function") {
    return;
  }

  window.fbq("track", eventName, params);
}

function setupMetrics() {
  loadMetaPixel(metricsConfig.metaPixelId);

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest("[data-track-event]")
      : null;

    if (!(target instanceof HTMLAnchorElement)) {
      return;
    }

    const eventName = target.dataset.trackEvent;
    if (!eventName) {
      return;
    }

    trackMetric(eventName, {
      content_name: target.dataset.trackLabel || target.textContent?.trim() || "link",
      content_category: target.getAttribute("href")?.startsWith("https://") ? "outbound_link" : "cta"
    });
  });
}

setupMetrics();
