# Wordly

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Zustand-5-orange?style=flat-square" alt="Zustand 5" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

<p align="center">
  A beautiful, modern Wordle-inspired word guessing game built with the latest web technologies.
</p>

---

## ✨ Features

- **🎮 Two Game Modes** — Play the **Daily** challenge (same word for everyone each day) or **Random** mode for unlimited practice
- **⌨️ On-Screen Keyboard** — Fully interactive keyboard with color-coded feedback showing letter states
- **📊 Statistics Tracking** — Track your games played, win percentage, current streak, max streak, and guess distribution
- **📜 Score History** — View your complete game history with scores, words, and timestamps
- **🎯 Smart Scoring** — Earn more points for solving in fewer guesses
- **📤 Share Results** — Copy your results as emoji grids to share with friends (🟩🟨⬛)
- **💾 Persistent State** — Game progress and statistics saved locally in your browser
- **📱 Responsive Design** — Beautiful UI that works seamlessly on desktop and mobile
- **🎨 Modern Animations** — Smooth tile flips, shake effects for invalid guesses, and celebratory animations

## 🚀 Demo

**[Play Wordly Live →](https://wordlyapp.vercel.app)**

## 📦 Tech Stack

| Category             | Technology                                                    |
| -------------------- | ------------------------------------------------------------- |
| **Framework**        | [Next.js 16](https://nextjs.org/) with App Router & Turbopack |
| **UI Library**       | [React 19](https://react.dev/)                                |
| **Language**         | [TypeScript 5](https://www.typescriptlang.org/)               |
| **Styling**          | [Tailwind CSS 4](https://tailwindcss.com/)                    |
| **State Management** | [Zustand 5](https://zustand-demo.pmnd.rs/)                    |
| **Date Utilities**   | [date-fns 4](https://date-fns.org/)                           |
| **Linting**          | [ESLint 9](https://eslint.org/) with flat config              |

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 18.17 or later ([download](https://nodejs.org/))
- **npm** 9+ or **yarn** or **pnpm**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/brown2020/wordly.git
   cd wordly
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start development server with Turbopack |
| `npm run build` | Create optimized production build       |
| `npm run start` | Start production server                 |
| `npm run lint`  | Run ESLint checks                       |

## 🎯 How to Play

1. **Start a game** — Choose between Daily mode (one word per day) or Random mode (unlimited games)
2. **Make a guess** — Type a 5-letter word using your keyboard or the on-screen keyboard
3. **Submit** — Press Enter to submit your guess
4. **Read the feedback**:
   - 🟩 **Green** — Letter is correct and in the right position
   - 🟨 **Yellow** — Letter is in the word but wrong position
   - ⬛ **Gray** — Letter is not in the word
5. **Win or lose** — Guess the word within 6 attempts to win!

## 📁 Project Structure

```
wordly/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Home page
│   │   ├── error.tsx           # Error boundary
│   │   ├── loading.tsx         # Loading state
│   │   ├── not-found.tsx       # 404 page
│   │   ├── globals.css         # Global styles
│   │   └── scores/             # Scores routes
│   │       ├── page.tsx        # Full scores page
│   │       └── (..)scores/     # Intercepting route for modal
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Modal.tsx       # Generic modal component
│   │   │   └── icons.tsx       # SVG icon components
│   │   ├── keyboard/           # Keyboard components
│   │   │   └── OnscreenKeyboard.tsx
│   │   ├── WordlyMain.tsx      # Main game container
│   │   ├── GameBoard.tsx       # Game grid with tiles
│   │   ├── GameTile.tsx        # Individual letter tile
│   │   ├── GameHeader.tsx      # Logo, score, mode toggle
│   │   ├── GameControls.tsx    # Action buttons
│   │   ├── GameOverModal.tsx   # Win/lose modal
│   │   ├── StatsModal.tsx      # Statistics display
│   │   ├── ScoresClient.tsx    # Score history table
│   │   └── AttemptsCounter.tsx # Attempts display
│   │
│   ├── stores/                 # Zustand state management
│   │   └── game-store.ts       # Main game state store
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useGameController.ts # Game logic orchestration
│   │   ├── useGameStats.ts     # Statistics persistence
│   │   └── useScores.ts        # Score history loading
│   │
│   ├── utils/                  # Utility functions
│   │   ├── game-utils.ts       # Game logic (evaluate guess, etc.)
│   │   └── stats-utils.ts      # Statistics calculations
│   │
│   ├── constants/              # App constants
│   │   ├── constants.ts        # Game config, styles, storage keys
│   │   └── wordlist.ts         # Word dictionary
│   │
│   └── types/                  # TypeScript type definitions
│       └── types.ts            # Shared types
│
├── public/                     # Static assets
├── eslint.config.mjs           # ESLint flat config
├── tailwind.config.js          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🏗️ Architecture

### State Management

The app uses **Zustand** for global state management with the following design:

- **`game-store.ts`** — Single store managing all game state including:
  - Current game (answer, guesses, evaluations)
  - UI state (revealing animations, invalid guess shake)
  - Keyboard state (letter colors)
  - Score and mode (daily/random)
  - Persisted to localStorage for mode preference and cumulative score

### Data Flow

```
User Input → useGameController → game-store → Components
                    ↓
              useGameStats → localStorage (scores)
```

### Key Design Decisions

- **React Server Components** — Layout and metadata rendered on server
- **Client Components** — Game logic marked with `"use client"` where needed
- **Memoization** — `GameRow` and `GameTile` memoized to prevent unnecessary re-renders
- **Fine-grained Selectors** — Zustand selectors minimize re-renders
- **Dynamic Imports** — Keyboard loaded client-side only

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and ensure:
   - Code passes linting (`npm run lint`)
   - Build succeeds (`npm run build`)
   - TypeScript has no errors
4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New features
- `fix:` — Bug fixes
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `perf:` — Performance improvements
- `test:` — Test additions or fixes
- `chore:` — Maintenance tasks

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html) by Josh Wardle
- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/)
- State management powered by [Zustand](https://zustand-demo.pmnd.rs/)

## 📬 Contact

For questions, feedback, or issues:

- **GitHub Issues**: [Open an issue](https://github.com/brown2020/wordly/issues)
- **Email**: [info@ignitechannel.com](mailto:info@ignitechannel.com)

---

<p align="center">
  Made with ❤️ by the Wordly Team
</p>
