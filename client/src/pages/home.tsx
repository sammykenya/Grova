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
    <div className="min-h-screen bg-slate-50">
      {/* Status Bar */}
      <div className="status-bar text-white text-xs px-4 py-1 flex justify-between items-center">
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

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(true)}
            className="text-slate-600 p-0"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <Globe className="text-[hsl(207,90%,54%)] w-5 h-5" />
            <span className="font-bold text-lg">Grova</span>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`p-0 ${isVoiceEnabled ? 'text-[hsl(252,83%,57%)]' : 'text-slate-400'} hover:text-[hsl(252,83%,57%)]`}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="text-slate-600 relative p-0">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <div className="px-4 py-6 balance-gradient text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-200 text-sm">Total Balance</p>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">
                {balanceVisible ? getTotalBalance() : '••••••'}
              </span>
              <Button
                variant="ghost"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-blue-200 p-0"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <span className="text-sm mr-1">Switch</span>
            <ArrowLeftRight className="w-3 h-3" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <Link href="/send">
            <Button className="flex flex-col items-center space-y-2 bg-white/10 p-3 rounded-xl h-auto">
              <Send className="w-5 h-5" />
              <span className="text-xs">Send</span>
            </Button>
          </Link>
          <Button className="flex flex-col items-center space-y-2 bg-white/10 p-3 rounded-xl h-auto">
            <QrCode className="w-5 h-5" />
            <span className="text-xs">Request</span>
          </Button>
          <Button className="flex flex-col items-center space-y-2 bg-white/10 p-3 rounded-xl h-auto">
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-xs">Convert</span>
          </Button>
          <Button 
            onClick={() => setVoiceModalOpen(true)}
            className="flex flex-col items-center space-y-2 bg-white/10 p-3 rounded-xl h-auto"
          >
            <Wifi className="w-5 h-5" />
            <span className="text-xs">Mesh</span>
          </Button>
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
        {/* AI Coach Card */}
        {dailyTip && (
          <Card className="ai-coach-gradient text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Today's Tip
                </h3>
                <Button
                  variant="ghost"
                  className="text-purple-200 p-0"
                  onClick={() => {
                    // TODO: Implement text-to-speech
                    toast({
                      title: "Voice Tip",
                      description: "Playing audio advice...",
                    });
                  }}
                >
                  <Play className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-purple-100 text-sm mb-3">
                {dailyTip.tip}
              </p>
              <Link href="/ai-coach">
                <span className="text-xs text-purple-200 font-medium cursor-pointer">
                  View AI Coach →
                </span>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Recent Activity</h3>
                <Button variant="ghost" className="text-[hsl(207,90%,54%)] text-sm p-0">
                  View All
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              {transactions.length > 0 ? (
                transactions.slice(0, 3).map((transaction: any) => (
                  <TransactionCard 
                    key={transaction.id} 
                    transaction={transaction}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-slate-500">
                  <p>No transactions yet</p>
                  <Link href="/send">
                    <Button variant="outline" className="mt-2">
                      Send Your First Payment
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Community Treasury Preview */}
        {communityGroups.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center">
                  <Users className="text-purple-600 w-4 h-4 mr-2" />
                  {communityGroups[0].name}
                </h3>
                <Link href="/community">
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
    </div>
  );
}