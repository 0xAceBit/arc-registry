import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated", description: "Your password has been reset. Redirecting..." });
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="w-full max-w-sm mx-auto border border-border p-8 space-y-6 text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase mb-2">
              Invalid Link
            </p>
            <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
              No Recovery Session
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This page is only accessible via a password reset link. Please request a new one from the sign-in page.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              className="w-full font-display tracking-wider text-xs h-10"
            >
              Back to Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-sm mx-auto border border-border p-8 space-y-6">
          <div className="text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase mb-2">
              Account Recovery
            </p>
            <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Set New Password
            </h1>
          </div>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                New Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-secondary border-border text-sm"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-secondary border-border text-sm"
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full font-display tracking-wider text-xs h-10"
            >
              {submitting ? "Updating..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;