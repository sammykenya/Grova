import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Building2, 
  CreditCard, 
  Landmark, 
  Users, 
  Shield, 
  Zap,
  TrendingUp,
  ArrowRightLeft,
  PiggyBank,
  Coins,
  Globe,
  CheckCircle,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  Star,
  Clock,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";

interface FinancialInstitution {
  id: number;
  name: string;
  type: string;
  logo: string;
  rating: number;
  services: string[];
  fees: string;
  processingTime: string;
  countries: string[];
  isConnected: boolean;
  description: string;
  specialOffers?: string;
}

export default function Banking() {
  const [activeTab, setActiveTab] = useState("banks");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<FinancialInstitution | null>(null);

  const banks: FinancialInstitution[] = [
    {
      id: 1,
      name: "Kenya Commercial Bank (KCB)",
      type: "Commercial Bank",
      logo: "🏦",
      rating: 4.5,
      services: ["Transfers", "Loans", "Savings", "Investment"],
      fees: "KES 25-100",
      processingTime: "Instant",
      countries: ["Kenya", "Uganda", "Tanzania"],
      isConnected: true,
      description: "Leading commercial bank in East Africa with comprehensive digital banking services.",
      specialOffers: "Zero fees for UniFi users on first 10 transactions"
    },
    {
      id: 2,
      name: "Equity Bank",
      type: "Commercial Bank",
      logo: "🏛️",
      rating: 4.3,
      services: ["Mobile Banking", "Microfinance", "Corporate", "SME"],
      fees: "KES 30-150",
      processingTime: "1-5 minutes",
      countries: ["Kenya", "Uganda", "Tanzania", "Rwanda", "DRC"],
      isConnected: false,
      description: "Pan-African bank focused on financial inclusion and digital innovation.",
      specialOffers: "Special rates for youth and women entrepreneurs"
    },
    {
      id: 3,
      name: "Safaricom M-Pesa",
      type: "Mobile Money",
      logo: "📱",
      rating: 4.8,
      services: ["Mobile Money", "Payments", "Loans", "Savings"],
      fees: "KES 0-110",
      processingTime: "Instant",
      countries: ["Kenya", "Tanzania", "Mozambique", "Lesotho"],
      isConnected: true,
      description: "Revolutionary mobile money service transforming financial access across Africa.",
      specialOffers: "Reduced transaction fees for frequent users"
    }
  ];

  const saccos: FinancialInstitution[] = [
    {
      id: 4,
      name: "Kenya Police SACCO",
      type: "SACCO",
      logo: "👮",
      rating: 4.2,
      services: ["Savings", "Loans", "Investment", "Insurance"],
      fees: "KES 10-50",
      processingTime: "1-3 days",
      countries: ["Kenya"],
      isConnected: false,
      description: "Dedicated to serving law enforcement officers and their families.",
      specialOffers: "Low interest rates for members"
    },
    {
      id: 5,
      name: "Stima SACCO",
      type: "SACCO",
      logo: "⚡",
      rating: 4.0,
      services: ["Member Savings", "Asset Financing", "Development Loans"],
      fees: "KES 15-75",
      processingTime: "2-5 days",
      countries: ["Kenya"],
      isConnected: false,
      description: "Serving Kenya Power employees and the energy sector.",
      specialOffers: "Green energy project financing available"
    },
    {
      id: 6,
      name: "Teachers SACCO",
      type: "SACCO",
      logo: "📚",
      rating: 4.4,
      services: ["Education Loans", "Home Loans", "Emergency Loans"],
      fees: "KES 5-60",
      processingTime: "1-7 days",
      countries: ["Kenya"],
      isConnected: true,
      description: "Empowering educators through comprehensive financial services.",
      specialOffers: "School fees payment plans available"
    }
  ];

  const microfinance: FinancialInstitution[] = [
    {
      id: 7,
      name: "Faulu Microfinance",
      type: "Microfinance",
      logo: "🌱",
      rating: 4.1,
      services: ["Micro Loans", "SME Financing", "Group Lending"],
      fees: "KES 20-100",
      processingTime: "1-3 days",
      countries: ["Kenya", "Uganda"],
      isConnected: false,
      description: "Dedicated to empowering micro, small and medium enterprises.",
      specialOffers: "No collateral required for group loans"
    },
    {
      id: 8,
      name: "Kenya Women Finance Trust",
      type: "Microfinance",
      logo: "👩‍💼",
      rating: 4.3,
      services: ["Women Empowerment", "Business Loans", "Financial Literacy"],
      fees: "KES 25-80",
      processingTime: "2-4 days",
      countries: ["Kenya"],
      isConnected: false,
      description: "Empowering women entrepreneurs through tailored financial solutions.",
      specialOffers: "Women-only investment circles available"
    }
  ];

  const digitalWallets: FinancialInstitution[] = [
    {
      id: 9,
      name: "PayPal",
      type: "Digital Wallet",
      logo: "💙",
      rating: 4.6,
      services: ["International Transfers", "Online Payments", "Currency Exchange"],
      fees: "2.9% + KES 30",
      processingTime: "Instant",
      countries: ["Global"],
      isConnected: false,
      description: "Global leader in online payments and money transfers.",
      specialOffers: "Reduced fees for verified business accounts"
    },
    {
      id: 10,
      name: "Skrill",
      type: "Digital Wallet",
      logo: "💜",
      rating: 4.2,
      services: ["Crypto Trading", "FX Trading", "International Payments"],
      fees: "1.45% + KES 25",
      processingTime: "1-24 hours",
      countries: ["Global"],
      isConnected: false,
      description: "Digital wallet for trading and international money transfers.",
      specialOffers: "Crypto cashback rewards program"
    }
  ];

  const getInstitutionsByType = (type: string) => {
    switch (type) {
      case "banks": return banks;
      case "saccos": return saccos;
      case "microfinance": return microfinance;
      case "digital": return digitalWallets;
      default: return [...banks, ...saccos, ...microfinance, ...digitalWallets];
    }
  };

  const filteredInstitutions = getInstitutionsByType(activeTab).filter(institution =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    institution.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    institution.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const ConnectAccountModal = () => (
    <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {selectedInstitution?.name}</DialogTitle>
          <DialogDescription>
            Link your {selectedInstitution?.name} account to UniFi for seamless transactions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Account Number</label>
            <Input placeholder="Enter your account number" />
          </div>
          <div>
            <label className="text-sm font-medium">Account Name</label>
            <Input placeholder="Account holder name" />
          </div>
          <div>
            <label className="text-sm font-medium">Account Type</label>
            <select className="w-full p-2 border rounded-lg">
              <option>Savings</option>
              <option>Checking</option>
              <option>Business</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1">Connect Account</Button>
            <Button variant="outline" onClick={() => setShowConnectModal(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="mobile-container">
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6 pt-2">
            <Link href="/more">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-unifi-blue bg-clip-text text-transparent">
              Banking & Finance
            </h1>
          </div>

          {/* Connected Accounts Summary */}
          {/*
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Connected Banks</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <Building2 className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Total Balance</p>
                    <p className="text-2xl font-bold">KES 84K</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Available Services</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Active Loans</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>
          */}

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search banks, SACCOs, or financial services..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="banks">Banks</TabsTrigger>
              <TabsTrigger value="saccos">SACCOs</TabsTrigger>
              <TabsTrigger value="microfinance">Microfinance</TabsTrigger>
              <TabsTrigger value="digital">Digital Wallets</TabsTrigger>
            </TabsList>

            <TabsContent value="banks" className="space-y-4">
              <div className="text-center mb-6">
                <Building2 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Commercial Banks</h3>
                <p className="text-gray-600 text-sm">Major banks offering comprehensive financial services</p>
              </div>
              {filteredInstitutions.map((institution) => (
                <Card key={institution.id} className="mb-4 border-0 shadow-lg bg-gradient-to-r from-card via-card to-muted/5 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-unifi-blue text-white font-semibold">
                          {institution.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{institution.name}</h3>
                          <Badge
                            variant={institution.isConnected ? "default" : "secondary"}
                            className={`text-xs ${
                              institution.isConnected
                                ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-0"
                                : "bg-primary/10 text-primary border-primary/20"
                            }`}
                          >
                            {institution.isConnected ? "Connected" : "Available"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{institution.type}</p>
                        <p className="text-xs text-muted-foreground">{institution.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={institution.isConnected ? "outline" : "default"}
                        onClick={() => {
                          setSelectedInstitution(institution);
                          setShowConnectModal(true);
                        }}
                        className={!institution.isConnected ? "bg-gradient-to-r from-primary to-unifi-blue hover:opacity-90 transition-opacity" : ""}
                      >
                        {institution.isConnected ? "Manage" : "Connect"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="saccos" className="space-y-4">
              <div className="text-center mb-6">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Savings & Credit Cooperatives</h3>
                <p className="text-gray-600 text-sm">Member-owned financial institutions</p>
              </div>
              {filteredInstitutions.map((institution) => (
                <Card key={institution.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{institution.logo}</div>
                        <div>
                          <h3 className="font-semibold text-lg">{institution.name}</h3>
                          <p className="text-sm text-gray-600">{institution.type}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{institution.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {institution.isConnected ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Button
                            onClick={() => {
                              setSelectedInstitution(institution);
                              setShowConnectModal(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">{institution.description}</p>

                    {institution.specialOffers && (
                      <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg mb-4">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          🎁 Member Benefit: {institution.specialOffers}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Member Fees</p>
                        <p className="font-medium">{institution.fees}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Processing Time</p>
                        <p className="font-medium">{institution.processingTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Locations</p>
                        <p className="font-medium">{institution.countries.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Services</p>
                        <p className="font-medium">{institution.services.length} available</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {institution.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="microfinance" className="space-y-4">
              <div className="text-center mb-6">
                <PiggyBank className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Microfinance Institutions</h3>
                <p className="text-gray-600 text-sm">Supporting small businesses and entrepreneurs</p>
              </div>
              {filteredInstitutions.map((institution) => (
                <Card key={institution.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{institution.logo}</div>
                        <div>
                          <h3 className="font-semibold text-lg">{institution.name}</h3>
                          <p className="text-sm text-gray-600">{institution.type}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{institution.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {institution.isConnected ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Button
                            onClick={() => {
                              setSelectedInstitution(institution);
                              setShowConnectModal(true);
                            }}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">{institution.description}</p>

                    {institution.specialOffers && (
                      <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg mb-4">
                        <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                          💡 Special Program: {institution.specialOffers}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Service Fees</p>
                        <p className="font-medium">{institution.fees}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Processing Time</p>
                        <p className="font-medium">{institution.processingTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Coverage</p>
                        <p className="font-medium">{institution.countries.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Programs</p>
                        <p className="font-medium">{institution.services.length} available</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {institution.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="digital" className="space-y-4">
              <div className="text-center mb-6">
                <Coins className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Digital Wallets & Crypto</h3>
                <p className="text-gray-600 text-sm">Global payment solutions and cryptocurrency</p>
              </div>
              {filteredInstitutions.map((institution) => (
                <Card key={institution.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{institution.logo}</div>
                        <div>
                          <h3 className="font-semibold text-lg">{institution.name}</h3>
                          <p className="text-sm text-gray-600">{institution.type}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{institution.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {institution.isConnected ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Button
                            onClick={() => {
                              setSelectedInstitution(institution);
                              setShowConnectModal(true);
                            }}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">{institution.description}</p>

                    {institution.specialOffers && (
                      <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg mb-4">
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                          🚀 Exclusive: {institution.specialOffers}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Transaction Fees</p>
                        <p className="font-medium">{institution.fees}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Processing Time</p>
                        <p className="font-medium">{institution.processingTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Availability</p>
                        <p className="font-medium">{institution.countries.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Features</p>
                        <p className="font-medium">{institution.services.length} available</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {institution.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <ConnectAccountModal />
        </div>
      </div>

      <BottomNavigation currentPage="more" />
    </div>
  );
}

import { Avatar, AvatarFallback } from "@/components/ui/avatar"