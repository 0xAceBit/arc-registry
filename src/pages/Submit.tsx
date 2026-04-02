import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import type { ProjectCategory } from "@/data/projects";

const Submit = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    category: "" as ProjectCategory | "",
    summary: "",
    documentation: "",
    contractAddress: "",
    problemSolved: "",
    infrastructure: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Submission Received",
      description: `${form.name} has been submitted for review. An Arc reviewer will assess the deployment.`,
    });
    setForm({ name: "", category: "", summary: "", documentation: "", contractAddress: "", problemSolved: "", infrastructure: "" });
  };

  const isValid = form.name && form.category && form.summary && form.contractAddress && form.problemSolved;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="container py-12">
            <p className="font-display text-[10px] tracking-[0.3em] text-primary uppercase mb-3">
              Architect Submission
            </p>
            <h1 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-2">
              Submit for Review
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg">
              Submit your project for inclusion in the Arc Ecosystem Registry. All submissions 
              undergo technical review focused on infrastructure utility.
            </p>
          </div>
        </section>

        <section className="container py-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border border-border p-6 space-y-5">
              <p className="font-display text-xs tracking-widest text-primary uppercase">
                Project Details
              </p>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                  Project Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. ArcSettle"
                  className="bg-secondary border-border text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                  Category
                </label>
                <Select value={form.category} onValueChange={(v) => update("category", v)}>
                  <SelectTrigger className="bg-secondary border-border text-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internet Capital Markets">Internet Capital Markets</SelectItem>
                    <SelectItem value="Stablecoin-native Infrastructure">Stablecoin-native Infrastructure</SelectItem>
                    <SelectItem value="Programmable Settlement">Programmable Settlement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                  Summary
                </label>
                <Textarea
                  value={form.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  placeholder="Brief description of your project's utility..."
                  className="bg-secondary border-border text-sm min-h-[80px] resize-none"
                />
              </div>
            </div>

            <div className="border border-border p-6 space-y-5">
              <p className="font-display text-xs tracking-widest text-primary uppercase">
                Technical Information
              </p>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                  Onchain Contract Address
                </label>
                <Input
                  value={form.contractAddress}
                  onChange={(e) => update("contractAddress", e.target.value)}
                  placeholder="0x..."
                  className="bg-secondary border-border text-sm font-display"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                  Project Documentation
                </label>
                <Input
                  value={form.documentation}
                  onChange={(e) => update("documentation", e.target.value)}
                  placeholder="https://docs.yourproject.io"
                  className="bg-secondary border-border text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                  Problem Solved
                </label>
                <Textarea
                  value={form.problemSolved}
                  onChange={(e) => update("problemSolved", e.target.value)}
                  placeholder="What specific problem in the Internet Financial System does this address?"
                  className="bg-secondary border-border text-sm min-h-[80px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                  Infrastructure Details
                </label>
                <Textarea
                  value={form.infrastructure}
                  onChange={(e) => update("infrastructure", e.target.value)}
                  placeholder="How does your project utilize Arc's 1-second finality, USDC-native gas, or other infrastructure?"
                  className="bg-secondary border-border text-sm min-h-[80px] resize-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="w-full font-display tracking-wider text-xs h-11"
            >
              Submit for Review
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Submit;
