
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 07
 *
 * Reusable React hook for accessing CalendarContext.
 *
 * Provides access to:
 * - Academic and personal events
 * - Month, week and day navigation
 * - Calendar filters and search
 * - Personal event CRUD
 * - Modal management
 * - Storage and validation errors
 *
 * Must be used inside CalendarProvider.
 */

import { useContext } from "react";

import {
  CalendarContext,
} from "../context/CalendarContext";

/**
 * Access the Student Calendar context.
 *
 * @returns {object} Calendar state and actions
 *
 * @throws {Error} When used outside CalendarProvider
 */
export function useCalendar() {
  const context = useContext(CalendarContext);

  if (context === null) {
    throw new Error(
      "useCalendar must be used within a CalendarProvider."
    );
  }

  return context;
}

export default useCalendar;
