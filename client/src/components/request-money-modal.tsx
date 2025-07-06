
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { QrCode, Share2, Copy, MessageSquare, Mail, Phone, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userWallets: any[];
}

export default function RequestMoneyModal({
  isOpen,
  onClose,
  userWallets
}: RequestMoneyModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [step, setStep] = useState<'form' | 'share' | 'success'>('form');
  const [requestId, setRequestId] = useState("");
  const { toast } = useToast();

  const handleCreateRequest = () => {
    if (!amount || !selectedWallet) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and select a wallet",
        variant: "destructive",
      });
      return;
    }

    const newRequestId = `REQ${Date.now()}`;
    setRequestId(newRequestId);
    setStep('share');
  };

  const handleShare = (method: 'sms' | 'email' | 'copy' | 'whatsapp') => {
    const requestText = `Hi! I'm requesting ${selectedWallet?.currency} ${amount} ${description ? `for ${description}` : ''}. Please pay via Grova using this request ID: ${requestId}`;
    
    switch (method) {
      case 'copy':
        navigator.clipboard.writeText(requestText);
        toast({
          title: "Copied!",
          description: "Request details copied to clipboard",
        });
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(requestText)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Payment Request&body=${encodeURIComponent(requestText)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(requestText)}`);
        break;
    }
    
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setAmount("");
    setDescription("");
    setSelectedWallet(null);
    setRequestId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            Request Money
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'form' && (
            <div className="space-y-4">
              <div>
                <Label>Select Wallet</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {userWallets.map((wallet) => (
                    <Card 
                      key={wallet.id} 
                      className={`cursor-pointer hover:bg-gray-50 ${selectedWallet?.id === wallet.id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedWallet(wallet)}
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
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="What's this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleCreateRequest}
                disabled={!amount || !selectedWallet}
                className="w-full"
              >
                Create Request
              </Button>
            </div>
          )}

          {step === 'share' && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <QrCode className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">QR Code</p>
                <p className="text-xs text-gray-500 mt-1">Coming soon!</p>
              </div>

              <div className="text-center">
                <h3 className="font-semibold mb-2">Request Details</h3>
                <p className="text-lg font-bold">{selectedWallet?.currency} {amount}</p>
                {description && <p className="text-sm text-gray-600">{description}</p>}
                <p className="text-xs text-gray-500 mt-2">ID: {requestId}</p>
              </div>

              <div className="space-y-2">
                <Label>Share via:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleShare('sms')}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    SMS
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleShare('email')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Request Sent!</h3>
                <p className="text-sm text-gray-600">
                  Your payment request has been shared successfully
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
