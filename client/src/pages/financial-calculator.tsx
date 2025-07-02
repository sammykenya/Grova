import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  CreditCard,
  ArrowLeft,
  Info
} from "lucide-react";
import { Link } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";

export default function FinancialCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [loanRate, setLoanRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [loanResult, setLoanResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investmentRate, setInvestmentRate] = useState("");
  const [investmentYears, setInvestmentYears] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [investmentResult, setInvestmentResult] = useState<{
    futureValue: number;
    totalContributions: number;
    totalInterest: number;
  } | null>(null);

  const [savingsGoal, setSavingsGoal] = useState("");
  const [savingsYears, setSavingsYears] = useState("");
  const [savingsRate, setSavingsRate] = useState("");
  const [savingsResult, setSavingsResult] = useState<{
    monthlyRequired: number;
    totalContributions: number;
    interestEarned: number;
  } | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(loanRate) / 100 / 12;
    const payments = parseFloat(loanTerm) * 12;

    if (principal && rate && payments) {
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, payments)) / 
                            (Math.pow(1 + rate, payments) - 1);
      const totalPayment = monthlyPayment * payments;
      const totalInterest = totalPayment - principal;

      setLoanResult({
        monthlyPayment,
        totalPayment,
        totalInterest
      });
    }
  };

  const calculateInvestment = () => {
    const principal = parseFloat(investmentAmount) || 0;
    const rate = parseFloat(investmentRate) / 100 / 12;
    const years = parseFloat(investmentYears);
    const monthly = parseFloat(monthlyContribution) || 0;
    const months = years * 12;

    if (rate && years) {
      // Future value of lump sum
      const fvLumpSum = principal * Math.pow(1 + rate, months);
      
      // Future value of monthly contributions
      const fvMonthly = monthly * (Math.pow(1 + rate, months) - 1) / rate;
      
      const futureValue = fvLumpSum + fvMonthly;
      const totalContributions = principal + (monthly * months);
      const totalInterest = futureValue - totalContributions;

      setInvestmentResult({
        futureValue,
        totalContributions,
        totalInterest
      });
    }
  };

  const calculateSavings = () => {
    const goal = parseFloat(savingsGoal);
    const years = parseFloat(savingsYears);
    const rate = parseFloat(savingsRate) / 100 / 12;
    const months = years * 12;

    if (goal && years && rate) {
      const monthlyRequired = (goal * rate) / (Math.pow(1 + rate, months) - 1);
      const totalContributions = monthlyRequired * months;
      const interestEarned = goal - totalContributions;

      setSavingsResult({
        monthlyRequired,
        totalContributions,
        interestEarned
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/more">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Financial Calculator
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Calculate loans, investments, and savings goals
            </p>
          </div>
          <Calculator className="w-8 h-8 text-purple-600" />
        </div>

        <Tabs defaultValue="loan" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="loan">Loan Calculator</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="savings">Savings Goal</TabsTrigger>
          </TabsList>

          {/* Loan Calculator */}
          <TabsContent value="loan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Loan Payment Calculator
                </CardTitle>
                <CardDescription>
                  Calculate monthly payments, total interest, and loan details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="loanAmount">Loan Amount (KES)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="500000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="loanRate">Annual Interest Rate (%)</Label>
                    <Input
                      id="loanRate"
                      type="number"
                      step="0.1"
                      placeholder="12.5"
                      value={loanRate}
                      onChange={(e) => setLoanRate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                    <Input
                      id="loanTerm"
                      type="number"
                      placeholder="5"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={calculateLoan} className="w-full">
                  Calculate Loan Payment
                </Button>

                {loanResult && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Loan Calculation Results
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Payment</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(loanResult.monthlyPayment)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Payment</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(loanResult.totalPayment)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Interest</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatCurrency(loanResult.totalInterest)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Calculator */}
          <TabsContent value="investment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Investment Growth Calculator
                </CardTitle>
                <CardDescription>
                  Calculate compound growth of your investments over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="investmentAmount">Initial Investment (KES)</Label>
                    <Input
                      id="investmentAmount"
                      type="number"
                      placeholder="100000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyContribution">Monthly Contribution (KES)</Label>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      placeholder="10000"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="investmentRate">Annual Return Rate (%)</Label>
                    <Input
                      id="investmentRate"
                      type="number"
                      step="0.1"
                      placeholder="8.5"
                      value={investmentRate}
                      onChange={(e) => setInvestmentRate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="investmentYears">Investment Period (Years)</Label>
                    <Input
                      id="investmentYears"
                      type="number"
                      placeholder="10"
                      value={investmentYears}
                      onChange={(e) => setInvestmentYears(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={calculateInvestment} className="w-full bg-green-600 hover:bg-green-700">
                  Calculate Investment Growth
                </Button>

                {investmentResult && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Investment Projection
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Future Value</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(investmentResult.futureValue)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Contributions</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(investmentResult.totalContributions)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Interest Earned</p>
                        <p className="text-xl font-bold text-purple-600">
                          {formatCurrency(investmentResult.totalInterest)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Savings Goal Calculator */}
          <TabsContent value="savings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5" />
                  Savings Goal Calculator
                </CardTitle>
                <CardDescription>
                  Calculate how much to save monthly to reach your financial goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="savingsGoal">Savings Goal (KES)</Label>
                    <Input
                      id="savingsGoal"
                      type="number"
                      placeholder="1000000"
                      value={savingsGoal}
                      onChange={(e) => setSavingsGoal(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="savingsYears">Time to Goal (Years)</Label>
                    <Input
                      id="savingsYears"
                      type="number"
                      placeholder="3"
                      value={savingsYears}
                      onChange={(e) => setSavingsYears(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="savingsRate">Annual Interest Rate (%)</Label>
                    <Input
                      id="savingsRate"
                      type="number"
                      step="0.1"
                      placeholder="6.5"
                      value={savingsRate}
                      onChange={(e) => setSavingsRate(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={calculateSavings} className="w-full bg-purple-600 hover:bg-purple-700">
                  Calculate Required Savings
                </Button>

                {savingsResult && (
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <PiggyBank className="w-4 h-4" />
                      Savings Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Required</p>
                        <p className="text-xl font-bold text-purple-600">
                          {formatCurrency(savingsResult.monthlyRequired)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Saved</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(savingsResult.totalContributions)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Interest Earned</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(savingsResult.interestEarned)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Financial Planning Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Loan Tips</Badge>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Lower interest rates save thousands over time</li>
                  <li>• Shorter terms mean higher payments but less interest</li>
                  <li>• Consider extra payments to reduce total interest</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Investment Tips</Badge>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Start investing early to maximize compound growth</li>
                  <li>• Regular contributions build wealth over time</li>
                  <li>• Diversify investments to manage risk</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation currentPage="more" />
    </div>
  );
}