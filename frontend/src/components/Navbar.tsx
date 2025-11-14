import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Leaf className="w-8 h-8" />
              <span className="text-2xl font-bold">EcoVibes</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className={`hover:text-secondary transition ${isActive("/dashboard") ? "text-secondary font-semibold" : ""}`}>
                  Dashboard
                </Link>
                <Link to="/events" className={`hover:text-secondary transition ${isActive("/events") ? "text-secondary font-semibold" : ""}`}>
                  Events
                </Link>
                <Link to="/challenges" className={`hover:text-secondary transition ${isActive("/challenges") ? "text-secondary font-semibold" : ""}`}>
                  EcoChallenges
                </Link>
                <Link to="/community" className={`hover:text-secondary transition ${isActive("/community") ? "text-secondary font-semibold" : ""}`}>
                  Community
                </Link>
                <Link to="/profile" className={`hover:text-secondary transition ${isActive("/profile") ? "text-secondary font-semibold" : ""}`}>
                  <User className="w-5 h-5" />
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="outline" size="sm" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                Login / Signup
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-secondary transition" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/events" className="block py-2 hover:text-secondary transition" onClick={() => setIsOpen(false)}>
                  Events
                </Link>
                <Link to="/challenges" className="block py-2 hover:text-secondary transition" onClick={() => setIsOpen(false)}>
                  EcoChallenges
                </Link>
                <Link to="/community" className="block py-2 hover:text-secondary transition" onClick={() => setIsOpen(false)}>
                  Community
                </Link>
                <Link to="/profile" className="block py-2 hover:text-secondary transition" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
                <Button onClick={() => { handleLogout(); setIsOpen(false); }} variant="outline" size="sm" className="w-full bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => { navigate("/auth"); setIsOpen(false); }} variant="outline" size="sm" className="w-full bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                Login / Signup
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
