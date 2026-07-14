import { Public_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { ProfileProvider } from '@/lib/profile';
import AppShell from '@/components/AppShell';

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-public-sans'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} font-sans bg-background text-on-background min-h-screen relative`}>
        <AuthProvider>
          <ProfileProvider>
            <AppShell>{children}</AppShell>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}