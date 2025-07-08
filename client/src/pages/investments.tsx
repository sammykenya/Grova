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
  Globe,
  ArrowLeft,
  Play,
  Star
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Cell, 
  Pie
} from "recharts";
import BottomNavigation from "@/components/bottom-navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

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

export default function Investments() {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [investAmount, setInvestAmount] = useState("");
  const [selectedInvestment, setSelectedInvestment] = useState("");
  const { toast } = useToast();

  // Mock portfolio data
  const portfolioData = {
    totalValue: 285420,
    totalChange: 34850,
    totalChangePercent: 13.9,
    investments: [
      {
        id: "saf",
        name: "Safaricom PLC",
        type: "Stock",
        amount: 50000,
        currentValue: 67500,
        change: 17500,
        changePercent: 35.0,
        riskLevel: "medium" as const,
        sector: "Telecommunications",
        currency: "KES"
      },
      {
        id: "eqt",
        name: "Equity Bank",
        type: "Stock", 
        amount: 75000,
        currentValue: 89250,
        change: 14250,
        changePercent: 19.0,
        riskLevel: "low" as const,
        sector: "Financial Services",
        currency: "KES"
      },
      {
        id: "btc",
        name: "Bitcoin",
        type: "Cryptocurrency",
        amount: 25000,
        currentValue: 31200,
        change: 6200,
        changePercent: 24.8,
        riskLevel: "high" as const,
        sector: "Cryptocurrency",
        currency: "USD"
      },
      {
        id: "tbill",
        name: "Treasury Bills",
        type: "Government Bond",
        amount: 100000,
        currentValue: 107500,
        change: 7500,
        changePercent: 7.5,
        riskLevel: "low" as const,
        sector: "Government Securities",
        currency: "KES"
      }
    ]
  };

  // Mock performance data
  const performanceData = [
    { month: "Jan", value: 195000 },
    { month: "Feb", value: 208500 },
    { month: "Mar", value: 198200 },
    { month: "Apr", value: 225800 },
    { month: "May", value: 242100 },
    { month: "Jun", value: 268750 },
    { month: "Jul", value: 285420 }
  ];

  // Mock allocation data
  const allocationData = [
    { name: "Stocks", value: 45, amount: 128439 },
    { name: "Bonds", value: 25, amount: 71355 },
    { name: "Crypto", value: 20, value: 57084 },
    { name: "Real Estate", value: 10, amount: 28542 }
  ];

  const COLORS = ['#1D4ED8', '#EA580C', '#DC2626', '#059669'];

  // Mock available investments
  const availableInvestments = [
    { id: "saf", name: "Safaricom PLC", type: "Stock", price: 45.50, change: 2.3, minAmount: 1000, currency: "KES" },
    { id: "kcb", name: "KCB Group", type: "Stock", price: 52.80, change: -1.2, minAmount: 1000, currency: "KES" },
    { id: "eqt", name: "Equity Bank", type: "Stock", price: 67.25, change: 3.4, minAmount: 1000, currency: "KES" },
    { id: "btc", name: "Bitcoin", type: "Cryptocurrency", price: 98745.32, change: 5.8, minAmount: 100, currency: "USD" },
    { id: "eth", name: "Ethereum", type: "Cryptocurrency", price: 3842.15, change: 4.2, minAmount: 50, currency: "USD" },
    { id: "tbill", name: "Treasury Bills", type: "Government Bond", price: 15.2, change: 0.1, minAmount: 5000, currency: "KES" }
  ];

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'BTC') {
      return `₿${(amount / 98745.32).toFixed(6)}`;
    }
    if (currency === 'USD') {
      return `$${amount.toLocaleString()}`;
    }
    return `KSh ${amount.toLocaleString()}`;
  };

  const handleInvest = () => {
    if (!selectedInvestment || !investAmount) {
      toast({
        title: "Investment Error",
        description: "Please select an investment and enter an amount",
        variant: "destructive",
      });
      return;
    }

    const investment = availableInvestments.find(inv => inv.id === selectedInvestment);
    const amount = parseFloat(investAmount);

    if (amount < investment!.minAmount) {
      toast({
        title: "Minimum Investment",
        description: `Minimum investment for ${investment!.name} is ${formatCurrency(investment!.minAmount, investment!.currency)}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Investment Successful",
      description: `Successfully invested ${formatCurrency(amount, investment!.currency)} in ${investment!.name}`,
    });

    setInvestAmount("");
    setSelectedInvestment("");
  };

  return (
    <div className="min-h-screen neo-base">
      {/* Header */}
      <div className="neo-card" style={{ borderRadius: '0 0 24px 24px', margin: '0' }}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/more">
                <Button variant="ghost" className="text-white p-0 hover:bg-white/20">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
              </Link>
              <div>
                <h2 className="text-xl font-semibold">Investment Portfolio</h2>
                <p className="text-sm text-blue-100">Build wealth with smart investments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-grova-blue text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Total Portfolio</p>
                <p className="grova-data text-white text-2xl font-black">KSh {portfolioData.totalValue.toLocaleString()}</p>
              </div>
              <PieChart className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-grova-orange text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Total Gains</p>
                <p className="grova-data text-white text-2xl font-black">+KSh {portfolioData.totalChange.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-white border-2 border-grova-blue p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-gray-600 mb-2">Growth Rate</p>
                <p className="grova-data text-grova-blue text-2xl font-black">+{portfolioData.totalChangePercent}%</p>
              </div>
              <Target className="w-8 h-8 text-grova-orange" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Performance Chart */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Performance</CardTitle>
                  <CardDescription>7-month growth trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`KSh ${value.toLocaleString()}`, 'Portfolio Value']} />
                      <Line type="monotone" dataKey="value" stroke="#1D4ED8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Allocation Chart */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Asset Allocation</CardTitle>
                  <CardDescription>Portfolio distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Holdings List */}
            <Card className="p-6 mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="grova-section-title">Your Holdings</CardTitle>
                <CardDescription>Current investment positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          investment.type === 'Stock' ? 'bg-grova-blue' :
                          investment.type === 'Cryptocurrency' ? 'bg-grova-orange' :
                          'bg-green-600'
                        }`}>
                          {investment.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{investment.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">{investment.type}</Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                investment.riskLevel === 'low' ? 'border-green-500 text-green-600' :
                                investment.riskLevel === 'medium' ? 'border-yellow-500 text-yellow-600' :
                                'border-red-500 text-red-600'
                              }`}
                            >
                              {investment.riskLevel} risk
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(investment.currentValue, investment.currency)}</p>
                        <p className={`text-sm flex items-center ${
                          investment.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {investment.change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          {investment.change > 0 ? '+' : ''}{investment.changePercent}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explore">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Investment Options */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Available Investments</CardTitle>
                  <CardDescription>Explore new investment opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableInvestments.map((investment) => (
                      <div key={investment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-grova-blue transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            investment.type === 'Stock' ? 'bg-grova-blue' :
                            investment.type === 'Cryptocurrency' ? 'bg-grova-orange' :
                            'bg-green-600'
                          }`}>
                            {investment.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{investment.name}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(investment.price, investment.currency)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${investment.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {investment.change > 0 ? '+' : ''}{investment.change}%
                          </p>
                          <p className="text-xs text-gray-500">{investment.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Investment Form */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Make Investment</CardTitle>
                  <CardDescription>Start investing with as little as KSh 100</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="investment-select">Select Investment</Label>
                    <Select value={selectedInvestment} onValueChange={setSelectedInvestment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an investment..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableInvestments.map((investment) => (
                          <SelectItem key={investment.id} value={investment.id}>
                            {investment.name} - {formatCurrency(investment.price, investment.currency)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Investment Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount..."
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleInvest}
                    className="w-full bg-grova-blue hover:bg-blue-700 text-white"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Invest Now
                  </Button>

                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-gray-900">Investment Benefits</p>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Diversified portfolio management</li>
                      <li>• Professional advisory support</li>
                      <li>• Real-time market analytics</li>
                      <li>• Low fees and transparent pricing</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Market Insights</CardTitle>
                  <CardDescription>Latest market performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">NSE 20 Index</p>
                        <p className="text-sm text-gray-600">Nairobi Securities Exchange</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+2.3%</p>
                        <p className="text-xs text-gray-500">Today</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">Bitcoin</p>
                        <p className="text-sm text-gray-600">Cryptocurrency</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">+5.8%</p>
                        <p className="text-xs text-gray-500">24h</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">Treasury Bills</p>
                        <p className="text-sm text-gray-600">91-day rate</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">15.2%</p>
                        <p className="text-xs text-gray-500">Annual</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Portfolio Analytics</CardTitle>
                  <CardDescription>Performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-grova-blue" />
                      <p className="text-sm text-gray-600">Sharpe Ratio</p>
                      <p className="text-lg font-bold">1.85</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <Target className="w-6 h-6 mx-auto mb-2 text-grova-orange" />
                      <p className="text-sm text-gray-600">Alpha</p>
                      <p className="text-lg font-bold">+3.2%</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-gray-600">Beta</p>
                      <p className="text-lg font-bold">0.92</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <DollarSign className="w-6 h-6 mx-auto mb-2 text-red-600" />
                      <p className="text-sm text-gray-600">Max Drawdown</p>
                      <p className="text-lg font-bold">-8.3%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation currentPage="investments" />
    </div>
  );
}