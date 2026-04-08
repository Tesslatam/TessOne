import './globals.css';
import { ReactQueryProvider } from '../lib/react-query';

export const metadata = {
  title: 'TessOne',
  description: 'Sistema empresarial TessOne',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}