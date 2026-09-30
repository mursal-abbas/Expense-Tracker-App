# Expense Tracker App

A polished local-first personal finance dashboard built with React, Vite and Tailwind CSS.

## Features
- Live accounts, balances, income, expenses and transfers
- Searchable transaction ledger with type/category/account/date filters
- CSV transaction export
- Monthly budgets with live spending and over-limit states
- Savings goals with progress and target dates
- 7-day spending rhythm
- Monthly comparison and yearly income-vs-expense analytics
- Full JSON backup and restore
- Command palette with `Ctrl/Cmd + K`
- Responsive desktop/mobile navigation
- Local browser persistence with no backend required

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Data model
Transactions are the source events. Account balances, monthly totals, budgets, category analytics and reports are derived from those events, so the UI stays synchronized.

## Next production layer
The v3 architecture intentionally keeps the finance calculations separate from storage. Firebase Authentication + Firestore can be introduced later for accounts, cloud sync and multi-device access without rebuilding the UI.
