import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Droplets } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import WalletButton from "@/components/WalletButton";

const Header = () => {
  const location = useLocation();
  const { isDark, toggle } = useTheme();

  const navItems = [
    { label: "Registry", path: "/" },
    { label: "Submit", path: "/submit" },
    { label: "Admin", path: "/admin" },
  ];

  const handleFaucet = () => {
    window.open("https://faucet.circle.com", "_blank", "noopener,noreferrer");
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-lg font-display font-bold tracking-tight text-foreground">
            Arc Registry
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-body text-sm px-3 py-1.5 rounded-md transition-colors ${
                location.pathname === item.path
                  ? "text-foreground font-medium bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleFaucet}
            className="font-body text-sm px-3 py-1.5 rounded-md transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <Droplets className="h-3.5 w-3.5" />
            Faucet
          </button>

          <div className="ml-2 pl-2 border-l border-border">
            <WalletButton />
          </div>

          <div className="ml-1 pl-2 border-l border-border flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-muted-foreground" />
              <Switch checked={isDark} onCheckedChange={toggle} className="scale-75" />
              <Moon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
