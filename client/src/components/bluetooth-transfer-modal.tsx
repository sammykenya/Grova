
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bluetooth, 
  Search, 
  Wifi, 
  User, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { bluetoothTransfer, type BluetoothDiscoveryResult } from "@/lib/bluetoothUtils";

interface BluetoothTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: string;
  walletType?: 'fiat' | 'crypto' | 'credits';
}

export default function BluetoothTransferModal({ 
  isOpen, 
  onClose, 
  initialAmount = '', 
  walletType = 'fiat' 
}: BluetoothTransferModalProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [step, setStep] = useState<'scan' | 'select' | 'confirm' | 'transfer'>('scan');
  const [nearbyDevices, setNearbyDevices] = useState<BluetoothDiscoveryResult[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDiscoveryResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transferStatus, setTransferStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      checkBluetoothAvailability();
    }
  }, [isOpen]);

  useEffect(() => {
    // Listen for incoming transfers
    const handleIncomingTransfer = (event: CustomEvent) => {
      const transferData = event.detail;
      toast({
        title: "Money Received!",
        description: `Received ${transferData.currency} ${transferData.amount} via Bluetooth`,
      });
    };

    window.addEventListener('bluetoothMoneyTransfer', handleIncomingTransfer as EventListener);
    return () => {
      window.removeEventListener('bluetoothMoneyTransfer', handleIncomingTransfer as EventListener);
    };
  }, [toast]);

  const checkBluetoothAvailability = async () => {
    const available = await bluetoothTransfer.isBluetoothAvailable();
    setBluetoothAvailable(available);
    
    if (!available) {
      toast({
        title: "Bluetooth Not Available",
        description: "Bluetooth is not supported on this device. Using mock devices for demo.",
        variant: "destructive",
      });
      // Use mock devices for demo
      const mockDevices = await bluetoothTransfer.getMockNearbyDevices();
      setNearbyDevices(mockDevices);
    }
  };

  const startScanning = async () => {
    setIsScanning(true);
    try {
      if (bluetoothAvailable) {
        const hasPermission = await bluetoothTransfer.requestBluetoothPermission();
        if (!hasPermission) {
          throw new Error('Bluetooth permission denied');
        }
        
        const devices = await bluetoothTransfer.scanForGrovaDevices();
        setNearbyDevices(devices);
      } else {
        // Use mock devices for demo
        const mockDevices = await bluetoothTransfer.getMockNearbyDevices();
        setNearbyDevices(mockDevices);
      }
      
      setStep('select');
    } catch (error) {
      console.error('Error scanning for devices:', error);
      toast({
        title: "Scan Failed",
        description: "Failed to scan for nearby devices. Using demo devices.",
        variant: "destructive",
      });
      // Fallback to mock devices
      const mockDevices = await bluetoothTransfer.getMockNearbyDevices();
      setNearbyDevices(mockDevices);
      setStep('select');
    } finally {
      setIsScanning(false);
    }
  };

  const selectDevice = (device: BluetoothDiscoveryResult) => {
    setSelectedDevice(device);
    setStep('confirm');
  };

  const confirmTransfer = async () => {
    if (!selectedDevice || !amount || !user) return;
    
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setStep('transfer');
    setTransferStatus('sending');
    
    try {
      setIsConnecting(true);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = await bluetoothTransfer.sendMoneyTransfer({
        type: 'money_transfer',
        amount: amount,
        currency: walletType === 'fiat' ? 'KES' : walletType === 'crypto' ? 'BTC' : 'CREDITS',
        fromUserId: user.id,
        toUserId: selectedDevice.userId || 'unknown',
        walletType: walletType
      });

      if (success) {
        setTransferStatus('success');
        toast({
          title: "Transfer Successful!",
          description: `Sent ${amount} ${walletType === 'fiat' ? 'KES' : walletType.toUpperCase()} to ${selectedDevice.deviceName}`,
        });
        
        // Auto-close after success
        setTimeout(() => {
          onClose();
          resetModal();
        }, 2000);
      } else {
        throw new Error('Transfer failed');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setTransferStatus('error');
      toast({
        title: "Transfer Failed",
        description: "Failed to send money via Bluetooth. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const resetModal = () => {
    setStep('scan');
    setNearbyDevices([]);
    setSelectedDevice(null);
    setAmount(initialAmount);
    setTransferStatus('idle');
  };

  const renderStep = () => {
    switch (step) {
      case 'scan':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Bluetooth className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Scan for Nearby Devices</h3>
              <p className="text-slate-600 text-sm">
                Find Grova users nearby to send money directly via Bluetooth
              </p>
            </div>
            <Button 
              onClick={startScanning}
              disabled={isScanning}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Start Scanning
                </>
              )}
            </Button>
            {!bluetoothAvailable && (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Demo mode: Bluetooth not available</span>
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Select Recipient</h3>
              <p className="text-slate-600 text-sm">
                Choose a nearby Grova user to send money to
              </p>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {nearbyDevices.length > 0 ? (
                nearbyDevices.map((device) => (
                  <Card 
                    key={device.deviceId} 
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => selectDevice(device)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{device.deviceName}</p>
                            <p className="text-sm text-slate-500">
                              {device.userId ? `ID: ${device.userId}` : 'Unknown user'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            <Wifi className="w-3 h-3 mr-1" />
                            Online
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No nearby devices found</p>
                  <Button 
                    variant="outline" 
                    onClick={startScanning}
                    className="mt-2"
                  >
                    Scan Again
                  </Button>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setStep('scan')}
              className="w-full"
            >
              Back to Scan
            </Button>
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Confirm Transfer</h3>
              <p className="text-slate-600 text-sm">
                Review the transfer details before sending
              </p>
            </div>
            
            {selectedDevice && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedDevice.deviceName}</p>
                      <p className="text-sm text-slate-500">
                        {selectedDevice.userId || 'Unknown user'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Currency:</span>
                        <span className="font-medium">
                          {walletType === 'fiat' ? 'KES' : walletType.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Transfer fee:</span>
                        <span className="font-medium">Free</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('select')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={confirmTransfer}
                disabled={!amount || parseFloat(amount) <= 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Send Money
              </Button>
            </div>
          </div>
        );

      case 'transfer':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                {transferStatus === 'sending' && (
                  <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                )}
                {transferStatus === 'success' && (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                )}
                {transferStatus === 'error' && (
                  <AlertCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
            </div>
            
            <div>
              {transferStatus === 'sending' && (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    {isConnecting ? 'Connecting...' : 'Sending Money...'}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {isConnecting 
                      ? 'Establishing Bluetooth connection' 
                      : 'Transferring funds securely'
                    }
                  </p>
                </>
              )}
              
              {transferStatus === 'success' && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Transfer Successful!</h3>
                  <p className="text-slate-600 text-sm">
                    Money sent successfully to {selectedDevice?.deviceName}
                  </p>
                </>
              )}
              
              {transferStatus === 'error' && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Transfer Failed</h3>
                  <p className="text-slate-600 text-sm">
                    Please check your connection and try again
                  </p>
                  <Button 
                    onClick={() => setStep('confirm')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                </>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bluetooth className="w-5 h-5 text-blue-600" />
            <span>Bluetooth Transfer</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
