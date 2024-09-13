# Wordly - A Wordle-Inspired Game

**Wordly** is a Wordle-inspired game built with Next.js, React, and Tailwind CSS. The game allows users to guess a 5-letter word in 6 attempts or less. It features different difficulty levels, hints, scoring, and visual effects to make the game more engaging and fun!

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Game Rules](#game-rules)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## Features

- **Difficulty Levels**: Select between Easy, Medium, and Hard levels for varied challenges.
- **Scoring System**: Earn points based on the number of attempts used to guess the word.
- **Hints**: Use hints to reveal a letter in the word after three incorrect attempts.
- **Visual Feedback**: Enjoy animations and visual effects for correct, incorrect, and partially correct guesses.
- **Responsive Design**: Built with Tailwind CSS for a responsive and visually appealing layout.

## Demo

Check out a live demo of the game [here](https://wordlyapp.vercel.app).

## Installation

To run the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/brown2020/wordly.git
   cd wordly
   ```

2. **Install dependencies:**

   Make sure you have [Node.js](https://nodejs.org/) installed, then run:

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   Visit `http://localhost:3000` to see the game in action.

## Usage

1. **Start the Game:**

   - Select a difficulty level (Easy, Medium, Hard) from the dropdown menu.
   - The game will start with a word based on your selected difficulty.

2. **Make Guesses:**

   - Enter a 5-letter word in the input field.
   - Press "Enter" or click the "Submit" button to make a guess.

3. **Use Hints:**

   - After three incorrect guesses, click the "Hint" button to reveal a letter in the word.

4. **End Game:**
   - The game ends when you guess the word correctly or exhaust all 6 attempts.
   - Click "Start Over" to play again.

## Game Rules

- **Objective**: Guess the 5-letter word in 6 attempts or less.
- **Hints**: Available after 3 incorrect attempts and limited to one per game.
- **Scoring**: Points are awarded based on the number of attempts used to guess the word. Fewer attempts result in a higher score.

## Project Structure

The project structure is as follows:

```
/wordly
│
├── public
│   └── favicon.ico
│
├── src
│   ├── components
│   │   └── WordlyMain.tsx
│   ├── constants
│   │   └── wordlist.ts
│   └── pages
│       └── index.tsx
│
├── styles
│   └── globals.css
│
├── .gitignore
├── README.md
├── package.json
└── tailwind.config.js
```

### Main Components

- **`WordlyMain.tsx`**: The main game component that handles game logic, state management, and UI.
- **`wordlist.ts`**: Contains the list of words categorized by difficulty levels.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch with a descriptive name (`git checkout -b feature/my-new-feature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/my-new-feature`).
5. Open a pull request.

Please ensure your code adheres to the project's coding standards and conventions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Inspired by the original Wordle game.
- Built with [Next.js](https://nextjs.org/), [React](https://reactjs.org/), and [Tailwind CSS](https://tailwindcss.com/).

## Contact

For any questions or feedback, please contact [info@ignitechannel.com](mailto:info@ignitechannel.com).

---

Thank you for checking out Wordly! Enjoy the game!
