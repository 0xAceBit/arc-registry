import { useWallet } from "@/contexts/WalletContext";
import { Wallet, AlertTriangle, X } from "lucide-react";

const WalletButton = () => {
  const { address, isConnected, isCorrectNetwork, connecting, connectWallet, switchToArcTestnet, disconnect } = useWallet();

  if (isConnected && !isCorrectNetwork) {
    return (
      <button
        onClick={switchToArcTestnet}
        className="flex items-center gap-1.5 font-body text-xs px-3 py-1.5 text-status-testnet border border-status-testnet/30 bg-status-testnet/5 hover:bg-status-testnet/10 transition-colors rounded-md"
      >
        <AlertTriangle className="h-3 w-3" />
        Switch Network
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground px-3 py-1.5 border border-border rounded-md">
        <span className="h-1.5 w-1.5 rounded-full bg-status-live animate-pulse" />
        {address.slice(0, 6)}...{address.slice(-4)}
        <button
          onClick={disconnect}
          className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
          title="Disconnect wallet"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={connecting}
      className="flex items-center gap-1.5 font-body text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 transition-colors rounded-md"
    >
      <Wallet className="h-3 w-3" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};

export default WalletButton;
