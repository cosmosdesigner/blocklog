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

---

## 🔮 Future Features & Roadmap

- **Tagging, Categorization & Filtering:**

  - ✅ Implement a **tag system** to allow users to categorize blockers during creation (e.g., "Dependency," "Technical Debt," "Awaiting Review").
  - ✅ Introduce advanced **filtering by tags** in the history view, making it easy to sort and find specific types of blockers.
  - ✅ Create a new dashboard widget to analyze **total time blocked by category**, revealing the most significant sources of friction and a AI suggestionto minimize souce of friction.

- **AI-Powered Unblocker Assistant:**

  - Integrate a large language model (LLM) like Gemini to provide proactive help. When a user logs a block, the AI could analyze the title and reason to:
    - Suggest potential solutions or troubleshooting steps.
    - Link to relevant internal documentation or public resources.
    - Identify similar past blockers and their resolutions.

- **Native Desktop Application:**

  - Package the application using **Tauri** or **Electron** to create a native desktop experience for Windows, macOS, and Linux. This would offer better OS integration, offline reliability, and system tray functionality.

- **Team Collaboration & Cloud Sync:**

  - Move beyond `localStorage` to an optional cloud-based backend (like Firebase or Supabase) to enable:
    - **Team-shared blocklogs:** Allow teams to see a unified view of all member blockers.
    - **Cross-device sync:** Access your Blocklog from any device.

- **Integrations with Developer Tools:**

  - Connect Blocklog to popular platforms like **Jira, GitHub, or Slack**.
  - For example, automatically log a blocker when a Jira ticket is moved to a "Blocked" column, or resolve it based on a GitHub commit message.

- **Reporting & Goal Setting:**
  - Generate exportable weekly or monthly Excel and/or PDF reports summarizing key metrics and trends.
  - Allow users or teams to set goals for reducing total blocked time and track their progress.
