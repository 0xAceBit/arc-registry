import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import StatusBadge from "@/components/StatusBadge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProjectDetail = () => {
  const { id } = useParams();
  const project = PROJECTS.find((p) => p.id === id);
  const [insights, setInsights] = useState(project?.insights ?? []);
  const [newInsight, setNewInsight] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Project not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmitInsight = () => {
    if (!newInsight.trim() || !authorName.trim()) return;
    setInsights((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        author: authorName,
        role: authorRole || "Builder",
        content: newInsight,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewInsight("");
    setAuthorName("");
    setAuthorRole("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="container py-4">
            <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-display tracking-wider">
              <ArrowLeft className="h-3 w-3" />
              Back to Registry
            </Link>
          </div>
        </div>

        {/* Header */}
        <section className="border-b border-border">
          <div className="container py-10">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                  {project.name}
                </h1>
                <span className="font-display text-[9px] tracking-widest text-muted-foreground uppercase border border-border px-1.5 py-0.5">
                  Built on Arc
                </span>
              </div>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
              {project.summary}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-display text-[10px] tracking-wider text-muted-foreground uppercase border border-border px-2 py-1">
                {project.category}
              </span>
              <span className="font-display text-[10px] tracking-wider text-muted-foreground">
                Contract: {project.contractAddress}
              </span>
            </div>
          </div>
        </section>

        <div className="container py-8 grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Infrastructure */}
            <section className="border border-border p-6">
              <h2 className="font-display text-xs tracking-widest text-primary uppercase mb-4">
                Infrastructure Analysis
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.infrastructure}
              </p>
            </section>

            {/* Value */}
            <section className="border border-border p-6">
              <h2 className="font-display text-xs tracking-widest text-primary uppercase mb-4">
                Value Proposition
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.valueProposition}
              </p>
            </section>

            {/* Milestones */}
            <section className="border border-border p-6">
              <h2 className="font-display text-xs tracking-widest text-primary uppercase mb-4">
                Builder Milestones
              </h2>
              <div className="space-y-4">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 bg-primary mt-1.5" />
                      {i < project.milestones.length - 1 && (
                        <div className="w-px h-full bg-border flex-1 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <span className="font-display text-[10px] tracking-wider text-muted-foreground">
                        {m.date}
                      </span>
                      <h3 className="text-sm font-medium text-foreground mt-0.5">{m.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Insights */}
          <div className="space-y-6">
            <section className="border border-border p-6">
              <h2 className="font-display text-xs tracking-widest text-primary uppercase mb-4">
                Architect Insights
              </h2>

              {insights.length === 0 && (
                <p className="text-xs text-muted-foreground">No insights yet. Be the first to contribute.</p>
              )}

              <div className="space-y-4 mb-6">
                {insights.map((insight) => (
                  <div key={insight.id} className="border-l-2 border-primary/30 pl-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.content}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-medium text-foreground">{insight.author}</span>
                      <span className="text-[10px] text-muted-foreground">· {insight.role}</span>
                      <span className="text-[10px] text-muted-foreground">· {insight.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
                  Submit Insight
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="h-8 text-xs bg-secondary border-border"
                  />
                  <Input
                    placeholder="Role"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="h-8 text-xs bg-secondary border-border"
                  />
                </div>
                <Textarea
                  placeholder="Share technical feedback on this deployment..."
                  value={newInsight}
                  onChange={(e) => setNewInsight(e.target.value)}
                  className="text-xs bg-secondary border-border min-h-[80px] resize-none"
                />
                <Button
                  onClick={handleSubmitInsight}
                  className="w-full h-8 text-xs font-display tracking-wider"
                  disabled={!newInsight.trim() || !authorName.trim()}
                >
                  Submit
                </Button>
              </div>
            </section>

            <section className="border border-border p-6">
              <h2 className="font-display text-xs tracking-widest text-muted-foreground uppercase mb-3">
                Documentation
              </h2>
              <a
                href={project.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {project.documentation}
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
