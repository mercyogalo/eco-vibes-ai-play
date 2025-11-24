import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Calendar,
    Trophy,
    Users,
    Radar,
    AlertTriangle,
    Video,
    BarChart3,
    User,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const links = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Events", icon: Calendar, path: "/events" },
        { name: "Challenges", icon: Trophy, path: "/challenges" },
        { name: "Community", icon: Users, path: "/community" },
        { name: "Radar", icon: Radar, path: "/radar" },
        { name: "Eco Exposed", icon: AlertTriangle, path: "/exposed" },
        { name: "Video Creator", icon: Video, path: "/video-creator" },
        { name: "Impact", icon: BarChart3, path: "/impact" },
        { name: "Profile", icon: User, path: "/profile" },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <motion.div
            initial={{ width: 240 }}
            animate={{ width: isCollapsed ? 80 : 240 }}
            className="hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border sticky top-0 z-40 shadow-xl transition-all duration-300"
        >
            <div className="p-4 flex items-center justify-between">
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-primary font-bold text-xl"
                        >
                            <Leaf className="w-8 h-8" />
                            <span>EcoPulse</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="ml-auto hover:bg-sidebar-accent text-sidebar-foreground"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
            </div>

            <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
                <nav className="space-y-2 px-2">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <link.icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-primary-foreground" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground")} />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="whitespace-nowrap overflow-hidden"
                                        >
                                            {link.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-sidebar-border space-y-2">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full flex items-center gap-3 justify-start hover:bg-sidebar-accent",
                        isCollapsed && "justify-center px-0"
                    )}
                    onClick={toggleTheme}
                >
                    {theme === "light" ? (
                        <>
                            <Moon className="w-5 h-5" />
                            {!isCollapsed && <span>Dark Mode</span>}
                        </>
                    ) : (
                        <>
                            <Sun className="w-5 h-5" />
                            {!isCollapsed && <span>Light Mode</span>}
                        </>
                    )}
                </Button>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full flex items-center gap-3 justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
                        isCollapsed && "justify-center px-0"
                    )}
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span>Logout</span>}
                </Button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
