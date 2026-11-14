// ─── Site content: types + defaults ──────────────────────────────────────────
//
// Everything on the public page. The admin panel saves edits to the server
// (see contentStore.ts); these values are the defaults used until something
// has been saved, and after "Reset to defaults".
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
  status: "complete" | "in progress" | "upcoming";
}

export const caModules: CAModule[] = [
  { name: "Australian Taxation", status: "complete" },
  { name: "Financial Modelling", status: "complete" },
  { name: "Data Analytics and Insights", status: "in progress" },
];

export const caProgram: Degree = {
  title: "Graduate Diploma of Chartered Accounting",
  institution: "Chartered Accountants Australia and New Zealand",
  period: "Jan 2026 – expected 2028",
};

export interface Degree { title: string; institution: string; period: string }

export const degrees: Degree[] = [
  { title: "Bachelor of Business (Accounting)", institution: "Queensland University of Technology", period: "Feb 2023 – Nov 2025" },
  { title: "Bachelor of Information Technology (Computer Science)", institution: "Queensland University of Technology", period: "Feb 2023 – Nov 2025" },
];

export const skillGroups: { domain: string; skills: string[] }[] = [
  { domain: "Accounting", skills: ["Financial reporting", "Tax compliance & preparation", "Account reconciliation", "Bookkeeping", "Financial analysis"] },
  { domain: "Accounting software", skills: ["XPA", "Xero", "MYOB", "Reckon", "Cashbooks"] },
  { domain: "Systems & AI", skills: ["Systems analysis", "Workflow design", "Process automation (Excel VBA, scripting)", "AI-assisted workflows (OpenAI, Claude)"] },
  { domain: "Data & modelling", skills: ["Advanced Excel", "Financial modelling", "Dashboarding (Excel / Google Sheets)", "SQL"] },
  { domain: "Development", skills: ["Python", "JavaScript / TypeScript", "C#", "Next.js / React", "Postgres", "MongoDB", "Docker"] },
  { domain: "Working style", skills: ["Workflow coordination", "Communication", "Critical thinking", "Problem solving"] },
];

export const toolkit: string[] = [
  "XPA", "Xero", "MYOB", "Excel", "Claude", "OpenAI", "Python", "TypeScript", "Next.js / React",
  "SQL", "Postgres", "Docker", "Tailscale", "Cloudflare", "Supabase", "Basiq",
];

export interface Step { n: string; title: string; body: string }

export const steps: Step[] = [
  { n: "01", title: "Analyse", body: "Map the current system and workflow end to end, and find where time and accuracy are lost." },
  { n: "02", title: "Redesign", body: "Simplify the process, remove duplicated effort, and define what good looks like." },
  { n: "03", title: "Automate", body: "Use AI and scripting to take repetitive work off the team, with checks that hold up." },
];

export interface Practice { n: string; tone: "pri" | "acc"; label: string; title: string; short: string; body: string; tags: string[] }

export const practices: Practice[] = [
  {
    n: "01",
    tone: "pri",
    label: "Practice",
    title: "Business Services Advisory",
    short: "Compliance and advisory work for property development clients at HMW Group.",
    body: "Compliance and advisory work for clients who are mostly in property development, across the companies, trusts and partnerships behind each project.",
    tags: ["Financial statements", "Income tax", "BAS", "Advisory"],
  },
  {
    n: "02",
    tone: "acc",
    label: "Build",
    title: "Systems & Automation",
    short: "Workflow analysis, AI-driven automation, and the software to support it.",
    body: "Analysing current systems and workflows, redesigning them for efficiency, and using AI to automate repetitive work.",
    tags: ["Workflow analysis", "AI automation", "Process design", "Internal tooling"],
  },
];

export interface Contact { label: string; text: string; href: string }

export const contacts: Contact[] = [
  { label: "LinkedIn", text: "linkedin.com/in/bailey-king-25b22a235", href: "https://www.linkedin.com/in/bailey-king-25b22a235/" },
  { label: "GitHub", text: "github.com/KingKong74", href: "https://github.com/KingKong74" },
  { label: "Email", text: "bailey.king37@gmail.com", href: "mailto:bailey.king37@gmail.com" },
];

export interface Project {
  id: string;
  name: string;
  tagline: string;
  tech: string[];
  status: string;
  link?: string;
  learned?: string; // shown on the Projects tab
  visible: boolean;
}

