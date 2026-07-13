// ─── Career data for /work ───────────────────────────────────────────────────
//
// REVIEW ME: everything in this file is rendered verbatim on /work.
// Firm names, dates, engagement figures and CA module statuses are seeded
// with placeholders — edit before sharing the page around.
// ─────────────────────────────────────────────────────────────────────────────

export interface Role {
  firm: string;
  title: string;
  dates: string;
  summary: string;
  bullets: string[];
  skills: string[];
}

export interface CAModule {
  name: string;
  status: "passed" | "in progress" | "upcoming";
}

export interface Qualification {
  title: string;
  institution: string;
  detail: string;
  year?: string;
}

export interface Engagement {
  description: string;
  meta: string; // industry · year
}

export interface SkillGroup {
  domain: string;
  skills: { name: string; level: 1 | 2 | 3 | 4 | 5 }[];
}

export const roles: Role[] = [
  {
    // REVIEW: firm name withheld until you confirm what you want public
    firm: "Mid-tier accounting firm, Brisbane",
    title: "Accountant — Business Advisory & Forensic",
    dates: "2023 — present",
    summary:
      "Business services base with a deliberate shift into commercial forensic work: transaction disputes, loss quantification, and reconstructing financial records when the records don't want to be reconstructed.",
    bullets: [
      // REVIEW: quantify these with real numbers before publishing
      "Supporting forensic engagements on commercial disputes — tracing funds, rebuilding transaction histories, preparing schedules that hold up under scrutiny",
      "Compliance and advisory work across a portfolio of SME and family-group clients",
      "Scripted repetitive data-cleanup steps that turned multi-day reconciliations into same-day jobs",
      "Day-to-day in XPA, Excel, and increasingly my own tooling",
    ],
    skills: ["Forensic analysis", "Audit", "Australian tax", "XPA", "Financial modelling"],
  },
  {
    // REVIEW: adjust firm/title/dates for your actual earlier role
    firm: "Same firm",
    title: "Undergraduate → Graduate Accountant",
    dates: "2021 — 2023",
    summary:
      "Started part-time while studying, went full-time after graduating. Learned the fundamentals the slow, correct way: workpapers, reconciliations, tax returns, and asking the second question.",
    bullets: [
      "Preparation of financial statements and income tax returns across entity types — companies, trusts, partnerships, SMSFs",
      "BAS and compliance work for a broad SME client base",
      "Built the habit of automating anything I had to do three times",
    ],
    skills: ["Financial statements", "Tax compliance", "BAS", "Workpapers"],
  },
];

// CA ANZ CA Program — REVIEW: set the real statuses before publishing
export const caModules: CAModule[] = [
  { name: "Ethics & Business", status: "passed" },
  { name: "Risk & Technology (incl. AI)", status: "passed" },
  { name: "Australian Taxation", status: "in progress" },
  { name: "Financial Accounting & Reporting", status: "upcoming" },
  { name: "Business Performance", status: "upcoming" },
  { name: "Audit & Risk", status: "upcoming" },
  { name: "Integrated Chartered Accounting Practice", status: "upcoming" },
];

export const qualifications: Qualification[] = [
  {
    // REVIEW: institution + year
    title: "Bachelor of Commerce (Accounting)",
    institution: "University — Brisbane",
    detail: "Majored in accounting; picked up the coding habit on the side.",
  },
];

export const engagements: Engagement[] = [
  // REVIEW: anonymised examples — replace $X / industries / years with what
  // you can safely share. Confidentiality first.
  {
    description: "Forensic review of a multi-million-dollar transaction dispute",
    meta: "construction · 2025",
  },
  {
    description: "Loss quantification supporting a shareholder dispute",
    meta: "professional services · 2024",
  },
  {
    description: "Reconstruction of transaction histories across a multi-entity family group",
    meta: "private group · 2024",
  },
];

// Self-assessed, deliberately conservative. 5 = comfortable being the last
// line of defence; 1 = actively learning.
export const skillGroups: SkillGroup[] = [
  {
    domain: "Accounting",
    skills: [
      { name: "Forensic analysis", level: 3 },
      { name: "Audit", level: 3 },
      { name: "Australian tax", level: 3 },
      { name: "XPA", level: 4 },
      { name: "Financial modelling", level: 4 },
    ],
  },
  {
    domain: "Development",
    skills: [
      { name: "TypeScript", level: 4 },
      { name: "Next.js / React", level: 4 },
      { name: "Postgres", level: 3 },
      { name: "Docker", level: 3 },
      { name: "Rust (exploring)", level: 1 },
    ],
  },
  {
    domain: "Infrastructure",
    skills: [
      { name: "Docker Swarm", level: 3 },
      { name: "Tailscale", level: 3 },
      { name: "Cloudflare (DNS, tunnels)", level: 3 },
      { name: "Homelab ops", level: 4 },
    ],
  },
  {
    domain: "Products",
    skills: [
      { name: "Stripe integrations", level: 2 },
      { name: "Basiq bank feeds", level: 3 },
      { name: "Financial data pipelines", level: 3 },
    ],
  },
];
