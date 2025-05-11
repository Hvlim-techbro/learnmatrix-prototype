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
import AudioMvp from "@/pages/AudioMvp";
import BasicAudioMvp from "@/pages/BasicAudioMvp";
import VisualTutor from "@/pages/VisualTutor";
import QuizBattle from "@/pages/QuizBattle";
import CohortEngine from "@/pages/CohortEngine";
import Profile from "@/pages/Profile";
import RewardShop from "@/pages/RewardShop";
import SplashScreen from "@/pages/SplashScreen";
import WelcomeScreen from "@/pages/WelcomeScreen";
import SignUp from "@/pages/SignUp";
import ProfileSetup from "@/pages/ProfileSetup";
import PlanSelection from "@/pages/PlanSelection";
import { useEffect, useState } from "react";

function Router() {
  const [location] = useLocation();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Check if user has completed the onboarding flow
    const onboardingCompleted = localStorage.getItem("learnMatrixOnboardingCompleted");
    setHasCompletedOnboarding(!!onboardingCompleted);
    
    // Clear the initial load state after checking (give it more time to load)
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Determine if this is a welcome flow page
  const isWelcomeFlowPage = [
    "/", 
    "/splash",
    "/welcome",
    "/signup",
    "/profile-setup",
    "/plan-selection"
  ].includes(location) && !hasCompletedOnboarding;
  
  // Development helper - uncomment to test welcome flow
  // localStorage.removeItem("learnMatrixOnboardingCompleted");

  // Hide header and tab bar on welcome flow screens
  const showHeaderAndTabs = !isWelcomeFlowPage && location !== "/onboarding";
  
  // Show initial splash screen (but fix the previous loading issue)
  if (isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-20 h-20 rounded-full bg-gradient-primary animate-pulse-custom"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      {showHeaderAndTabs && (
        <>
          {/* Abstract background patterns */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-primary opacity-5 blur-3xl"></div>
          <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-gradient-purple opacity-5 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-48 h-48 rounded-full bg-gradient-blue opacity-5 blur-3xl"></div>
        </>
      )}
      
      {showHeaderAndTabs && <Header />}
      
      <main className={`flex-1 overflow-y-auto ${showHeaderAndTabs ? 'pb-20 max-w-screen-lg w-full mx-auto' : 'w-full'} relative z-10`}>
        <Switch>
          {/* Welcome Flow Routes */}
          <Route path="/" component={SplashScreen} />
          <Route path="/splash" component={SplashScreen} />
          <Route path="/welcome" component={WelcomeScreen} />
          <Route path="/signup" component={SignUp} />
          <Route path="/profile-setup" component={ProfileSetup} />
          <Route path="/plan-selection" component={PlanSelection} />
          
          {/* Main App Routes */}
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/home" component={Home} />
          <Route path="/dashboard" component={Home} />
          <Route path="/audio-tutor" component={AudioTutor} />
          <Route path="/audio-mvp" component={AudioMvp} />
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
      
      {showHeaderAndTabs && (
        // Additional decorative element at the bottom
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-neutral-light to-transparent -z-10"></div>
      )}
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
