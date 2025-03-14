'use client';
import { MultiLocaleSwitcher } from '@/components/switchers/MultiLocaleSwitcher';
import { useLocale } from '@/components/providers/LocaleProvider';
import { CheckAppRootResult, checkAppRoot } from '@/lib/graphql/check-app-root';
import { useCallback, useState } from 'react';
import { ResultsTable } from './_components/ResultsTable';
import { useSiteList } from '@/lib/hooks/use-site-list';
import { sortBy } from 'lodash';
import { WithLoader } from '@/components/helpers/Loader';
import { QuerySettings } from '@/lib/graphql/util';
import { useFetchData } from '@/lib/hooks/use-fetch-data';

export default function Page() {
  const { systemLocales } = useLocale();

  const [locales, setLocales] = useState<string[]>([...systemLocales]);

  const sites = useSiteList();

  const fetchData = useCallback(
    async (querySettings: QuerySettings) => {
      const promises: Promise<CheckAppRootResult>[] = [];
      for (let siteIndex = 0; siteIndex < sites.length; siteIndex++) {
        const site = sites[siteIndex];
        for (let index = 0; index < locales.length; index++) {
          const element = locales[index];

          const promise = checkAppRoot(querySettings, site.siteName, element);
          promises.push(promise);
        }
      }
      // Batch the requests
      const results: CheckAppRootResult[] = await Promise.all(promises);
      return results;
    },
    [sites, locales]
  );

  const { loading, data } = useFetchData(fetchData);

  const appRootResults = data;

  const sortedResults = sortBy(
    appRootResults,
    (x) => x.success,
    (x) => x.siteName,
    (x) => x.language
  );

  return (
    <div>
      <p className="py-4">
        {` Use this to troubleshoot "Error: Valid value for rootItemId not provided and failed to
        auto-resolve app root item."`}
      </p>
      <MultiLocaleSwitcher locales={locales} setLocales={setLocales} />
      <WithLoader loading={loading}>
        <ResultsTable results={sortedResults} />
      </WithLoader>
    </div>
  );
}
