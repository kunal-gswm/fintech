<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="200">
  <rect width="800" height="200" fill="#000000" />
  <text x="400" y="110" font-family="monospace" font-size="64" font-weight="bold" fill="#E5B80B" text-anchor="middle" letter-spacing="4">
    ai-finance
    <animate attributeName="opacity" values="0;1" dur="2s" fill="freeze" />
  </text>
  <line x1="250" y1="130" x2="550" y2="130" stroke="#262626" stroke-width="2">
    <animate attributeName="x2" from="250" to="550" dur="1.5s" fill="freeze" />
  </line>
</svg>

[![Build Status](https://img.shields.io/github/actions/workflow/status/owner/ai-finance/build.yml?branch=main)](https://github.com/owner/ai-finance/actions)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://semver.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Overview

ai-finance is an intelligent personal finance tracking platform built on Next.js and TypeScript that leverages local AI processing for actionable insights. It solves the problem of unintuitive financial tracking by combining expense logging, goal management, and automated reporting into a single, offline-first application.

## Installation

```bash
git clone https://github.com/owner/ai-finance.git
cd ai-finance
npm install
npm run dev
```

## Usage

```typescript
import { generateExpenseAnalytics } from "@/lib/engines/analytics";
import { getLocalData } from "@/lib/local-db";
import type { Expense } from "@/types";

const expenses = getLocalData<Expense[]>("expenses");
const analytics = generateExpenseAnalytics(expenses);

console.log(`Total Spent: ${analytics.totalSpending}`);
console.log(`Top Category: ${analytics.largestCategory?.name}`);
```

## Configuration

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `string` | `""` | The base URL for the backend API endpoints. |
| `LOCAL_DB_KEY` | `string` | `"ai-finance"` | Prefix used for all localStorage database keys. |
| `AI_MODEL_PATH` | `string` | `"models/local"` | Path to the local LLM weights used for offline inference. |

## API reference

- `getReports(): Promise<Report[]>` - Fetches the 6-month historical report data for the user.
- `getAnalytics(month?: string): Promise<AnalyticsData>` - Aggregates spending data and calculates top categories and trends.
- `calculateHealthScore(income: number, expenses: number, emergency: number, goals: number): HealthScore` - Computes a risk level and overall financial health score based on user metrics.

## Contributing

```bash
git clone https://github.com/owner/ai-finance.git
cd ai-finance
git checkout -b feature/new-component
npm run test
npm run lint
git push origin feature/new-component
```
