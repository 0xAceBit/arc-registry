export type ProjectStatus = "Mainnet" | "Testnet" | "In Review";
export type ProjectCategory = "Internet Capital Markets" | "Stablecoin-native Infrastructure" | "Programmable Settlement";

export interface ProjectInsight {
  id: string;
  author: string;
  role: string;
  content: string;
  date: string;
}

export interface ProjectMilestone {
  date: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  status: ProjectStatus;
  category: ProjectCategory;
  infrastructure: string;
  valueProposition: string;
  contractAddress: string;
  documentation: string;
  milestones: ProjectMilestone[];
  insights: ProjectInsight[];
}

export const PROJECTS: Project[] = [
  {
    id: "arc-settle",
    name: "ArcSettle",
    summary: "Programmable settlement layer for institutional USDC transfers with 1-second finality guarantees.",
    status: "Mainnet",
    category: "Programmable Settlement",
    infrastructure: "Leverages Arc's 1-second finality to enable atomic settlement of cross-border USDC transfers. Uses native gas abstraction to remove friction from institutional payment flows.",
    valueProposition: "Eliminates T+2 settlement delays for institutional capital movement. Enables real-time treasury operations with full auditability onchain.",
    contractAddress: "0x7a3b...4e2f",
    documentation: "https://docs.arcsettle.io",
    milestones: [
      { date: "2026-03-15", title: "Mainnet Launch", description: "Deployed core settlement contracts to Arc mainnet." },
      { date: "2026-02-01", title: "Audit Complete", description: "Completed security audit with Trail of Bits." },
      { date: "2026-01-10", title: "Testnet Beta", description: "Opened public testnet with 12 institutional partners." },
    ],
    insights: [
      { id: "1", author: "M. Chen", role: "Protocol Architect", content: "Settlement finality is genuinely sub-second. The USDC-native gas model removes a significant UX barrier for enterprise treasury teams.", date: "2026-03-20" },
    ],
  },
  {
    id: "meridian-markets",
    name: "Meridian Markets",
    summary: "Onchain order book for tokenized fixed-income instruments with native USDC denomination.",
    status: "Testnet",
    category: "Internet Capital Markets",
    infrastructure: "Built on Arc's high-throughput execution environment. Utilizes 1-second block finality for deterministic order matching. All positions denominated in USDC.",
    valueProposition: "Brings institutional-grade fixed-income trading onchain. Transparent pricing, real-time settlement, and programmable yield distribution.",
    contractAddress: "0x3f1c...8a9d",
    documentation: "https://docs.meridian.markets",
    milestones: [
      { date: "2026-03-28", title: "Testnet V2", description: "Launched improved order matching engine on Arc testnet." },
      { date: "2026-02-15", title: "Initial Deploy", description: "First contract deployment with basic limit orders." },
    ],
    insights: [
      { id: "2", author: "R. Nakamura", role: "DeFi Engineer", content: "Order matching latency is impressive. The fixed-income primitives are well-designed for institutional adoption.", date: "2026-03-30" },
    ],
  },
  {
    id: "vault-protocol",
    name: "Vault Protocol",
    summary: "Non-custodial stablecoin yield infrastructure with transparent risk stratification.",
    status: "Testnet",
    category: "Stablecoin-native Infrastructure",
    infrastructure: "Deploys yield strategies natively on Arc using USDC gas. Auto-compounds with 1-second finality ensuring no MEV leakage on rebalances.",
    valueProposition: "Institutional-grade yield generation on stablecoins with full transparency. Risk tranches allow capital allocators to select exposure profiles.",
    contractAddress: "0x9e4a...2b7c",
    documentation: "https://docs.vaultprotocol.xyz",
    milestones: [
      { date: "2026-03-25", title: "Strategy Audits", description: "Three yield strategies audited and deployed to testnet." },
    ],
    insights: [],
  },
  {
    id: "clearnet",
    name: "ClearNet",
    summary: "Onchain identity and compliance layer for regulated financial applications on Arc.",
    status: "In Review",
    category: "Programmable Settlement",
    infrastructure: "Implements verifiable credential verification onchain with Arc's sub-second finality. Compliance checks execute within a single block.",
    valueProposition: "Enables regulated institutions to participate in onchain markets while maintaining KYC/AML compliance. Programmable compliance rules reduce operational overhead.",
    contractAddress: "0x1d8f...6c3e",
    documentation: "https://docs.clearnet.io",
    milestones: [
      { date: "2026-03-20", title: "Submitted for Review", description: "Core contracts submitted for ecosystem review." },
    ],
    insights: [],
  },
];
