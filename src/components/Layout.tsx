import type { FC } from 'hono/jsx'
import { Head } from './Head.js'
import { Header } from './Header.js'
import { Footer } from './Footer.js'
import { ClientScript } from './ClientScript.js'

type LayoutProps = {
  year: number
  children: any
}

export const Layout: FC<LayoutProps> = ({ year, children }) => {
  return (
    <html lang="en">
      <Head year={year} />
      <body class="min-h-screen bg-gray-50 font-sans antialiased">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <Header year={year} />
          {children}
          <Footer />
        </div>
        <div id="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg opacity-0 transition-opacity duration-300 pointer-events-none text-sm font-medium">
          Copied!
        </div>
        <ClientScript />
      </body>
    </html>
  )
}
