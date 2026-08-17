import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OBD2 Scanner Pro | Professional Automotive Diagnostic Tools',
  description: 'Premium OBD2 diagnostic scanners for all vehicles. EV/Hybrid support, Chinese brands coverage, professional workshop tools. Free shipping worldwide.',
  keywords: ['OBD2 scanner', 'automotive diagnostic', 'car scanner', 'EV diagnostic', 'professional scan tool'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
