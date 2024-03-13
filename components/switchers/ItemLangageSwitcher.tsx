'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { useGraphQLClientContext } from '@/components/providers/GraphQLClientProvider';
import { useLocale } from '../providers/LocaleProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { formatLocale } from '../../lib/locale/utils';
import { useItemLocales } from '@/lib/hooks/use-item-locales';

export function ItemLocaleSwitcher({ itemId }: { itemId?: string }) {
  const [selectedLocale, setSelectedLocale] = useState<string>('en');

  const [open, setOpen] = useState(false);

  const client = useGraphQLClientContext();

  const { setItemLocale } = useLocale();

  const allLocaleInfos = useItemLocales(itemId);

  const localeSelected = (localeValue: string) => {
    const selectedLocale = allLocaleInfos.find(
      (x) =>
        // For some reason the command returns selected value in lowercase
        x.isoCode?.toLocaleLowerCase() === localeValue?.toLocaleLowerCase()
    );

    if (selectedLocale) {
      setSelectedLocale(selectedLocale.isoCode);
      setItemLocale(selectedLocale.isoCode);
    }
    setOpen(false);
  };

  if (!client) {
    return;
  }
  const selectedLocaleInfo = allLocaleInfos.find((site) => site.isoCode === selectedLocale ?? 'en');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
          {formatLocale(selectedLocaleInfo)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search locale code..." />
          <CommandEmpty>No locales found.</CommandEmpty>
          <CommandGroup>
            {allLocaleInfos.map((localeInfo) => (
              <CommandItem
                key={localeInfo.isoCode}
                value={`${localeInfo?.isoCode}`}
                onSelect={localeSelected}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedLocale === localeInfo.isoCode ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {formatLocale(localeInfo)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
