import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { BrowserProvider, type JsonRpcSigner } from "ethers";
import { toast } from "sonner";

const ARC_TESTNET = {
  chainId: "0x4CEF52", // 5042002
  chainName: "Arc Testnet",
  rpcUrls: ["https://rpc.testnet.arc.network", "https://arc-testnet.drpc.org"],
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  blockExplorerUrls: ["https://testnet.arcscan.app"],
};

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  connecting: boolean;
  signer: JsonRpcSigner | null;
  connectWallet: () => Promise<void>;
  switchToArcTestnet: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);

  const isConnected = !!address;
  const isCorrectNetwork = chainId === 5042002;

  const getProvider = () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      return new BrowserProvider((window as any).ethereum);
    }
    return null;
  };

  const connectWallet = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      toast.error("MetaMask not detected. Please install MetaMask to continue.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setConnecting(true);
    try {
      // Request accounts explicitly first to avoid unhandled rejections
      const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length === 0) {
        toast.error("No accounts found. Please unlock MetaMask.");
        return;
      }
      const provider = new BrowserProvider(eth);
      const s = await provider.getSigner();
      const addr = await s.getAddress();
      const network = await provider.getNetwork();
      setAddress(addr);
      setSigner(s);
      setChainId(Number(network.chainId));
      toast.success("Wallet connected!");
    } catch (err: any) {
      if (err?.code === 4001) {
        toast.error("Connection rejected by user.");
      } else {
        toast.error(err?.shortMessage || err?.message || "Failed to connect wallet");
      }
    } finally {
      setConnecting(false);
    }
  }, []);

  const switchToArcTestnet = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      toast.error("MetaMask not detected. Please install MetaMask to continue.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ARC_TESTNET.chainId }] });
      toast.success("Switched to Arc Testnet!");
    } catch (err: any) {
      if (err.code === 4902) {
        try {
          await eth.request({ method: "wallet_addEthereumChain", params: [ARC_TESTNET] });
          toast.success("Arc Testnet added and switched!");
        } catch (addErr: any) {
          toast.error(addErr?.message || "Failed to add Arc Testnet");
          return;
        }
      } else {
        toast.error(err?.message || "Failed to switch network");
        return;
      }
    }
    const provider = getProvider();
    if (provider) {
      const s = await provider.getSigner();
      const network = await provider.getNetwork();
      setSigner(s);
      setChainId(Number(network.chainId));
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setSigner(null);
    setChainId(null);
  }, []);

  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) disconnect();
      else setAddress(accounts[0]);
    };
    const handleChainChanged = (id: string) => setChainId(parseInt(id, 16));
    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);
    return () => {
      eth.removeListener("accountsChanged", handleAccountsChanged);
      eth.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect]);

  return (
    <WalletContext.Provider value={{ address, isConnected, isCorrectNetwork, connecting, signer, connectWallet, switchToArcTestnet, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};
