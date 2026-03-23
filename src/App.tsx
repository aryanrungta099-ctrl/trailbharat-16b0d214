import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";
import Index from "./pages/Index.tsx";
import RoutesPage from "./pages/Routes.tsx";
import TrekDetail from "./pages/TrekDetail.tsx";
import Tips from "./pages/Tips.tsx";
import Experiences from "./pages/Experiences.tsx";
import Auth from "./pages/Auth.tsx";
import Sherpas from "./pages/Sherpas.tsx";
import Agencies from "./pages/Agencies.tsx";
import Profile from "./pages/Profile.tsx";
import PublicProfile from "./pages/PublicProfile.tsx";

import Admin from "./pages/Admin.tsx";
import RecommendedTreks from "./pages/RecommendedTreks.tsx";
import SuggestTrek from "./pages/SuggestTrek.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/trek/:id" element={<TrekDetail />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/sherpas" element={<Sherpas />} />
            <Route path="/agencies" element={<Agencies />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            
            <Route path="/admin" element={<Admin />} />
            <Route path="/recommended" element={<RecommendedTreks />} />
            <Route path="/suggest" element={<SuggestTrek />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
