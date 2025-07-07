import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Target, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Coins,
  Building,
  Globe
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from "recharts";
import BottomNavigation from "@/components/bottom-navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  currentValue: number;
  change: number;
  changePercent: number;
  riskLevel: "low" | "medium" | "high";
  sector: string;
  currency: string;
}

interface PortfolioData {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  investments: Investment[];
}

export default function Investments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("portfolio");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedInvestment, setSelectedInvestment] = useState("");

  // Mock portfolio data
  const portfolioData: PortfolioData = {
    totalValue: 85420,
    totalChange: 4250,
    totalChangePercent: 5.24,
    investments: [
      {
        id: "1",
        name: "Safaricom PLC",
        type: "Stock",
        amount: 25000,
        currentValue: 28500,
        change: 3500,
        changePercent: 14.0,
        riskLevel: "medium",
        sector: "Telecommunications",
        currency: "KES"
      },
      {
        id: "2", 
        name: "KCB Group",
        type: "Stock",
        amount: 15000,
        currentValue: 16200,
        change: 1200,
        changePercent: 8.0,
        riskLevel: "medium",
        sector: "Banking",
        currency: "KES"
      },
      {
        id: "3",
        name: "Bitcoin",
        type: "Cryptocurrency",
        amount: 20000,
        currentValue: 18800,
        change: -1200,
        changePercent: -6.0,
        riskLevel: "high",
        sector: "Cryptocurrency",
        currency: "USD"
      },
      {
        id: "4",
        name: "Treasury Bills",
        type: "Government Bond",
        amount: 10000,
        currentValue: 10520,
        change: 520,
        changePercent: 5.2,
        riskLevel: "low",
        sector: "Government",
        currency: "KES"
      },
      {
        id: "5",
        name: "Equity Bank",
        type: "Stock", 
        amount: 12000,
        currentValue: 11400,
        change: -600,
        changePercent: -5.0,
        riskLevel: "medium",
        sector: "Banking",
        currency: "KES"
      }
    ]
  };

  // Chart data for portfolio performance
  const performanceData = [
    { month: "Jan", value: 75000 },
    { month: "Feb", value: 78500 },
    { month: "Mar", value: 76800 },
    { month: "Apr", value: 81200 },
    { month: "May", value: 83400 },
    { month: "Jun", value: 85420 }
  ];

  // Pie chart data for allocation
  const allocationData = portfolioData.investments.map(inv => ({
    name: inv.name,
    value: inv.currentValue,
    color: inv.type === "Stock" ? "#3B82F6" : 
           inv.type === "Cryptocurrency" ? "#F59E0B" :
           inv.type === "Government Bond" ? "#10B981" : "#6366F1"
  }));

  const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#6366F1", "#EF4444"];

  const availableInvestments = [
    { id: "saf", name: "Safaricom PLC", type: "Stock", minAmount: 1000, currency: "KES" },
    { id: "kcb", name: "KCB Group", type: "Stock", minAmount: 1000, currency: "KES" },
    { id: "eqt", name: "Equity Bank", type: "Stock", minAmount: 1000, currency: "KES" },
    { id: "btc", name: "Bitcoin", type: "Cryptocurrency", minAmount: 100, currency: "USD" },
    { id: "eth", name: "Ethereum", type: "Cryptocurrency", minAmount: 50, currency: "USD" },
    { id: "tbill", name: "Treasury Bills", type: "Government Bond", minAmount: 5000, currency: "KES" },
    { id: "corp", name: "Corporate Bonds", type: "Corporate Bond", minAmount: 10000, currency: "KES" }
  ];

  const handleInvestment = () => {
    if (!selectedInvestment || !investmentAmount) {
      toast({
        title: "Missing Information",
        description: "Please select an investment and enter amount",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Investment Placed",
      description: `Your investment of ${investmentAmount} has been processed`,
    });

    setInvestmentAmount("");
    setSelectedInvestment("");
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600 bg-green-100 dark:bg-green-900";
      case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900";
      case "high": return "text-red-600 bg-red-100 dark:bg-red-900";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Bold Blue Header */}
      <div className="bg-grova-blue text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="grova-headline text-white text-xl mb-2">
            Investment Portfolio
          </h1>
          <p className="grova-body text-white/90 text-sm">
            Build wealth through smart investments in stocks, bonds, and digital assets
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {/* Portfolio Summary - Bold Color Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-grova-blue text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Total Portfolio Value</p>
                <p className="grova-data text-white text-3xl font-black">KSh {portfolioData.totalValue.toLocaleString()}</p>
              </div>
              <PieChart className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-grova-orange text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Total Gains</p>
                <p className="grova-data text-white text-3xl font-black">+KSh {portfolioData.totalChange.toLocaleString()}</p>
                <p className="grova-body text-white/80 text-sm">+{portfolioData.totalChangePercent}%</p>
              </div>
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 text-gray-900 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-gray-600 mb-2">Active Investments</p>
                <p className="grova-data text-gray-900 text-3xl font-black">{portfolioData.investments.length}</p>
                <p className="grova-body text-gray-600 text-sm">Diversified Portfolio</p>
              </div>
              <Target className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="invest">New Investment</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="education">Learn</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Performance Chart</CardTitle>
                  <CardDescription>6-month portfolio performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, "Portfolio Value"]} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        dot={{ fill: "#8B5CF6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                  <CardDescription>Portfolio distribution by investment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        dataKey="value"
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, "Value"]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Investments</CardTitle>
                <CardDescription>Current holdings and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {investment.type === "Stock" ? <Building className="w-6 h-6" /> :
                           investment.type === "Cryptocurrency" ? <Coins className="w-6 h-6" /> :
                           <Globe className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{investment.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{investment.type}</Badge>
                            <Badge variant="outline" className={`text-xs ${getRiskColor(investment.riskLevel)}`}>
                              {investment.riskLevel} risk
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">
                          {investment.currency} {investment.currentValue.toLocaleString()}
                        </p>
                        <div className={`flex items-center gap-1 ${investment.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {investment.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="text-sm">
                            {investment.change >= 0 ? '+' : ''}{investment.changePercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invest">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Make New Investment
                  </CardTitle>
                  <CardDescription>
                    Choose from our curated selection of investment options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="investment">Select Investment</Label>
                    <Select value={selectedInvestment} onValueChange={setSelectedInvestment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an investment" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableInvestments.map((inv) => (
                          <SelectItem key={inv.id} value={inv.id}>
                            {inv.name} ({inv.type}) - Min: {inv.currency} {inv.minAmount}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Investment Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount to invest"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleInvestment} className="w-full bg-green-600 hover:bg-green-700">
                    Invest Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Investment Options</CardTitle>
                  <CardDescription>Available investment categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { type: "Stocks", desc: "Individual company shares", risk: "Medium", return: "8-15%" },
                    { type: "Bonds", desc: "Government & corporate debt", risk: "Low", return: "4-8%" },
                    { type: "Crypto", desc: "Digital assets & currencies", risk: "High", return: "15-50%" },
                    { type: "ETFs", desc: "Diversified index funds", risk: "Medium", return: "6-12%" }
                  ].map((option, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{option.type}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">{option.return}</p>
                          <Badge variant="outline" className={`text-xs ${getRiskColor(option.risk.toLowerCase())}`}>
                            {option.risk}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Portfolio Risk Level</span>
                        <span>Medium</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Diversification Score</span>
                        <span>Good</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Expected Annual Return</span>
                        <span>12.5%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Well diversified across sectors</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Your portfolio spans multiple industries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Consider adding more bonds</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Increase stability with government securities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Good crypto allocation</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Balanced exposure to digital assets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Investment Basics",
                  description: "Learn the fundamentals of investing and building wealth",
                  lessons: 8,
                  duration: "2 hours",
                  level: "Beginner"
                },
                {
                  title: "Stock Market Mastery", 
                  description: "Deep dive into stock analysis and trading strategies",
                  lessons: 12,
                  duration: "4 hours",
                  level: "Intermediate"
                },
                {
                  title: "Cryptocurrency Guide",
                  description: "Understanding digital assets and blockchain technology",
                  lessons: 10,
                  duration: "3 hours",
                  level: "Intermediate"
                }
              ].map((course, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>{course.lessons} lessons</span>
                      <span>{course.duration}</span>
                    </div>
                    <Badge variant="outline">{course.level}</Badge>
                    <Button className="w-full">Start Learning</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation currentPage="investments" />
    </div>
  );
}