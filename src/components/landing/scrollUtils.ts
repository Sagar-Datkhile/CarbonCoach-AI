/**
 * Smoothly scrolls to a target section by ID with an offset to account for the sticky header.
 * Avoids default jump behavior and updates the browser history cleanly.
 */
export function scrollToSection(sectionId: string, offset = 80): void {
  if (typeof window === "undefined") return;

  const targetId = sectionId.replace(/^#/, "");

  if (targetId === "hero") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    try {
      window.history.pushState(null, "", "/");
    } catch {
      // Safely ignore history errors in non-standard environments
    }
    return;
  }

  const element = document.getElementById(targetId);

  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = Math.max(0, elementPosition - offset);

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    try {
      window.history.pushState(null, "", `#${targetId}`);
    } catch {
      // Safely ignore history errors in non-standard environments
    }
  }
}
