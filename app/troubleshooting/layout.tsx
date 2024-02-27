import { TroubleshootingNav } from './_components/TroubleshootingNav';

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <main>
      <TroubleshootingNav />

      {children}
    </main>
  );
}
