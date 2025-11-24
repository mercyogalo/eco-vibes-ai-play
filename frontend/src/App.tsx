import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import EnvironmentalRadar from "./pages/EnvironmentalRadar";
import EcoExposed from "./pages/EcoExposed";
import VideoCreator from "./pages/VideoCreator";
import ImpactTracker from "./pages/ImpactTracker";
import NotFound from "./pages/NotFound";
import Chatbot from "./components/Chatbot";
import TermsOfService from "./pages/Terms";
import PrivacyPolicy from "./pages/Privacy";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

 
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    checkUser();

   
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

 
  const hideChatbot = location.pathname === "/auth" || !user;

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/radar" element={<EnvironmentalRadar />} />
        <Route path="/exposed" element={<EcoExposed />} />
        <Route path="/video-creator" element={<VideoCreator />} />
        <Route path="/impact" element={<ImpactTracker />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideChatbot && <Chatbot />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
