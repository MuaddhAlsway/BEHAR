export const SUPPORTED_LOCALES = ["en", "ar"];

export function isLocale(value) {
  return SUPPORTED_LOCALES.includes(value);
}

export function getLocaleFromPath(pathname) {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return isLocale(firstSegment) ? firstSegment : null;
}

export function getPathWithoutLocale(pathname) {
  const locale = getLocaleFromPath(pathname);
  if (!locale) return pathname || "/";

  const withoutLocale = pathname.slice(`/${locale}`.length);
  return withoutLocale || "/";
}

export function withLocale(pathname, locale) {
  const path = getPathWithoutLocale(pathname);
  return `/${isLocale(locale) ? locale : "en"}${path.startsWith("/") ? path : `/${path}`}`;
}
