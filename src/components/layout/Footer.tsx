import { Link } from "react-router-dom";
import { Shield, Twitter, Linkedin, Github, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { name: "How It Works", path: "/how-it-works" },
    { name: "Get Started", path: "/profile" },
    { name: "Risk Analysis", path: "/dashboard" },
    { name: "Recommendations", path: "/recommendations" },
  ],
  company: [
    { name: "About Us", path: "#" },
    { name: "Careers", path: "#" },
    { name: "Blog", path: "#" },
    { name: "Press", path: "#" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "#" },
    { name: "Cookie Policy", path: "#" },
    { name: "Compliance", path: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Mail, href: "#", label: "Email" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-warm flex items-center justify-center shadow-glow">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground font-display">InsureAI</span>
                <span className="text-[10px] text-primary/80 uppercase tracking-widest font-medium">भारत</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              AI-powered insurance recommendations that understand your unique needs 
              and find the perfect coverage for your life.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 InsureAI India. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made in India 🇮🇳 • IRDAI Registered
          </p>
        </div>
      </div>
    </footer>
  );
};
