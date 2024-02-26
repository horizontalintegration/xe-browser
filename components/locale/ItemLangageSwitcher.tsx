"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { gql } from "@apollo/client";
import { useGraphQLClientContext } from "@/components/providers/GraphQLClientProvider";
import { useLocale } from "../providers/LocaleProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { LocaleInfo, formatLocale } from "./utils";

const GetLocales = gql`
  query GetLocales($itemId: String!, $systemLocale: String!) {
    item(language: $systemLocale, path: $itemId) {
      languages {
        language {
          name
          englishName
        }
      }
    }
  }
`;

interface ItemLanguageData {
  item?: {
    languages: {
      language: {
        name: string;
        englishName: string;
      };
    }[];
  };
}

export function ItemLocaleSwitcher({ itemId }: { itemId?: string }) {
  const [selectedLocale, setSelectedLocale] = useState<string>("en");

  const [allLocaleInfos, setAllLocaleInfos] = useState<LocaleInfo[]>([]);
  const [open, setOpen] = useState(false);

  const client = useGraphQLClientContext();

  const { systemLocales, setItemLocale } = useLocale();

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

  const fetchData = async () => {
    if (!client || !itemId) {
      return;
    }
    for (let index = 0; index < systemLocales.length; index++) {
      const systemLocale = systemLocales[index];
      const { data } = await client.query<ItemLanguageData>({
        query: GetLocales,
        variables: { itemId, systemLocale },
      });

      if (data.item) {
        const foundLocales = data.item.languages.map<LocaleInfo>((x) => {
          return {
            isoCode: x.language.name,
            friendlyName: x.language.englishName,
          };
        });

        setAllLocaleInfos(foundLocales);
        // Since we're fetching other language versions, we only need the first one that's found
        // Once we found one, we're good.
        break;
      }
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, itemId]);

  if (!client) {
    return;
  }
  const selectedLocaleInfo = allLocaleInfos.find(
    (site) => site.isoCode === selectedLocale ?? "en"
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
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
                    "mr-2 h-4 w-4",
                    selectedLocale === localeInfo.isoCode
                      ? "opacity-100"
                      : "opacity-0"
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
