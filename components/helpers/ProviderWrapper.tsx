import { GraphQLClientProvider } from '@/components/providers/GraphQLClientProvider';
import { GraphQLConnectionInfoProvider } from '@/components/providers/GraphQLConnectionInfoProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LogQueriesProvider } from '../providers/LogQueriesProvider';

export function ProviderWrapper({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" enableSystem>
      <GraphQLConnectionInfoProvider>
        <LogQueriesProvider>
          <GraphQLClientProvider>
            <LocaleProvider>{children}</LocaleProvider>
          </GraphQLClientProvider>
        </LogQueriesProvider>
      </GraphQLConnectionInfoProvider>
    </ThemeProvider>
  );
}
