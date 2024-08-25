import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import * as fs from 'fs'
import * as path from 'path'


const directoryPath = path.resolve(__dirname, '..', '..')


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


const readProjectsFromFile = (): any[] => {
  const dataFilePath = path.join(directoryPath, 'projects.json')
  if (!fs.existsSync(dataFilePath)) {
    console.log('No projects.json file found, returning empty list.')
    return []
  }
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading or parsing projects.json:', error)
    return []
  }
}


const writeProjectsToFile = (projects: any[]) => {
  const dataFilePath = path.join(directoryPath, 'projects.json')
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing to projects.json:', error)
  }
}

const app = new Hono()


let projects: any[] = readProjectsFromFile()


app.get('/', (c) => {
  return c.text('Welcome to the Projects API!')
})


app.get('/projects', (c) => {
  const files = listFilesInDirectory()
  return c.json(files)
})


app.post('/projects', async (c) => {
  try {
    const newProject = await c.req.json()
    projects.push(newProject)
    writeProjectsToFile(projects)
    return c.json({ message: 'Project added successfully' }, 201)
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return c.json({ message: 'Invalid JSON' }, 400)
  }
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
