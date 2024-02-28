'use client';

import { useLocale } from '../providers/LocaleProvider';
import { MultiLocaleSwitcher } from './MultiLocaleSwitcher';

export function SystemLangageSwitcher() {
  const { setSystemLocales, systemLocales } = useLocale();

  return <MultiLocaleSwitcher locales={systemLocales} setLocales={setSystemLocales} />;
}
