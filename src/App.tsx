import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/Calendar";
import Index from "./pages/Index";
import DayView from "./pages/DayView";
import Onboarding from "./pages/Onboarding";
import SwipeFile from "./pages/SwipeFile";
import SwipeFileDetail from "./pages/SwipeFileDetail";
import Ideas from "./pages/Ideas";
import IdeaDetail from "./pages/IdeaDetail";
import Generate from "./pages/Generate";
import Export from "./pages/Export";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Generate />} />
          <Route path="/index" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/day/:date" element={<DayView />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/swipe-file" element={<SwipeFile />} />
          <Route path="/swipe-file/:id" element={<SwipeFileDetail />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/ideas/:id" element={<IdeaDetail />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/export" element={<Export />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
