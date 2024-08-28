// Importerer nødvendige moduler
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs/promises"; // Brukes for filoperasjoner

// Oppretter en ny Hono-applikasjon
const app = new Hono();

// Aktiverer CORS (Cross-Origin Resource Sharing) for alle ruter
app.use("/*", cors());

// Setter opp statisk filbetjening for filer i "static" mappen
app.use("/static/*", serveStatic({ root: "./" }));

// Initialiserer en tom liste med vaner (habits)
let habits = [];

// Funksjon for å laste vaner fra "habits.json"
async function loadHabits() {
  try {
    const data = await fs.readFile("habits.json", "utf8"); // Leser innholdet i habits.json
    habits = JSON.parse(data); // Pars det til et JSON-objekt
    console.log("Vaner lastet fra fil:", habits); // Logger til konsollen for verifikasjon
  } catch (error) {
    console.error("Kunne ikke laste vaner fra fil:", error);
  }
}

// Funksjon for å lagre vaner til "habits.json"
async function saveHabits() {
  try {
    await fs.writeFile("habits.json", JSON.stringify(habits, null, 2)); // Skriver oppdatert liste til habits.json
    console.log("Vaner lagret til fil."); // Logger suksess til konsollen
  } catch (error) {
    console.error("Kunne ikke lagre vaner til fil:", error);
  }
}

// Laster vaner ved oppstart
loadHabits();

// Definerer en POST-rute for å legge til nye vaner
app.post("/add", async (c) => {
  const newHabit = await c.req.json(); // Leser data fra forespørselen
  console.log("Mottatt ny vane:", newHabit);
  
  // Legger til den nye vanen i listen med en unik ID og tidsstempel
  habits.push({ id: crypto.randomUUID(), createdAt: new Date(), ...newHabit });
  
  // Lagrer oppdatert liste til fil
  await saveHabits();

  // Returnerer den oppdaterte listen med vaner og en 201 (Created) statuskode
  return c.json(habits, { status: 201 });
});

// Definerer en GET-rute for å hente alle vaner
app.get("/", (c) => {
  return c.json(habits); // Returnerer den nåværende listen over vaner
});

// Definerer porten serveren skal lytte på
const port = 3999;

console.log(`Server is running on port ${port}`);

// Starter serveren
serve({
  fetch: app.fetch,
  port,
});
