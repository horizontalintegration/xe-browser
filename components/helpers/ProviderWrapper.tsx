import { GraphQLClientProvider } from '@/components/providers/GraphQLClientProvider';
import { ApiKeyProvider } from '@/components/providers/ApiKeyProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LogQueriesProvider } from '../providers/LogQueriesProvider';

export function ProviderWrapper({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" enableSystem>
      <ApiKeyProvider>
        <LogQueriesProvider>
          <GraphQLClientProvider>
            <LocaleProvider>{children}</LocaleProvider>
          </GraphQLClientProvider>
        </LogQueriesProvider>
      </ApiKeyProvider>
    </ThemeProvider>
  );
}
