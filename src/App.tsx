import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CalendarPage from "./pages/Calendar";
import Index from "./pages/Index";
import DayView from "./pages/DayView";
import Onboarding from "./pages/Onboarding";
import SwipeFileDetail from "./pages/SwipeFileDetail";
import Ideas from "./pages/Ideas";
import IdeaDetail from "./pages/IdeaDetail";
import Generate from "./pages/Generate";
import Export from "./pages/Export";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Assets from "./pages/Assets";
import Dashboard from "./pages/Dashboard";
import BoardDetail from "./pages/BoardDetail";
import StrategyPage from "./pages/Strategy";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/index" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/day/:date" element={<DayView />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/swipe/:id" element={<SwipeFileDetail />} />
          {/* Back-compat redirects */}
          <Route path="/swipe-file" element={<Navigate to="/assets" replace />} />
          <Route path="/swipe-file/:id" element={<Navigate to="/assets/swipe/:id" replace />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/ideas/:id" element={<IdeaDetail />} />
          <Route path="/export" element={<Export />} />
          {/* Protected routes - require strategy completion */}
          <Route path="/strategy" element={
            <ProtectedRoute>
              <StrategyPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/board/:id" element={
            <ProtectedRoute>
              <BoardDetail />
            </ProtectedRoute>
          } />
          <Route path="/generate" element={
            <ProtectedRoute>
              <Generate />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
