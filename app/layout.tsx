import { Public_Sans } from 'next/font/google';
import './globals.css';
import BottomTabBar from '@/components/BottomTabBar';

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-public-sans'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} font-sans bg-background text-on-background max-w-md mx-auto min-h-screen relative pb-20`}>
        {children}
        <BottomTabBar />
      </body>
    </html>
  );
}