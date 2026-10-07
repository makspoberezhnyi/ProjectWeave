# Project Weave

**Weave** is a React Native & Expo application designed for tracking and connecting different forms of media (movies, music, books, video games, and board games).

Rather than just listing what you want to consume, Weave allows you to visually map out connections between different media items on an interactive canvas—showing how a book might have inspired a video game, or how a movie shares a director with your favorite playlist.

## Features

- **Dual Views:**
  - **List View:** A clean, filterable list to manage your backlog, in-progress, and completed media.
  - **Canvas View:** An interactive node-based canvas where you can place media items and draw labeled connections between them.
- **Media Tracking:** Track status (`want to consume`, `in progress`, `done`), set ratings, and schedule reminders.
- **Cross-Platform:** Built with Expo, React Native, and [Tamagui](https://tamagui.dev/) for a unified, high-performance UI across Web, iOS, and Android.
- **Local Persistence:** Uses Zustand with `AsyncStorage` to persist your library and canvas layout entirely on your device.
- **Light & Dark Mode:** Native theme support with a clean UI.

## Tech Stack

- **Framework:** React Native / Expo
- **Styling:** Tamagui
- **State Management:** Zustand
- **Storage:** `@react-native-async-storage/async-storage`
- **Icons & Graphics:** `react-native-svg`, `html-to-image`

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI

### Installation & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npm start
   ```
3. Press `i` to open in the iOS simulator, `a` for Android, or `w` to run in the web browser.

