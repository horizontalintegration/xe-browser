export interface LanguageInfo {
  isoCode: string;
  friendlyName: string;
}

export function formatLanguage(languageInfo?: LanguageInfo) {
  if (!languageInfo) {
    return "No Language Selected";
  }
  return `${languageInfo?.isoCode} (${languageInfo?.friendlyName})`;
}
