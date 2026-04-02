const Footer = () => (
  <footer className="border-t border-border mt-auto">
    <div className="container py-8">
      <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
        This platform is an independent editorial resource for the @Arc ecosystem. 
        Reviews focus on technical utility and infrastructure. No content should be 
        construed as financial advice or token speculation.
      </p>
      <div className="mt-4 flex items-center gap-4">
        <span className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
          Arc Ecosystem Registry
        </span>
        <span className="text-border">|</span>
        <span className="text-[10px] text-muted-foreground">
          Internet Financial System
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
