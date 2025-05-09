/**
 * Collects all link elements, except buttons.
 * @returns {Object} An object containing the links array.
 */
function collectLinkElements() {
  const allLinks = [...document.querySelectorAll("a")];
  const filteredLinks = allLinks.filter(link => !link.classList.contains('no-scroll-animation') && !link.closest('.no-scroll-animation'));
  return { links: filteredLinks };
}

/**
 * Decorates link elements with cursor interaction.
 * @param {Object} elements - The elements object containing the links array.
 */
function decorateLinkElements(elements) {
  elements.links.forEach(function(element) {
    if (element.tagName === "A" &&
        !element.classList.contains("pema-button") &&
        !element.classList.contains("w-button") &&
        !element.classList.contains("w-inline-block") &&
        !element.classList.contains("w-nav-brand")) {
      element.classList.add("link", "underline-trail");
    }
  });
}

/**
 * Collects all button elements.
 * @returns {Object} An object containing the buttonElements array.
 */
function collectButtonElements() {
  const allButtons = [
    ...document.querySelectorAll(".pema-button---internal---new"),
    ...document.querySelectorAll(".pema-button---internal---new---centered"),
    ...document.querySelectorAll(".div---big-picture"),
    ...document.querySelectorAll(".direct-link---contact"),
  ];
  const filteredButtons = allButtons.filter(button => !button.classList.contains('no-scroll-animation') && !button.closest('.no-scroll-animation'));
  return { buttonElements: filteredButtons };
}

/**
 * Decorates button elements with animation.
 * @param {Object} elements - The elements object containing the buttonElements array.
 */
function decorateButtonElements(elements) {
  elements.buttonElements.forEach(function(element) {
    element.classList.add("animate-scroll-button");
  });
}

/**
 * Collects all text elements.
 * @returns {Object} An object containing the textElements array.
 */
function collectTextElements() {
  const allTextElements = [
    ...document.querySelectorAll("p"),
    ...document.querySelectorAll("h2"),
    ...document.querySelectorAll("h3"),
    ...document.querySelectorAll("h4"),
    ...document.querySelectorAll("h5"),
    ...document.querySelectorAll("h6"),
    ...document.querySelectorAll(".card---cable-assembly-benefit"),
    ...document.querySelectorAll(".faq-item---numbered"),
    ...document.querySelectorAll(".faq-item"),
    ...document.querySelectorAll(".checkmark-list---item"),
    ...document.querySelectorAll(".quality-control---point"),
    ...document.querySelectorAll(".highlighted-statement"),
    ...document.querySelectorAll(".list-item-3"),
    ...document.querySelectorAll(".list-item-3---narrow"),
    ...document.querySelectorAll(".list-item-4"),
    ...document.querySelectorAll(".location-advantage"),
    ...document.querySelectorAll(".manual-list---item"),
    ...document.querySelectorAll(".contact---name"),
    ...document.querySelectorAll(".contact---job-title"),
    ...document.querySelectorAll(".contact---job-role"),
    ...document.querySelectorAll(".contact---email"),
    ...document.querySelectorAll(".contact---phone"),
    ...document.querySelectorAll(".contact-footer---homepage---heading"),
    ...document.querySelectorAll(".contact-footer---homepage---greeting"),
    ...document.querySelectorAll(".flex-box---quote"),
    ...document.querySelectorAll(".flex-box---quote---text---container"),
    ...document.querySelectorAll(".quote-slide---heading"),
    ...document.querySelectorAll(".testing-process---flex-box"),
    ...document.querySelectorAll(".section---fold-out-text"),
    ...document.querySelectorAll(".location---byline"),
    ...document.querySelectorAll(".collection-item"),
    ...document.querySelectorAll(".location---address"),
    ...document.querySelectorAll(".location---link"),
    ...document.querySelectorAll(".staff---filters"),
    ...document.querySelectorAll(".staff---members---collection-list"),
    ...document.querySelectorAll(".contact-footer---homepage---staff---members---collection-list"),
    ...document.querySelectorAll(".download-link"),
    ...document.querySelectorAll(".internal-link---new"),
    ...document.querySelectorAll(".cell-3"),
    ...document.querySelectorAll(".text---topline"),
    ...document.querySelectorAll(".legends---text-block"),
  ];
  const filteredTextElements = allTextElements.filter(element => !element.classList.contains('no-scroll-animation') && !element.closest('.no-scroll-animation'));
  return { textElements: filteredTextElements };
}

/**
 * Decorates text elements with animation.
 * @param {Object} elements - The elements object containing the textElements array.
 */
function decorateTextElements(elements) {
  elements.textElements.forEach(function(element) {
    element.classList.add("animate-scroll");
  });
}

/**
 * Collects all image elements.
 * @returns {Object} An object containing the imageElements array.
 */
function collectImageElements() {
  const allImageElements = [
    ...document.querySelectorAll(".div-block-8"),
    ...document.querySelectorAll(".div-block-9"),
    ...document.querySelectorAll(".image---div-container"),
    ...document.querySelectorAll(".image---div-container---static"),
    ...document.querySelectorAll(".slider1"),
    ...document.querySelectorAll(".contact---image---div-container"),
    ...document.querySelectorAll(".div---expertise"),
    ...document.querySelectorAll(".image---info-box---leistungen"),
    ...document.querySelectorAll(".card---core-competencies"),
    ...document.querySelectorAll(".success-story---quote"),
    ...document.querySelectorAll(".sustainability---image"),
    ...document.querySelectorAll(".tabs-menu"),
    ...document.querySelectorAll(".location---image---container"),
    ...document.querySelectorAll(".card---career-benefit"),
    ...document.querySelectorAll(".flex-box---image-45---container"),
    ...document.querySelectorAll(".testing-process---point"),
  ];
  const filteredImageElements = allImageElements.filter(element => !element.classList.contains('no-scroll-animation') && !element.closest('.no-scroll-animation'));
  return { imageElements: filteredImageElements };
}

/**
 * Decorates image elements with animation.
 * @param {Object} elements - The elements object containing the imageElements array.
 */
function decorateImageElements(elements) {
  elements.imageElements.forEach(function(element) {
    element.classList.add("animate-scroll-image");
  });
}

// Initialize all functions
const linkElements = collectLinkElements();
decorateLinkElements(linkElements);

const buttonElements = collectButtonElements();
decorateButtonElements(buttonElements);

const textElements = collectTextElements();
decorateTextElements(textElements);

const imageElements = collectImageElements();
decorateImageElements(imageElements);