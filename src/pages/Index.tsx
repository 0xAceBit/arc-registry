import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PROJECTS, type ProjectCategory, type ProjectStatus } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories: (ProjectCategory | "All")[] = [
  "All",
  "Internet Capital Markets",
  "Stablecoin-native Infrastructure",
  "Programmable Settlement",
];

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");

  const filtered = PROJECTS.filter((p) => {
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
          <div className="container py-16">
            <p className="font-display text-[10px] tracking-[0.3em] text-primary uppercase mb-4">
              Internet Financial System
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
              Arc Ecosystem Registry
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              A technical directory of projects building onchain infrastructure on @Arc. 
              Reviewed for utility, not speculation.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border">
          <div className="container py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-secondary border-border text-sm font-body"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-display text-[10px] tracking-wider uppercase px-3 py-1.5 border transition-colors ${
                    activeCategory === cat
                      ? "border-primary text-primary bg-primary/5"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <span className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
              {filtered.length} Project{filtered.length !== 1 ? "s" : ""} Registered
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {filtered.length === 0 && (
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
