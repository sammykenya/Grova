import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/bottom-navigation";
import FinancialDashboard from "@/components/financial-dashboard";
import ExpenseTracker from "@/components/expense-tracker";
import { ArrowLeft, BarChart3, TrendingUp } from "lucide-react";

export default function FinancialDashboardPage() {
  // Fetch wallets for dashboard
  const { data: wallets = [] } = useQuery({
    queryKey: ['/api/wallets'],
    retry: false,
  });

  return (
    <div className="min-h-screen neo-base pb-24">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-[hsl(207,90%,54%)] via-[hsl(207,80%,58%)] to-[hsl(207,70%,62%)] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/more">
              <Button variant="ghost" size="icon" className="neo-glass-button">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            
            <h1 className="grova-headline text-white text-xl">Financial Dashboard</h1>
            
            <Button variant="ghost" size="icon" className="neo-glass-button">
              <BarChart3 className="w-6 h-6" />
            </Button>
          </div>
          
          <p className="grova-body text-white/90 text-sm">
            Comprehensive view of your financial health and spending patterns
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Financial Dashboard Component */}
        <FinancialDashboard wallets={wallets} />
        
        {/* Expense Tracker Component */}
        <ExpenseTracker />
      </div>

      <BottomNavigation />
    </div>
  );
}