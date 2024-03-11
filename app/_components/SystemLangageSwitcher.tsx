'use client';

import { XeTooltip } from '../../components/helpers/Tooltip';
import { useLocale } from '../../components/providers/LocaleProvider';
import { MultiLocaleSwitcher } from '../../components/switchers/MultiLocaleSwitcher';

export function SystemLangageSwitcher() {
  const { setSystemLocales, systemLocales } = useLocale();

  return (
    <>
      <span>System locales</span>
      <XeTooltip>
        <p>The locales that are used for query the Sitecore tree.</p>
        <p>
          {`If an item isn't in one of these locales, it won't show up on the tree.  
                            Try to select the fewest number of locales possible, because queries will be made against 
                            every selected locale to ensure we aren't missing items.`}
        </p>
      </XeTooltip>
      <MultiLocaleSwitcher locales={systemLocales} setLocales={setSystemLocales} />
    </>
  );
}
