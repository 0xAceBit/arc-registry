import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import StatusBadge from "./StatusBadge";

const ProjectCard = ({ project }: { project: Project }) => (
  <Link
    to={`/project/${project.id}`}
    className="group relative block border border-border bg-card p-6 rounded-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/90 hover:border-glow"
  >
    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <ArrowUpRight className="h-4 w-4 text-primary" />
    </div>
    <div className="flex items-start justify-between gap-4 mb-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <span className="font-display text-xs font-bold text-primary">
            {project.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
            Built on Arc
          </span>
        </div>
      </div>
      <StatusBadge status={project.status} />
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
      {project.summary}
    </p>
    <div className="flex items-center gap-3">
      <span className="text-[10px] tracking-wider text-muted-foreground font-mono uppercase px-2 py-0.5 bg-secondary rounded-sm">
        {project.category}
      </span>
    </div>
  </Link>
);

export default ProjectCard;
