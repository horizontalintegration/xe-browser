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
import { LanguageInfo, formatLanguage } from "./utils";

const GetLanguages = gql`
  query GetLanguages($itemId: String!, $systemLanguage: String!) {
    item(language: $systemLanguage, path: $itemId) {
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

export function ItemLangageSwitcher({ itemId }: { itemId?: string }) {
  const [selectedLanguageCode, setSelectedLanguageCode] =
    useState<string>("en");

  const [languages, setLanguages] = useState<LanguageInfo[]>([]);
  const [open, setOpen] = useState(false);

  const client = useGraphQLClientContext();

  const { systemLanguage, setItemLanguage } = useLanguage();

  const languageSelected = (languageValue: string) => {
    const selectedLanguage = languages.find(
      (x) =>
        // For some reason the command returns selected value in lowercase
        x.isoCode?.toLocaleLowerCase() === languageValue?.toLocaleLowerCase()
    );

    if (selectedLanguage) {
      setSelectedLanguageCode(selectedLanguage.isoCode);
      setItemLanguage(selectedLanguage.isoCode);
    }
    setOpen(false);
  };

  const fetchData = async () => {
    if (!client || !itemId) {
      return;
    }
    const { data } = await client.query<ItemLanguageData>({
      query: GetLanguages,
      variables: { itemId, systemLanguage },
    });

    if (data.item) {
      const foundLanguages = data.item.languages.map<LanguageInfo>((x) => {
        return {
          isoCode: x.language.name,
          friendlyName: x.language.englishName,
        };
      });

      setLanguages(foundLanguages);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, itemId]);

  if (!client) {
    return;
  }
  const selectedLanguage = languages.find(
    (site) => site.isoCode === selectedLanguageCode ?? "en"
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
                    selectedLanguageCode === language.isoCode
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
