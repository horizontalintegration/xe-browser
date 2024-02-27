'use client';
import { SiteInfo, SiteSwitcher } from '@/app/layout/_components/SiteSwitcher';
import { useGraphQLClientContext } from '@/components/providers/GraphQLClientProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import { JsonViewWrapper } from '@/components/viewers/JsonViewWrapper';
import { CheckAppRootResult, checkAppRoot } from '@/lib/graphql/check-app-root';
import { useEffect, useState } from 'react';

export default function Page() {
  const { systemLocales } = useLocale();
  const [site, setSite] = useState<SiteInfo>();
  const [appRootResults, setAppRootResults] = useState<CheckAppRootResult[]>();
  const client = useGraphQLClientContext();

  useEffect(() => {
    async function getData() {
      if (!site) {
        return;
      }
      const results: CheckAppRootResult[] = [];
      for (let index = 0; index < systemLocales.length; index++) {
        const element = systemLocales[index];

        const result = await checkAppRoot(client, site.siteName, element);
        results.push(result);
      }
      setAppRootResults(results);
    }

    getData();
  }, [client, site, systemLocales]);

  return (
    <div>
      <p>
        {` Use this to troubleshoot "Error: Valid value for rootItemId not provided and failed to
        auto-resolve app root item."  Select a site and it will show you whether the app id was found in each language.`}
      </p>
      <p>
        {` For now it will only use the system languages selected in top right, but will add ability to select languages for this list.`}
      </p>
      <SiteSwitcher onSiteSelected={setSite} />
      <JsonViewWrapper data={appRootResults} />
    </div>
  );
}
