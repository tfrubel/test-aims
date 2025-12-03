// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize map only if the component exists on the page
  console.log("🪲 : Map initialized");

  initMap();
  console.log("🪲 : Map initialized");
});

function initMap() {
  const countryPaths = document.querySelectorAll("path.country");
  const countryBoxes = document.querySelectorAll(".country-box");
  const countryDataPointers = document.querySelectorAll("[data-pointer]");
  const mapSvg = document.querySelector(".map-svg");
  const mapSvgPaths = document.querySelectorAll(".map-svg path");

  // Make the svg map responsive
  if (mapSvg) {
    const svgWidth = mapSvg.getAttribute("width");
    const svgHeight = mapSvg.getAttribute("height");
    mapSvg.style.width = "100%";
    mapSvg.style.height = "auto";
    mapSvg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  }

  // Helper function to handle hover effects
  function handleHover(countryId, isHover, linkedSvgName) {
    const targetBox = document.querySelector(`.country-box.${countryId}`);
    const targetPath = document.querySelector(`path.country.${countryId}`);
    const countryNameElement = targetBox?.querySelector(".country-name");
    const countryColor = countryNameElement?.getAttribute("data-country-color");

    if (!countryColor) return;

    // Update box styles
    // if (targetBox) {
    //   targetBox.style.backgroundColor = isHover ? `${countryColor}20` : "";
    //   if (countryNameElement) {
    //     countryNameElement.style.color = isHover ? countryColor : "";
    //   }
    // }

    // Update path styles
    if (targetPath) {
      mapSvgPaths.forEach((path) => {
        path.style.transition = "opacity 0.3s ease";
        path.classList.toggle("opacity-20", isHover && path !== targetPath);
      });
      targetPath.classList.toggle("active", isHover);
    }

    // Update pointer elements
    countryDataPointers.forEach((pointer) => {
      const shouldActivate =
        pointer.getAttribute("data-pointer") === linkedSvgName;
      pointer.style.opacity = isHover ? (shouldActivate ? "1" : "0") : "1";
      pointer.classList.toggle("active", isHover && shouldActivate);
    });
  }

  // Set up event listeners for country paths
  countryPaths.forEach((path) => {
    path.style.position = "relative";
    const countryId = path.classList[1];
    if (!countryId) return;

    const countryBox = document.querySelector(`.country-box.${countryId}`);
    if (!countryBox) return;

    const linkedSvgName = countryBox.getAttribute("data-link-svg-name");

    path.addEventListener("mouseover", () =>
      handleHover(countryId, true, linkedSvgName),
    );
    path.addEventListener("mouseout", () =>
      handleHover(countryId, false, linkedSvgName),
    );
  });

  // Set up event listeners for data pointers
  countryDataPointers.forEach((pointerElem) => {
    const countryId = pointerElem.getAttribute("data-pointer");
    if (!countryId) return;

    const countryBox = document.querySelector(`.country-box.${countryId}`);
    if (!countryBox) return;

    const linkedSvgName = countryBox.getAttribute("data-link-svg-name");

    pointerElem.addEventListener("mouseover", () =>
      handleHover(countryId, true, linkedSvgName),
    );
    pointerElem.addEventListener("mouseout", () =>
      handleHover(countryId, false, linkedSvgName),
    );
  });

  // Set up event listeners for country boxes
  countryBoxes.forEach((box) => {
    const countryId = box.classList[1];
    const linkedSvgName = box.getAttribute("data-link-svg-name");

    box.addEventListener("mouseover", () =>
      handleHover(countryId, true, linkedSvgName),
    );
    box.addEventListener("mouseout", () =>
      handleHover(countryId, false, linkedSvgName),
    );
  });
}
