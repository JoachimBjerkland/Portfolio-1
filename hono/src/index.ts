import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import * as fs from 'fs'
import * as path from 'path'

// Definer korrekt mappesti for prosjektdata
const directoryPath = path.resolve(__dirname, '..', '..')

// Funksjon for å liste filer og mapper i `portfolio-1`
const listFilesInDirectory = (): string[] => {
  try {
    if (!fs.existsSync(directoryPath)) {
      console.error(`Directory does not exist: ${directoryPath}`)
      return []
    }
    const files = fs.readdirSync(directoryPath)
    console.log('Files in directory:', files)
    return files
  } catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
}

// Rute for rot (/) - gir en velkomstmelding
const app = new Hono()
app.get('/', (c) => {
  return c.text('Welcome to the Projects API!')
})

// Rute for å hente alle filer og mapper i `portfolio-1`
app.get('/projects', (c) => {
  const files = listFilesInDirectory()
  return c.json(files)
})

// Start serveren
const port = 3000
console.log(`Server is running on port ${port}`)
serve({
  fetch: app.fetch,
  port
})
