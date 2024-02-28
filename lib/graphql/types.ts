import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export type ApolloClientType = ApolloClient<NormalizedCacheObject> | undefined;

export interface Params {
  [paramName: string]: string;
}

export interface Fields {
  [fieldName: string]: { value: object };
}

export interface Placeholders {
  [phKey: string]: ComponentResponse[];
}

export interface ComponentResponse {
  uid: string;
  componentName: string;
  params?: Params;
  fields: Fields;
  placeholders?: Placeholders;
}

export interface ItemResponse {
  id: string;
  url: string;
  name: string;
  fields: Fields;
}

export interface LayoutResponse {
  layout?: LayoutItemResponse;
}

export interface LayoutItemResponse {
  item?: {
    rendered?: {
      sitecore: RenderedSitecoreData;
    };
  };
}

export interface RenderedSitecoreData {
  context: object;
  route: {
    name: string;
    fields: Fields;
    placeholders?: Placeholders;
  };
}
