import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import TabBar from "@/components/TabBar";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import AudioTutor from "@/pages/AudioTutor";
import VisualTutor from "@/pages/VisualTutor";
import QuizBattle from "@/pages/QuizBattle";
import CohortEngine from "@/pages/CohortEngine";
import Profile from "@/pages/Profile";
import RewardShop from "@/pages/RewardShop";
import { useEffect, useState } from "react";

function Router() {
  const [location] = useLocation();
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // Check if user has visited before (in real app, use localStorage)
    const visited = localStorage.getItem("hasVisitedLearnMatrix");
    setHasVisited(!!visited);
    
    // Set visited flag if not already set
    if (!visited) {
      localStorage.setItem("hasVisitedLearnMatrix", "true");
    }
  }, []);

  // Hide header and tab bar on onboarding screens
  const showHeaderAndTabs = location !== "/onboarding";

  return (
    <div className="h-screen flex flex-col">
      {showHeaderAndTabs && <Header />}
      
      <main className="flex-1 overflow-y-auto pb-16">
        <Switch>
          <Route path="/" component={hasVisited ? Home : Onboarding} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/audio-tutor" component={AudioTutor} />
          <Route path="/visual-tutor" component={VisualTutor} />
          <Route path="/quiz-battle" component={QuizBattle} />
          <Route path="/cohort" component={CohortEngine} />
          <Route path="/profile" component={Profile} />
          <Route path="/rewards" component={RewardShop} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {showHeaderAndTabs && <TabBar />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
