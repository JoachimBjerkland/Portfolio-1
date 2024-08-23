```mermaid
sequenceDiagram
    participant Bruker
    participant Applikasjon
    participant Server
    participant Database

    Bruker ->> Applikasjon: Start applikasjon
    Applikasjon ->> Server: Send GET-forespørsel for å laste alle prosjekter
    Server ->> Database: Hent alle prosjekter
    Database -->> Server: Returner prosjekter
    Server -->> Applikasjon: Send prosjekter
    Applikasjon -->> Bruker: Viser alle prosjekter