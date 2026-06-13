const STORAGE_KEY = "wealthos-alpha-state-v1";

const navItems = [
  ["dashboard", "Executive Dashboard", "⌘"],
  ["money", "Money Hub", "₹"],
  ["investments", "Investments", "↗"],
  ["assets", "Assets & Debt", "◆"],
  ["vault", "Vault", "▣"],
  ["inbox", "Financial Inbox", "✉"],
  ["goals", "Goals", "◎"],
  ["copilot", "AI Copilot", "AI"],
  ["reports", "Reports", "◫"]
];

const sampleState = {
  accounts: [
    { id: crypto.randomUUID(), name: "HDFC Salary Account", category: "Savings", value: 840000, notes: "Primary salary and UPI account" },
    { id: crypto.randomUUID(), name: "Emergency Liquid Fund", category: "Liquid Cash", value: 650000, notes: "6 month family emergency buffer" },
    { id: crypto.randomUUID(), name: "Credit Card Outstanding", category: "Credit Card", value: 42000, notes: "Paid monthly; included under liabilities too" }
  ],
  investments: [
    { id: crypto.randomUUID(), name: "Nifty 50 Index Fund", category: "Mutual Fund", value: 1850000, cost: 1320000, notes: "Monthly SIP" },
    { id: crypto.randomUUID(), name: "US Total Market ETF", category: "International ETF", value: 920000, cost: 720000, notes: "International diversification" },
    { id: crypto.randomUUID(), name: "EPF + PPF Corpus", category: "Retirement", value: 1410000, cost: 1180000, notes: "Long-term retirement assets" }
  ],
  assets: [
    { id: crypto.randomUUID(), name: "Primary Residence", category: "Real Estate", value: 9500000, notes: "Family home" },
    { id: crypto.randomUUID(), name: "Gold & Jewelry", category: "Gold", value: 760000, notes: "Insure and document photos" }
  ],
  liabilities: [
    { id: crypto.randomUUID(), name: "Home Loan", category: "Secured Loan", value: 3850000, notes: "EMI due 5th monthly" },
    { id: crypto.randomUUID(), name: "Credit Card Current Cycle", category: "Credit Card", value: 42000, notes: "Due 22nd monthly" }
  ],
  insurance: [
    { id: crypto.randomUUID(), name: "Term Life Policy", category: "Life", value: 20000000, premium: 18000, date: nextDate(42), notes: "Nominee: spouse" },
    { id: crypto.randomUUID(), name: "Family Floater Health", category: "Health", value: 1500000, premium: 32000, date: nextDate(23), notes: "Renew before expiry" }
  ],
  goals: [
    { id: crypto.randomUUID(), name: "Financial Freedom", category: "Retirement", value: 60000000, current: 5580000, date: "2045-01-01", notes: "Target corpus at 3.5% SWR" },
    { id: crypto.randomUUID(), name: "Child Education Fund", category: "Education", value: 12000000, current: 900000, date: "2038-06-01", notes: "Inflation adjusted goal" }
  ],
  reminders: [
    { id: crypto.randomUUID(), name: "Nifty SIP", category: "SIP", value: 50000, date: nextDate(5), notes: "Auto-debit check balance" },
    { id: crypto.randomUUID(), name: "Home Loan EMI", category: "EMI", value: 67000, date: nextDate(9), notes: "Maintain buffer" },
    { id: crypto.randomUUID(), name: "Advance Tax Review", category: "Tax", value: 0, date: nextDate(61), notes: "Review AIS/TIS and capital gains" }
  ],
  vault: [
    { id: crypto.randomUUID(), name: "PAN Card", category: "Identity", date: "", notes: "Tagged to primary user" },
    { id: crypto.randomUUID(), name: "Home Sale Deed", category: "Property", date: "", notes: "Link to Primary Residence" },
    { id: crypto.randomUUID(), name: "CAMS Consolidated Statement", category: "Investment", date: "", notes: "Parse holdings in Phase 2" }
  ],
  transactions: [
    { id: crypto.randomUUID(), date: nextDate(-2), narration: "SALARY CREDIT ACME", credit: 420000, debit: 0, category: "Income", confidence: 0.98 },
    { id: crypto.randomUUID(), date: nextDate(-1), narration: "ZERODHA BROKING SIP", credit: 0, debit: 50000, category: "Investments", confidence: 0.94 },
    { id: crypto.randomUUID(), date: nextDate(-1), narration: "SWIGGY FOOD ORDER", credit: 0, debit: 1260, category: "Food", confidence: 0.88 }
  ],
  inbox: [
    { id: crypto.randomUUID(), title: "2 upcoming renewals need review", type: "Insurance", severity: "warn", status: "Needs Review" },
    { id: crypto.randomUUID(), title: "Salary credit detected", type: "Income", severity: "info", status: "Resolved" },
    { id: crypto.randomUUID(), title: "Missing nominee for Gold & Jewelry", type: "Family Office", severity: "danger", status: "New" }
  ]
};

