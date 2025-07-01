import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeftRight,
  Bitcoin,
  Users,
  Wifi
} from "lucide-react";

interface TransactionCardProps {
  transaction: {
    id: number;
    type: string;
    amount: string;
    currency: string;
    status: string;
    description?: string;
    createdAt: string;
    metadata?: any;
  };
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'send':
        return <ArrowUp className="w-4 h-4" />;
      case 'receive':
        return <ArrowDown className="w-4 h-4" />;
      case 'convert':
        return <ArrowLeftRight className="w-4 h-4" />;
      case 'mesh':
        return <Wifi className="w-4 h-4" />;
      default:
        return <ArrowLeftRight className="w-4 h-4" />;
    }
  };

  const getTransactionColor = () => {
    switch (transaction.type) {
      case 'send':
        return 'bg-red-100 text-red-600';
      case 'receive':
        return 'bg-green-100 text-green-600';
      case 'convert':
        return 'bg-blue-100 text-blue-600';
      case 'mesh':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-slate-500';
    }
  };

  const formatAmount = () => {
    const amount = parseFloat(transaction.amount);
    const prefix = transaction.type === 'send' ? '-' : '+';
    
    if (transaction.currency === 'BTC') {
      return `${prefix}${amount.toFixed(6)} BTC`;
    }
    if (transaction.currency === 'CREDITS') {
      return `${prefix}${amount.toFixed(0)} Credits`;
    }
    return `${prefix}${transaction.currency} ${amount.toLocaleString()}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
    return date.toLocaleDateString();
  };

  const getTransactionTitle = () => {
    if (transaction.description) {
      return transaction.description;
    }
    
    switch (transaction.type) {
      case 'send':
        return 'Money Sent';
      case 'receive':
        return 'Money Received';
      case 'convert':
        return 'Currency Converted';
      case 'mesh':
        return 'Offline Transfer';
      default:
        return 'Transaction';
    }
  };

  const getRecipientInfo = () => {
    if (transaction.metadata?.recipient) {
      return transaction.metadata.recipient;
    }
    if (transaction.metadata?.offline) {
      return 'Offline Recipient';
    }
    return 'Unknown';
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor()}`}>
          {getTransactionIcon()}
        </div>
        <div>
          <p className="font-medium text-sm">{getTransactionTitle()}</p>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-slate-500">{formatTime(transaction.createdAt)}</p>
            {transaction.metadata?.offline && (
              <Badge variant="secondary" className="text-xs">
                Offline
              </Badge>
            )}
            {transaction.metadata?.smartConvert && (
              <Badge variant="secondary" className="text-xs">
                Smart Convert
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-sm">{formatAmount()}</p>
        <p className={`text-xs ${getStatusColor()}`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </p>
      </div>
    </div>
  );
}
