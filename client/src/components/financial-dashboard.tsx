import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Wallet,
  PiggyBank,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface FinancialDashboardProps {
  wallets: any[];
}

export default function FinancialDashboard({ wallets }: FinancialDashboardProps) {
  const [animateCounters, setAnimateCounters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    setAnimateCounters(true);
  }, []);

  // Mock financial data - in real app this would come from API
  const financialStats = {
    totalAssets: 125000,
    monthlyIncome: 8500,
    monthlyExpenses: 6200,
    savings: 18800,
    investments: 42000,
    creditUtilization: 23,
    savingsGoal: 25000,
    expenseCategories: [
      { name: 'Housing', amount: 2500, percentage: 40, color: 'hsl(207,90%,54%)' },
      { name: 'Food', amount: 800, percentage: 13, color: 'hsl(25,85%,53%)' },
      { name: 'Transport', amount: 600, percentage: 10, color: 'hsl(142,71%,45%)' },
      { name: 'Entertainment', amount: 400, percentage: 6, color: 'hsl(262,83%,58%)' },
      { name: 'Other', amount: 1900, percentage: 31, color: 'hsl(217,91%,60%)' }
    ]
  };

  const netWorth = financialStats.totalAssets;
  const monthlyNet = financialStats.monthlyIncome - financialStats.monthlyExpenses;
  const savingsProgress = (financialStats.savings / financialStats.savingsGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="neo-card-interactive p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="neo-icon bg-gradient-to-br from-[hsl(207,90%,54%)] to-[hsl(207,70%,62%)]">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className={`grova-data text-lg ${animateCounters ? 'balance-counter' : ''}`}>
            KES {netWorth.toLocaleString()}
          </div>
          <p className="grova-body text-gray-600 text-xs">Net Worth</p>
        </div>

        <div className="neo-card-interactive p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="neo-icon bg-gradient-to-br from-[hsl(25,85%,53%)] to-[hsl(25,75%,58%)]">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            {monthlyNet > 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className={`grova-data text-lg ${animateCounters ? 'balance-counter' : ''}`}>
            KES {monthlyNet.toLocaleString()}
          </div>
          <p className="grova-body text-gray-600 text-xs">Monthly Net</p>
        </div>

        <div className="neo-card-interactive p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="neo-icon bg-gradient-to-br from-green-500 to-green-600">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <Target className="w-4 h-4 text-[hsl(25,85%,53%)]" />
          </div>
          <div className={`grova-data text-lg ${animateCounters ? 'balance-counter' : ''}`}>
            KES {financialStats.savings.toLocaleString()}
          </div>
          <p className="grova-body text-gray-600 text-xs">Savings</p>
        </div>

        <div className="neo-card-interactive p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="neo-icon bg-gradient-to-br from-purple-500 to-purple-600">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-gray-500">{financialStats.creditUtilization}%</span>
          </div>
          <div className={`grova-data text-lg ${animateCounters ? 'balance-counter' : ''}`}>
            KES {financialStats.investments.toLocaleString()}
          </div>
          <p className="grova-body text-gray-600 text-xs">Investments</p>
        </div>
      </div>

      {/* Savings Goal Progress */}
      <div className="neo-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="grova-section-title flex items-center">
            <Target className="w-5 h-5 mr-2 text-[hsl(25,85%,53%)]" />
            Savings Goal Progress
          </h3>
          <span className="text-sm font-semibold gradient-text-primary">
            {savingsProgress.toFixed(1)}%
          </span>
        </div>
        
        <div className="neo-progress-track mb-4">
          <div 
            className="neo-progress-fill"
            style={{ width: `${savingsProgress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="grova-body text-gray-600">
            KES {financialStats.savings.toLocaleString()} saved
          </span>
          <span className="grova-body text-gray-600">
            Goal: KES {financialStats.savingsGoal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="neo-card p-6">
        <h3 className="grova-section-title mb-6">Monthly Expenses</h3>
        <div className="space-y-4">
          {financialStats.expenseCategories.map((category, index) => (
            <div 
              key={category.name}
              className="flex items-center justify-between p-3 neo-card-small hover:neo-card-interactive transition-all"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="grova-body font-medium">{category.name}</span>
              </div>
              <div className="text-right">
                <div className="grova-body font-semibold">
                  KES {category.amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {category.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Financial Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="neo-button-primary p-6 h-auto flex-col space-y-2">
          <PiggyBank className="w-6 h-6" />
          <span>Add to Savings</span>
        </Button>
        <Button className="neo-button-secondary p-6 h-auto flex-col space-y-2">
          <TrendingUp className="w-6 h-6" />
          <span>Invest More</span>
        </Button>
      </div>
    </div>
  );
}