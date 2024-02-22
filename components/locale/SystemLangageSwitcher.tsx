"use client";

import { useEffect, useState } from "react";
import { groupBy } from "lodash";
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
import { LocaleInfo, formatLocale } from "./utils";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

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

export function SystemLangageSwitcher() {
  const [allLocaleInfos, setAllLocaleInfos] = useState<LocaleInfo[]>([]);
  const [localeDisplayNames, setLocaleDisplayNames] = useState<Intl.DisplayNames>();
  const [open, setOpen] = useState(false);

  const client = useGraphQLClientContext();

  const { setSystemLocales, systemLocales } = useLocale();

  const localeSelected = (localeValues: string[]) => {
    setSystemLocales(localeValues);
  };

  const fetchData = async () => {
    if (!client) {
      return;
    }
    const { data } = await client.query<SiteCollectionData>({
      query: GetLocales,
    });

    if (data) {
      const foundLocales = data.item.children.results.map<LocaleInfo>((x) => {
        return {
          isoCode: x.name,
          friendlyName: localeDisplayNames?.of(x.name) ?? "Unknown",
        };
      });

      setAllLocaleInfos(foundLocales);
    }
  };

  useEffect(() => {
    const userLang = window.navigator.language;
    const displayNames = new Intl.DisplayNames([userLang], {
      type: "language",
    });

    setLocaleDisplayNames(displayNames);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, localeDisplayNames]);

  if (!client) {
    return;
  }

  const selectedLocale = allLocaleInfos.filter((lang) =>
    systemLocales.includes(lang.isoCode)
  );

  const localesByLanguage = groupBy(
    allLocaleInfos,
    (x) => x.isoCode.split("-")[0]
  );

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selectedLocale.map((x) => x.isoCode).join(", ")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ToggleGroup
          type="multiple"
          orientation="vertical"
          value={systemLocales}
          onValueChange={localeSelected}
        >
          {Object.keys(localesByLanguage).map((lang) => {
            const locales = localesByLanguage[lang];
            return (
              <div key={lang} className="">
                <div className="font-bold text-lg">
                  {localeDisplayNames?.of(lang)}
                </div>
                <div className="justify-center items-center">
                  {locales.map((localeInfo) => {
                    return (
                      <ToggleGroupItem
                        key={localeInfo.isoCode}
                        value={`${localeInfo?.isoCode}`}
                        className=" text-left"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            systemLocales.includes(localeInfo.isoCode)
                              ? "opacity-100"
                              : "opacity-0"
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
