import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Radar, User, Home, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
    const location = useLocation();

    const links = [
        { name: "Home", icon: Home, path: "/" },
        { name: "Dash", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Radar", icon: Radar, path: "/radar" },
        { name: "Chat", icon: MessageCircle, path: "/chat" }, // Assuming chat route
        { name: "Profile", icon: User, path: "/profile" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            <link.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;
