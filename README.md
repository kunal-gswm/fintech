# Expanda

Expanda is a privacy-first, full-stack personal finance application. It provides users with comprehensive tools for tracking expenses, setting financial goals, and receiving AI-driven financial advice directly on their devices. Built with modern web technologies, it is designed to run seamlessly in the browser as a Progressive Web App (PWA) and natively on iOS and Android.

## Key Features

- **On-Device AI Advisor:** Runs a Gemma 4 model locally on your phone using `@capgo/capacitor-llm` and the LiteRT-LM runtime for fully private, offline financial advice. Falls back to the Gemini cloud API when the on-device model is unavailable.
- **Smart Receipt Scanning:** Utilizes Tesseract.js and device cameras to scan physical receipts, automatically extracting the merchant name and total amount using Optical Character Recognition (OCR).
- **True Offline Support:** Configured as a Progressive Web App (PWA) using Serwist. It employs a network-first caching strategy to ensure the application remains functional even without an internet connection.
- **Native Mobile Experience:** Features a premium, fluid user interface with glassmorphism, sharp edges, pure dark mode, and native haptic feedback. Can be compiled to native iOS and Android applications.

## Technology Stack

- **Framework:** Next.js (App Router, Static Export)
- **Styling:** Tailwind CSS, Framer Motion, shadcn/ui
- **State Management:** Zustand
- **Native Bridge:** Capacitor (Core, Camera, Haptics, Splash Screen, Browser)
- **Offline & PWA:** Serwist
- **AI Integration:** On-device Gemma 4 (LiteRT-LM via @capgo/capacitor-llm), Google Generative AI SDK (cloud fallback)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and provide a Google Gemini API Key if you intend to use the cloud AI fallback.
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.

## Building for Native Mobile (iOS / Android)

This project uses Capacitor to package the Next.js web application and synchronize the native Capacitor projects:
   ```bash
   npm run cap:sync
   ```

2. Open the project in your respective native IDE:
   - For iOS (requires macOS and Xcode):
     ```bash
     npm run cap:open:ios
     ```
   - For Android (requires Android Studio):
     ```bash
     npm run cap:open:android
     ```

3. Build and deploy to your physical device or emulator using Xcode or Android Studio.

## Architecture Notes

- **Static Export:** The application is configured with `output: 'export'` in `next.config.ts`. All API calls must be handled client-side or during build time, as Node.js server runtimes are not available in native Capacitor environments.
- **Theme Management:** The application prevents Flash of Unstyled Content (FOUC) in dark mode through a blocking inline script in the root layout, checking `localStorage` prior to React hydration.
