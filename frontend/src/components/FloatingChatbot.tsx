import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChatPopup } from "./ChatPopup";

export function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Hide on chat page
    if (location.pathname === "/chat") {
        return null;
    }

    return (
        <>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="fixed bottom-24 md:bottom-6 right-6 z-[60]"
            >
                <Button
                    onClick={() => setIsOpen(true)}
                    size="icon"
                    className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group relative"
                >
                    <MessageCircle className="h-6 w-6 text-primary-foreground group-hover:scale-110 transition-transform" />
                    <span className="sr-only">Open AI Assistant</span>

                    {/* Pulse animation */}
                    <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 pointer-events-none" />
                </Button>
            </motion.div>

            {/* Chat Popup */}
            <ChatPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
