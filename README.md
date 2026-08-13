# ◆ THE INSTITUTE ◆

> *A fantasy-science organization website for planned future RPG*

---

## 🌌 About This Project

Welcome to **The Institute** — a fictional research organization from the upcoming "KLOERLAND" universe. This is a test website showcasing a futuristic, glossy design aesthetic inspired by **Frutiger Aero** design principles, featuring shimmering blues and greens.

### What is The Institute?

The Institute is an advanced research division within a game world where science meets fantasy. It houses multiple specialized departments dedicated to extraordinary research:

- **Holder 1** — [TEXT HERE]

---

## 🎮 RPG Context

This website serves as an **in-game web interface** for The Institute within an RPG universe. It currently takes the form of a static website, but there's room for improvement!

---

## 👨‍💻 About the Developer

This is a **test/learning project** made by a newbie HTML/CSS developer. It's a work in progress, and feedback is always welcome! 

---

## Magic Archive Data Flow

`magic-data.json` is the canonical read-only dataset used by both `admin.html` and `agent.html`.

The admin page keeps its working edits in browser `localStorage` and can export the edited dataset as a JSON file. Because this project is currently a static website, a browser cannot directly overwrite the deployed `magic-data.json`. To publish admin changes for all agents, export the JSON and replace the site's `magic-data.json` with that file.

Agents only read `magic-data.json` and have no edit/delete controls. The agent dashboard also requires the normal agent login flag before displaying the archive.
