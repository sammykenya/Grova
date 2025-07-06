import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import SendMoney from "@/pages/send-money";
import AICoach from "@/pages/ai-coach";
import CommunityTreasury from "@/pages/community-treasury";
import AgentLocator from "@/pages/agent-locator";
import QRPayments from "@/pages/qr-payments";
import Investments from "@/pages/investments";
import Advisors from "@/pages/advisors";
import More from "@/pages/more";
import FoundersRoom from "@/pages/founders-room";
import Mentorship from "@/pages/mentorship";
import Banking from "@/pages/banking";
import FinancialCalculator from "@/pages/financial-calculator";
import BudgetPlanner from "@/pages/budget-planner";
import CurrencyExchange from "@/pages/currency-exchange";
import CryptoTracker from "@/pages/crypto-tracker";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/send" component={SendMoney} />
          <Route path="/qr-payments" component={QRPayments} />
          <Route path="/investments" component={Investments} />
          <Route path="/advisors" component={Advisors} />
          <Route path="/more" component={More} />
          <Route path="/founders-room" component={FoundersRoom} />
          <Route path="/mentorship" component={Mentorship} />
          <Route path="/ai-coach" component={AICoach} />
          <Route path="/community" component={CommunityTreasury} />
          <Route path="/community-treasury" component={CommunityTreasury} />
          <Route path="/agents" component={AgentLocator} />
          <Route path="/agent-locator" component={AgentLocator} />
          <Route path="/banking" component={Banking} />
          <Route path="/financial-calculator" component={FinancialCalculator} />
          <Route path="/budget-planner" component={BudgetPlanner} />
          <Route path="/currency-exchange" component={CurrencyExchange} />
          <Route path="/crypto-tracker" component={CryptoTracker} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="mobile-container bg-slate-50">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;