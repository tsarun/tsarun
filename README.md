<<<<<<< HEAD
# wealthos-alpha
Findashboard - GPT built
=======
# WealthOS Alpha

A private, zero-dependency WealthOS alpha that runs locally in the browser.

## Open

Open `index.html` directly in a browser:

`/Users/arunhome/Documents/New project/WealthOS/index.html`

## What Is Built

- Executive dashboard with net worth, liquid net worth, savings rate, financial freedom progress, and Wealth Score.
- Money hub with accounts, transactions, and CSV statement import.
- Investment hub with value, cost, and unrealized gain.
- Asset registry and liabilities.
- Secure vault and insurance tracker.
- Financial inbox for reviews, alerts, and detected events.
- Goals and progress tracking.
- AI Copilot-style Personal CFO insights generated from local data.
- Local persistence using `localStorage`.
- Mobile-first and desktop-optimized dark premium UI.

## Try It

1. Click `Seed` to load sample family-office data.
2. Click `+ Add` to add accounts, investments, assets, liabilities, policies, goals, reminders, or vault documents.
3. Open `Money Hub` and upload `sample-bank-statement.csv`.

## 7-Day Alpha Roadmap

### Day 1: Product Spine
- Local private app shell
- Dashboard and core modules
- Manual entry
- Local persistence

### Day 2: Data Model Upgrade
- Move from localStorage to Supabase/Postgres
- Add authentication
- Add typed schema for accounts, assets, liabilities, insurance, goals, reminders, documents, and transactions

### Day 3: Banking & Expenses
- Robust CSV import
- Transaction review queue
- Categorization rules
- Recurring SIP/EMI/subscription detection

### Day 4: Investments & Reports
- Investment holdings model
- Allocation analytics
- Monthly wealth report
- Goal forecast calculations

### Day 5: Vault & Family Office
- Document uploads
- Tags and linked entities
- Nominees, beneficiaries, emergency contacts
- Emergency readiness score

### Day 6: AI Copilot
- Data-grounded AI summaries
- Spending insights
- Portfolio and risk review
- Recommended action queue

### Day 7: Hardening
- Audit logs
- Export/import backup
- Mobile polish
- Security review
- Private deployment plan
>>>>>>> a8c991d (Build WealthOS alpha)
