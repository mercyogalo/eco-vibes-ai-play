import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Leaf, Bot, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const Chatbot = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I'm EcoPulse 🌱. I'm here to help you with environmental questions, report issues, or just chat about nature. How can I assist you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();
                setUserProfile(data);
            }
        };
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        const userInput = input;
        setInput("");
        setIsLoading(true);

        try {
            const res = await api.post("/chat", {
                query: userInput,
                userId: userProfile?.id  || "test-user-123",
            });

            const assistantReply = res.data.reply || "I'm sorry, I didn't quite catch that.";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: assistantReply },
            ]);
        } catch (error: any) {
            console.error("Chat error:", error);
            toast({
                title: "Connection Error",
                description: "Could not reach EcoPulse. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-card border-border rounded-t-3xl">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">EcoPulse Assistant</h1>
                        <p className="text-sm text-muted-foreground">AI-powered environmental guide</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-6 bg-[#F4F1EA] dark:bg-background/50 relative overflow-hidden" ref={scrollRef}>
                {/* Background Texture/Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23000000\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}
                />

                <div className="space-y-6 relative z-10 pb-4">
                    <AnimatePresence initial={false}>
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`flex gap-3 max-w-[80%] md:max-w-[70%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-primary"}`}>
                                        {message.role === "user" ? <User className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
                                    </div>

                                    <div className={`p-4 rounded-2xl shadow-sm ${message.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-card border border-border/50 text-foreground rounded-tl-none"
                                        }`}>
                                        <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                                    <Leaf className="w-5 h-5 text-primary" />
                                </div>
                                <div className="bg-card border border-border/50 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Thinking...</span>
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-6 bg-card border-t border-border rounded-b-3xl">
                <div className="flex gap-3 items-center bg-card border border-border rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask EcoPulse about the environment..."
                        disabled={isLoading}
                        className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent text-base"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        size="icon"
                        className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 shrink-0"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-3">
                    EcoPulse can make mistakes. Verify important information.
                </p>
            </div>
        </div>
    );
};

export default Chatbot;
