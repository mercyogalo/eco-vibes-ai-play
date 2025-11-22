import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { Leaf } from "lucide-react";

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-background w-full font-sans text-foreground">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">

                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
                    <div className="flex items-center gap-2 text-primary font-bold text-xl">
                        <Leaf className="w-6 h-6" />
                        <span>EcoPulse</span>
                    </div>
                    {/* Add User Avatar or Notifications here if needed */}
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-24 md:pb-8 w-full max-w-[1600px] mx-auto">
                    <Outlet />
                </main>

                {/* Mobile Bottom Nav */}
                <MobileNav />
            </div>
        </div>
    );
};

export default Layout;
