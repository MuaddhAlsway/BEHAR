
import { useEffect } from "react";

/**
 * BEHAR — P14.3.8
 * Accessible Focus Trap Hook
 *
 * Features:
 * - Focuses the first interactive element on open
 * - Traps Tab and Shift+Tab inside the container
 * - Closes on Escape
 * - Restores focus when the container closes
 * - Ignores hidden, disabled, and inert elements
 * - Supports React refs and stable callbacks
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Return all currently focusable elements
 * within the provided container.
 */
function getFocusableElements(container) {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll(FOCUSABLE_SELECTOR)
  ).filter((element) => {
    if (!element.isConnected) return false;

    if (element.hasAttribute("disabled")) return false;

    if (element.closest("[inert]")) return false;

    if (element.closest('[aria-hidden="true"]')) {
      return false;
    }

    if (element.closest("[hidden]")) return false;

    if (element.tabIndex < 0) return false;

    if (element.getClientRects().length === 0) {
      return false;
    }

    const style = window.getComputedStyle(element);

    if (
      style.visibility === "hidden" ||
      style.display === "none"
    ) {
      return false;
    }

    return true;
  });
}

/**
 * useFocusTrap
 *
 * @param {Object} options
 * @param {boolean} options.active
 * @param {React.RefObject<HTMLElement>} options.containerRef
 * @param {Function} options.onEscape
 * @param {React.RefObject<HTMLElement>} options.returnFocusRef
 */
export default function useFocusTrap({
  active = false,
  containerRef,
  onEscape,
  returnFocusRef,
}) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef?.current;

    if (!container) return;

    const previouslyFocused = document.activeElement;

    /**
     * Initial focus
     */
    const focusableElements = getFocusableElements(container);

    const initialFocus =
      focusableElements[0] || container;

    // Allow focus on the container when it has
    // no interactive children.
    const originalTabIndex =
      container.getAttribute("tabindex");

    if (!container.hasAttribute("tabindex")) {
      container.setAttribute("tabindex", "-1");
    }

    initialFocus.focus();

    /**
     * Keyboard navigation
     */
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();

        onEscape?.();
        return;
      }

      if (event.key !== "Tab") return;

      const elements = getFocusableElements(container);

      if (elements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      const activeElement = document.activeElement;

      const isInside = container.contains(activeElement);

      /**
       * Shift + Tab
       */
      if (event.shiftKey) {
        if (!isInside || activeElement === first) {
          event.preventDefault();
          last.focus();
        }

        return;
      }

      /**
       * Tab
       */
      if (!isInside || activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    /**
     * Prevent focus from escaping via
     * mouse or programmatic focus changes.
     */
    function handleFocusIn(event) {
      if (!container.contains(event.target)) {
        const elements = getFocusableElements(container);

        (elements[0] || container).focus();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
      true
    );

    document.addEventListener(
      "focusin",
      handleFocusIn
    );

    /**
     * Cleanup and focus restoration
     */
    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
        true
      );

      document.removeEventListener(
        "focusin",
        handleFocusIn
      );

      if (originalTabIndex === null) {
        container.removeAttribute("tabindex");
      } else {
        container.setAttribute(
          "tabindex",
          originalTabIndex
        );
      }

      const returnTarget = returnFocusRef?.current;

      if (
        returnTarget?.isConnected &&
        !returnTarget.closest("[inert]")
      ) {
        returnTarget.focus();
      } else if (
        previouslyFocused?.isConnected &&
        !previouslyFocused.closest("[inert]")
      ) {
        previouslyFocused.focus();
      }
    };
  }, [
    active,
    containerRef,
    onEscape,
    returnFocusRef,
  ]);
}
