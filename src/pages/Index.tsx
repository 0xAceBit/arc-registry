import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { PROJECTS, type ProjectCategory } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroGrid from "@/components/HeroGrid";

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
        <section className="relative border-b border-border overflow-hidden">
          <HeroGrid />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background pointer-events-none" />
          <div className="container relative py-20 md:py-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-mono text-[11px] tracking-[0.4em] text-primary uppercase mb-5">
                Internet Financial System
              </p>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-glow"
            >
              Arc Ecosystem
              <br />
              <span className="text-primary">Registry</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed"
            >
              A technical directory of projects building onchain infrastructure on @Arc.
              Reviewed for utility, not speculation.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex gap-8 mt-10"
            >
              {[
                { label: "Projects", value: PROJECTS.length },
                { label: "Mainnet", value: PROJECTS.filter((p) => p.status === "Mainnet").length },
                { label: "Categories", value: 3 },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40">
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
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-sm border transition-all duration-200 ${
                    activeCategory === cat
                      ? "border-primary text-primary bg-primary/10 border-glow"
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
        <section className="container py-10">
          <div className="flex items-center justify-between mb-8">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {filtered.length} Project{filtered.length !== 1 ? "s" : ""} Registered
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <ProjectCard project={project} />
              </motion.div>
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
