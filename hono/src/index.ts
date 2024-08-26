import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import * as fs from 'fs';
import * as path from 'path';

// Definer korrekt mappesti for prosjektdata
const directoryPath = path.resolve(__dirname, '..', '..');

// Funksjon for å liste filer og mapper i `portfolio-1`
const listFilesInDirectory = (): string[] => {
  try {
    if (!fs.existsSync(directoryPath)) {
      console.error(`Directory does not exist: ${directoryPath}`);
      return [];
    }
    const files = fs.readdirSync(directoryPath);
    console.log('Files in directory:', files);
    return files;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
};

// Initialiser Hono-applikasjonen
const app = new Hono();

// Inline CSS
const styles = `
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    h1 {
      color: #333;
    }
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
    }
    button:hover {
      background-color: #0056b3;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      background: white;
      margin: 5px 0;
      padding: 10px;
      border-radius: 4px;
    }
  </style>
`;

// Rute for rot (/) - gir en velkomstmelding
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="no">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hovedside</title>
      ${styles}
    </head>
    <body>
      <h1>Velkommen til Prosjekter API</h1>
      <button onclick="window.location.href='/projects'">Se Prosjekter</button>
    </body>
    </html>
  `);
});

// Rute for å vise en liste over prosjekter
app.get('/projects', (c) => {
  const files = listFilesInDirectory();
  const fileItems = files.map(file => `<li>${file}</li>`).join('');
  return c.html(`
    <!DOCTYPE html>
    <html lang="no">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Prosjekter</title>
      ${styles}
    </head>
    <body>
      <h1>Liste over Prosjekter</h1>
      <ul>${fileItems}</ul>
      <button onclick="window.location.href='/'">Tilbake til Hjem</button>
    </body>
    </html>
  `);
});

// Start serveren
const port = 3000;
console.log(`Server is running on port ${port}`);
serve({
  fetch: app.fetch,
  port
});
