// Henter referanser til HTML-elementer
const form = document.getElementById("habitForm");
const habitsList = document.getElementById("habitsList");
const habits = []; // Intern liste med vaner

// Funksjon for å oppdatere visningen av vaner på nettsiden
function updateHabitsList() {
  console.log(habits); // Logger vanene til konsollen
  habitsList.innerHTML = ""; // Tømmer listen før ny oppdatering

  // Legger til hver vane som et listeelement
  for (const habit of habits) {
    const listItem = document.createElement("li");
    listItem.textContent = `${habit.title} - ${new Date(habit.createdAt).toLocaleDateString()}`;
    habitsList.appendChild(listItem);
  }
}

// Funksjon for å hente alle vaner fra serveren
function fetchAllHabits() {
  console.log("Prøver å hente alle vaner fra serveren...");
  fetch("http://localhost:3999/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP-feil! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Alle vaner fra serveren:", data); // Logger alle vaner fra serveren
      habits.push(...data); // Legger til vaner fra serveren i den interne listen
      updateHabitsList(); // Oppdaterer visningen på nettsiden
    })
    .catch((error) => {
      console.error("Feil ved henting av vaner fra serveren:", error);
    });
}

// Laster alle vaner ved oppstart
fetchAllHabits();

// Legger til en lytter som fanger opp sending av skjema
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Forhindrer standard oppførsel ved sending av skjema

  // Oppretter et nytt vane-objekt basert på brukerens input
  const newHabit = {
    title: event.target.elements.title.value,
    createdAt: new Date().toISOString(),
  };

  // Forsøker å sende vanen til serveren
  try {
    const response = await fetch("http://localhost:3999/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHabit),
    });

    // Håndterer serverresponsen
    if (response.status === 201) {
      console.log("Vane lagret på serveren");
      habits.push(newHabit); // Legger til den nye vanen i den interne listen
      updateHabitsList(); // Oppdaterer visningen av vaner på nettsiden
    } else {
      console.error("Feil ved lagring av vane på serveren");
    }
  } catch (error) {
    console.error("Feil ved sending av data til serveren:", error);
  }
});
