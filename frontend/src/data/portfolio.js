export const PROFILE = {
  name: "Alan Marvel",
  alias: "Mr.Marvel",
  title: "Autonomous Systems Architect",
  brand: "ATLAS VEX",
  brandSub: "Autonomous Intelligence Systems",
  tagline:
    "Architecting autonomous intelligence systems, deep research, and adaptive AI infrastructure.",
  mission:
    "Building the infrastructure layer for autonomous, research-driven systems engineering — focused on AI adaptive automation, resilient infrastructure, and cybernetic execution.",
  location: "Operating Globally // Remote",
  status: "Online · Accepting Engagements",
  portrait: "/assets/jake-portrait.png",
  socials: {
    email: "Alanmarvel5@gmail.com",
    phone: "+60 11-1854 4005",
    phoneRaw: "+601118544005",
    whatsapp: "https://wa.me/qr/CLBPIW5WFCY3B1",
    github: "https://github.com/mrmarvel123",
  },
};

export const SKILLS = [
  { label: "Autonomous Multi-Agent Systems", span: "lg:col-span-3", weight: "primary" },
  { label: "Software Engineering", span: "lg:col-span-3", weight: "primary" },
  { label: "AI Orchestration", span: "lg:col-span-2", weight: "primary" },
  { label: "Reverse Engineering", span: "lg:col-span-2" },
  { label: "DevSecOps", span: "lg:col-span-2" },
  { label: "Ethical Hacking", span: "lg:col-span-2" },
  { label: "Cybersecurity Research", span: "lg:col-span-2" },
  { label: "Systems Architecture", span: "lg:col-span-2" },
  { label: "Predictive Automation", span: "lg:col-span-3" },
  { label: "Distributed Systems", span: "lg:col-span-3" },
  { label: "Cloud Architecture", span: "lg:col-span-2" },
  { label: "Infrastructure", span: "lg:col-span-2" },
];

export const PROJECTS = [
  {
    id: "legion-core",
    code: "01",
    name: "LEGION CORE",
    summary: "Distributed AI swarm orchestration framework.",
    description:
      "Multi-agent execution mesh with elastic scheduling, circuit-breakers, and signed inter-agent messaging. Designed for offline-first autonomous operations and zero-downtime fleet upgrades.",
    impact: "Sustains 99.98% sync across 12+ agent fleets",
    status: "Production",
    year: "2024 — Present",
    stack: ["Next.js", "Rust", "Agents", "Kubernetes"],
    repo: "https://github.com/ENZOxNINJA",
    image:
      "https://images.pexels.com/photos/17489160/pexels-photo-17489160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    accent: "#00E5FF",
  },
  {
    id: "atlas-memory",
    code: "02",
    name: "ATLAS MEMORY",
    summary: "Persistent autonomous memory infrastructure.",
    description:
      "Vector + graph memory layer with provenance, lineage, and audit-grade retrieval. Powers long-horizon reasoning for autonomous agents across production workloads.",
    impact: "Sub-100ms recall · audit-grade lineage",
    status: "Active",
    year: "2024 — Present",
    stack: ["Postgres", "Vector DB", "LLM"],
    repo: "https://github.com/AtlasTheDev123",
    image:
      "https://images.pexels.com/photos/17489150/pexels-photo-17489150.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    accent: "#39FF14",
  },
  {
    id: "omega-security",
    code: "03",
    name: "OMEGA SECURITY",
    summary: "Adaptive DevSecOps execution layer.",
    description:
      "Continuous threat-modeling pipeline with autonomous remediation playbooks, supply-chain attestations, and zero-trust workload identity at runtime.",
    impact: "Zero-trust runtime · auto-remediation playbooks",
    status: "Research",
    year: "2025 — Present",
    stack: ["Docker", "Cloud", "Zero Trust"],
    repo: "https://github.com/mrmarvel123",
    image:
      "https://images.unsplash.com/photo-1628763228722-b11a9c545ed7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHwzfHxjeWJlcnNlY3VyaXR5JTIwc2VydmVyJTIwbmVvbnxlbnwwfHx8fDE3NzgzNzUyNzZ8MA&ixlib=rb-4.1.0&q=85",
    accent: "#FFB000",
  },
];

export const METRICS = [
  { label: "Agent Synchronization", value: "99.98", unit: "%", accent: "#00E5FF" },
  { label: "Execution Pipelines", value: "REALTIME", unit: "rt/s", accent: "#39FF14" },
  { label: "Memory Persistence", value: "DISTRIBUTED", unit: "nodes", accent: "#FFB000" },
  { label: "Security Layer", value: "ADAPTIVE", unit: "z-trust", accent: "#FF003C" },
];

export const NAV = [
  { id: "hero", label: "00 // Index" },
  { id: "identity", label: "01 // About" },
  { id: "skills", label: "02 // Capabilities" },
  { id: "stack", label: "03 // Stack" },
  { id: "experience", label: "04 // Experience" },
  { id: "projects", label: "05 // Systems" },
  { id: "credentials", label: "06 // Credentials" },
  { id: "services", label: "07 // Engage" },
  { id: "testimonials", label: "08 // Voices" },
  { id: "contact", label: "09 // Contact" },
];

