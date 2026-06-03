# Expanda

Expanda is a personal finance application built with Next.js and Capacitor. It allows users to track expenses, set financial goals, and use an on-device AI for financial reviews.

## Core Features
- **On-Device AI:** Uses a local Gemma 4 model via `@capgo/capacitor-llm` for offline financial reviews. Falls back to Gemini API if the on-device model is unavailable.
- **Receipt Scanning:** Uses `tesseract.js` for basic optical character recognition to extract amounts and merchant names from receipt images.
- **Offline Support:** Configured as a Progressive Web App using Serwist for basic offline caching.
- **Native Apps:** Compiles to iOS and Android via Capacitor.

## Tech Stack
- **Frontend:** Next.js (App Router, Static Export), Tailwind CSS, shadcn/ui
- **State Management:** Zustand
- **Mobile Bridge:** Capacitor
- **PWA:** Serwist

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file from the example and add your Gemini API key (for cloud fallback).
   ```bash
   cp .env.example .env
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

## Building for Native (iOS/Android)

1. **Sync Capacitor**
   Compile the Next.js app and sync the native directories:
   ```bash
   npm run cap:sync
   ```

2. **Open Native IDE**
   - iOS (Requires Xcode): `npm run cap:open:ios`
   - Android (Requires Android Studio): `npm run cap:open:android`

## Architecture Limitations
- **Static Export Only:** Because Capacitor requires a static web bundle, `output: 'export'` is strictly enforced in `next.config.ts`. You cannot use Node.js server actions or API routes. All logic must execute client-side.
