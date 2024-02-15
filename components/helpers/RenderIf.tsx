export type RenderIfProps = React.PropsWithChildren<{
  condition: boolean;
}>;
export function RenderIf({ condition, children }: RenderIfProps) {
  return condition ? children : null;
}
