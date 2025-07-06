import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  QrCode, 
  Wifi, 
  Sparkles,
  Send,
  CheckCircle,
  Bluetooth
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import BluetoothTransferModal from "@/components/bluetooth-transfer-modal";

export default function SendMoney() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [useOffline, setUseOffline] = useState(false);
  const [useSmartConvert, setUseSmartConvert] = useState(false);
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [bluetoothModalOpen, setBluetoothModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch wallets
  const { data: wallets = [] } = useQuery({
    queryKey: ['/api/wallets'],
    retry: false,
  });

  // Send money mutation
  const sendMoneyMutation = useMutation({
    mutationFn: async (transactionData: any) => {
      await apiRequest('POST', '/api/transactions', transactionData);
    },
    onSuccess: () => {
      setStep('success');
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    },
    onError: (error) => {
      toast({
        title: "Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const currentWallet = wallets.find((w: any) => w.walletType === 'fiat');
  const balance = currentWallet ? parseFloat(currentWallet.balance) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum <= 0 || amountNum > balance) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0 and not exceed your balance",
        variant: "destructive",
      });
      return;
    }

    setStep('confirm');
  };

  const confirmTransaction = () => {
    if (!currentWallet) return;

    sendMoneyMutation.mutate({
      fromWalletId: currentWallet.id,
      toUserId: null, // For demo purposes
      amount: amount,
      currency: currentWallet.currency,
      type: useOffline ? 'mesh' : 'send',
      description: `Sent to ${recipient}`,
      metadata: {
        offline: useOffline,
        smartConvert: useSmartConvert,
        recipient: recipient
      }
    });
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center p-8">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Transaction Successful!</h2>
          <p className="text-slate-600 mb-8">
            Sent {currentWallet?.currency} {amount} to {recipient}
          </p>
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-[hsl(207,90%,54%)] text-white">
                Back to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => {
                setStep('form');
                setRecipient('');
                setAmount('');
              }}
              className="w-full"
            >
              Send Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => setStep('form')}
              className="text-[hsl(207,90%,54%)] p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-semibold">Confirm Transaction</h2>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Sending</p>
                  <p className="text-3xl font-bold">{currentWallet?.currency} {amount}</p>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <Avatar className="w-12 h-12 mx-auto mb-2">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-slate-600">You</p>
                  </div>
                  
                  <Send className="w-6 h-6 text-[hsl(207,90%,54%)]" />
                  
                  <div className="text-center">
                    <Avatar className="w-12 h-12 mx-auto mb-2">
                      <AvatarFallback>{recipient.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-slate-600">{recipient}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {useOffline && (
                    <div className="flex items-center justify-center text-blue-600">
                      <Wifi className="w-4 h-4 mr-2" />
                      Offline/Mesh Transfer
                    </div>
                  )}
                  {useSmartConvert && (
                    <div className="flex items-center justify-center text-purple-600">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Smart Convert Enabled
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button 
              onClick={confirmTransaction}
              disabled={sendMoneyMutation.isPending}
              className="w-full bg-[hsl(207,90%,54%)] text-white py-4"
            >
              {sendMoneyMutation.isPending ? 'Processing...' : 'Confirm & Send'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setStep('form')}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link href="/">
            <Button variant="ghost" className="text-[hsl(207,90%,54%)] p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h2 className="text-xl font-semibold">Send Money</h2>
        </div>
        <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
          Current Wallet: Fiat ({currentWallet?.currency} {balance.toLocaleString()})
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            To
          </Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search contacts or enter phone number"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-4 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-transparent"
              required
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[hsl(207,90%,54%)] p-0"
            >
              <QrCode className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Amount
          </Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-4 pr-16 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-transparent text-2xl font-semibold"
              step="0.01"
              min="0"
              max={balance}
              required
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
              {currentWallet?.currency || 'KES'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Available: {currentWallet?.currency} {balance.toLocaleString()}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 border border-slate-300 rounded-xl">
            <Checkbox 
              id="offline"
              checked={useOffline}
              onCheckedChange={(checked) => setUseOffline(checked as boolean)}
            />
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-[hsl(207,90%,54%)]" />
              <Label htmlFor="offline" className="text-sm">
                Use Mesh (Offline)
              </Label>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border border-slate-300 rounded-xl">
            <Checkbox 
              id="convert"
              checked={useSmartConvert}
              onCheckedChange={(checked) => setUseSmartConvert(checked as boolean)}
            />
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[hsl(207,90%,54%)]" />
              <Label htmlFor="convert" className="text-sm">
                Smart Convert (Best Rate)
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            type="submit"
            className="w-full bg-[hsl(207,90%,54%)] text-white py-4 rounded-xl font-semibold text-lg"
          >
            Continue
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={() => setBluetoothModalOpen(true)}
            className="w-full py-4 rounded-xl font-semibold text-lg border-[hsl(207,90%,54%)] text-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,54%)] hover:text-white"
          >
            <Bluetooth className="w-4 h-4 mr-2" />
            Bluetooth
          </Button>
        </div>

        {/* Recent Recipients */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Recent Recipients</p>
          <div className="grid grid-cols-3 gap-3">
            {['Achieng', 'John', 'Musa'].map((name) => (
              <Button
                key={name}
                type="button"
                variant="outline"
                onClick={() => setRecipient(name)}
                className="flex flex-col items-center space-y-2 p-3 h-auto hover:border-[hsl(207,90%,54%)]"
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-slate-600">{name}</span>
              </Button>
            ))}
          </div>
        </div>
      </form>

      <BluetoothTransferModal
        isOpen={bluetoothModalOpen}
        onClose={() => setBluetoothModalOpen(false)}
        userWallets={wallets}
        onTransferComplete={(transferData) => {
          console.log('Bluetooth transfer completed:', transferData);
          // Handle transfer completion
        }}
      />
    </div>
  );
}
