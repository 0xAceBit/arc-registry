import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { label: "Registry", path: "/" },
  { label: "Submit", path: "/submit" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:border-glow transition-all duration-300">
            <div className="h-3 w-3 bg-primary rounded-[2px]" />
          </div>
          <div>
            <span className="font-display text-sm font-bold tracking-wide text-foreground">
              ARC REGISTRY
            </span>
            <span className="block font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
              Ecosystem Terminal
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative font-display text-xs tracking-wider px-4 py-2 rounded-sm transition-colors ${
                location.pathname === item.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-px bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
