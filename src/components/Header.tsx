import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Shield, User } from "lucide-react";
import WalletButton from "@/components/WalletButton";

const Header = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const navItems = [
    { label: "Registry", path: "/" },
    { label: "Submit", path: "/submit" },
    ...(isAdmin ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
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

          <div className="ml-2 pl-2 border-l border-border">
            <WalletButton />
          </div>

          <div className="ml-1 pl-2 border-l border-border flex items-center gap-1">
            {user ? (
              <>
                <span className="font-body text-xs text-muted-foreground hidden sm:inline truncate max-w-[120px]">
                  {user.email}
                </span>
                {isAdmin && <Shield className="h-3 w-3 text-foreground" />}
                <button
                  onClick={signOut}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 font-body text-sm px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
