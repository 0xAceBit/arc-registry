import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back", description: "Logged in successfully." });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setShowVerification(true);
        setEmail("");
        setPassword("");
        setDisplayName("");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-sm mx-auto">
          <div className="border border-border p-8 space-y-6">
            <div className="text-center">
              <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase mb-2">
                Architect Access
              </p>
              <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {isLogin ? "Sign In" : "Register"}
              </h1>
            </div>

            <div className="flex border border-border">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                  isLogin ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                  !isLogin ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                    Display Name
                  </label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your builder alias"
                    className="bg-secondary border-border text-sm"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="architect@arc.io"
                  className="bg-secondary border-border text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-display tracking-wider uppercase">
                  Password
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
              <Button
                type="submit"
                disabled={submitting}
                className="w-full font-display tracking-wider text-xs h-10"
              >
                {submitting ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-[10px] text-muted-foreground">
              {isLogin ? "No account? " : "Already registered? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin ? "Register here" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
