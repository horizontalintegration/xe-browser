'use client';
import { MultiLocaleSwitcher } from '@/components/switchers/MultiLocaleSwitcher';
import { useLocale } from '@/components/providers/LocaleProvider';
import { CheckAppRootResult, checkAppRoot } from '@/lib/graphql/check-app-root';
import { useEffect, useRef, useState } from 'react';
import { ResultsTable } from './_components/ResultsTable';
import { RenderIf } from '@/components/helpers/RenderIf';
import { useSiteList } from '@/lib/hooks/use-site-list';
import { LoaderIcon } from 'lucide-react';
import { useQuerySettings } from '@/lib/hooks/use-query-settings';
import { sortBy } from 'lodash';
import { ApolloError } from '@apollo/client';

export default function Page() {
  const { systemLocales } = useLocale();

  const [loading, setLoading] = useState<boolean>(false);
  const [locales, setLocales] = useState<string[]>([...systemLocales]);
  const [appRootResults, setAppRootResults] = useState<CheckAppRootResult[]>([]);

  const abortController = useRef(new AbortController());

  const querySettings = useQuerySettings(abortController.current.signal);

  const sites = useSiteList();

  async function getData() {
    if (!querySettings?.client) {
      return;
    }

    abortController.current = new AbortController();
    querySettings.abortSignal = abortController.current.signal;

    setLoading(true);
    setAppRootResults([]);
    const promises: Promise<CheckAppRootResult>[] = [];
    try {
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

      setAppRootResults(results);
    } catch (error) {
      if (error instanceof ApolloError) {
        if (error.networkError?.name === 'AbortError') {
        } else {
          console.error(error);
        }
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (sites.length && locales.length) {
      getData();
    }
    return () => {
      abortController.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySettings, sites, locales]);

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
      {/* <SiteSwitcher onSiteSelected={setSite} /> */}
      <RenderIf condition={loading}>
        <span>
          <LoaderIcon /> Loading
        </span>
      </RenderIf>
      {/* <RenderIf condition={sortedResults.length > 0}> */}
      <ResultsTable results={sortedResults} />
      {/* </RenderIf> */}
    </div>
  );
}
