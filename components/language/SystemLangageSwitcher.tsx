"use client";

import { useEffect, useState } from "react";
import { groupBy } from "lodash";
import { cn } from "@/lib/utils";
import { gql } from "@apollo/client";
import { useGraphQLClientContext } from "@/components/providers/GraphQLClientProvider";
import { useLanguage } from "../providers/LanguageProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { LocaleInfo, formatLanguage } from "./utils";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const GetLanguages = gql`
  query GetLanguages {
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
  const [allLanguages, setAllLanguages] = useState<LocaleInfo[]>([]);
  const [languageDisplayNames, setLanguageDisplayNames] = useState<Intl.DisplayNames>();
  const [open, setOpen] = useState(false);

  const client = useGraphQLClientContext();

  const { setSystemLanguages, systemLanguages } = useLanguage();

  const languageSelected = (languageValues: string[]) => {
    setSystemLanguages(languageValues);
  };

  const fetchData = async () => {
    if (!client) {
      return;
    }
    const { data } = await client.query<SiteCollectionData>({
      query: GetLanguages,
    });

    if (data) {
      const foundLanguages = data.item.children.results.map<LocaleInfo>((x) => {
        return {
          isoCode: x.name,
          friendlyName: languageDisplayNames?.of(x.name) ?? "Unknown",
        };
      });

      setAllLanguages(foundLanguages);
    }
  };

  useEffect(() => {
    const userLang = window.navigator.language;
    const languageNames = new Intl.DisplayNames([userLang], {
      type: "language",
    });

    setLanguageDisplayNames(languageNames);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, languageDisplayNames]);

  if (!client) {
    return;
  }

  const selectedLanguage = allLanguages.filter((lang) =>
    systemLanguages.includes(lang.isoCode)
  );

  const localesByLanguage = groupBy(
    allLanguages,
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
          {selectedLanguage.map((x) => x.isoCode).join(", ")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ToggleGroup
          type="multiple"
          orientation="vertical"
          value={systemLanguages}
          onValueChange={languageSelected}
        >
          {Object.keys(localesByLanguage).map((lang) => {
            const locales = localesByLanguage[lang];
            return (
              <div key={lang} className="">
                <div className="font-bold text-lg">
                  {languageDisplayNames?.of(lang)}
                </div>
                <div className="justify-center items-center">
                  {locales.map((language) => {
                    return (
                      <ToggleGroupItem
                        key={language.isoCode}
                        value={`${language?.isoCode}`}
                        className=" text-left"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            systemLanguages.includes(language.isoCode)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span>{formatLanguage(language)}</span>
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
