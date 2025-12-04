import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import app from '../dist/app.js'

const PUBLIC_DIR = join(process.cwd(), 'public')

async function generateStaticPages() {
  console.log('Generating static calendar pages...')

  const currentYear = new Date().getFullYear()
  const yearsToGenerate = []

  // Generate for current year ±10 years
  for (let i = -10; i <= 10; i++) {
    yearsToGenerate.push(currentYear + i)
  }

  // Ensure public directory exists
  await mkdir(PUBLIC_DIR, { recursive: true })

  // Generate index.html (current year) with client-side redirect if year changes
  const indexReq = new Request(`http://localhost/`)
  const indexRes = await app.fetch(indexReq)
  let indexHtml = await indexRes.text()

  // Inject redirect script that only redirects if current year differs
  const redirectScript = `
    <script>
      (function() {
        var currentYear = new Date().getFullYear();
        var pageYear = ${currentYear};
        if (currentYear !== pageYear) {
          window.location.href = '/' + currentYear;
        }
      })();
    </script>
  `
  // Insert script right after <head> tag
  indexHtml = indexHtml.replace('<head>', '<head>' + redirectScript)

  await writeFile(join(PUBLIC_DIR, 'index.html'), indexHtml)
  console.log(`✓ Generated / (${currentYear})`)

  // Generate each year page
  for (const year of yearsToGenerate) {
    const yearDir = join(PUBLIC_DIR, year.toString())
    await mkdir(yearDir, { recursive: true })

    const yearReq = new Request(`http://localhost/${year}`)
    const yearRes = await app.fetch(yearReq)
    const yearHtml = await yearRes.text()

    await writeFile(join(yearDir, 'index.html'), yearHtml)
    console.log(`✓ Generated /${year}`)
  }

  console.log(`\nSuccessfully generated ${yearsToGenerate.length + 1} static pages`)
}

generateStaticPages().catch(console.error)
