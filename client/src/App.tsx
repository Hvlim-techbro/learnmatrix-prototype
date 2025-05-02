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
    // Check if user has visited before 
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-lightest to-neutral-light relative">
      {/* Abstract background patterns */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-primary opacity-5 blur-3xl"></div>
      <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-gradient-purple opacity-5 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-48 h-48 rounded-full bg-gradient-blue opacity-5 blur-3xl"></div>
      
      {showHeaderAndTabs && <Header />}
      
      <main className="flex-1 overflow-y-auto pb-20 max-w-screen-lg w-full mx-auto relative z-10">
        <Switch>
          <Route path="/" component={hasVisited ? Home : Onboarding} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/audio-tutor" component={AudioTutor} />
          <Route path="/visual-tutor" component={VisualTutor} />
          <Route path="/quiz-battle" component={QuizBattle} />
          <Route path="/cohort" component={CohortEngine} />
          <Route path="/profile" component={Profile} />
          <Route path="/rewards" component={RewardShop} />
          <Route path="/courses" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {showHeaderAndTabs && <TabBar />}
      
      {/* Additional decorative element at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-neutral-light to-transparent -z-10"></div>
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
