import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { supabase } from "@/integrations/supabase/client";
import { keccak256, toUtf8Bytes } from "ethers";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, Wallet } from "lucide-react";

interface Props {
  projectId: string;
  onInsightAdded: () => void;
}

const InsightSubmitForm = ({ projectId, onInsightAdded }: Props) => {
  const { user } = useAuth();
  const { isConnected, isCorrectNetwork, signer, connectWallet, switchToArcTestnet } = useWallet();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!content.trim() || !user || !signer) return;
    setSubmitting(true);
    setStatus("Hashing review content...");

    try {
      const timestamp = Date.now().toString();
      const payload = `${projectId}:${content}:${timestamp}`;
      const hash = keccak256(toUtf8Bytes(payload));

      setStatus("Confirm transaction in your wallet...");
      const address = await signer.getAddress();
      const tx = await signer.sendTransaction({
        to: address,
        value: 0n,
        data: hash,
      });

      setStatus("Waiting for onchain confirmation...");
      const receipt = await tx.wait();
      const txHash = receipt?.hash || tx.hash;

      setStatus("Saving review to database...");
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .single();

      const { error } = await supabase.from("project_insights").insert({
        project_id: projectId,
        user_id: user.id,
        author: profile?.display_name || user.email || "Anonymous",
        role: "Architect",
        content,
        tx_hash: txHash,
      });

      if (error) throw error;
      setContent("");
      setStatus("");
      onInsightAdded();
    } catch (err: any) {
      console.error("Submit insight error:", err);
      setStatus(err.code === "ACTION_REJECTED" ? "Transaction rejected." : `Error: ${err.message?.slice(0, 80)}`);
      setTimeout(() => setStatus(""), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to submit insights.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-4 space-y-3">
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
        Submit Onchain-Verified Insight
      </p>

      {!isConnected && (
        <button
          onClick={connectWallet}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-display tracking-wider border border-primary/30 text-primary hover:bg-primary/5 transition-colors rounded-sm"
        >
          <Wallet className="h-3.5 w-3.5" />
          Connect Wallet to Submit
        </button>
      )}

      {isConnected && !isCorrectNetwork && (
        <button
          onClick={switchToArcTestnet}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-display tracking-wider border border-amber-400/30 text-amber-400 hover:bg-amber-400/5 transition-colors rounded-sm"
        >
          Switch to Arc Testnet
        </button>
      )}

      {isConnected && isCorrectNetwork && (
        <>
          <Textarea
            placeholder="Share technical feedback on this deployment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-xs bg-secondary border-border min-h-[80px] resize-none"
            disabled={submitting}
          />
          <Button
            onClick={handleSubmit}
            className="w-full h-8 text-xs font-display tracking-wider"
            disabled={!content.trim() || submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                {status}
              </span>
            ) : (
              "Submit & Sign Onchain"
            )}
          </Button>
          <p className="text-[9px] text-muted-foreground">
            Requires USDC on Arc Testnet for gas. Your review hash will be stored onchain as proof.
          </p>
        </>
      )}

      {!submitting && status && (
        <p className="text-[10px] text-amber-400">{status}</p>
      )}
    </div>
  );
};

export default InsightSubmitForm;
