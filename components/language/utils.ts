export interface LocaleInfo {
  isoCode: string;
  friendlyName: string;
}

export function formatLanguage(localeInfo?: LocaleInfo) {
  if (!localeInfo) {
    return "No Locale Selected";
  }
  return `${localeInfo?.isoCode} (${localeInfo?.friendlyName})`;
}
