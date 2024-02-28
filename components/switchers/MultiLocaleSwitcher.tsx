'use client';

import { useEffect, useState } from 'react';
import { groupBy } from 'lodash';
import { cn } from '@/lib/utils';
import { gql } from '@apollo/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { LocaleInfo, formatLocale } from '../locale/utils';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { getDataUtil } from '@/lib/graphql/util';
import { useQuerySettings } from '@/lib/hooks/use-query-settings';

const GetLocales = gql`
  query GetLocales {
    item(language: "en", path: "/sitecore/system/Languages") {
      children(first: 500) {
        results {
          name
        }
      }
    }
  }
`;

interface SiteCollectionData {
  item: {
    children: {
      results: {
        name: string;
      }[];
    };
  };
}

export interface MultiLocaleSwitcherProps {
  locales: string[];
  setLocales: (locales: string[]) => void;
}
export function MultiLocaleSwitcher({ locales, setLocales }: MultiLocaleSwitcherProps) {
  const [allLocaleInfos, setAllLocaleInfos] = useState<LocaleInfo[]>([]);
  const [localeDisplayNames, setLocaleDisplayNames] = useState<Intl.DisplayNames>();
  const [open, setOpen] = useState(false);

  const localeSelected = (localeValues: string[]) => {
    setLocales(localeValues);
  };

  const querySettings = useQuerySettings();
  const fetchData = async () => {
    if (!querySettings?.client) {
      return;
    }
    const data = await getDataUtil<SiteCollectionData>(querySettings, GetLocales);

    if (data) {
      const foundLocales = data.item.children.results.map<LocaleInfo>((x) => {
        return {
          isoCode: x.name,
          friendlyName: localeDisplayNames?.of(x.name) ?? 'Unknown',
        };
      });

      setAllLocaleInfos(foundLocales);
    }
  };

  useEffect(() => {
    const userLang = window.navigator.language;
    const displayNames = new Intl.DisplayNames([userLang], {
      type: 'language',
    });

    setLocaleDisplayNames(displayNames);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySettings, localeDisplayNames]);

  if (!querySettings?.client) {
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
