/**
 * Smoothly scrolls to a target section by ID with an offset to account for the sticky header.
 * Avoids default jump behavior and updates the browser history cleanly.
 */
export function scrollToSection(sectionId: string, offset = 80): void {
  if (typeof window === "undefined") return;

  const targetId = sectionId.replace(/^#/, "");
  const element = document.getElementById(targetId);

  if (element) {
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
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
