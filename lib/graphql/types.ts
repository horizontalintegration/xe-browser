import { useGraphQLClientContext } from "@/components/providers/GraphQLClientProvider";

export type ApolloClientType = ReturnType<typeof useGraphQLClientContext>;

export interface Params {
  [paramName: string]: string;
}

export interface Fields {
  [fieldName: string]: { value: any };
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
  context: any;
  route: {
    name: string;
    fields: Fields;
    placeholders?: Placeholders;
  };
}