let state = loadState();
let activeView = "dashboard";

function nextDate(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return emptyState();
  try {
    return { ...emptyState(), ...JSON.parse(stored) };
  } catch {
    return emptyState();
  }
}

function emptyState() {
  return {
    accounts: [],
    investments: [],
    assets: [],
    liabilities: [],
    insurance: [],
    goals: [],
    reminders: [],
    vault: [],
    transactions: [],
    inbox: []
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function sum(items, key = "value") {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

function totals() {
  const cash = sum(state.accounts.filter((item) => item.category !== "Credit Card"));
  const investments = sum(state.investments);
  const physicalAssets = sum(state.assets);
  const liabilities = sum(state.liabilities);
  const netWorth = cash + investments + physicalAssets - liabilities;
  const liquid = cash + investments * 0.82 - sum(state.liabilities.filter((item) => item.category === "Credit Card"));
  const monthlyIncome = state.transactions.filter((tx) => tx.category === "Income").reduce((acc, tx) => acc + Number(tx.credit || 0), 0);
  const monthlySpend = state.transactions.reduce((acc, tx) => acc + Number(tx.debit || 0), 0);
  const savingsRate = monthlyIncome ? Math.max(0, Math.round(((monthlyIncome - monthlySpend) / monthlyIncome) * 100)) : 0;
  const goalTarget = sum(state.goals);
  const goalCurrent = state.goals.reduce((acc, goal) => acc + Number(goal.current || 0), 0);
  const score = Math.min(96, Math.max(28, Math.round(
    30 +
    Math.min(20, cash / 60000) +
    Math.min(18, savingsRate / 3) +
    Math.min(16, state.vault.length * 2.5) +
    Math.min(12, state.insurance.length * 4)
  )));

  return { cash, investments, physicalAssets, liabilities, netWorth, liquid, monthlyIncome, monthlySpend, savingsRate, goalTarget, goalCurrent, score };
}

function renderNav() {
  document.getElementById("navList").innerHTML = navItems.map(([id, label, icon]) => `
    <button class="nav-item ${activeView === id ? "active" : ""}" data-view="${id}">
      <span class="nav-icon">${icon}</span>
      <span>${label}</span>
    </button>
  `).join("");

  document.getElementById("mobileTabs").innerHTML = navItems.slice(0, 5).map(([id, label, icon]) => `
    <button class="mobile-tab ${activeView === id ? "active" : ""}" data-view="${id}" title="${label}">${icon}</button>
  `).join("");

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      activeView = button.dataset.view;
      render();
    });
  });
}

function render() {
  renderNav();
  const item = navItems.find(([id]) => id === activeView);
  document.getElementById("pageTitle").textContent = item[1];
  const root = document.getElementById("viewRoot");
  root.innerHTML = views[activeView]();
  attachViewHandlers();
}

