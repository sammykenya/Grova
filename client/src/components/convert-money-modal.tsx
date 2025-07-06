
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface ConvertMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userWallets: any[];
}

export default function ConvertMoneyModal({
  isOpen,
  onClose,
  userWallets
}: ConvertMoneyModalProps) {
  const [amount, setAmount] = useState("");
  const [fromWallet, setFromWallet] = useState<any>(null);
  const [toWallet, setToWallet] = useState<any>(null);
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [exchangeRate, setExchangeRate] = useState(1);
  const { toast } = useToast();

  // Mock exchange rates
  const getExchangeRate = (from: string, to: string) => {
    const rates: { [key: string]: number } = {
      'KES_USD': 0.0077,
      'USD_KES': 129.87,
      'KES_BTC': 0.0000007,
      'BTC_KES': 1428571.43,
      'USD_BTC': 0.000024,
      'BTC_USD': 41666.67,
      'CREDITS_KES': 1,
      'KES_CREDITS': 1,
      'CREDITS_USD': 0.0077,
      'USD_CREDITS': 129.87
    };
    return rates[`${from}_${to}`] || 1;
  };

  const convertMutation = useMutation({
    mutationFn: async (conversionData: any) => {
      await apiRequest('POST', '/api/transactions', conversionData);
    },
    onSuccess: () => {
      setStep('success');
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    },
    onError: (error) => {
      toast({
        title: "Conversion Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleWalletSelect = (wallet: any, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromWallet(wallet);
      if (toWallet && wallet.currency !== toWallet.currency) {
        const rate = getExchangeRate(wallet.currency, toWallet.currency);
        setExchangeRate(rate);
      }
    } else {
      setToWallet(wallet);
      if (fromWallet && wallet.currency !== fromWallet.currency) {
        const rate = getExchangeRate(fromWallet.currency, wallet.currency);
        setExchangeRate(rate);
      }
    }
  };

  const handleConvert = () => {
    if (!amount || !fromWallet || !toWallet) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (fromWallet.id === toWallet.id) {
      toast({
        title: "Invalid Conversion",
        description: "Cannot convert to the same wallet",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum <= 0 || amountNum > parseFloat(fromWallet.balance)) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0 and not exceed your balance",
        variant: "destructive",
      });
      return;
    }

    setStep('confirm');
  };

  const confirmConversion = () => {
    convertMutation.mutate({
      fromWalletId: fromWallet.id,
      toWalletId: toWallet.id,
      amount: amount,
      currency: fromWallet.currency,
      type: 'convert',
      description: `Converted ${fromWallet.currency} to ${toWallet.currency}`,
      metadata: {
        exchangeRate: exchangeRate,
        convertedAmount: (parseFloat(amount) * exchangeRate).toFixed(8)
      }
    });
  };

  const handleClose = () => {
    setStep('form');
    setAmount("");
    setFromWallet(null);
    setToWallet(null);
    setExchangeRate(1);
    onClose();
  };

  const convertedAmount = amount ? (parseFloat(amount) * exchangeRate).toFixed(8) : '0';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            Convert Money
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'form' && (
            <div className="space-y-4">
              <div>
                <Label>From Wallet</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {userWallets.map((wallet) => (
                    <Card 
                      key={wallet.id} 
                      className={`cursor-pointer hover:bg-gray-50 ${fromWallet?.id === wallet.id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => handleWalletSelect(wallet, 'from')}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{wallet.walletType} Wallet</p>
                            <p className="text-sm text-gray-600">{wallet.currency}</p>
                          </div>
                          <Badge variant="outline">{wallet.balance}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label>To Wallet</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {userWallets.filter(w => w.id !== fromWallet?.id).map((wallet) => (
                    <Card 
                      key={wallet.id} 
                      className={`cursor-pointer hover:bg-gray-50 ${toWallet?.id === wallet.id ? 'ring-2 ring-green-500' : ''}`}
                      onClick={() => handleWalletSelect(wallet, 'to')}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{wallet.walletType} Wallet</p>
                            <p className="text-sm text-gray-600">{wallet.currency}</p>
                          </div>
                          <Badge variant="outline">{wallet.balance}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                />
                {fromWallet && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {fromWallet.currency} {fromWallet.balance}
                  </p>
                )}
              </div>

              {fromWallet && toWallet && fromWallet.currency !== toWallet.currency && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Exchange Rate</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    1 {fromWallet.currency} = {exchangeRate} {toWallet.currency}
                  </p>
                  {amount && (
                    <p className="text-sm font-semibold mt-1">
                      You'll receive: {toWallet.currency} {convertedAmount}
                    </p>
                  )}
                </div>
              )}

              <Button 
                onClick={handleConvert}
                disabled={!amount || !fromWallet || !toWallet}
                className="w-full"
              >
                Convert
              </Button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Conversion Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>From:</span>
                    <span className="font-medium">{fromWallet.currency} {amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span className="font-medium">{toWallet.currency} {convertedAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Rate:</span>
                    <span>1 {fromWallet.currency} = {exchangeRate} {toWallet.currency}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Important Notice</p>
                  <p className="text-yellow-700">
                    Exchange rates are indicative and may vary. The conversion is final once confirmed.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={confirmConversion}
                  disabled={convertMutation.isPending}
                  className="w-full"
                >
                  {convertMutation.isPending ? 'Converting...' : 'Confirm Conversion'}
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
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Conversion Successful!</h3>
                <p className="text-sm text-gray-600">
                  Converted {fromWallet.currency} {amount} to {toWallet.currency} {convertedAmount}
                </p>
              </div>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
