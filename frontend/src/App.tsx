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
import Challenges from "./pages/Challenges";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import EnvironmentalRadar from "./pages/EnvironmentalRadar";
import EcoExposed from "./pages/EcoExposed";
import VideoCreator from "./pages/VideoCreator";
import ImpactTracker from "./pages/ImpactTracker";
import NotFound from "./pages/NotFound";
import Chatbot from "./pages/Chatbot";
import TermsOfService from "./pages/Terms";
import PrivacyPolicy from "./pages/Privacy";

const queryClient = new QueryClient();

import Layout from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacypolicy" element={<PrivacyPolicy />} />

      {/* App Routes wrapped in Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/radar" element={<EnvironmentalRadar />} />
        <Route path="/exposed" element={<EcoExposed />} />
        <Route path="/video-creator" element={<VideoCreator />} />
        <Route path="/impact" element={<ImpactTracker />} />
        <Route path="/chat" element={<Chatbot />} /> {/* Added Chat route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
