'use client';
import React, { useState } from 'react';
import NextImage from 'next/image';
import { Label } from '@/components/ui/label';
import {
  CheckboxField,
  DateField,
  FieldResponse,
  ImageField,
  JsonField,
  LinkField,
  LookupField,
  MultilistField,
  NumberField,
  RichTextField,
  TextField,
} from '@/lib/graphql/get-field-data';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { JsonViewWrapper } from '@/components/viewers/JsonViewWrapper';

export type FieldDataViewProps = {
  data: FieldResponse | null;
};

export type SelectedTabValue = 'sitecore-context' | 'route';

const renderField = (field: JsonField) => {
  switch (field.__typename) {
    case 'CheckboxField':
      return <CheckboxFieldView field={field as CheckboxField} />;
    case 'NumberField':
      return <NumberFieldView field={field as NumberField} />;
    case 'DateField':
      return <DateFieldView field={field as DateField} />;
    case 'TextField':
      if (typeof field.jsonValue?.value === 'string') {
        return <TextFieldView field={field as TextField} />;
      } else {
        return (
          <div>
            Unknown field type that was treated as TextField <JsonViewWrapper data={field} />
          </div>
        );
      }
    case 'RichTextField':
      return <RichTextFieldView field={field as RichTextField} />;
    case 'ImageField':
      return <ImageFieldView field={field as ImageField} />;
    case 'LinkField':
      return <LinkFieldView field={field as LinkField} />;
    case 'LookupField':
      return <LookupFieldView field={field as LookupField} />;
    case 'MultilistField':
      return <MultilistFieldView field={field as MultilistField} />;
    default:
      return (
        <div>
          Unknown field type: {field.__typename} <JsonViewWrapper data={field} />
        </div>
      );
  }
};

const TextFieldView = ({ field }: { field: TextField }) => {
  return field.jsonValue?.value;
};

const RichTextFieldView = ({ field }: { field: RichTextField }) => {
  return <div dangerouslySetInnerHTML={{ __html: field.jsonValue?.value ?? '' }}></div>;
};

const DateFieldView = ({ field }: { field: DateField }) => {
  const dateNumber = Date.parse(field.jsonValue?.value ?? '');
  if (Number.isNaN(dateNumber)) {
    return `Invalid date: ${field.jsonValue?.value}`;
  }
  const date = new Date(dateNumber);
  return date.toLocaleString();
};

const CheckboxFieldView = ({ field }: { field: CheckboxField }) => {
  return <Switch checked={field.jsonValue?.value} disabled />;
};

const NumberFieldView = ({ field }: { field: NumberField }) => {
  return field.jsonValue?.value?.toString();
};

const LinkFieldView = ({ field }: { field: LinkField }) => {
  return <JsonViewWrapper data={field.jsonValue?.value as object} />;
};

const ImageFieldView = ({ field }: { field: ImageField }) => {
  const imgData = field.jsonValue?.value;

  const { src, alt, width, height } = imgData ?? {};
  const renderImage = !!src;
  const renderNextImage =
    renderImage && src?.startsWith('https://edge.sitecorecloud.io') && width && height;

  return (
    <div>
      {renderNextImage ? (
        <NextImage src={src} width={width} height={height} alt={alt ?? ''} />
      ) : renderImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} />
      ) : null}
      <JsonViewWrapper data={imgData as object} collapsed={true} />
    </div>
  );
};

const LookupFieldView = ({ field }: { field: LookupField }) => {
  return (
    <div>
      {field.jsonValue?.name}
      <JsonViewWrapper data={field.jsonValue as object} collapsed={true} />
    </div>
  );
};

const MultilistFieldView = ({ field }: { field: MultilistField }) => {
  if (!field.jsonValue?.map) {
    return (
      <div>
        Item is not part of a site, could not get proper JSON value, displaying raw values
        <JsonViewWrapper data={field.jsonValue as object} />
      </div>
    );
  }
  return (
    <ol>
      {field.jsonValue?.map((x) => {
        return (
          <li key={x.id}>
            {x.name}:
            <JsonViewWrapper data={x} collapsed={true} />
          </li>
        );
      })}
    </ol>
  );
};

const FieldDataView = ({ data }: FieldDataViewProps) => {
  const [showFriendlyView, setShowFriendlyView] = useState<boolean>(true);

  return (
    <div>
      <Label className="px-4 py-2 flex space-x-2">
        <span>Show Friendly View</span>
        <Switch
          checked={showFriendlyView}
          onCheckedChange={(x) => setShowFriendlyView(x === true)}
        />
      </Label>

      {showFriendlyView ? (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-60">Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.item?.fields.map((x) => {
                return (
                  <TableRow key={x.name}>
                    <TableCell>
                      {x.name} ({x.__typename})
                    </TableCell>
                    <TableCell>{renderField(x)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <JsonViewWrapper data={data as object} />
      )}
    </div>
  );
};

export default FieldDataView;
