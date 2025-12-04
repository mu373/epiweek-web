import type { FC } from 'hono/jsx'

type HeadProps = {
  year: number
}

export const Head: FC<HeadProps> = ({ year }) => {
  return (
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Simple web calendar for MMWR epidemiological weeks with REST API" />
      <meta property="og:title" content="Epiweek Calendar" />
      <meta property="og:description" content="Simple web calendar for MMWR epidemiological weeks with REST API" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://epiweek.vercel.app/" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Epiweek Calendar" />
      <meta name="twitter:description" content="Simple web calendar for MMWR epidemiological weeks with REST API" />
      <title>Epiweek Calendar {year}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script dangerouslySetInnerHTML={{
        __html: `
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
            }
          }
        }
      }
    }
  `
      }} />
      <style type="text/css" dangerouslySetInnerHTML={{
        __html: `
    @layer base {
      html {
        scrollbar-gutter: stable;
      }
    }
    @layer utilities {
      .cell-size {
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  `
      }} />
    </head>
  )
}
