import './globals.css'
import { Kanit } from 'next/font/google'
import { GlobalNav } from '@/components/global-nav'
import { LanguageProvider } from '@/components/language-provider'

const kanit = Kanit({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  display: 'swap',
})

export const metadata = {
  title: 'Gym App',
  description: 'Secure fitness tracking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={kanit.className}>
        <LanguageProvider>
          <GlobalNav>
            {children}
          </GlobalNav>
        </LanguageProvider>
      </body>
    </html>
  )
}