const views = {
  dashboard: () => {
    const t = totals();
    const freedomProgress = t.goalTarget ? Math.round((t.goalCurrent / t.goalTarget) * 100) : 0;
    return `
      <div class="metric-grid">
        ${metric("Net Worth", formatCurrency(t.netWorth), "Assets minus liabilities")}
        ${metric("Liquid Net Worth", formatCurrency(t.liquid), "Cash plus liquid investments")}
        ${metric("Monthly Savings Rate", `${t.savingsRate}%`, "Based on imported transactions")}
        ${metric("Financial Freedom", `${freedomProgress}%`, "Goal-weighted progress")}
      </div>
      <div class="hero-grid">
        <section class="card wealth-panel">
          <div>
            <p class="eyebrow">Family Office Readiness</p>
            <h2>Wealth health is ${t.score >= 75 ? "strong" : "forming"}</h2>
            <p class="muted">This alpha calculates a blended score from liquidity, savings behavior, vault completeness, and insurance coverage.</p>
            <div class="bar-list">
              ${bar("Cash Position", Math.min(100, Math.round(t.cash / 15000)), formatCurrency(t.cash))}
              ${bar("Investable Assets", Math.min(100, Math.round(t.investments / 50000)), formatCurrency(t.investments))}
              ${bar("Debt Load", Math.max(5, 100 - Math.min(100, Math.round(t.liabilities / 50000))), formatCurrency(t.liabilities))}
              ${bar("Document Readiness", Math.min(100, state.vault.length * 12), `${state.vault.length} records`)}
            </div>
          </div>
          <div class="score-ring" style="--score:${t.score}%">
            <div>
              <strong>${t.score}</strong>
              <span>Wealth Score</span>
            </div>
          </div>
        </section>
        <section class="card">
          <p class="eyebrow">Next Actions</p>
          <h2>Financial Inbox</h2>
          <div class="list">
            ${state.inbox.slice(0, 5).map(inboxItem).join("") || empty("No open finance work.")}
          </div>
        </section>
      </div>
      <div class="two-col">
        <section class="table-card">
          <h3>Upcoming Payments</h3>
          ${recordTable(state.reminders, ["name", "category", "date", "value"])}
        </section>
        <section class="card">
          <h3>AI CFO Brief</h3>
          ${copilotBrief()}
        </section>
      </div>
    `;
  },
  money: () => `
    <div class="metric-grid">
      ${metric("Cash Position", formatCurrency(totals().cash), "Accounts excluding credit cards")}
      ${metric("Monthly Income", formatCurrency(totals().monthlyIncome), "Detected from transactions")}
      ${metric("Monthly Spend", formatCurrency(totals().monthlySpend), "Debit total")}
      ${metric("Transactions", state.transactions.length, "Imported or entered")}
    </div>
    <div class="two-col">
      <section class="table-card">
        <h3>Banking Hub</h3>
        ${recordTable(state.accounts, ["name", "category", "value", "notes"])}
      </section>
      <section class="card">
        <h3>CSV Transaction Import</h3>
        <div class="upload-zone">
          <p class="muted">Upload a CSV with columns like date, narration, credit, debit, balance. The alpha auto-categorizes common merchants and creates inbox review items.</p>
          <input type="file" id="csvInput" accept=".csv" />
        </div>
      </section>
    </div>
    <section class="table-card">
      <h3>Recent Transactions</h3>
      ${transactionTable()}
    </section>
  `,
  investments: () => `
    <div class="metric-grid">
      ${metric("Investment Value", formatCurrency(totals().investments), "Current market value")}
      ${metric("Estimated Cost", formatCurrency(sum(state.investments, "cost")), "Manual cost basis")}
      ${metric("Unrealized Gain", formatCurrency(totals().investments - sum(state.investments, "cost")), "Value minus cost")}
      ${metric("Holdings", state.investments.length, "Tracked instruments")}
    </div>
    <section class="table-card">
      <h3>Investment Hub</h3>
      ${recordTable(state.investments, ["name", "category", "cost", "value", "notes"])}
    </section>
  `,
  assets: () => `
    <div class="metric-grid">
      ${metric("Physical Assets", formatCurrency(totals().physicalAssets), "Registry value")}
      ${metric("Liabilities", formatCurrency(totals().liabilities), "Outstanding debt")}
      ${metric("Asset Records", state.assets.length, "Real estate, gold, vehicles")}
      ${metric("Debt Records", state.liabilities.length, "Loans and credit")}
    </div>
    <div class="two-col">
      <section class="table-card">
        <h3>Asset Registry</h3>
        ${recordTable(state.assets, ["name", "category", "value", "notes"])}
      </section>
      <section class="table-card">
        <h3>Liabilities</h3>
        ${recordTable(state.liabilities, ["name", "category", "value", "notes"])}
      </section>
    </div>
  `,
  vault: () => `
    <div class="metric-grid">
      ${metric("Vault Items", state.vault.length, "Documents indexed")}
      ${metric("Insurance Policies", state.insurance.length, "Policies tracked")}
      ${metric("Emergency Readiness", `${Math.min(100, state.vault.length * 10 + state.insurance.length * 10)}%`, "Document and policy coverage")}
      ${metric("Audit Mode", "On", "Local event trail planned")}
    </div>
    <div class="two-col">
      <section class="table-card">
        <h3>Secure Vault</h3>
        ${recordTable(state.vault, ["name", "category", "date", "notes"])}
      </section>
      <section class="table-card">
        <h3>Insurance</h3>
        ${recordTable(state.insurance, ["name", "category", "premium", "date", "value"])}
      </section>
    </div>
  `,
  inbox: () => `
    <section class="card">
      <p class="eyebrow">Operational Queue</p>
      <h2>Financial Inbox</h2>
      <div class="list">
        ${state.inbox.map(inboxItem).join("") || empty("No inbox items yet. Imports and reminders will appear here.")}
      </div>
    </section>
  `,
  goals: () => `
    <div class="metric-grid">
      ${metric("Goal Target", formatCurrency(totals().goalTarget), "All goals")}
      ${metric("Goal Corpus", formatCurrency(totals().goalCurrent), "Current mapped value")}
      ${metric("Gap", formatCurrency(Math.max(0, totals().goalTarget - totals().goalCurrent)), "Remaining")}
      ${metric("Active Goals", state.goals.length, "Tracked goals")}
    </div>
    <section class="card">
      <h3>Goal Progress</h3>
      <div class="bar-list">
        ${state.goals.map((goal) => bar(goal.name, Math.min(100, Math.round((Number(goal.current || 0) / Number(goal.value || 1)) * 100)), `${formatCurrency(goal.current)} / ${formatCurrency(goal.value)}`)).join("") || empty("Add your first goal.")}
      </div>
    </section>
    <section class="table-card">
      <h3>Goals</h3>
      ${recordTable(state.goals, ["name", "category", "current", "value", "date"])}
    </section>
  `,
  copilot: () => `
    <div class="two-col">
      <section class="card">
        <p class="eyebrow">AI-Ready Advisor Layer</p>
        <h2>Personal CFO Copilot</h2>
        ${copilotBrief()}
      </section>
      <section class="card">
        <h3>Recommended Next Prompts</h3>
        <div class="list">
          ${["What changed in my wealth this month?", "Can I afford a major purchase?", "What risks should I fix first?", "How do I improve financial freedom odds?", "Which documents are missing for emergency access?"].map((text) => `<div class="list-item"><strong>${text}</strong><span class="pill">Prompt</span></div>`).join("")}
        </div>
      </section>
    </div>
  `,
  reports: () => `
    <div class="report-grid">
      ${["CEO Dashboard", "Monthly Wealth Report", "Investment Report", "Expense Report", "Insurance Report", "Estate Report", "Tax Readiness Report", "Advisor Pack"].map((report) => `
        <section class="card">
          <p class="eyebrow">Report</p>
          <h3>${report}</h3>
          <p class="muted">Alpha-ready summary surface. PDF export and advisor sharing are planned for the backend phase.</p>
          <span class="pill">Draft</span>
        </section>
      `).join("")}
    </div>
  `
};

