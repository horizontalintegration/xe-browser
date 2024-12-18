'use client';
import { MultiLocaleSwitcher } from '@/components/switchers/MultiLocaleSwitcher';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useCallback, useState } from 'react';
import { ResultsTable } from './_components/ResultsTable';
import { useSiteList } from '@/lib/hooks/use-site-list';
import { sortBy } from 'lodash';
import { getAllSiteInfo } from '@/lib/graphql/get-site-info';
import { GetAllSiteInfoResult } from '@/lib/graphql/types';
import { QuerySettings } from '@/lib/graphql/util';
import { useFetchData } from '@/lib/hooks/use-fetch-data';
import { WithLoader } from '@/components/helpers/Loader';

export default function Page() {
  const { systemLocales } = useLocale();

  const [locales, setLocales] = useState<string[]>([...systemLocales]);

  const sites = useSiteList();

  const fetchData = useCallback(
    async (querySettings: QuerySettings) => {
      if (!sites.length) return [];
      const promises: Promise<GetAllSiteInfoResult[]>[] = [];

      for (let index = 0; index < locales.length; index++) {
        const locale = locales[index];

        const promise = getAllSiteInfo(querySettings, locale);
        promises.push(promise);
      }
      // Batch the requests
      const results: GetAllSiteInfoResult[] = (await Promise.all(promises)).flat();
      return results;
    },
    [locales, sites]
  );

  const { loading, data: siteInfoResults } = useFetchData(fetchData);

  const sortedResults = sortBy(
    siteInfoResults,
    (x) => x.siteName,
    (x) => x.language
  );

  return (
    <div>
      <MultiLocaleSwitcher locales={locales} setLocales={setLocales} />

      <WithLoader loading={loading}>
        <ResultsTable results={sortedResults} />
      </WithLoader>
    </div>
  );
}
