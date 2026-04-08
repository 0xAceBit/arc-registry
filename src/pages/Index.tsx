import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import ProjectCard from "@/components/ProjectCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Project = Tables<"projects">;
type ProjectCategory = "Internet Capital Markets" | "Stablecoin-native Infrastructure" | "Programmable Settlement";

const categories: (ProjectCategory | "All")[] = [
  "All",
  "Internet Capital Markets",
  "Stablecoin-native Infrastructure",
  "Programmable Settlement",
];

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (data) setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="container py-16 md:py-24">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-body text-sm tracking-wide text-muted-foreground mb-3"
            >
              Internet Financial System
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-5 leading-[1.1]"
            >
              Arc Ecosystem Registry
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              A technical directory of projects building onchain infrastructure on Arc.
              Reviewed for utility, not speculation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex gap-10 mt-10"
            >
              {[
                { label: "Projects", value: projects.length },
                { label: "Mainnet", value: projects.filter((p) => p.status === "Mainnet").length },
                { label: "Categories", value: 3 },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl md:text-4xl font-semibold text-foreground">{s.value}</p>
                  <p className="font-body text-xs tracking-wide text-muted-foreground mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border bg-background sticky top-14 z-40">
          <div className="container py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-background border-border text-sm font-body"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-body text-xs px-3 py-1.5 rounded-md border transition-colors ${
                    activeCategory === cat
                      ? "border-foreground text-foreground bg-accent font-medium"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="container py-10">
          <div className="flex items-center justify-between mb-8">
            <span className="font-body text-xs text-muted-foreground">
              {loading ? "Loading..." : `${filtered.length} project${filtered.length !== 1 ? "s" : ""} registered`}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-muted-foreground">No projects match your criteria.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
