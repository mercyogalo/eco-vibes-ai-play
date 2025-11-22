import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Video, Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">EcoPulse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering communities to protect nature through environmental awareness,
              education, and collective action.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home Page</Link></li>
              <li><Link to="/video-creator" className="text-sm text-muted-foreground hover:text-primary transition-colors">Video Creator</Link></li>
              <li><Link to="/challenges" className="text-sm text-muted-foreground hover:text-primary transition-colors">EcoChallenges</Link></li>
              <li><Link to="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/privacypolicy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy policy</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact + Socials */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Email: support@ecovibes.com</li>
              <li className="text-sm text-muted-foreground">Phone: +254 700 000 000</li>
              <li className="text-sm text-muted-foreground">Location: Nairobi, Kenya</li>
            </ul>

            <div className="flex gap-3 mt-4">
              <a
                href="https://twitter.com/ecovibes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/ecovibes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/ecovibes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://tiktok.com/@ecovibes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">TikTok</span>
                <Video className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EcoPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
