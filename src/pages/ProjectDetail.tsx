import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StatusBadge from "@/components/StatusBadge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InsightSubmitForm from "@/components/InsightSubmitForm";
import { useState, useEffect } from "react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
type Insight = Tables<"project_insights">;

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    const { data: ins } = await supabase
      .from("project_insights")
      .select("*")
      .eq("project_id", id!)
      .order("created_at", { ascending: false });
    setInsights(ins || []);
  };

  useEffect(() => {
    const fetch = async () => {
      const { data: proj } = await supabase.from("projects").select("*").eq("id", id!).single();
      setProject(proj);
      const { data: ins } = await supabase
        .from("project_insights")
        .select("*")
        .eq("project_id", id!)
        .order("created_at", { ascending: false });
      setInsights(ins || []);
      setLoading(false);
    };
    if (id) fetch();
  }, [id]);

  const handleSubmitInsight = async () => {
    if (!newInsight.trim() || !user || !project) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single();

    const { error } = await supabase.from("project_insights").insert({
      project_id: project.id,
      user_id: user.id,
      author: profile?.display_name || user.email || "Anonymous",
      role: "Architect",
      content: newInsight,
    });

    if (!error) {
      const { data: ins } = await supabase
        .from("project_insights")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false });
      setInsights(ins || []);
      setNewInsight("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="border-b border-border">
          <div className="container py-4">
            <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-display tracking-wider">
              <ArrowLeft className="h-3 w-3" />
              Back to Registry
            </Link>
          </div>
        </div>

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
              <StatusBadge status={project.status as any} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
              {project.summary}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-display text-[10px] tracking-wider text-muted-foreground uppercase border border-border px-2 py-1">
                {project.category}
              </span>
              {project.contract_address && (
                <span className="font-display text-[10px] tracking-wider text-muted-foreground">
                  Contract: {project.contract_address}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="container py-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {project.infrastructure && (
              <section className="border border-border p-6">
                <h2 className="font-display text-xs tracking-widest text-primary uppercase mb-4">
                  Infrastructure Analysis
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.infrastructure}
                </p>
              </section>
            )}
            {project.value_proposition && (
              <section className="border border-border p-6">
                <h2 className="font-display text-xs tracking-widest text-primary uppercase mb-4">
                  Value Proposition
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.value_proposition}
                </p>
              </section>
            )}
          </div>

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
                      <span className="text-[10px] text-muted-foreground">· {new Date(insight.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {user ? (
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
                    Submit Insight
                  </p>
                  <Textarea
                    placeholder="Share technical feedback on this deployment..."
                    value={newInsight}
                    onChange={(e) => setNewInsight(e.target.value)}
                    className="text-xs bg-secondary border-border min-h-[80px] resize-none"
                  />
                  <Button
                    onClick={handleSubmitInsight}
                    className="w-full h-8 text-xs font-display tracking-wider"
                    disabled={!newInsight.trim()}
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to submit insights.
                  </p>
                </div>
              )}
            </section>

            {project.documentation && (
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
