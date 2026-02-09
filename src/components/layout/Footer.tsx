import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">InsureAI</span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link to="/compare" className="hover:text-foreground transition-colors">Compare</Link>
            <Link to="/calculator" className="hover:text-foreground transition-colors">Calculator</Link>
            <Link to="/quiz" className="hover:text-foreground transition-colors">Quiz</Link>
            <Link to="/claims-guide" className="hover:text-foreground transition-colors">Claims Guide</Link>
            <Link to="/providers" className="hover:text-foreground transition-colors">Providers</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2024 InsureAI India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
};
