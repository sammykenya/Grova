
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
  Pie,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend
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

  // Enhanced portfolio data with comprehensive metrics
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
      },
      {
        id: "real",
        name: "REIT Fund",
        type: "Real Estate",
        amount: 60000,
        currentValue: 72450,
        change: 12450,
        changePercent: 20.75,
        riskLevel: "medium" as const,
        sector: "Real Estate",
        currency: "KES"
      }
    ]
  };

  // Enhanced performance data with more sophisticated metrics
  const performanceData = [
    { month: "Jul 2024", value: 195000, benchmark: 190000, growth: 2.1 },
    { month: "Aug 2024", value: 208500, benchmark: 195500, growth: 6.9 },
    { month: "Sep 2024", value: 198200, benchmark: 201000, growth: -4.9 },
    { month: "Oct 2024", value: 225800, benchmark: 208500, growth: 13.9 },
    { month: "Nov 2024", value: 242100, benchmark: 215300, growth: 7.2 },
    { month: "Dec 2024", value: 268750, benchmark: 223800, growth: 11.0 },
    { month: "Jan 2025", value: 285420, benchmark: 235600, growth: 6.2 }
  ];

  // Sector allocation data
  const sectorData = [
    { name: "Financial Services", value: 35, amount: 99875, color: "#1D4ED8" },
    { name: "Telecommunications", value: 25, amount: 71355, color: "#EA580C" },
    { name: "Real Estate", value: 20, amount: 57084, color: "#DC2626" },
    { name: "Technology", value: 12, amount: 34251, color: "#7C3AED" },
    { name: "Government Securities", value: 8, amount: 22855, color: "#059669" }
  ];

  // Risk allocation data
  const riskData = [
    { name: "Low Risk", value: 45, amount: 128475, color: "#059669" },
    { name: "Medium Risk", value: 35, amount: 99897, color: "#EA580C" },
    { name: "High Risk", value: 20, amount: 57048, color: "#DC2626" }
  ];

  // Market trends data
  const marketTrends = [
    { period: "1W", nse: 2.3, crypto: -5.7, bonds: 0.8, global: 1.2 },
    { period: "1M", nse: 8.9, crypto: 15.2, bonds: 2.1, global: 4.5 },
    { period: "3M", nse: 12.4, crypto: 28.7, bonds: 3.8, global: 7.8 },
    { period: "6M", nse: 18.2, crypto: 45.3, bonds: 6.9, global: 11.2 },
    { period: "1Y", nse: 24.6, crypto: 67.8, bonds: 12.4, global: 16.8 }
  ];

  // Available investments with comprehensive data
  const availableInvestments = [
    { 
      id: "saf", 
      name: "Safaricom PLC", 
      type: "Stock", 
      price: 45.50,
      change: 2.3,
      minAmount: 1000, 
      currency: "KES",
      rating: 4.2,
      volume: "2.3M",
      marketCap: "1.8T"
    },
    { 
      id: "kcb", 
      name: "KCB Group", 
      type: "Stock", 
      price: 52.80,
      change: -1.2,
      minAmount: 1000, 
      currency: "KES",
      rating: 4.0,
      volume: "1.8M",
      marketCap: "987B"
    },
    { 
      id: "eqt", 
      name: "Equity Bank", 
      type: "Stock", 
      price: 67.25,
      change: 3.4,
      minAmount: 1000, 
      currency: "KES",
      rating: 4.1,
      volume: "2.1M",
      marketCap: "1.2T"
    },
    { 
      id: "btc", 
      name: "Bitcoin", 
      type: "Cryptocurrency", 
      price: 98745.32,
      change: 5.8,
      minAmount: 100, 
      currency: "USD",
      rating: 3.8,
      volume: "28.5B",
      marketCap: "1.9T"
    },
    { 
      id: "eth", 
      name: "Ethereum", 
      type: "Cryptocurrency", 
      price: 3842.15,
      change: 4.2,
      minAmount: 50, 
      currency: "USD",
      rating: 4.0,
      volume: "15.2B",
      marketCap: "462B"
    },
    { 
      id: "tbill", 
      name: "Treasury Bills", 
      type: "Government Bond", 
      price: 15.2,
      change: 0.1,
      minAmount: 5000, 
      currency: "KES",
      rating: 4.9,
      volume: "890M",
      marketCap: "2.1T"
    }
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
          <p className="font-semibold text-gray-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Bold Blue Header */}
      <div className="bg-grova-blue text-white px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/more">
            <Button variant="ghost" className="text-white p-0 hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="grova-headline text-white text-xl mb-2">Investment Portfolio</h1>
            <p className="grova-body text-white/90 text-sm">Build wealth with smart investments</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {/* Portfolio Summary - Enhanced with more data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-grova-blue text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Total Portfolio</p>
                <p className="grova-data text-white text-2xl font-black">KSh {portfolioData.totalValue.toLocaleString()}</p>
                <p className="grova-body text-white/80 text-sm mt-1">+{portfolioData.totalChangePercent}% this year</p>
              </div>
              <PieChart className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-grova-orange text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Total Gains</p>
                <p className="grova-data text-white text-2xl font-black">+KSh {portfolioData.totalChange.toLocaleString()}</p>
                <p className="grova-body text-white/80 text-sm mt-1">Monthly: +7.2%</p>
              </div>
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-white border-2 border-grova-blue p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-gray-600 mb-2">Best Performer</p>
                <p className="grova-data text-grova-blue text-xl font-black">Safaricom</p>
                <p className="grova-body text-green-600 text-sm mt-1">+35.0%</p>
              </div>
              <Star className="w-8 h-8 text-grova-orange" />
            </div>
          </div>

          <div className="bg-gray-900 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-gray-300 mb-2">Risk Score</p>
                <p className="grova-data text-white text-2xl font-black">7.2/10</p>
                <p className="grova-body text-gray-300 text-sm mt-1">Moderate Risk</p>
              </div>
              <Target className="w-8 h-8 text-grova-orange" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="portfolio" className="text-sm">Portfolio</TabsTrigger>
            <TabsTrigger value="explore" className="text-sm">Explore</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="education" className="text-sm">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Enhanced Performance Chart */}
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Portfolio Performance</CardTitle>
                  <CardDescription>7-month growth vs benchmark</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EA580C" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12, fill: '#666' }}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#666' }}
                        axisLine={{ stroke: '#e0e0e0' }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#1D4ED8"
                        strokeWidth={3}
                        fill="url(#portfolioGradient)"
                        name="Portfolio"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="benchmark" 
                        stroke="#EA580C"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="url(#benchmarkGradient)"
                        name="Benchmark"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Enhanced Allocation Chart */}
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Asset Allocation</CardTitle>
                  <CardDescription>Portfolio distribution by sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <RechartsPieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, name]}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Holdings List */}
            <Card className="neo-card p-6 mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="grova-section-title">Your Holdings</CardTitle>
                <CardDescription>Current investment positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          investment.type === 'Stock' ? 'bg-grova-blue' :
                          investment.type === 'Cryptocurrency' ? 'bg-grova-orange' :
                          investment.type === 'Government Bond' ? 'bg-green-600' :
                          'bg-purple-600'
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
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Available Investments</CardTitle>
                  <CardDescription>Explore new investment opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableInvestments.map((investment) => (
                      <div key={investment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-grova-blue transition-colors cursor-pointer">
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
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-gray-600">{formatCurrency(investment.price, investment.currency)}</p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < investment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">{investment.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${investment.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {investment.change > 0 ? '+' : ''}{investment.change}%
                          </p>
                          <p className="text-xs text-gray-500">Vol: {investment.volume}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Investment Form */}
              <Card className="neo-card p-6">
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
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Market Trends */}
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Market Trends</CardTitle>
                  <CardDescription>Performance across different time periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={marketTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#666' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="nse" fill="#1D4ED8" name="NSE" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="crypto" fill="#EA580C" name="Crypto" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="bonds" fill="#059669" name="Bonds" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="global" fill="#7C3AED" name="Global" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk Distribution */}
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Risk Distribution</CardTitle>
                  <CardDescription>Portfolio risk analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={3}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, name]}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '12px'
                        }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-90">Sharpe Ratio</p>
                  <p className="text-2xl font-bold">1.85</p>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
                <div className="text-center">
                  <Target className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-90">Alpha</p>
                  <p className="text-2xl font-bold">+3.2%</p>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-90">Beta</p>
                  <p className="text-2xl font-bold">0.92</p>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-90">Max Drawdown</p>
                  <p className="text-2xl font-bold">-8.3%</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Investment Education</CardTitle>
                  <CardDescription>Learn the fundamentals of investing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { title: "Understanding Risk vs Return", progress: 85, duration: "15 min" },
                      { title: "Diversification Strategies", progress: 60, duration: "20 min" },
                      { title: "Market Analysis Basics", progress: 40, duration: "25 min" },
                      { title: "Cryptocurrency Fundamentals", progress: 20, duration: "30 min" },
                      { title: "Bond Investing Guide", progress: 0, duration: "18 min" }
                    ].map((course, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-grova-blue transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900">{course.title}</p>
                          <span className="text-xs text-gray-500">{course.duration}</span>
                        </div>
                        <Progress value={course.progress} className="mb-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">{course.progress}% complete</span>
                          <Button size="sm" variant="outline">
                            <Play className="w-3 h-3 mr-1" />
                            {course.progress > 0 ? 'Continue' : 'Start'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Market Insights</CardTitle>
                  <CardDescription>Latest market news and analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "NSE 20 Index Reaches New Heights",
                      summary: "Strong corporate earnings drive market optimism across key sectors.",
                      time: "2 hours ago",
                      category: "Market News"
                    },
                    {
                      title: "Central Bank Maintains Interest Rates",
                      summary: "Policy rates held steady as inflation remains within target range.",
                      time: "5 hours ago",
                      category: "Policy"
                    },
                    {
                      title: "Tech Stocks Lead Weekly Gains",
                      summary: "Technology sector outperforms with strong digital adoption trends.",
                      time: "1 day ago",
                      category: "Sector Analysis"
                    },
                    {
                      title: "Emerging Markets Outlook Positive",
                      summary: "Global investors increase allocation to developing economies.",
                      time: "2 days ago",
                      category: "Global Markets"
                    }
                  ].map((article, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                        <span className="text-xs text-gray-500">{article.time}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{article.title}</h4>
                      <p className="text-sm text-gray-600">{article.summary}</p>
                    </div>
                  ))}
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
