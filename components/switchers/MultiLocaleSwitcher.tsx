'use client';

import { useState } from 'react';
import { groupBy } from 'lodash';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { formatLocale } from '../../lib/locale/utils';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { useAllLocales } from '@/lib/hooks/use-all-locales';

export interface MultiLocaleSwitcherProps {
  locales: string[];
  setLocales: (locales: string[]) => void;
}
export function MultiLocaleSwitcher({ locales, setLocales }: MultiLocaleSwitcherProps) {
  const [open, setOpen] = useState(false);

  const { allLocaleInfos, localeDisplayNames } = useAllLocales();

  const localeSelected = (localeValues: string[]) => {
    const validLocales = localeValues.filter((x) => allLocaleInfos.find((l) => l.isoCode === x));

    if (validLocales.length) {
      setLocales(validLocales);
    }
  };

  if (!allLocaleInfos.length) {
    return;
  }

  const selectedLocale = allLocaleInfos.filter((lang) => locales.includes(lang.isoCode));

  const localesByLanguage = groupBy(allLocaleInfos, (x) => x.isoCode.split('-')[0]);

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
          {selectedLocale.map((x) => x.isoCode).join(', ')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ToggleGroup
          type="multiple"
          orientation="vertical"
          value={locales}
          onValueChange={localeSelected}
        >
          {Object.keys(localesByLanguage).map((lang) => {
            const localeInfos = localesByLanguage[lang];
            return (
              <div key={lang} className="">
                <div className="font-bold text-lg">{localeDisplayNames?.of(lang)}</div>
                <div className="justify-center items-center">
                  {localeInfos.map((localeInfo) => {
                    return (
                      <ToggleGroupItem
                        key={localeInfo.isoCode}
                        value={`${localeInfo?.isoCode}`}
                        className=" text-left"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            locales.includes(localeInfo.isoCode) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span>{formatLocale(localeInfo)}</span>
                      </ToggleGroupItem>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}
