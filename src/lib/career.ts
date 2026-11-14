// ─── Career data ─────────────────────────────────────────────────────────────
//
// Rendered verbatim on the home page and the Resume tab. Edit here, git push.
// Projects live in siteContent.ts (editable from the admin panel).
// ─────────────────────────────────────────────────────────────────────────────

export const EMPLOYER = "HMW Group";
export const LOCATION = "Brisbane, QLD";

export const HEADLINE =
  "Accountant, Business Services Advisory · Systems Analyst · CA ANZ candidate";

export const INTRO =
  "Accountant in Business Services Advisory and Systems Analyst at HMW Group. I analyse existing systems and workflows, redesign them for efficiency, and use AI to automate repetitive work. CA ANZ candidate.";

export const ABOUT =
  "Accountant in Business Services Advisory and Systems Analyst at HMW Group in Brisbane City. I advise clients, most of them in property development, and analyse the systems and workflows behind that work to make it more efficient, using AI and automation to remove repetitive manual tasks. I hold a double degree from QUT in Business (Accounting) and Information Technology (Computer Science), and I'm completing the CA ANZ Graduate Diploma of Chartered Accounting. Before HMW I worked in business advisory at Vincents and as an assistant accountant at Absolute Business Solutions. Outside practice, I build financial and infrastructure software, including an accounting platform for Australian sole traders and a self-hosted personal operating system.";

export interface Role {
  id: string;
  org: string;
  title: string;
  start: string;
  end: string;
  period: string;
  type: string;
  summary: string;
  bullets: string[];
  skills: string[];
}

export const roles: Role[] = [
  {
    id: "hmw",
    org: "HMW Group",
    title: "Accountant, Business Services Advisory & Systems Analyst",
    start: "2026",
    end: "present",
    period: "Oct 2026 – present",
    type: "Full-time · Brisbane City",
    summary:
      "Dual role across business services advisory and internal systems. Advising clients, most of them in property development, while analysing the firm's systems and workflows, identifying inefficiencies, and building automated, AI-assisted processes to replace manual work.",
    bullets: [
      "Analysing current systems and workflows to identify bottlenecks, duplicated effort and manual handling",
      "Designing and implementing AI-assisted automation for recurring accounting and administrative tasks",
      "Compliance and advisory work for a client base made up mostly of property development groups and their entities",
      "Day-to-day in XPA, Excel, AI tooling, and increasingly my own software",
    ],
    skills: ["Systems analysis", "Process improvement", "AI automation", "Australian tax", "XPA"],
  },
  {
    id: "vincents",
    org: "Vincents",
    title: "Graduate Accountant, Business Advisory",
    start: "2026",
    end: "2026",
    period: "Feb 2026 – Oct 2026",
    type: "Full-time · Brisbane CBD",
    summary:
      "Tax and compliance work across individuals, trusts and companies, under the supervision of Chartered Accountants.",
    bullets: [
      "Prepared and reviewed tax returns across individuals, trusts and companies in line with current legislation and ATO rulings",
      "Provided compliance-focused tax advice, including CGT, structuring and small business concessions",
      "Coordinated client handovers and managed workflow, deadlines and job progress",
      "Performed month-end processes and financial reporting for business clients",
      "Contributed to weekly technical tax discussions and knowledge-sharing sessions",
    ],
    skills: ["Tax returns", "CGT", "Small business concessions", "Financial reporting"],
  },
  {
    id: "abs",
    org: "Absolute Business Solutions",
    title: "Assistant Accountant / Bookkeeper",
    start: "2024",
    end: "2026",
    period: "Dec 2024 – Feb 2026",
    type: "Part-time",
    summary:
      "BAS, tax returns and bookkeeping across multiple clients while finishing university, and my first taste of automating the repetitive parts.",
    bullets: [
      "Prepared BAS and tax returns and maintained financial records across multiple clients",
      "Bank reconciliations and general bookkeeping in Xero, MYOB and Reckon",
      "Supported client compliance and liaised with the ATO on administrative matters",
      "Assisted with tax queries across CGT, superannuation and small business matters",
      "Automated routine processes with Excel VBA and macros",
    ],
    skills: ["BAS", "Bookkeeping", "Xero", "MYOB", "Excel VBA"],
  },
];

export interface CAModule {
  name: string;
  status: "passed" | "in progress" | "upcoming";
}

// REVIEW: confirm module statuses
export const caModules: CAModule[] = [
  { name: "Ethics & Business", status: "passed" },
  { name: "Risk & Technology (incl. AI)", status: "passed" },
  { name: "Australian Taxation", status: "in progress" },
  { name: "Financial Accounting & Reporting", status: "upcoming" },
  { name: "Business Performance", status: "upcoming" },
  { name: "Audit & Risk", status: "upcoming" },
  { name: "Integrated Chartered Accounting Practice", status: "upcoming" },
];

export const caProgram = {
  title: "Graduate Diploma of Chartered Accounting",
  institution: "Chartered Accountants Australia and New Zealand",
  period: "Jan 2026 – present",
};

export const degrees = [
  { title: "Bachelor of Business (Accounting)", institution: "Queensland University of Technology", period: "Feb 2023 – Nov 2025" },
  { title: "Bachelor of Information Technology (Computer Science)", institution: "Queensland University of Technology", period: "Feb 2023 – Nov 2025" },
];

export const skillGroups: { domain: string; skills: string[] }[] = [
  { domain: "Accounting", skills: ["Financial reporting", "Tax compliance & preparation", "Account reconciliation", "Bookkeeping", "Financial analysis"] },
  { domain: "Accounting software", skills: ["XPA", "Xero", "MYOB", "Reckon", "Cashbooks"] },
  { domain: "Systems & AI", skills: ["Systems analysis", "Workflow design", "Process automation (Excel VBA, scripting)", "AI-assisted workflows (OpenAI, Claude)"] },
  { domain: "Data & modelling", skills: ["Advanced Excel", "Financial modelling", "Dashboarding (Excel / Google Sheets)", "SQL"] },
  { domain: "Development", skills: ["Python", "JavaScript / TypeScript", "C#", "Next.js / React", "Postgres", "MongoDB", "Docker"] },
  { domain: "Working style", skills: ["Workflow coordination", "Communication", "Critical thinking", "Problem solving", "Team leadership"] },
];

export const toolkit = [
  "XPA", "Xero", "MYOB", "Excel", "Claude", "OpenAI", "Python", "TypeScript", "Next.js / React",
  "SQL", "Postgres", "Docker", "Tailscale", "Cloudflare", "Supabase", "Basiq",
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
    short: "Compliance and advisory work for property development clients at HMW Group.",
    body: "Compliance and advisory work for clients who are mostly in property development, across the companies, trusts and partnerships behind each project.",
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
