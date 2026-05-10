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
    github: "https://github.com/mrmarvel123",
  },
};

export const SKILLS = [
  { label: "Autonomous Multi-Agent Systems", span: "lg:col-span-3", weight: "primary" },
  { label: "AI Orchestration", span: "lg:col-span-2", weight: "primary" },
  { label: "Reverse Engineering", span: "lg:col-span-1" },
  { label: "DevSecOps", span: "lg:col-span-2" },
  { label: "Ethical Hacking", span: "lg:col-span-2" },
  { label: "Cybersecurity Research", span: "lg:col-span-2" },
  { label: "Systems Architecture", span: "lg:col-span-3" },
  { label: "Predictive Automation", span: "lg:col-span-3" },
  { label: "Distributed Systems", span: "lg:col-span-2" },
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
  { id: "identity", label: "01 // Identity" },
  { id: "skills", label: "02 // Skills" },
  { id: "projects", label: "03 // Systems" },
  { id: "mission", label: "04 // Mission" },
  { id: "metrics", label: "05 // Telemetry" },
  { id: "contact", label: "06 // Contact" },
];
