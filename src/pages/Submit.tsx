import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Upload, X } from "lucide-react";

const Submit = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    summary: "",
    documentation: "",
    contractAddress: "",
    problemSolved: "",
    infrastructure: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB allowed.", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile && user) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage
          .from("project-images")
          .getPublicUrl(path);
        imageUrl = publicData.publicUrl;
      }

      const { error } = await supabase.from("project_submissions").insert({
        user_id: user.id,
        name: form.name,
        category: form.category,
        summary: form.summary,
        contract_address: form.contractAddress,
        documentation: form.documentation || null,
        problem_solved: form.problemSolved,
        infrastructure: form.infrastructure || null,
        image_url: imageUrl,
      });
      if (error) throw error;
      toast({
        title: "Submission Received",
        description: `${form.name} has been submitted for review. An Arc reviewer will assess the deployment.`,
      });
      setForm({ name: "", category: "", summary: "", documentation: "", contractAddress: "", problemSolved: "", infrastructure: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
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
          {!user ? (
            <div className="border border-border p-8 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You need to be signed in to submit a project.
              </p>
              <Link to="/auth">
                <Button className="font-display tracking-wider text-xs">Sign In</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border border-border p-6 space-y-5">
                <p className="font-display text-xs tracking-widest text-primary uppercase">
                  Project Details
                </p>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Project Name</label>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. ArcSettle" className="bg-secondary border-border text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Category</label>
                  <Select value={form.category} onValueChange={(v) => update("category", v)}>
                    <SelectTrigger className="bg-secondary border-border text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internet Capital Markets">Internet Capital Markets</SelectItem>
                      <SelectItem value="Stablecoin-native Infrastructure">Stablecoin-native Infrastructure</SelectItem>
                      <SelectItem value="Programmable Settlement">Programmable Settlement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Summary</label>
                  <Textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} placeholder="Brief description of your project's utility..." className="bg-secondary border-border text-sm min-h-[80px] resize-none" />
                </div>
              </div>

              <div className="border border-border p-6 space-y-5">
                <p className="font-display text-xs tracking-widest text-primary uppercase">Technical Information</p>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Onchain Contract Address</label>
                  <Input value={form.contractAddress} onChange={(e) => update("contractAddress", e.target.value)} placeholder="0x..." className="bg-secondary border-border text-sm font-display" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Project Documentation</label>
                  <Input value={form.documentation} onChange={(e) => update("documentation", e.target.value)} placeholder="https://docs.yourproject.io" className="bg-secondary border-border text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Problem Solved</label>
                  <Textarea value={form.problemSolved} onChange={(e) => update("problemSolved", e.target.value)} placeholder="What specific problem in the Internet Financial System does this address?" className="bg-secondary border-border text-sm min-h-[80px] resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">Infrastructure Details</label>
                  <Textarea value={form.infrastructure} onChange={(e) => update("infrastructure", e.target.value)} placeholder="How does your project utilize Arc's 1-second finality, USDC-native gas, or other infrastructure?" className="bg-secondary border-border text-sm min-h-[80px] resize-none" />
                </div>
              </div>

              <Button type="submit" disabled={!isValid || submitting} className="w-full font-display tracking-wider text-xs h-11">
                {submitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Submit;
