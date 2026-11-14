// ─── Career data ─────────────────────────────────────────────────────────────
//
// Rendered verbatim on the home page and the Resume tab. Edit here, git push.
// Projects live in siteContent.ts (editable from the admin panel).
// ─────────────────────────────────────────────────────────────────────────────

export const EMPLOYER = "HMW Group";
export const LOCATION = "Brisbane City, QLD";

export const HEADLINE =
  "Accountant, Business Services Advisory · Systems Analyst · CA ANZ candidate";

export const INTRO =
  "Accountant in Business Services Advisory and Systems Analyst at HMW Group. I analyse existing systems and workflows, redesign them for efficiency, and use AI to automate repetitive work. CA ANZ candidate.";

export const ABOUT =
  "Accountant in Business Services Advisory and Systems Analyst at HMW Group in Brisbane City. I advise SME and family-group clients, and analyse the systems and workflows behind that work to make it more efficient, using AI and automation to remove repetitive manual tasks. Currently completing the CA ANZ Chartered Accountants Program. Outside practice, I build financial and infrastructure software, including an accounting platform for Australian sole traders and a self-hosted personal operating system.";

export interface Role {
  id: string;
  title: string;
  start: string;
  end: string;
  dur: string;
  type: string;
  summary: string;
  bullets: string[];
  skills: string[];
}

export const roles: Role[] = [
  {
    id: "r1",
    title: "Accountant, Business Services Advisory & Systems Analyst",
    start: "2023",
    end: "present",
    dur: "3 yrs",
    type: "Full-time",
    summary:
      "Dual role across business services advisory and internal systems. Advising SME and family-group clients while analysing the firm's systems and workflows, identifying inefficiencies, and building automated, AI-assisted processes to replace manual work.",
    bullets: [
      "Analysing current systems and workflows to identify bottlenecks, duplicated effort and manual handling",
      "Designing and implementing AI-assisted automation for recurring accounting and administrative tasks",
      "Compliance and advisory work across a portfolio of SME and family-group clients",
      "Scripted repetitive data-cleanup steps that turned multi-day reconciliations into same-day jobs",
      "Day-to-day in XPA, Excel, AI tooling, and increasingly my own software",
    ],
    skills: ["Systems analysis", "Process improvement", "AI automation", "Australian tax", "XPA"],
  },
  {
    id: "r2",
    title: "Undergraduate to Graduate Accountant",
    start: "2021",
    end: "2023",
    dur: "2 yrs",
    type: "Part-time → Full-time",
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

export interface CAModule {
  name: string;
  status: "passed" | "in progress" | "upcoming";
}

export const caModules: CAModule[] = [
  { name: "Ethics & Business", status: "passed" },
  { name: "Risk & Technology (incl. AI)", status: "passed" },
  { name: "Australian Taxation", status: "in progress" },
  { name: "Financial Accounting & Reporting", status: "upcoming" },
  { name: "Business Performance", status: "upcoming" },
  { name: "Audit & Risk", status: "upcoming" },
  { name: "Integrated Chartered Accounting Practice", status: "upcoming" },
];

export const degree = {
  title: "Bachelor of Commerce (Accounting)",
  institution: "University, Brisbane",
  detail: "Majored in accounting; picked up the coding habit on the side.",
};

export const skillGroups: { domain: string; skills: string[] }[] = [
  { domain: "Accounting", skills: ["Business services advisory", "Australian tax", "Audit", "XPA", "Financial modelling"] },
  { domain: "Systems", skills: ["Systems analysis", "Workflow design", "Process improvement", "AI automation"] },
  { domain: "Development", skills: ["TypeScript", "Next.js / React", "Postgres", "Docker", "Rust (exploring)"] },
  { domain: "Infrastructure", skills: ["Docker Swarm", "Tailscale", "Cloudflare (DNS, tunnels)", "Homelab ops"] },
  { domain: "Products", skills: ["Stripe integrations", "Basiq bank feeds", "Financial data pipelines"] },
];

export const toolkit = [
  "XPA", "Excel", "AI tooling", "TypeScript", "Next.js / React", "Postgres", "Docker",
  "Docker Swarm", "Tailscale", "Cloudflare", "Supabase", "Basiq", "Stripe",
];

export const steps = [
  { n: "01", title: "Analyse", body: "Map the current system and workflow end to end, and find where time and accuracy are lost." },
  { n: "02", title: "Redesign", body: "Simplify the process, remove duplicated effort, and define what good looks like." },
  { n: "03", title: "Automate", body: "Use AI and scripting to take repetitive work off the team, with checks that hold up." },
];

export const practices = [
  {
    n: "01",
    tone: "pri" as const,
    label: "Practice",
    title: "Business Services Advisory",
    short: "Compliance and advisory work for SME and family-group clients at HMW Group.",
    body: "Compliance and advisory work for SME and family-group clients across companies, trusts, partnerships and SMSFs.",
    tags: ["Financial statements", "Income tax", "BAS", "Advisory"],
  },
  {
    n: "02",
    tone: "acc" as const,
    label: "Build",
    title: "Systems & Automation",
    short: "Workflow analysis, AI-driven automation, and the software to support it.",
    body: "Analysing current systems and workflows, redesigning them for efficiency, and using AI to automate repetitive work.",
    tags: ["Workflow analysis", "AI automation", "Process design", "Internal tooling"],
  },
];

export const contacts = [
  { label: "LinkedIn", text: "linkedin.com/in/bailey-king-25b22a235", href: "https://www.linkedin.com/in/bailey-king-25b22a235/" },
  { label: "GitHub", text: "github.com/KingKong74", href: "https://github.com/KingKong74" },
  { label: "Email", text: "bailey.king37@gmail.com", href: "mailto:bailey.king37@gmail.com" },
];
