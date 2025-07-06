import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import BottomNavigation from "@/components/bottom-navigation";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Settings, 
  User, 
  Gift, 
  Smartphone, 
  CreditCard, 
  Building, 
  Shield, 
  Bell, 
  HelpCircle,
  Star,
  Heart,
  MapPin,
  Phone,
  Globe,
  ExternalLink,
  CheckCircle,
  Copy
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function More() {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState("GROVA-USER-2025");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [topupAmount, setTopupAmount] = useState("");
  const [billType, setBillType] = useState("");
  const [billAccount, setBillAccount] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const { toast } = useToast();

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const handleTopup = () => {
    if (!phoneNumber || !topupAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Top-up Successful",
      description: `KSh ${topupAmount} airtime sent to ${phoneNumber}`,
    });
    setActiveModal(null);
    setPhoneNumber("");
    setTopupAmount("");
  };

  const handleBillPayment = () => {
    if (!billType || !billAccount || !billAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bill Payment Successful",
      description: `Paid KSh ${billAmount} for ${billType}`,
    });
    setActiveModal(null);
    setBillType("");
    setBillAccount("");
    setBillAmount("");
  };

  const handleLoanApplication = () => {
    if (!loanAmount || !loanPurpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Loan Application Submitted",
      description: "Your loan application is being processed",
    });
    setActiveModal(null);
    setLoanAmount("");
    setLoanPurpose("");
  };

  const handleSupportSubmit = () => {
    if (!supportMessage) {
      toast({
        title: "Missing Information",
        description: "Please enter your message",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Support Request Sent",
      description: "Our team will get back to you soon",
    });
    setActiveModal(null);
    setSupportMessage("");
  };

  const mainFeatures = [
    {
      title: "Founders Investor Room",
      description: "Submit ideas, get funding, connect with investors",
      icon: Zap,
      path: "/founders-room",
      color: "from-purple-500 to-purple-600",
      badge: "Hot"
    },
    {
      title: "Banking & Finance",
      description: "Connect with banks, SACCOs, and financial institutions",
      icon: Building,
      path: "/banking",
      color: "from-blue-500 to-blue-600",
      badge: "Trusted"
    },
    {
      title: "QR Payments",
      description: "Instant payments with QR code scanning",
      icon: QrCode,
      path: "/qr-payments",
      color: "from-green-500 to-green-600",
      badge: "Fast"
    },
    {
      title: "Investment Portfolio",
      description: "Build wealth with smart investments",
      icon: TrendingUp,
      path: "/investments",
      color: "from-indigo-500 to-indigo-600",
      badge: "Grow"
    }
  ];

  const communityFeatures = [
    {
      title: "Financial Advisors", 
      description: "Connect with certified professionals",
      icon: UserCheck,
      path: "/advisors",
      color: "text-orange-600"
    },
    {
      title: "AI Financial Coach",
      description: "Get personalized financial advice powered by AI",
      icon: Bot,
      path: "/ai-coach",
      color: "text-purple-600"
    },
    {
      title: "Community Treasury",
      description: "Join savings groups and community funds",
      icon: Users,
      path: "/community-treasury",
      color: "text-blue-600"
    },
    {
      title: "Cash Agents",
      description: "Find nearby agents for cash transactions",
      icon: MapPin,
      path: "/agent-locator", 
      color: "text-green-600"
    }
  ];

  const toolsAndUtilities = [
    {
      title: "Financial Calculator",
      description: "Calculate loans, investments, and savings",
      icon: Calculator,
      path: "/financial-calculator",
      color: "text-purple-600"
    },
    {
      title: "Budget Planner",
      description: "Plan and track your monthly budget",
      icon: Target,
      path: "/budget-planner",
      color: "text-indigo-600"
    },
    {
      title: "Currency Exchange",
      description: "Real-time exchange rates and conversion",
      icon: Globe2,
      path: "/currency-exchange",
      color: "text-yellow-600"
    },
    {
      title: "Crypto Tracker",
      description: "Track cryptocurrency prices and portfolio",
      icon: Coins,
      path: "/crypto-tracker",
      color: "text-orange-600"
    }
  ];

  const accountSettings = [
    {
      title: "Security Settings",
      description: "Manage passwords and two-factor authentication",
      icon: Shield,
      action: () => setActiveModal("security"),
      color: "text-red-600"
    },
    {
      title: "Notifications",
      description: "Control your notification preferences",
      icon: Bell,
      action: () => setActiveModal("notifications"),
      color: "text-blue-600"
    },
    {
      title: "App Settings",
      description: "Customize your app experience",
      icon: Settings,
      action: () => setActiveModal("app"),
      color: "text-gray-600"
    },
    {
      title: "Help & Support",
      description: "Get help and contact support",
      icon: HelpCircle,
      action: () => setActiveModal("support"),
      color: "text-green-600"
    }
  ];

  const quickActions = [
    {
      title: "Refer Friends",
      description: "Earn rewards for successful referrals",
      icon: Gift,
      badge: "Earn KSh 500",
      action: () => setActiveModal("referral")
    },
    {
      title: "Mobile Top-up",
      description: "Buy airtime and data bundles",
      icon: Smartphone,
      badge: "Instant",
      action: () => setActiveModal("topup")
    },
    {
      title: "Bill Payments",
      description: "Pay utilities and subscription services",
      icon: CreditCard,
      badge: "Convenient",
      action: () => setActiveModal("bill")
    },
    {
      title: "Loan Services",
      description: "Access micro-loans and credit facilities",
      icon: Building,
      badge: "Quick Approval",
      action: () => setActiveModal("loan")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            More Features
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover all the powerful tools UniFi has to offer
          </p>
        </div>

        {/* Main Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Featured Services
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {mainFeatures.map((feature, index) => (
              <Link key={index} href={feature.path}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription className="text-sm">{feature.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        {feature.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Community Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Community & Social
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {communityFeatures.map((feature, index) => (
              <Link key={index} href={feature.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Tools & Utilities */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-500" />
            Financial Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {toolsAndUtilities.map((tool, index) => (
              <Link key={index} href={tool.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <CardContent className="pt-6 pb-4">
                    <tool.icon className={`w-8 h-8 ${tool.color} mx-auto mb-2`} />
                    <h3 className="font-medium text-sm mb-1">{tool.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={action.action}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <action.icon className="w-6 h-6 text-blue-600" />
                    <Badge variant="outline" className="text-xs">{action.badge}</Badge>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Account & Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" />
            Account & Settings
          </h2>
          <div className="space-y-3">
            {accountSettings.map((setting, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={setting.action}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <setting.icon className={`w-5 h-5 ${setting.color}`} />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{setting.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{setting.description}</p>
                    </div>
                    <Badge variant="outline" className="text-gray-400">→</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user ? (user as any).firstName?.[0] || 'U' : 'U'}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {user ? `${(user as any).firstName || 'User'} ${(user as any).lastName || ''}` : 'User Account'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user ? (user as any).email || 'user@unifi.app' : 'user@unifi.app'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">UniFi v1.0.0 - Revolutionary Financial Platform</p>
          <div className="flex items-center justify-center gap-4">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              Rate App
            </span>
          </div>
        </div>
      </div>

      {/* Referral Modal */}
      <Dialog open={activeModal === "referral"} onOpenChange={(open) => open ? setActiveModal("referral") : setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refer Friends</DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Share your referral code with friends and earn rewards!
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Input
                type="text"
                value={referralCode}
                readOnly
                className="text-center"
              />
              <Button variant="secondary" size="sm" onClick={handleCopyReferralCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <Button onClick={() => setActiveModal(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Top-up Modal */}
      <Dialog open={activeModal === "topup"} onOpenChange={(open) => open ? setActiveModal("topup") : setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mobile Top-up</DialogTitle>
          </DialogHeader>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            type="tel"
            id="phoneNumber"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mb-4"
          />
          <Label htmlFor="topupAmount">Amount (KSh)</Label>
          <Input
            type="number"
            id="topupAmount"
            placeholder="Enter amount"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleTopup}>Top-up</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bill Payment Modal */}
      <Dialog open={activeModal === "bill"} onOpenChange={(open) => open ? setActiveModal("bill") : setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bill Payment</DialogTitle>
          </DialogHeader>
          <Label htmlFor="billType">Bill Type</Label>
          <Select onValueChange={(value) => setBillType(value)}>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Select bill type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="internet">Internet</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="billAccount">Account Number</Label>
          <Input
            type="text"
            id="billAccount"
            placeholder="Enter account number"
            value={billAccount}
            onChange={(e) => setBillAccount(e.target.value)}
            className="mb-4"
          />
          <Label htmlFor="billAmount">Amount (KSh)</Label>
          <Input
            type="number"
            id="billAmount"
            placeholder="Enter amount"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleBillPayment}>Pay Bill</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loan Services Modal */}
      <Dialog open={activeModal === "loan"} onOpenChange={(open) => open ? setActiveModal("loan") : setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loan Application</DialogTitle>
          </DialogHeader>
          <Label htmlFor="loanAmount">Loan Amount (KSh)</Label>
          <Input
            type="number"
            id="loanAmount"
            placeholder="Enter amount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="mb-4"
          />
          <Label htmlFor="loanPurpose">Purpose of Loan</Label>
          <Textarea
            id="loanPurpose"
            placeholder="Describe the purpose of the loan"
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleLoanApplication}>Apply for Loan</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Settings Modal */}
      <Dialog open={activeModal === "security"} onOpenChange={(open) => open ? setActiveModal("security") : setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Security Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="biometric">Enable Biometric Login</Label>
              <Switch
                id="biometric"
                checked={biometricEnabled}
                onCheckedChange={(checked) => setBiometricEnabled(checked)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => setActiveModal(null)}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Modal */}
      <Dialog open={activeModal === "notifications"} onOpenChange={(open) => open ? setActiveModal("notifications") : setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={(checked) => setNotificationsEnabled(checked)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => setActiveModal(null)}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* App Settings Modal */}
      <Dialog open={activeModal === "app"} onOpenChange={(open) => open ? setActiveModal("app") : setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>App Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch
                id="darkMode"
                checked={isDarkMode}
                onCheckedChange={(checked) => setIsDarkMode(checked)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => setActiveModal(null)}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help & Support Modal */}
      <Dialog open={activeModal === "support"} onOpenChange={(open) => open ? setActiveModal("support") : setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
          </DialogHeader>
          <Label htmlFor="supportMessage">Enter your message</Label>
          <Textarea
            id="supportMessage"
            placeholder="Describe your issue"
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleSupportSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation currentPage="more" />
    </div>
  );
}