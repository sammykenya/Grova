import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calculator, 
  CreditCard, 
  TrendingUp, 
  Info,
  DollarSign,
  Target,
  Home,
  PiggyBank
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
  const [investmentResult, setInvestmentResult] = useState<any>(null);
  const [mortgageResult, setMortgageResult] = useState<any>(null);
  const [retirementResult, setRetirementResult] = useState<any>(null);

  // Mortgage calculator state
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [mortgageRate, setMortgageRate] = useState("");
  const [mortgageYears, setMortgageYears] = useState("");

  // Retirement calculator state
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyRetirementSavings, setMonthlyRetirementSavings] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [retirementGoal, setRetirementGoal] = useState("");

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
    const principal = parseFloat(investmentAmount);
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(investmentRate) / 100;
    const years = parseFloat(investmentYears);

    if (isNaN(principal) || isNaN(rate) || isNaN(years)) {
      // toast({
      //   title: "Invalid Input",
      //   description: "Please enter valid numbers for all fields",
      //   variant: "destructive",
      // });
      return;
    }

    const monthlyRate = rate / 12;
    const totalMonths = years * 12;

    // Future value of initial investment
    const futureValueInitial = principal * Math.pow(1 + rate, years);

    // Future value of monthly contributions (annuity)
    let futureValueMonthly = 0;
    if (monthly > 0) {
      futureValueMonthly = monthly * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    }

    const totalFutureValue = futureValueInitial + futureValueMonthly;
    const totalContributions = principal + (monthly * totalMonths);
    const totalReturns = totalFutureValue - totalContributions;

    // Year-by-year breakdown
    const yearlyBreakdown = [];
    for (let year = 1; year <= years; year++) {
      const futureValueAtYear = principal * Math.pow(1 + rate, year);
      const monthlyContributionsAtYear = monthly * (Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate;
      yearlyBreakdown.push({
        year,
        value: futureValueAtYear + monthlyContributionsAtYear,
        contributions: principal + (monthly * year * 12)
      });
    }

    setInvestmentResult({
      futureValue: totalFutureValue,
      totalContributions,
      totalReturns,
      returnOnInvestment: (totalReturns / totalContributions) * 100,
      yearlyBreakdown
    });
  };

  const calculateMortgage = () => {
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(mortgageRate) / 100 / 12;
    const years = parseFloat(mortgageYears);

    if (isNaN(price) || isNaN(down) || isNaN(rate) || isNaN(years)) {
      // toast({
      //   title: "Invalid Input",
      //   description: "Please enter valid numbers for all fields",
      //   variant: "destructive",
      // });
      return;
    }

    const loanAmount = price - down;
    const totalMonths = years * 12;

    const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, totalMonths)) / (Math.pow(1 + rate, totalMonths) - 1);
    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    setMortgageResult({
      loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      downPaymentPercent: (down / price) * 100
    });
  };

  const calculateRetirement = () => {
    const current = parseFloat(currentAge);
    const retirement = parseFloat(retirementAge);
    const savings = parseFloat(currentSavings);
    const monthly = parseFloat(monthlyRetirementSavings);
    const rate = parseFloat(expectedReturn) / 100;
    const goal = parseFloat(retirementGoal);

    if (isNaN(current) || isNaN(retirement) || isNaN(savings) || isNaN(monthly) || isNaN(rate)) {
      // toast({
      //   title: "Invalid Input",
      //   description: "Please enter valid numbers for all fields",
      //   variant: "destructive",
      // });
      return;
    }

    const yearsToRetirement = retirement - current;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyRate = rate / 12;

    // Future value of current savings
    const futureCurrentSavings = savings * Math.pow(1 + rate, yearsToRetirement);

    // Future value of monthly contributions
    const futureMonthlySavings = monthly * (Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate;

    const totalRetirementFund = futureCurrentSavings + futureMonthlySavings;
    const totalContributions = savings + (monthly * monthsToRetirement);

    const shortfall = goal ? goal - totalRetirementFund : 0;
    const onTrack = !goal || totalRetirementFund >= goal;

    setRetirementResult({
      totalRetirementFund,
      totalContributions,
      projectedIncome: totalRetirementFund * 0.04, // 4% withdrawal rule
      yearsToRetirement,
      shortfall: shortfall > 0 ? shortfall : 0,
      onTrack
    });
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="loan">Loan</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
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

          {/* Mortgage Calculator */}
          <TabsContent value="mortgage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Mortgage Payment Calculator
                </CardTitle>
                <CardDescription>
                  Calculate monthly mortgage payments and total cost
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="homePrice">Home Price (KES)</Label>
                    <Input
                      id="homePrice"
                      type="number"
                      placeholder="5000000"
                      value={homePrice}
                      onChange={(e) => setHomePrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="downPayment">Down Payment (KES)</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      placeholder="1000000"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mortgageRate">Interest Rate (%)</Label>
                    <Input
                      id="mortgageRate"
                      type="number"
                      step="0.1"
                      placeholder="10.5"
                      value={mortgageRate}
                      onChange={(e) => setMortgageRate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mortgageYears">Loan Term (Years)</Label>
                    <Input
                      id="mortgageYears"
                      type="number"
                      placeholder="25"
                      value={mortgageYears}
                      onChange={(e) => setMortgageYears(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={calculateMortgage} className="w-full bg-blue-600 hover:bg-blue-700">
                  Calculate Mortgage
                </Button>

                {mortgageResult && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Mortgage Calculation Results
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Payment</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(mortgageResult.monthlyPayment)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Interest</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatCurrency(mortgageResult.totalInterest)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Loan Amount</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(mortgageResult.loanAmount)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Down Payment %</p>
                        <p className="text-xl font-bold text-purple-600">
                          {mortgageResult.downPaymentPercent.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retirement Calculator */}
          <TabsContent value="retirement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5" />
                  Retirement Planning Calculator
                </CardTitle>
                <CardDescription>
                  Plan for your retirement and see if you're on track
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentAge">Current Age</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      placeholder="30"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retirementAge">Retirement Age</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      placeholder="60"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentSavings">Current Savings (KES)</Label>
                    <Input
                      id="currentSavings"
                      type="number"
                      placeholder="500000"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyRetirementSavings">Monthly Savings (KES)</Label>
                    <Input
                      id="monthlyRetirementSavings"
                      type="number"
                      placeholder="20000"
                      value={monthlyRetirementSavings}
                      onChange={(e) => setMonthlyRetirementSavings(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.1"
                      placeholder="8.0"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retirementGoal">Retirement Goal (KES)</Label>
                    <Input
                      id="retirementGoal"
                      type="number"
                      placeholder="10000000"
                      value={retirementGoal}
                      onChange={(e) => setRetirementGoal(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={calculateRetirement} className="w-full bg-purple-600 hover:bg-purple-700">
                  Calculate Retirement Plan
                </Button>

                {retirementResult && (
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Retirement Planning Results
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Projected Fund</p>
                        <p className="text-xl font-bold text-purple-600">
                          {formatCurrency(retirementResult.totalRetirementFund)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Annual Income</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(retirementResult.projectedIncome)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Years to Retirement</p>
                        <p className="text-xl font-bold text-blue-600">
                          {retirementResult.yearsToRetirement}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Goal Status</p>
                        <p className={`text-xl font-bold ${retirementResult.onTrack ? 'text-green-600' : 'text-red-600'}`}>
                          {retirementResult.onTrack ? 'On Track!' : 'Shortfall'}
                        </p>
                      </div>
                    </div>
                    {retirementResult.shortfall > 0 && (
                      <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 rounded">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          You need an additional {formatCurrency(retirementResult.shortfall)} to reach your retirement goal.
                        </p>
                      </div>
                    )}
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