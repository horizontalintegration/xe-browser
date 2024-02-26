export interface LocaleInfo {
  isoCode: string;
  friendlyName: string;
}

export function formatLocale(localeInfo?: LocaleInfo) {
  if (!localeInfo) {
    return "No Locale Selected";
  }
  return `${localeInfo?.isoCode} (${localeInfo?.friendlyName})`;
}
