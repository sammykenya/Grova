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
  Lightbulb
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
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Zone - Bold Blue Background */}
      <div className="bg-grova-blue text-white">
        {/* Status Bar */}
        <div className="text-white text-xs px-6 py-2 flex justify-between items-center opacity-90">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Online</span>
          </span>
          <span>9:41 AM</span>
          <span className="flex items-center gap-1">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
            <Wifi className="w-3 h-3" />
          </span>
        </div>

        {/* Header - Clean Navigation */}
        <header className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setSidebarOpen(true)}
              className="text-white p-0 hover:bg-white/10"
            >
              <Menu className="w-6 h-6" />
            </Button>

            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6" />
              <span className="grova-headline text-white text-xl">Grova</span>
              <span className="grova-body text-white/80 text-xs">by BoldStreet Partners</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-0 hover:bg-white/10 ${isVoiceEnabled ? 'text-grova-orange' : 'text-white/70'}`}
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button variant="ghost" className="text-white relative p-0 hover:bg-white/10">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-grova-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Button>
            </div>
          </div>
        </header>

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
            <Button className="grova-button-secondary bg-white/20 border-white/30 text-white hover:bg-white/30">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Switch
            </Button>
          </div>

          {/* Quick Actions - Geometric & Clean */}
          <div className="grid grid-cols-4 gap-4">
            <Link href="/send">
              <div className="flex flex-col items-center space-y-2 bg-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/20 transition-all">
                <Send className="w-6 h-6" />
                <span className="grova-body text-white">Send</span>
              </div>
            </Link>
            <div 
              onClick={() => setRequestModalOpen(true)}
              className="flex flex-col items-center space-y-2 bg-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/20 transition-all"
            >
              <QrCode className="w-6 h-6" />
              <span className="grova-body text-white">Request</span>
            </div>
            <div 
              onClick={() => setConvertModalOpen(true)}
              className="flex flex-col items-center space-y-2 bg-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/20 transition-all"
            >
              <ArrowLeftRight className="w-6 h-6" />
              <span className="grova-body text-white">Convert</span>
            </div>
            <div 
              onClick={() => setVoiceModalOpen(true)}
              className="flex flex-col items-center space-y-2 bg-grova-orange p-4 rounded-2xl cursor-pointer hover:bg-orange-600 transition-all"
            >
              <Wifi className="w-6 h-6" />
              <span className="grova-body text-white">Mesh</span>
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
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="grova-headline text-gray-900">Recent Activity</h3>
            <Button variant="ghost" className="text-grova-blue grova-body p-0 hover:bg-grova-blue/10">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.slice(0, 3).map((transaction: any) => (
                <TransactionCard 
                  key={transaction.id} 
                  transaction={transaction}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="grova-body text-gray-600 mb-4">Ready to start your financial journey?</p>
                <Link href="/send">
                  <div className="bg-grova-orange hover:bg-orange-600 text-white px-6 py-3 rounded-2xl inline-flex items-center transition-all">
                    <Send className="w-5 h-5 mr-2" />
                    <span className="grova-body">Send Your First Payment</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
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
        onClose={() => setRequestModalOpen(false)}
        userWallets={wallets}
      />

      {/* Convert Money Modal */}
      <ConvertMoneyModal
        isOpen={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        userWallets={wallets}
      />
    </div>
  );
}