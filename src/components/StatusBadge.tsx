import type { ProjectStatus } from "@/data/projects";

const statusStyles: Record<ProjectStatus, string> = {
  Mainnet: "bg-status-live/10 text-status-live border-status-live/30",
  Testnet: "bg-status-testnet/10 text-status-testnet border-status-testnet/30",
  "In Review": "bg-status-review/10 text-status-review border-status-review/30",
};

const dotStyles: Record<ProjectStatus, string> = {
  Mainnet: "bg-status-live animate-pulse",
  Testnet: "bg-status-testnet",
  "In Review": "bg-status-review",
};

const StatusBadge = ({ status }: { status: ProjectStatus }) => (
  <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border rounded-sm ${statusStyles[status]}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status]}`} />
    {status}
  </span>
);

export default StatusBadge;
