import { Link } from "react-router-dom";
import type { Project } from "@/data/projects";
import StatusBadge from "./StatusBadge";

const ProjectCard = ({ project }: { project: Project }) => (
  <Link
    to={`/project/${project.id}`}
    className="group block border border-border bg-card p-6 transition-all hover:border-primary/40 hover:bg-card/80"
  >
    <div className="flex items-start justify-between gap-4 mb-3">
      <div className="flex items-center gap-3">
        <h3 className="font-display text-sm font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <span className="font-display text-[9px] tracking-widest text-muted-foreground uppercase border border-border px-1.5 py-0.5">
          Built on Arc
        </span>
      </div>
      <StatusBadge status={project.status} />
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
      {project.summary}
    </p>
    <div className="flex items-center gap-3">
      <span className="text-[10px] tracking-wider text-muted-foreground font-display uppercase">
        {project.category}
      </span>
    </div>
  </Link>
);

export default ProjectCard;