function metric(label, value, trend) {
  return `
    <section class="metric-card">
      <span class="metric-label">${label}</span>
      <strong class="metric-value">${value}</strong>
      <span class="metric-trend">${trend}</span>
    </section>
  `;
}

function bar(label, width, value) {
  return `
    <div class="bar-row">
      <div class="bar-meta"><span>${label}</span><strong>${value}</strong></div>
      <div class="bar-track"><div class="bar-fill" style="--width:${width}%"></div></div>
    </div>
  `;
}

function inboxItem(item) {
  const klass = item.severity === "danger" ? "danger" : item.severity === "warn" ? "warn" : "";
  return `
    <div class="list-item">
      <div>
        <strong>${item.title}</strong>
        <span class="muted">${item.type}</span>
      </div>
      <span class="pill ${klass}">${item.status}</span>
    </div>
  `;
}

function empty(text) {
  return `<div class="empty-state">${text}</div>`;
}

function recordTable(records, columns) {
  if (!records.length) return empty("No records yet. Use Add to create one.");
  return `
    <table class="table">
      <thead><tr>${columns.map((column) => `<th>${labelize(column)}</th>`).join("")}</tr></thead>
      <tbody>
        ${records.map((record) => `
          <tr>
            ${columns.map((column) => `<td>${cell(record, column)}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function transactionTable() {
  if (!state.transactions.length) return empty("No transactions yet. Import a CSV to begin.");
  return `
    <table class="table">
      <thead><tr><th>Date</th><th>Narration</th><th>Category</th><th>Confidence</th><th>Amount</th></tr></thead>
      <tbody>
        ${state.transactions.slice(0, 30).map((tx) => `
          <tr>
            <td>${tx.date || ""}</td>
            <td>${tx.narration || ""}</td>
            <td>${tx.category || "Review"}</td>
            <td>${Math.round(Number(tx.confidence || 0.5) * 100)}%</td>
            <td class="${Number(tx.debit || 0) > 0 ? "negative" : ""}">${Number(tx.credit || 0) > 0 ? formatCurrency(tx.credit) : `-${formatCurrency(tx.debit)}`}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function labelize(value) {
  return value.replace(/^\w/, (char) => char.toUpperCase());
}

function cell(record, column) {
  const value = record[column];
  if (["value", "cost", "premium", "current"].includes(column)) return formatCurrency(value);
  return value || "";
}

function copilotBrief() {
  const t = totals();
  const insights = [
    `Your current net worth is ${formatCurrency(t.netWorth)} with liquid net worth of ${formatCurrency(t.liquid)}.`,
    t.savingsRate >= 40 ? `Savings rate is strong at ${t.savingsRate}%. Keep SIP/goal automation funded.` : `Savings rate is ${t.savingsRate}%; review discretionary spending and recurring debits.`,
    state.vault.length < 8 ? `Vault readiness is early. Add PAN, Aadhaar, passport, property, policy, tax and nominee documents.` : `Vault coverage is improving and can support emergency access design.`,
    state.insurance.length < 2 ? `Insurance coverage may be incomplete. Add term, health, vehicle and property policies.` : `Insurance records exist; next step is adequacy scoring and renewal automation.`,
    state.liabilities.length ? `Debt exposure is ${formatCurrency(t.liabilities)}. Track EMI dates and prepayment scenarios.` : `No liabilities captured yet.`
  ];
  return `<div class="list">${insights.map((text) => `<div class="list-item"><strong>${text}</strong><span class="pill">Insight</span></div>`).join("")}</div>`;
}

function attachViewHandlers() {
  const csvInput = document.getElementById("csvInput");
  if (csvInput) {
    csvInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const text = await file.text();
      const imported = parseCsvTransactions(text);
      state.transactions = [...imported, ...state.transactions];
      state.inbox.unshift({
        id: crypto.randomUUID(),
        title: `${imported.length} transactions imported from ${file.name}`,
        type: "Statement Import",
        severity: "info",
        status: "Needs Review"
      });
      saveState();
      render();
    });
  }
}

function parseCsvTransactions(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((item) => item.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    const narration = row.narration || row.description || row.particulars || row.details || "";
    const debit = Number((row.debit || row.withdrawal || row.dr || "0").replace(/,/g, "")) || 0;
    const credit = Number((row.credit || row.deposit || row.cr || "0").replace(/,/g, "")) || 0;
    const category = categorize(narration, debit, credit);
    return {
      id: crypto.randomUUID(),
      date: row.date || row.txn_date || row["transaction date"] || "",
      narration,
      debit,
      credit,
      balance: row.balance || "",
      category: category.name,
      confidence: category.confidence
    };
  });
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function categorize(narration, debit, credit) {
  const text = narration.toLowerCase();
  const rules = [
    ["salary", "Income", 0.98],
    ["zerodha", "Investments", 0.94],
    ["groww", "Investments", 0.94],
    ["cams", "Investments", 0.9],
    ["swiggy", "Food", 0.9],
    ["zomato", "Food", 0.9],
    ["uber", "Travel", 0.84],
    ["ola", "Travel", 0.84],
    ["amazon", "Shopping", 0.82],
    ["netflix", "Entertainment", 0.86],
    ["premium", "Insurance", 0.78],
    ["emi", "Housing", 0.84],
    ["rent", "Housing", 0.86],
    ["school", "Education", 0.82],
    ["hospital", "Healthcare", 0.86]
  ];
  const match = rules.find(([needle]) => text.includes(needle));
  if (match) return { name: match[1], confidence: match[2] };
  if (credit > debit) return { name: "Income", confidence: 0.62 };
  return { name: "Review", confidence: 0.45 };
}

document.getElementById("quickAddButton").addEventListener("click", () => {
  document.getElementById("entryDialog").showModal();
});

document.getElementById("seedButton").addEventListener("click", () => {
  state = structuredClone(sampleState);
  saveState();
  render();
});

document.getElementById("entryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const type = form.get("type");
  const record = {
    id: crypto.randomUUID(),
    name: form.get("name"),
    category: form.get("category") || "General",
    value: Number(form.get("value") || 0),
    date: form.get("date"),
    notes: form.get("notes")
  };
  if (type === "goal") record.current = 0;
  const target = type === "account" ? "accounts" : type === "investment" ? "investments" : type === "asset" ? "assets" : type === "liability" ? "liabilities" : type === "insurance" ? "insurance" : type === "goal" ? "goals" : type === "reminder" ? "reminders" : "vault";
  state[target].unshift(record);
  state.inbox.unshift({
    id: crypto.randomUUID(),
    title: `New ${type} added: ${record.name}`,
    type: "Manual Entry",
    severity: "info",
    status: "Resolved"
  });
  saveState();
  event.currentTarget.reset();
  document.getElementById("entryDialog").close();
  render();
});

render();
