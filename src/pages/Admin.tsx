import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@/contexts/WalletContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Check, X, Edit2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
type Submission = Tables<"project_submissions">;

// Hardcoded admin wallet address — update this to your wallet address
const ADMIN_WALLET_ADDRESS = "0x362f5b4391AC51a56b13F9A63E98bB95731E86a3";

const emptyProject = {
  name: "",
  category: "Internet Capital Markets",
  summary: "",
  status: "Testnet",
  contract_address: "",
  documentation: "",
  problem_solved: "",
  infrastructure: "",
  value_proposition: "",
  featured: false,
};

const Admin = () => {
  const { address, isConnected } = useWallet();
  const { toast } = useToast();
  const [tab, setTab] = useState<"projects" | "submissions">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  const fetchSubmissions = async () => {
    const { data } = await supabase.from("project_submissions").select("*").order("created_at", { ascending: false });
    if (data) setSubmissions(data);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProjects();
      fetchSubmissions();
    }
  }, [isAdmin]);

  const saveProject = async () => {
    if (!editing) return;
    try {
      if (isNew) {
        const { error } = await supabase.from("projects").insert({
          name: editing.name!,
          category: editing.category!,
          summary: editing.summary!,
          status: editing.status || "Testnet",
          contract_address: editing.contract_address,
          documentation: editing.documentation,
          problem_solved: editing.problem_solved,
          infrastructure: editing.infrastructure,
          value_proposition: editing.value_proposition,
          featured: editing.featured || false,
        });
        if (error) throw error;
        toast({ title: "Project added" });
      } else {
        const { error } = await supabase.from("projects").update({
          name: editing.name,
          category: editing.category,
          summary: editing.summary,
          status: editing.status,
          contract_address: editing.contract_address,
          documentation: editing.documentation,
          problem_solved: editing.problem_solved,
          infrastructure: editing.infrastructure,
          value_proposition: editing.value_proposition,
          featured: editing.featured,
        }).eq("id", editing.id!);
        if (error) throw error;
        toast({ title: "Project updated" });
      }
      setEditing(null);
      setIsNew(false);
      fetchProjects();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchProjects();
  };

  const handleSubmission = async (sub: Submission, action: "approved" | "rejected") => {
    if (action === "approved") {
      await supabase.from("projects").insert({
        name: sub.name,
        category: sub.category,
        summary: sub.summary,
        contract_address: sub.contract_address,
        documentation: sub.documentation,
        problem_solved: sub.problem_solved,
        infrastructure: sub.infrastructure,
        status: "In Review",
      });
    }
    await supabase.from("project_submissions").update({ status: action }).eq("id", sub.id);
    toast({ title: `Submission ${action}` });
    fetchSubmissions();
    fetchProjects();
  };

  const deleteInsight = async (id: string) => {
    const { error } = await supabase.from("project_insights").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Insight deleted" });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Connect the admin wallet to access this panel.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="container py-8">
            <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase mb-2">Control Terminal</p>
            <h1 className="font-display text-xl font-semibold text-foreground">Admin Panel</h1>
          </div>
        </section>

        <section className="container py-6">
          <div className="flex gap-2 mb-6">
            {(["projects", "submissions"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors ${
                  tab === t ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t} ({t === "projects" ? projects.length : submissions.filter((s) => s.status === "pending").length})
              </button>
            ))}
          </div>

          {tab === "projects" && (
            <div className="space-y-4">
              <Button
                onClick={() => { setEditing({ ...emptyProject }); setIsNew(true); }}
                variant="outline"
                className="font-display text-xs tracking-wider"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Project
              </Button>

              {editing && (
                <div className="border border-primary/30 p-6 space-y-4">
                  <p className="font-mono text-[10px] tracking-widest text-primary uppercase">
                    {isNew ? "New Project" : "Edit Project"}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Name</label>
                      <Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="bg-secondary border-border text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Category</label>
                      <Select value={editing.category || ""} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                        <SelectTrigger className="bg-secondary border-border text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Internet Capital Markets">Internet Capital Markets</SelectItem>
                          <SelectItem value="Stablecoin-native Infrastructure">Stablecoin-native Infrastructure</SelectItem>
                          <SelectItem value="Programmable Settlement">Programmable Settlement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Status</label>
                      <Select value={editing.status || "Testnet"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                        <SelectTrigger className="bg-secondary border-border text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mainnet">Mainnet</SelectItem>
                          <SelectItem value="Testnet">Testnet</SelectItem>
                          <SelectItem value="In Review">In Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Contract Address</label>
                      <Input value={editing.contract_address || ""} onChange={(e) => setEditing({ ...editing, contract_address: e.target.value })} className="bg-secondary border-border text-sm font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Documentation URL</label>
                      <Input value={editing.documentation || ""} onChange={(e) => setEditing({ ...editing, documentation: e.target.value })} className="bg-secondary border-border text-sm" />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input type="checkbox" checked={editing.featured || false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="accent-primary" />
                      <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Featured</label>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Summary</label>
                    <Textarea value={editing.summary || ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} className="bg-secondary border-border text-sm min-h-[60px] resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Infrastructure</label>
                    <Textarea value={editing.infrastructure || ""} onChange={(e) => setEditing({ ...editing, infrastructure: e.target.value })} className="bg-secondary border-border text-sm min-h-[60px] resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Value Proposition</label>
                    <Textarea value={editing.value_proposition || ""} onChange={(e) => setEditing({ ...editing, value_proposition: e.target.value })} className="bg-secondary border-border text-sm min-h-[60px] resize-none" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveProject} className="font-display text-xs tracking-wider">Save</Button>
                    <Button variant="ghost" onClick={() => { setEditing(null); setIsNew(false); }} className="font-display text-xs tracking-wider">Cancel</Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {projects.map((p) => (
                  <div key={p.id} className="border border-border p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{p.category} · {p.status}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setIsNew(false); }}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteProject(p.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "submissions" && (
            <div className="space-y-3">
              {submissions.length === 0 && (
                <p className="text-sm text-muted-foreground">No submissions yet.</p>
              )}
              {submissions.map((sub) => (
                <div key={sub.id} className="border border-border p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{sub.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{sub.category} · {sub.contract_address}</p>
                    </div>
                    <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 border ${
                      sub.status === "pending" ? "text-yellow-400 border-yellow-400/30" :
                      sub.status === "approved" ? "text-primary border-primary/30" :
                      "text-destructive border-destructive/30"
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{sub.summary}</p>
                  <p className="text-xs text-muted-foreground"><span className="text-foreground">Problem:</span> {sub.problem_solved}</p>
                  {sub.status === "pending" && (
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => handleSubmission(sub, "approved")} className="font-display text-xs tracking-wider h-7">
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSubmission(sub, "rejected")} className="font-display text-xs tracking-wider h-7">
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
