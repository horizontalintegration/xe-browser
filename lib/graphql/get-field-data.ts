import { gql } from '@apollo/client';
import { ItemResponse } from './types';
import { QuerySettings, getDataUtil } from './util';

export const getFieldData = async (
  querySettings: QuerySettings,
  itemLocale: string,
  itemId?: string
): Promise<FieldResponse | null> => {
  const data = await getDataUtil<FieldResponse>(querySettings, GetFieldData, {
    path: itemId,
    itemLocale,
  });

  return data;
};

const GetFieldData = gql`
  query GetItemData($path: String! = "/sitecore", $itemLocale: String!) {
    item(path: $path, language: $itemLocale) {
      fields {
        name
        jsonValue
      }
    }
  }
`;

export interface UnknownField {
  __typename: string;
  name: string;
  jsonValue?: {
    value: string;
  };
}

export interface TextField {
  __typename: 'TextField';
  name: string;
  jsonValue?: {
    value: string;
  };
}

export interface RichTextField {
  __typename: 'RichTextField';
  name: string;
  jsonValue?: {
    value: string;
  };
}

export interface DateField {
  __typename: 'DateField';
  name: string;
  jsonValue?: {
    value: string;
  };
}

export interface CheckboxField {
  __typename: 'CheckboxField';
  name: string;
  jsonValue?: {
    value: boolean;
  };
}

export interface NumberField {
  __typename: 'NumberField';
  name: string;
  jsonValue?: {
    value: number;
  };
}
export interface LinkField {
  __typename: 'LinkField';
  name: string;
  jsonValue?: {
    value: {
      text: string;
      anchor: string;
      linktype: string;
      class: string;
      title: string;
      target: string;
      querystring: string;
      id?: string;
      href: string;
    };
  };
}

export interface ImageField {
  __typename: 'ImageField';
  name: string;
  jsonValue?: {
    value?: {
      src?: string;
      alt?: string;
      width?: `${number}`;
      height?: `${number}`;
    };
  };
}

export interface LookupField {
  __typename: 'LookupField';
  name: string;
  jsonValue?: ItemResponse;
}

export interface MultilistField {
  __typename: 'MultilistField';
  name: string;
  jsonValue?: ItemResponse[];
}

export type JsonField =
  | UnknownField
  | RichTextField
  | TextField
  | DateField
  | CheckboxField
  | NumberField
  | LinkField
  | ImageField
  | LookupField
  | MultilistField;

export interface FieldResponse {
  item?: {
    fields: JsonField[];
  };
}
