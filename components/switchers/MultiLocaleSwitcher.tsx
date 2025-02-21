'use client';

import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { groupBy } from 'lodash';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { formatLocale } from '../../lib/locale/utils';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { useAllLocales } from '@/lib/hooks/use-all-locales';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import equal from 'fast-deep-equal/es6/react';

export interface MultiLocaleSwitcherProps {
  locales: string[];
  setLocales: Dispatch<SetStateAction<string[]>>;
}
export function MultiLocaleSwitcher(props: MultiLocaleSwitcherProps) {
  const [open, setOpen] = useState(false);

  const { allLocaleInfos } = useAllLocales();

  const { locales } = props;

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
          {locales.join(', ')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        {allLocaleInfos.length ? (
          <LocaleToggleGroup {...props} />
        ) : (
          <LocaleStringInput {...props} />
        )}
      </PopoverContent>
    </Popover>
  );
}
function LocaleStringInput({ locales, setLocales }: MultiLocaleSwitcherProps) {
  const [localeString, setLocaleString] = useState(locales.join(', '));

  const updateLocales = useCallback(() => {
    let localeArray = localeString.split(',').map((x) => x.trim());
    if (localeArray.length === 0) {
      localeArray = ['en'];
    }
    setLocales((locales) => {
      // Only update if it's changed, otherwise return the original array
      if (!equal(localeArray, locales)) {
        return localeArray;
      } else {
        return locales;
      }
    });
  }, [localeString, setLocales]);

  return (
    <div className="space-y-2">
      <Label htmlFor="locales">
        For Preview endpoints we cannot load the list of system locales. Type it in as a comma
        separated list
      </Label>
      <Input
        id="locales"
        autoComplete="off"
        value={localeString}
        onBlur={updateLocales}
        onChange={(e) => setLocaleString(e.target.value)}
      />
    </div>
  );
}
function LocaleToggleGroup({ locales, setLocales }: MultiLocaleSwitcherProps) {
  const { allLocaleInfos, localeDisplayNames } = useAllLocales();

  const localesByLanguage = groupBy(allLocaleInfos, (x) => x.isoCode.split('-')[0]);

  const localeSelected = (localeValues: string[]) => {
    // Only set if we have locales
    if (localeValues.length) {
      setLocales(localeValues);
    }
  };

  return (
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
  );
}
