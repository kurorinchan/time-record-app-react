# Time Recorder App

This is a simple React web application that allows you to track the current date
and time in real-time, record specific timestamps, and add a quick emoji note to
each entry. It keeps track of your 5 latest records using your browser's local
storage.

## Features

* **Real-time Clock:** Displays the current date and time, updating every second.
* **Timestamp Recording:** A button to instantly record the current date and time.
* **Emoji Notes:** Select a single-character emoji to associate with each recorded timestamp. Emojis can be edited after recording via a dropdown.
* **Elapsed Time:** Shows how much time has passed (in hours and minutes) since each timestamp was recorded for all entries.
* **Latest 5 Records:** Stores and displays only the 5 most recent entries, preventing indefinite growth of data.
* **Persistent Storage:** Records are saved in your browser's `localStorage`, so they persist even if you close and reopen the browser.
* **Clear Records:** A button to easily clear all recorded timestamps from `localStorage`.
* **Dark Theme:** A sleek, dark user interface for comfortable viewing.
* **Responsive Design:** Adapts to different screen sizes, with a wider table to prevent horizontal scrolling.

---

## Getting Started

Follow these steps to get a local copy of the project up and running on your machine.

### Prerequisites

* **Node.js:** Ensure you have Node.js installed (version 18 or higher is recommended). You can download it from [nodejs.org](https://nodejs.org/).
* **pnpm:** This project uses `pnpm` as its package manager. If you don't have it, you can install it globally:
    ```bash
    npm install -g pnpm
    ```

### Development Setup

1.  **Clone the repository:**

2.  **Install project dependencies:**
    This command will install all the necessary project dependencies, including React.
    ```bash
    pnpm install
    ```

3.  **Install and initialize Tailwind CSS:**
    If Tailwind CSS is not already configured in your project, follow these steps:

    1. Install Tailwind CSS, PostCSS, and Autoprefixer as dev dependencies:
    ```bash
    pnpm add -D tailwindcss postcss autoprefixer
    ```

    2. Generate your `tailwind.config.js` and `postcss.config.js` files:
    ```bash
    npx tailwindcss init -p
    ```

    3. Configure your template paths. Open `tailwind.config.js` and ensure the `content` array includes paths to all your component files (e.g., `.html`, `.js`, `.jsx`, `.ts`, `.tsx`):
    ```javascript
    // tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    export default {
        content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
        extend: {},
        },
        plugins: [],
    }
    ```

    4. Add the Tailwind directives to your `src/index.css` (or `src/App.css` or equivalent main CSS file):
    ```css
    /* src/index.css (or your main CSS file) */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

4.  **Run the development server:**
    This will start the Vite development server and open the app in your browser (usually at `http://localhost:5173/`).
    ```bash
    pnpm dev
    ```

    The app will automatically reload in your browser as you make changes to the source code.
