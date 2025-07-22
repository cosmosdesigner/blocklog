# Blocklog - Productivity & Blocker Analysis Tool

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2C5685?style=for-the-badge&logo=recharts&logoColor=white)

Blocklog is a sophisticated, client-side web application designed to help you track, visualize, and manage "blockers"—events that halt progress on your tasks. By logging the duration and reason for each block, you can gain powerful insights into productivity patterns, identify recurring obstacles, and ultimately reclaim lost time.

The application runs entirely in your browser, using `localStorage` for data persistence. This means it's fast, works offline, and keeps your data private to your device.

---

## ✨ Key Features

### 1. Core Block Management

- **Log New Blocks:** Quickly add new blocks with a title and reason via an intuitive modal.
- **Live Duration Tracking:** "Ongoing" blocks feature a real-time timer that ticks every second, providing an exact duration in days, hours, minutes, and seconds.
- **Resolve & Delete:** Mark blocks as "Resolved" to stop the timer or delete them entirely from your history.
- **Detailed History:** A chronological list displays all blocks, showing status, title, reason, start/end dates, and total duration.

### 2. Interactive Dashboard

The central hub for at-a-glance analytics and data visualization.

- **Key Stat Cards:**
  - **Total Blocks:** A running count of all blocks logged.
  - **Ongoing Blocks:** See how many issues are currently active.
  - **Total Time Blocked:** A precise, cumulative duration of all blocks.
  - **Longest Block:** Highlights your single most time-consuming blocker.
- **Interactive Drill-Down:** The "Longest Block" card is clickable, opening a detailed modal view for immediate investigation.

### 3. Advanced Data Visualization

Toggle between two powerful views to analyze your data over time.

- **📊 Monthly Bar Chart:** Aggregates total blocked time per month. Hover over a bar to see a detailed tooltip with the exact duration, making it easy to compare productivity across months.
- **🗓️ Yearly Calendar View:** A full-year "heatmap" grid where each day with an active block is highlighted. Hovering over a day reveals a tooltip listing the titles of all blocks from that day, perfect for spotting trends and recurring patterns.

### 4. Robust Data Management

Your data is valuable. Blocklog includes essential features for safety and portability.

- **Export to JSON:** Download a complete backup of all your block data into a single `.json` file.
- **Import from JSON:** Restore your data from a backup file, with a confirmation prompt to prevent accidental data overwrites and validation to ensure data integrity.

---

## 🚀 Getting Started

This project is set up with a **buildless** development environment. It uses ES Modules and an `importmap` to load dependencies like React and Recharts directly from a CDN (`esm.sh`).

**No installation or build step is required.**

Simply open the `index.html` file in a modern web browser (like Chrome, Firefox, or Edge) to run the application.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (used via CDN)
- **Charts:** [Recharts](https://recharts.org/) for responsive data visualizations.
- **Data Persistence:** Client-side `localStorage` via a custom `useLocalStorage` hook.
- **Development Environment:** Buildless setup using native browser ES Modules and `importmap`.

---

## 📁 File Structure

The project is organized into a modular structure with a clear separation of concerns.

```
.
├── 📄 .gitignore
├── 📄 README.md
├── 📄 index.html        # Main HTML entry point, includes CDN scripts and importmap.
├── 📄 index.tsx         # Root React component renderer.
├── 📄 App.tsx           # Main application component, manages state and logic.
├── 📄 metadata.json     # Application metadata.
├── 📄 types.ts          # Core TypeScript types and enums (Block, BlockStatus).
├── 📁 components/       # Reusable React components
│   ├── Button.tsx
│   ├── BlockCard.tsx
│   ├── BlockChart.tsx
│   ├── BlockDetails.tsx
│   ├── BlockForm.tsx
│   ├── BlockList.tsx
│   ├── Dashboard.tsx
│   ├── Header.tsx
│   ├── Modal.tsx
│   ├── StatCard.tsx
│   └── YearView.tsx
├── 📁 hooks/
│   └── useLocalStorage.ts # Custom hook for persisting state to localStorage.
└── 📁 lib/
    └── utils.ts         # Helper functions for date/time calculation, formatting, and validation.
```

### Component Breakdown:

- **`App.tsx`**: The top-level component that manages the global state (blocks, modals) and orchestrates the different parts of the application.
- **`Dashboard.tsx`**: Renders the statistics cards and handles the logic for switching between the `BlockChart` and `YearView`. Also contains the data import/export functionality.
- **`BlockList.tsx` / `BlockCard.tsx`**: Manages the display of individual block entries, including the live-updating timer.
- **`BlockChart.tsx`**: Visualizes aggregated block durations per month using a bar chart.
- **`YearView.tsx`**: Renders the full-year calendar heatmap.
- **`Modal.tsx`**: A generic modal component used for logging/editing blocks and viewing details.
- **`useLocalStorage.ts`**: A key hook that abstracts away the logic for reading from and writing to the browser's `localStorage`, making state persistence seamless.
- **`utils.ts`**: A crucial file containing pure functions for all business logic, such as calculating durations, formatting dates, and validating imported data.
