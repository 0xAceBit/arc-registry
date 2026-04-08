import { useWallet } from "@/contexts/WalletContext";
import { Wallet, AlertTriangle } from "lucide-react";

const WalletButton = () => {
  const { address, isConnected, isCorrectNetwork, connecting, connectWallet, switchToArcTestnet } = useWallet();

  if (isConnected && !isCorrectNetwork) {
    return (
      <button
        onClick={switchToArcTestnet}
        className="flex items-center gap-1.5 font-display text-[10px] tracking-wider px-3 py-1.5 text-amber-400 border border-amber-400/30 bg-amber-400/5 hover:bg-amber-400/10 transition-colors rounded-sm"
      >
        <AlertTriangle className="h-3 w-3" />
        Switch Network
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground px-3 py-1.5 border border-border rounded-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        {address.slice(0, 6)}...{address.slice(-4)}
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={connecting}
      className="flex items-center gap-1.5 font-display text-[10px] tracking-wider px-3 py-1.5 text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 transition-colors rounded-sm"
    >
      <Wallet className="h-3 w-3" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};

export default WalletButton;
