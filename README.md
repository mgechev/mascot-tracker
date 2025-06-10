# Angular Mascot Tracker 🏆

A real-time tracker for the Angular mascot design RFC, displaying vote counts and statistics from the [Angular mascot discussion](https://github.com/angular/angular/discussions/61733).

## Features

- 📊 Real-time tracking of mascot design votes
- 👤 Unique vote counting (one vote per GitHub user)

## Live Demo

Visit the live application at [https://mgechev.github.io/mascot-tracker](https://mgechev.github.io/mascot-tracker).

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mgechev/mascot-tracker.git
cd mascot-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## How It Works

The application fetches comments from the Angular mascot discussion on GitHub and analyzes them to:

1. Count unique votes for each mascot design (1️⃣, 2️⃣, 3️⃣)
2. Track one vote per GitHub user
3. Calculate vote percentages
4. Display real-time statistics with a beautiful UI

## Development

```bash
npm start
```

### Building for Production

```bash
npm run deploy
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
