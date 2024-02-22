import React18JsonView from "react18-json-view";
import 'react18-json-view/src/style.css'
import 'react18-json-view/src/dark.css'

export type JsonViewWrapperProps = {
  data: object;
  /** When set to true, all nodes will be collapsed by default. Use an integer value to collapse at a particular depth. @default false */
  collapsed?: boolean | number;
};
export function JsonViewWrapper({ data, collapsed }: JsonViewWrapperProps) {
  return <React18JsonView src={data} enableClipboard theme="winter-is-coming" collapsed={collapsed} displaySize="collapsed" />;
}
