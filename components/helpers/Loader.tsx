import { LoaderIcon } from 'lucide-react';

export function WithLoader({
  loading,
  noText,
  children,
}: React.PropsWithChildren & { loading: boolean; noText?: boolean }) {
  const text = noText ? null : 'Loading...';
  if (loading) {
    return (
      <span>
        <LoaderIcon className="animate-spin" /> {text}
      </span>
    );
  }
  return children;
}
