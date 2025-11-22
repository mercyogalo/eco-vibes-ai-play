import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ChatPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChatPopup({ isOpen, onClose }: ChatPopupProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm your EcoPulse AI assistant. How can I help you with environmental questions today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "I'm here to help with environmental questions! This is a demo response. In production, I would connect to an AI service to provide real answers about climate change, conservation, and sustainability.",
                },
            ]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 h-full w-full md:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xl">🤖</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">EcoPulse AI</h3>
                                <p className="text-xs text-muted-foreground">Environmental Assistant</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted text-foreground rounded-bl-none"
                                            }`}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t border-border">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask about the environment..."
                                className="flex-1"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                size="icon"
                                className="bg-primary hover:bg-primary/90"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
