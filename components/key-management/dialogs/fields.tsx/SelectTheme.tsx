import { EnvThemes } from '@/components/providers/ThemeProvider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';

export type SelectThemeProps = {
  id: string;
  envTheme: EnvThemes;
  setEnvTheme: Dispatch<SetStateAction<EnvThemes>>;
};
export function SelectTheme({ id, envTheme, setEnvTheme }: SelectThemeProps) {
  return (
    <Select value={envTheme} onValueChange={(e) => setEnvTheme(e as EnvThemes)}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Select a color scheme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Color</SelectLabel>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="green">Green</SelectItem>
          <SelectItem value="blue">Blue</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
