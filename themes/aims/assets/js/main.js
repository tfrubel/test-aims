// main script
(function () {
  ("use strict");

  // Dropdown Menu Toggler For Mobile
  // ----------------------------------------
  const dropdownMenuToggler = document.querySelectorAll(
    ".nav-dropdown > .nav-link",
  );

  dropdownMenuToggler.forEach((toggler) => {
    toggler?.addEventListener("click", (e) => {
      e.target.closest(".nav-item").classList.toggle("active");
    });
  });

  // Shuffle Filter (support multiple containers, scoped to their .initialize-shuffle)
  document.querySelectorAll(".initialize-shuffle").forEach(function (parent) {
    const container = parent.querySelector(".shuffle-container");
    if (!container) return;
    const filterButtons = parent.querySelectorAll("ul .shuffle-filter-btn");
    const shuffle = new Shuffle(container, {
      itemSelector: ".shuffle-item",
      sizer: null,
    });
    // Pre-select the first button for this container
    const firstButton = filterButtons[0];
    if (firstButton) {
      firstButton.classList.add("active");
      const filter = firstButton.getAttribute("data-filter");
      if (filter === "all") {
        shuffle.filter();
      } else {
        shuffle.filter((element) => {
          const groups = element.getAttribute("data-groups");
          return groups.includes(filter);
        });
      }
    }
    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Remove 'active' class from all buttons in this group
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Add 'active' class to the clicked button
        e.currentTarget.classList.add("active");
        const filter = e.currentTarget.getAttribute("data-filter");
        if (filter === "all") {
          shuffle.filter();
        } else {
          shuffle.filter((element) => {
            const groups = element.getAttribute("data-groups");
            return groups.includes(filter);
          });
        }
      });
    });
  });

  const handleNavbarScroll = () => {
    const header = document.querySelector(".header");

    if (window.scrollY > 240) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };

  // Handle Optimally load hero section video without hurting performance
  function initHeroVideo() {
    const video = document.getElementById("heroVideo");
    const placeholder = document.getElementById("videoPlaceholder");
    const source = video.querySelector("source");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    const slowConnection =
      connection &&
      (connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g");

    // Exit early if video shouldn't load
    if (prefersReducedMotion || slowConnection) {
      return;
    }

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          source.src = source.dataset.src;
          video.load();
          observer.disconnect();
        }
      },
      { rootMargin: "50px" },
    );

    // Only hide placeholder when video is playing
    video.addEventListener("playing", () => {
      if (placeholder) {
        placeholder.style.opacity = "0";
        placeholder.style.pointerEvents = "none";
      }
    });

    video.addEventListener("loadeddata", () => {
      video.play().catch((err) => console.log("Autoplay prevented:", err));
    });

    video.addEventListener("error", () => {
      console.error("Video failed to load");
    });

    // Visibility change handler
    document.addEventListener("visibilitychange", () => {
      document.hidden ? video.pause() : video.play().catch(() => {});
    });

    // Start observing
    observer.observe(video);
  }

  // Initialize hero video loading
  initHeroVideo();

  window.addEventListener("scroll", handleNavbarScroll);
})();

// Add alternating flares to sections (skip first section)
document
  .querySelectorAll(".section:not(:first-child)")
  .forEach((section, index) => {
    // Ensure section has relative positioning
    section.classList.add("relative");

    // Determine if this is an even or odd section (after skipping first)
    const isEven = index % 2 === 0;

    // Create flare element
    const flare = document.createElement("div");
    flare.className =
      "absolute top-0 w-[350px] h-[350px] pointer-events-none z-[1]";

    if (isEven) {
      // Left flare for even sections
      flare.classList.add("left-0");
      flare.style.backgroundImage = "url('../images/aims-flare-1.png')";
      flare.style.backgroundPosition = "left top";
    } else {
      // Right flare for odd sections
      flare.classList.add("right-0");
      flare.style.backgroundImage = "url('../images/aims-flare-2.png')";
      flare.style.backgroundPosition = "right top";
    }

    flare.style.backgroundRepeat = "no-repeat";
    flare.style.backgroundSize = "contain";

    // Add flare element to section
    section.appendChild(flare);
  });