export const TESTIMONIALS = [
  {
    quote:
      "Alan delivered architecture-level clarity in days. He doesn't just write code — he upgrades how the team thinks about systems.",
    name: "Engineering Director",
    role: "Series-B AI Startup",
    accent: "#00E5FF",
  },
  {
    quote:
      "Rare combination — security-minded, AI-native, ships fast. We hired him for a 4-week sprint and renewed three times.",
    name: "CTO",
    role: "DevTools / Cybersecurity",
    accent: "#39FF14",
  },
  {
    quote:
      "If you need autonomous systems that actually run in production — not demos — Alan is the engineer to call.",
    name: "Principal Architect",
    role: "Fortune 500 (NDA)",
    accent: "#FFB000",
  },
];

export const CREDENTIALS = {
  certifications: [
    { name: "OSCP", issuer: "Offensive Security", year: "2024", color: "#FF003C" },
    { name: "AWS Solutions Architect Pro", issuer: "Amazon Web Services", year: "2023", color: "#FFB000" },
    { name: "CKAD — Certified Kubernetes App Dev", issuer: "CNCF", year: "2023", color: "#00E5FF" },
    { name: "CEH v12", issuer: "EC-Council", year: "2022", color: "#39FF14" },
  ],
  education: [
    {
      degree: "B.Sc. Computer Science",
      institution: "University · Major in Distributed Systems",
      period: "2016 — 2020",
    },
    {
      degree: "Independent Research",
      institution: "Autonomous Multi-Agent Architectures · LLM Memory Systems",
      period: "2023 — Ongoing",
    },
  ],
  recognitions: [
    "Open-source contributor — agent frameworks & security tooling",
    "Speaker — internal tech talks on adaptive DevSecOps",
    "Bug bounty alumnus — responsible-disclosure track record",
  ],
};

export const NOW = {
  building: "LEGION CORE v0.4 — agent fleet auto-recovery",
  reading: "Designing Data-Intensive Applications · Tanenbaum",
  available: "Q3-Q4 2026 // Open to engagements",
};

export const STACK = [
  {
    category: "Languages",
    items: ["TypeScript", "Python", "Rust", "Go", "C++", "Bash"],
  },
  {
    category: "Frameworks",
    items: ["React", "Next.js", "FastAPI", "Node.js", "Tailwind", "Three.js"],
  },
  {
    category: "Infrastructure",
    items: ["Kubernetes", "Docker", "Terraform", "AWS", "GCP", "PostgreSQL", "Redis", "MongoDB"],
  },
  {
    category: "AI / Security",
    items: [
      "OpenAI",
      "Anthropic",
      "LangGraph",
      "Vector DBs",
      "Burp Suite",
      "Wireshark",
      "Zero Trust",
      "OWASP",
    ],
  },
];

export const EXPERIENCE = [
  {
    period: "2024 — Present",
    role: "Founder / Autonomous Systems Architect",
    company: "ATLAS VEX (Independent)",
    location: "Remote · Global",
    highlights: [
      "Designing the LEGION CORE multi-agent orchestration framework",
      "Building ATLAS MEMORY — persistent autonomous memory infrastructure",
      "Advising teams on AI-native infrastructure & adaptive DevSecOps",
    ],
    status: "active",
  },
  {
    period: "2022 — 2024",
    role: "Senior Software Engineer",
    company: "Confidential",
    location: "Remote",
    highlights: [
      "Led distributed-systems platform serving multi-region production traffic",
      "Built CI/CD + supply-chain attestation pipelines (SLSA L3)",
      "Mentored engineers on systems design and secure-by-default practices",
    ],
    status: "completed",
  },
  {
    period: "2020 — 2022",
    role: "Full-Stack Engineer · Security Research",
    company: "Confidential",
    location: "Hybrid",
    highlights: [
      "Shipped React + Node.js platforms at scale",
      "Conducted offensive-security research on internal infra",
      "Automated red-team tooling for continuous adversarial testing",
    ],
    status: "completed",
  },
  {
    period: "2018 — 2020",
    role: "Software Engineer",
    company: "Confidential",
    location: "On-site",
    highlights: [
      "Built backend services in Python, Go, and TypeScript",
      "Delivered first ML-assisted automation features",
      "Earned reputation for rigor in code review and architecture",
    ],
    status: "completed",
  },
];

export const SERVICES = [
  {
    code: "ENG/01",
    title: "Autonomous Systems Engineering",
    body: "Design and ship multi-agent platforms — orchestration meshes, persistent memory, and durable execution. End-to-end from architecture to production.",
    bullets: ["Agent fleet design", "LLM orchestration", "Eval + observability"],
    accent: "#00E5FF",
  },
  {
    code: "SEC/02",
    title: "DevSecOps & Adversarial Hardening",
    body: "Embed offensive-security thinking into your delivery pipeline. Threat modeling, supply-chain attestations, and zero-trust workload identity at runtime.",
    bullets: ["Threat modeling", "Supply-chain (SLSA)", "Red-team automation"],
    accent: "#39FF14",
  },
  {
    code: "ARC/03",
    title: "Systems Architecture & Advisory",
    body: "Embedded technical advisory for AI-native products and infrastructure-heavy startups. Architecture reviews, hiring rubrics, code-quality standards.",
    bullets: ["Architecture reviews", "Hiring rubrics", "Tech-strategy memos"],
    accent: "#FFB000",
  },
];
