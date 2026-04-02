import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Registry", path: "/" },
  { label: "Submit", path: "/submit" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-8 w-8 border border-primary flex items-center justify-center">
            <div className="h-3 w-3 bg-primary" />
          </div>
          <div>
            <span className="font-display text-sm font-semibold tracking-wider text-foreground">
              ARC REGISTRY
            </span>
            <span className="block text-[10px] tracking-widest text-muted-foreground uppercase">
              Ecosystem Terminal
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-display text-xs tracking-wider px-4 py-2 transition-colors ${
                location.pathname === item.path
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
