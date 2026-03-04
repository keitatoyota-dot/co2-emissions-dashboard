# CO2 Emissions Dashboard

This project is a web application that calculates and visualizes corporate CO2 emissions based on the GHG Protocol.

The system estimates emissions across Scope 1, Scope 2, and Scope 3 and provides visual dashboards to help companies understand their environmental impact.

---

## Why I built this

While studying environmental management at university, I learned the importance of carbon accounting in ESG management.

Initially, I developed a personal carbon footprint calculator. However, individuals often do not know their exact electricity usage, making continuous usage difficult.

Therefore, I pivoted the concept toward companies, where electricity usage and fuel consumption data are already recorded. This led me to design a web application that helps organizations calculate their CO2 emissions more realistically.

---

## Features

- CO2 emissions calculation based on the GHG Protocol
- Scope 1, Scope 2, and Scope 3 categorization
- Industry-based emission templates
- Interactive dashboard visualization

---

## Live Demo

https://ecotrace-dash-yxlp63tb.manus.space

---

## Tech Stack

Frontend  
- React  
- TypeScript  

Visualization  
- Recharts  

Environment  
- Node.js

---

## Architecture

The system separates industry templates from the core calculation logic.

Each industry has different emission structures.

Examples:
- Manufacturing companies emit more from fuel usage
- Retail businesses emit more from refrigeration systems
- IT companies emit mainly from electricity consumption

This architecture allows new industries to be added without modifying the core logic.

---

## Setup

Clone the repository
