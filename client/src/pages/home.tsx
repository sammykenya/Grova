import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WalletTabs from "@/components/wallet-tabs";
import BottomNavigation from "@/components/bottom-navigation";
import Sidebar from "@/components/sidebar";
import TransactionCard from "@/components/transaction-card";
import VoiceModal from "@/components/voice-modal";
import RequestMoneyModal from "@/components/request-money-modal";
import ConvertMoneyModal from "@/components/convert-money-modal";
import { 
  Menu, 
  Globe, 
  Mic, 
  Bell, 
  Eye, 
  EyeOff,
  Send,
  QrCode,
  ArrowLeftRight,
  ArrowRight,
  Wifi,
  Play,
  Users,
  Lightbulb,
  Receipt
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [currentWallet, setCurrentWallet] = useState<'fiat' | 'crypto' | 'credits'>('fiat');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [voiceAssistantActive, setVoiceAssistantActive] = useState(false);
  const { toast } = useToast();

  const handleVoiceAssistant = () => {
    if (!voiceAssistantActive) {
      setVoiceAssistantActive(true);
      toast({
        title: "🎤 AI Voice Assistant Active",
        description: "Say: 'send money', 'check balance', 'investments', 'financial advice', or 'help'",
      });

      // Enhanced voice commands with AI processing
      setTimeout(() => {
        setVoiceAssistantActive(false);
        const commands = [
          "I can help you send money, check balances, manage investments, or provide financial advice. What would you like to do?",
          "Your current balance is looking good! Would you like to make an investment or transfer funds?",
          "I noticed you haven't invested this month. Should I show you some investment opportunities?",
          "Your savings goal is 75% complete! Want to add more to reach your target faster?"
        ];
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];

        toast({
          title: "🤖 AI Assistant",
          description: randomCommand,
        });
      }, 3000);
    }
  };

  // Initialize wallets on first load
  const initWalletsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/wallets/initialize');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
    },
    onError: (error) => {
      if (!error.message.includes('already initialized')) {
        toast({
          title: "Error",
          description: "Failed to initialize wallets",
          variant: "destructive",
        });
      }
    },
  });

  // Fetch wallets
  const { data: wallets = [] } = useQuery({
    queryKey: ['/api/wallets'],
    retry: false,
  });

  // Fetch transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ['/api/transactions'],
    retry: false,
  });

  // Fetch daily AI tip
  const { data: dailyTip } = useQuery({
    queryKey: ['/api/ai-coach/daily-tip'],
    retry: false,
  });

  // Fetch community groups
  const { data: communityGroups = [] } = useQuery({
    queryKey: ['/api/community/groups'],
    retry: false,
  });

  useEffect(() => {
    initWalletsMutation.mutate();
  }, []);

  const getCurrentWalletData = () => {
    const wallet = wallets.find((w: any) => w.walletType === currentWallet);
    if (!wallet) return { balance: '0', currency: 'KES' };

    return {
      balance: wallet.balance,
      currency: wallet.currency
    };
  };

  const formatBalance = (balance: string, currency: string) => {
    const amount = parseFloat(balance);
    if (currency === 'BTC') {
      return `${amount.toFixed(6)} BTC`;
    }
    if (currency === 'CREDITS') {
      return `${amount.toFixed(0)} Credits`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  const getTotalBalance = () => {
    if (!wallets.length) return 'KES 0';

    const fiatWallet = wallets.find((w: any) => w.walletType === 'fiat');
    if (fiatWallet) {
      return formatBalance(fiatWallet.balance, fiatWallet.currency);
    }
    return 'KES 0';
  };

  const currentWalletData = getCurrentWalletData();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const navigate = (url: string) => {
    window.location.href = url;
  };

  const setConvertMoneyOpen = (isOpen: boolean) => {
    console.log('setConvertMoneyOpen', isOpen);
  };
  const setRequestMoneyOpen = (isOpen: boolean) => {
    console.log("setRequestMoneyOpen", isOpen);
  };
  const setBluetoothTransferOpen = (isOpen: boolean) => {
    console.log("setBluetoothTransferOpen", isOpen)
  }

  return (
    <div className="min-h-screen neo-base page-transition">
      {/* Hero Zone - Bold Blue Background */}
      <div className="bg-grova-blue text-white">
        {/* Status Bar */}
        <div className="text-white text-xs px-6 py-2 flex justify-between items-center opacity-90 fade-in">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full icon-bounce"></div>
            <span>Online</span>
          </span>
          <span>9:41 AM</span>
          <span className="flex items-center gap-1">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
            <Wifi className="w-3 h-3" />
          </span>
        </div>

        {/* Header - Enhanced Navigation */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="neo-glass-button"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3">
              <span className="text-white text-2xl font-black" style={{ fontFamily: 'Lufga, sans-serif', fontWeight: 900 }}>Grova</span>
              <span className="grova-body text-white/80 text-xs">by BoldStreet Partners</span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="neo-glass-button relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-grova-orange rounded-full animate-pulse"></span>
              </button>
              <button className="neo-glass-button">
                <Globe className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Balance Zone - Generous Whitespace */}
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="grova-body text-white/80 mb-2">Total Balance</p>
              <div className="flex items-center space-x-3">
                <span className="grova-data text-white text-4xl font-black">
                  {balanceVisible ? getTotalBalance() : '••••••'}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-white/80 p-0 hover:bg-white/10"
                >
                  {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            <Button className="grova-button-compact bg-white/20 border-white/30 text-white hover:bg-white/30">
              <ArrowLeftRight className="w-4 h-4 mr-1" />
              Switch
            </Button>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="grid grid-cols-4 gap-4">
            <Link href="/send">
              <div className="neo-action-button group">
                <div className="neo-icon-container mb-2">
                  <Send className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
                <span className="grova-body text-white text-sm">Send</span>
              </div>
            </Link>
            <div 
              onClick={() => setRequestModalOpen(true)}
              className="neo-action-button group"
            >
              <div className="neo-icon-container mb-2">
                <QrCode className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className="grova-body text-white text-sm">Request</span>
            </div>
            <div 
              onClick={() => setConvertModalOpen(true)}
              className="neo-action-button group"
            >
              <div className="neo-icon-container mb-2">
                <ArrowLeftRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className="grova-body text-white text-sm">Convert</span>
            </div>
            <div 
              onClick={() => setVoiceModalOpen(true)}
              className="neo-action-button-orange group"
            >
              <div className="neo-icon-container mb-2">
                <Wifi className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className="grova-body text-white text-sm">Mesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Tabs */}
      <WalletTabs 
        currentWallet={currentWallet} 
        onWalletChange={setCurrentWallet}
        walletData={currentWalletData}
      />

      {/* Main Content */}
      <div className="p-4 space-y-6 pb-20">
        {/* AI Coach Card - Bold Orange Block */}
        {dailyTip && (
          <div className="bg-grova-orange text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="grova-headline text-white flex items-center">
                <Lightbulb className="w-6 h-6 mr-3" />
                Today's Financial Tip
              </h3>
              <Button
                variant="ghost"
                className="text-white p-0 hover:bg-white/20"
                onClick={() => {
                  toast({
                    title: "Voice Tip",
                    description: "Playing audio advice...",
                  });
                }}
              >
                <Play className="w-6 h-6" />
              </Button>
            </div>
            <p className="grova-body text-white mb-4 text-base leading-relaxed">
              {dailyTip.tip}
            </p>
            <Link href="/ai-coach">
              <div className="grova-button-secondary bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl inline-flex items-center">
                <span className="grova-body">Get More AI Coaching</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </div>
        )}

        {/* Recent Activity - Clean White Block */}
        <div className="neo-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="grova-section-title text-sm font-bold text-gray-900">Recent Transactions</h3>
              <button className="text-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,48%)] text-sm font-medium">
                View All
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-8 fade-in">
                <div className="neo-icon-button w-16 h-16 mx-auto mb-4 !bg-gray-100">
                  <Receipt className="w-8 h-8 text-gray-400" />
                </div>
                <p className="grova-body text-gray-500">No transactions yet</p>
                <p className="grova-body text-gray-400 text-xs mt-1">Your recent transactions will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="neo-transaction-card stagger-animation enhanced-button">
                    <TransactionCard transaction={transaction} />
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Community Treasury Preview */}
        {communityGroups.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center">
                  <Users className="text-purple-600 w-4 h-4 mr-2" />
                  {communityGroups[0].name}
                </h3>
                <Link href="/community-treasury">
                  <span className="text-[hsl(207,90%,54%)] text-sm cursor-pointer">
                    View
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatBalance(communityGroups[0].totalPool, communityGroups[0].currency)}
                  </p>
                  <p className="text-xs text-slate-500">Total Pool</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-xs text-slate-500">Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Voice Assistant for Accessibility */}
      <button
        onClick={handleVoiceAssistant}
        className={`voice-assistant-button ${voiceAssistantActive ? 'listening' : ''}`}
        aria-label="Voice Assistant for accessibility"
      >
        <Mic className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="home" />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Voice Modal */}
      <VoiceModal 
        isOpen={voiceModalOpen} 
        onClose={() => setVoiceModalOpen(false)} 
      />

      {/* Request Money Modal */}
      <RequestMoneyModal
        isOpen={requestModalOpen}
        onClose={() => setRequestMoneyOpen(false)}
        userWallets={wallets}
      />

      {/* Convert Money Modal */}
      <ConvertMoneyModal
        isOpen={convertModalOpen}
        onClose={() => setConvertMoneyOpen(false)}
        userWallets={wallets}
      />
    </div>
  );
}