export const projects: Project[] = [
  {
    id: "bk-os",
    name: "BK-OS",
    tagline: "A self-hosted personal OS in the browser — auth, files, notes, apps.",
    tech: ["Next.js 16", "Postgres", "Docker Swarm"],
    status: "in development",
    link: "https://os.bkos.dev",
    learned:
      "Running my own auth and storage taught me more about sessions, cookies and failure modes than any tutorial. Also: backups are a feature, not a chore.",
    visible: true,
  },
  {
    id: "moniqr",
    name: "moniqr",
    tagline: "Accounting for Australian sole traders. Bank feeds, journals, BAS.",
    tech: ["React", "Supabase", "Basiq"],
    status: "in development",
    link: "https://moniqr.com",
    learned:
      "Bank feed data is messy in ways textbooks don't cover. Building double-entry from scratch made me a sharper accountant, not just a better dev.",
    visible: true,
  },
  {
    id: "stack",
    name: "Stack",
    tagline: "A self-hosted command centre for my side projects: resume cards, activity feeds, bug tracking and roadmaps.",
    tech: ["React", "Express", "Postgres", "Claude Code hooks"],
    status: "in development",
    link: "https://projects.bkos.dev",
    learned:
      "Context-switching is the real cost of side projects. Building a tool that remembers where I left off made every other project faster.",
    visible: true,
  },
];

/** Every piece of fixed page copy, editable from admin. */
export const DEFAULT_COPY = {
  name: "Bailey King",
  initials: "BK",
  brand: "bkos.dev",
  city: "Brisbane City",
  tabHome: "Home",
  tabResume: "Resume",
  tabProjects: "Projects",
  tabContact: "Contact",
  heroPrimary: "View resume",
  heroSecondary: "See projects",
  whatEyebrow: "What I do",
  whatHeading: "Two disciplines, one practice: the accounting and the systems that run it.",
  howEyebrow: "How I work",
  expEyebrow: "Experience",
  expHeading: "The accounting, and the systems behind it.",
  expButton: "Full resume →",
  projEyebrow: "Selected projects",
  projHeading: "Built and self-hosted.",
  projButton: "All projects →",
  toolkitEyebrow: "Toolkit",
  ctaHeading: "Let's work together.",
  ctaBody: "Recruiting, a systems or automation question, or comparing homelab notes — all welcome.",
  ctaEmailLabel: "Email me",
  ctaEmail: "bailey.king37@gmail.com",
  resumePdfLabel: "Resume PDF",
  downloadLabel: "Download resume",
  labelAbout: "About",
  labelExperience: "Experience",
  labelEducation: "Education",
  labelSkills: "Skills",
  labelContact: "Contact",
  projectsTitle: "Projects",
  projectsSubtitle: "Software built and run on my own infrastructure.",
  contactTitle: "Get in touch",
  contactSubtitle: "Recruiting, a systems or automation question, or comparing homelab notes — all welcome.",
  footer: "© 2026 — running on a mini PC under my desk · self-hosted with love",
  metaTitle: "Bailey King — accountant & systems analyst",
  metaDescription:
    "Accountant in Business Services Advisory and Systems Analyst at HMW Group, Brisbane. CA ANZ candidate. I redesign workflows and use AI to automate repetitive work.",
};
export type Copy = typeof DEFAULT_COPY;

export const DEFAULT_SECTIONS = {
  whatIDo: true,
  howIWork: true,
  experience: true,
  projects: true,
  toolkit: true,
  cta: true,
  nowPlaying: true,
  weather: true,
};
export type Sections = typeof DEFAULT_SECTIONS;

export interface SiteContent {
  copy: Copy;
  sections: Sections;
  resumeChips: string[];
  availability: string;
  headline: string;
  intro: string;
  about: string;
  employer: string;
  location: string;
  practices: Practice[];
  steps: Step[];
  roles: Role[];
  caProgram: Degree;
  caModules: CAModule[];
  degrees: Degree[];
  skillGroups: { domain: string; skills: string[] }[];
  toolkit: string[];
  projects: Project[];
  contacts: Contact[];
}

export const DEFAULT_CONTENT: SiteContent = {
  copy: DEFAULT_COPY,
  sections: DEFAULT_SECTIONS,
  resumeChips: [EMPLOYER, LOCATION, "CA Program, in progress"],
  availability: "open to opportunities",
  headline: HEADLINE,
  intro: INTRO,
  about: ABOUT,
  employer: EMPLOYER,
  location: LOCATION,
  practices,
  steps,
  roles,
  caProgram,
  caModules,
  degrees,
  skillGroups,
  toolkit,
  projects,
  contacts,
};

/** Overlay saved content on the defaults, keeping only known keys of the right shape. */
export function mergeContent(stored: unknown): SiteContent {
  const out: SiteContent = { ...DEFAULT_CONTENT };
  if (!stored || typeof stored !== "object") return out;
  const src = stored as Record<string, unknown>;
  for (const key of Object.keys(DEFAULT_CONTENT) as (keyof SiteContent)[]) {
    const def = DEFAULT_CONTENT[key];
    const val = src[key];
    if (val === undefined || val === null) continue;
    if (Array.isArray(def) ? !Array.isArray(val) : typeof val !== typeof def || Array.isArray(val)) continue;
    // Plain objects (copy, sections, caProgram) merge key-by-key so new defaults still appear
    const merged = typeof def === "object" && !Array.isArray(def) ? { ...def, ...(val as object) } : val;
    (out as unknown as Record<string, unknown>)[key] = merged;
  }
  return out;
}
