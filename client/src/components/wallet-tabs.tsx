import { Button } from "@/components/ui/button";
import { 
  Coins, 
  Bitcoin, 
  Star 
} from "lucide-react";

interface WalletTabsProps {
  currentWallet: 'fiat' | 'crypto' | 'credits';
  onWalletChange: (wallet: 'fiat' | 'crypto' | 'credits') => void;
  walletData: {
    balance: string;
    currency: string;
  };
}

export default function WalletTabs({ currentWallet, onWalletChange, walletData }: WalletTabsProps) {
  const walletConfig = {
    fiat: {
      icon: Coins,
      label: 'Fiat',
      colorClasses: 'border-fiat-green bg-green-50 text-fiat-green',
      inactiveClasses: 'border-transparent text-slate-500'
    },
    crypto: {
      icon: Bitcoin,
      label: 'Crypto',
      colorClasses: 'border-crypto-amber bg-orange-50 text-crypto-amber',
      inactiveClasses: 'border-transparent text-slate-500'
    },
    credits: {
      icon: Star,
      label: 'Credits',
      colorClasses: 'border-credits-purple bg-purple-50 text-credits-purple',
      inactiveClasses: 'border-transparent text-slate-500'
    }
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

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="flex">
        {(Object.keys(walletConfig) as Array<'fiat' | 'crypto' | 'credits'>).map((walletType) => {
          const config = walletConfig[walletType];
          const Icon = config.icon;
          const isActive = currentWallet === walletType;
          
          return (
            <Button
              key={walletType}
              variant="ghost"
              onClick={() => onWalletChange(walletType)}
              className={`wallet-tab flex-1 py-4 px-4 text-center border-b-2 rounded-none ${
                isActive ? config.colorClasses : config.inactiveClasses
              } hover:bg-slate-50`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="font-medium">{config.label}</span>
            </Button>
          );
        })}
      </div>
      
      {/* Wallet Balance Display */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="text-center">
          <p className="text-sm text-slate-500">
            {walletConfig[currentWallet].label} Wallet
          </p>
          <p className="text-lg font-semibold">
            {formatBalance(walletData.balance, walletData.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
