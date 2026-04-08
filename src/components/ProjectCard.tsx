import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import StatusBadge from "./StatusBadge";

type Project = Tables<"projects">;

const ProjectCard = ({ project }: { project: Project }) => (
  <Link
    to={`/project/${project.id}`}
    className="group relative block border border-border bg-card p-6 rounded-lg transition-all duration-200 hover:border-foreground/30 hover:shadow-sm"
  >
    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
      <ArrowUpRight className="h-4 w-4 text-foreground" />
    </div>
    <div className="flex items-start justify-between gap-4 mb-3">
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:underline underline-offset-4 decoration-1">
          {project.name}
        </h3>
        <span className="font-body text-[11px] text-muted-foreground">
          Built on Arc
        </span>
      </div>
      <StatusBadge status={project.status as any} />
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
      {project.summary}
    </p>
    <span className="text-xs text-muted-foreground font-body px-2.5 py-1 bg-accent rounded-md">
      {project.category}
    </span>
  </Link>
);

export default ProjectCard;
