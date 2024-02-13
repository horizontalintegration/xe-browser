"use client";

import { useEffect, useState } from "react";

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { LanguageInfo, formatLanguage } from "./utils";

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
  const [systemLanguageCode, setSystemLanguage] = useLocalStorage<string>(
    "systemLanguage",
    "en"
  );

  const [languages, setLanguages] = useState<LanguageInfo[]>([]);
  const [open, setOpen] = useState(false);

  const client = useGraphQLClientContext();

  const { setSystemLanguage: setLanguage } = useLanguage();

  const languageSelected = (languageValue: string) => {
    const selectedLanguage = languages.find(
      (x) =>
        // For some reason the command returns selected value in lowercase
        x.isoCode?.toLocaleLowerCase() === languageValue?.toLocaleLowerCase()
    );

    if (selectedLanguage) {
      setSystemLanguage(selectedLanguage.isoCode);
      setLanguage(selectedLanguage.isoCode);
    }
    setOpen(false);
  };

  const fetchData = async () => {
    if (!client) {
      return;
    }
    const { data } = await client.query<SiteCollectionData>({
      query: GetLanguages,
    });

    if (data) {
      const userLang = window.navigator.language;
      const languageNames = new Intl.DisplayNames([userLang], {
        type: "language",
      });

      const foundLanguages = data.item.children.results.map<LanguageInfo>(
        (x) => {
          return {
            isoCode: x.name,
            friendlyName: languageNames.of(x.name) ?? "Unknown",
          };
        }
      );

      setLanguages(foundLanguages);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  if (!client) {
    return;
  }
  const selectedLanguage = languages.find(
    (site) => site.isoCode === systemLanguageCode ?? "en"
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
          {formatLanguage(selectedLanguage)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search language code..." />
          <CommandEmpty>No languages found.</CommandEmpty>
          <CommandGroup>
            {languages.map((language) => (
              <CommandItem
                key={language.isoCode}
                value={`${language?.isoCode}`}
                onSelect={languageSelected}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    systemLanguageCode === language.isoCode
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />

                {formatLanguage(language)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
