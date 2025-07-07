import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Copy,
  Zap,
  QrCode,
  TrendingUp,
  UserCheck,
  Bot,
  Users,
  Calculator,
  Target,
  Globe2,
  Coins,
  LogOut,
  Mic,
  Receipt,
  Banknote
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
      color: "from-grova-orange to-grova-orange",
      badge: "Hot"
    },
    {
      title: "Banking & Finance",
      description: "Connect with banks, SACCOs, and financial institutions",
      icon: Building,
      path: "/banking",
      color: "from-grova-blue to-grova-blue",
      badge: "Trusted"
    },
    {
      title: "QR Payments",
      description: "Instant payments with QR code scanning",
      icon: QrCode,
      path: "/qr-payments",
      color: "from-grova-orange to-grova-orange",
      badge: "Fast"
    },
    {
      title: "Investment Portfolio",
      description: "Build wealth with smart investments",
      icon: TrendingUp,
      path: "/investments",
      color: "from-grova-blue to-grova-blue",
      badge: "Grow"
    }
  ];

  const communityFeatures = [
    {
      title: "Financial Advisors", 
      description: "Connect with certified professionals",
      icon: UserCheck,
      path: "/advisors",
      color: "text-grova-orange"
    },
    {
      title: "AI Financial Coach",
      description: "Get personalized financial advice powered by AI",
      icon: Bot,
      path: "/ai-coach",
      color: "text-grova-blue"
    },
    {
      title: "Community Treasury",
      description: "Join savings groups and community funds",
      icon: Users,
      path: "/community-treasury",
      color: "text-grova-blue"
    },
    {
      title: "Cash Agents",
      description: "Find nearby agents for cash transactions",
      icon: MapPin,
      path: "/agent-locator", 
      color: "text-grova-orange"
    },
    {
      title: "Voice Assistant",
      description: "Hands-free navigation for accessibility",
      icon: Mic,
      path: "#",
      color: "text-grova-blue",
      action: () => setActiveModal("voice-assistant")
    }
  ];

  const toolsAndUtilities = [
    {
      title: "Financial Calculator",
      description: "Calculate loans, investments, and savings",
      icon: Calculator,
      path: "/financial-calculator",
      color: "text-grova-blue"
    },
    {
      title: "Budget Planner",
      description: "Plan and track your monthly budget",
      icon: Target,
      path: "/budget-planner",
      color: "text-grova-orange"
    },
    {
      title: "Currency Exchange",
      description: "Real-time exchange rates and conversion",
      icon: Globe2,
      path: "/currency-exchange",
      color: "text-grova-blue"
    },
    {
      title: "Crypto Tracker",
      description: "Track cryptocurrency prices and portfolio",
      icon: Coins,
      path: "/crypto-tracker",
      color: "text-grova-orange"
    }
  ];

  const accountSettings = [
    {
      title: "Security Settings",
      description: "Manage passwords and two-factor authentication",
      icon: Shield,
      action: () => setActiveModal("security"),
      color: "text-grova-blue"
    },
    {
      title: "Notifications",
      description: "Control your notification preferences",
      icon: Bell,
      action: () => setActiveModal("notifications"),
      color: "text-grova-orange"
    },
    {
      title: "App Settings",
      description: "Customize your app experience",
      icon: Settings,
      action: () => setActiveModal("app"),
      color: "text-black"
    },
    {
      title: "Help & Support",
      description: "Get help and contact support",
      icon: HelpCircle,
      action: () => setActiveModal("support"),
      color: "text-grova-blue"
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
    <div className="min-h-screen bg-white">
      {/* Bold Blue Header */}
      <div className="bg-grova-blue text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="grova-headline text-white text-xl mb-2">
            More Services
          </h1>
          <p className="grova-body text-white/90 text-sm">
            Explore all the powerful features that make Grova your complete financial companion
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 pb-20">

        {/* Featured Services */}
        <div className="mb-8">
          <h2 className="grova-headline text-black text-sm mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-grova-orange" />
            Featured Services
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {mainFeatures.map((feature, index) => (
              <Link key={index} href={feature.path}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden bg-white rounded-2xl h-full">
                  <CardHeader className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between flex-1">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-grova-blue flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="grova-headline text-black text-sm mb-1">{feature.title}</CardTitle>
                          <CardDescription className="grova-body text-black/70 text-sm">{feature.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-grova-orange text-black grova-data text-xs px-3 py-1 ml-2 whitespace-nowrap">
                        {feature.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Community & Social */}
        <div className="mb-8">
          <h2 className="grova-headline text-black text-sm mb-6 flex items-center gap-2">
            <Users className="w-4 h-4 text-grova-blue" />
            Community & Social
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {communityFeatures.map((feature, index) => (
              <div key={index}>
                {feature.action ? (
                  <Card 
                    className="hover:shadow-lg transition-shadow cursor-pointer bg-white rounded-2xl border-0 h-full"
                    onClick={feature.action}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-grova-blue flex items-center justify-center">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="grova-headline text-black text-sm">{feature.title}</h3>
                          <p className="grova-body text-black/70 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Link href={feature.path}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white rounded-2xl border-0 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-grova-blue flex items-center justify-center">
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="grova-headline text-black text-sm">{feature.title}</h3>
                            <p className="grova-body text-black/70 text-sm">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Financial Tools */}
        <div className="mb-8">
          <h2 className="grova-headline text-black text-sm mb-6 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-grova-orange" />
            Financial Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {toolsAndUtilities.map((tool, index) => (
              <Link key={index} href={tool.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center bg-white rounded-2xl border-0">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-2xl bg-grova-blue flex items-center justify-center mx-auto mb-3">
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="grova-headline text-black text-sm mb-1">{tool.title}</h3>
                    <p className="grova-body text-black/70 text-xs">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="grova-headline text-black text-sm mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-grova-orange" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer bg-white rounded-2xl border-0 h-full"
                onClick={action.action}
              >
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-grova-blue flex items-center justify-center">
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-grova-orange text-black grova-data text-xs px-2 py-1 whitespace-nowrap">{action.badge}</Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="grova-headline text-black text-sm mb-1">{action.title}</h3>
                    <p className="grova-body text-black/70 text-xs">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Account & Settings */}
        <div className="mb-8">
          <h2 className="grova-headline text-black text-sm mb-6 flex items-center gap-2">
            <Settings className="w-4 h-4 text-grova-blue" />
            Account & Settings
          </h2>
          <div className="space-y-4">
            {accountSettings.map((setting, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer bg-white rounded-2xl border-0"
                onClick={setting.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-grova-blue flex items-center justify-center">
                      <setting.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="grova-headline text-black text-sm">{setting.title}</h3>
                      <p className="grova-body text-black/70 text-xs">{setting.description}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-grova-orange flex items-center justify-center">
                      <span className="text-black text-xs font-bold">→</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="mb-8">
          <Card className="bg-grova-blue text-white rounded-2xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-grova-orange flex items-center justify-center text-black font-bold">
                    {user ? (user as any).firstName?.[0] || 'U' : 'U'}
                  </div>
                  <div>
                    <h3 className="grova-headline text-white text-sm">
                      {user ? `${(user as any).firstName || 'User'} ${(user as any).lastName || ''}` : 'User Account'}
                    </h3>
                    <p className="grova-body text-white/80 text-sm">
                      {user ? (user as any).email || 'user@grova.app' : 'user@grova.app'}
                    </p>
                  </div>
                </div>
                <Button 
                  className="bg-grova-orange text-black hover:bg-grova-orange/90 grova-body border-0"
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-black/50">
          <p className="grova-body mb-2"><span className="grova-logo">Grova</span> v1.0.0 - Revolutionary Financial Platform</p>
          <div className="flex items-center justify-center gap-4 grova-body">
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

      {/* Voice Assistant Modal */}
      <Dialog open={activeModal === "voice-assistant"} onOpenChange={(open) => open ? setActiveModal("voice-assistant") : setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="grova-headline text-grova-blue">Voice Assistant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-grova-blue rounded-full flex items-center justify-center">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <p className="grova-body text-black/70 mb-4">
                Voice Assistant is designed to help users with disabilities navigate Grova hands-free.
              </p>
              <p className="grova-body text-black/70 mb-6">
                Say commands like "Check my balance", "Send money", or "Show transactions"
              </p>
              <Button 
                className="bg-grova-orange hover:bg-grova-orange/90 text-black px-8 py-3 rounded-2xl"
                onClick={() => {
                  // Basic voice recognition implementation
                  if ('webkitSpeechRecognition' in window) {
                    const recognition = new (window as any).webkitSpeechRecognition();
                    recognition.continuous = true;
                    recognition.interimResults = false;
                    recognition.lang = 'en-US';
                    recognition.start();
                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript;
                      toast({
                        title: "Voice Command Received",
                        description: `You said: "${transcript}"`,
                      });
                    };
                  } else {
                    toast({
                      title: "Voice Recognition Not Supported",
                      description: "Your browser doesn't support voice recognition",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Start Voice Assistant
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Voice Assistant for Accessibility */}
      <button
        onClick={() => {
          toast({
            title: "Voice Assistant",
            description: "Voice assistant activated. How can I help you navigate?",
          });
        }}
        className="voice-assistant-button"
        aria-label="Voice Assistant for accessibility"
      >
        <Mic className="w-6 h-6" />
      </button>

      <style>
        {`
        .grova-section-title {
          font-size: 1.1rem; /* Reduced font size */
          font-weight: bold;
          color: #333;
          margin-bottom: 0.75rem;
        }

        .grova-button-equal {
          width: 100%;
          padding: 0.6rem 1rem; /* Reduced padding */
          font-size: 0.9rem; /* Reduced font size */
          font-weight: 500;
        }

        .voice-assistant-button {
            position: fixed;
            bottom: 60px;
            right: 20px;
            background-color: #2196F3;
            color: white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            z-index: 100;
        }
        `}
      </style>

      <BottomNavigation currentPage="more" />
    </div>
  );
}