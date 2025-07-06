
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bluetooth, BluetoothConnected, Smartphone, Users, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { bluetoothTransfer, type BluetoothDiscoveryResult } from "@/lib/bluetoothUtils";

interface BluetoothTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  userWallets: any[];
  onTransferComplete: (transferData: any) => void;
}

export default function BluetoothTransferModal({
  isOpen,
  onClose,
  userWallets,
  onTransferComplete
}: BluetoothTransferModalProps) {
  const [step, setStep] = useState<'scan' | 'connect' | 'transfer' | 'confirm'>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDiscoveryResult[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDiscoveryResult | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      checkBluetoothSupport();
    }
  }, [isOpen]);

  useEffect(() => {
    // Listen for incoming Bluetooth transfers
    const handleIncomingTransfer = (event: CustomEvent) => {
      const transferData = event.detail;
      toast({
        title: "Money Transfer Received",
        description: `Received ${transferData.currency} ${transferData.amount} via Bluetooth`,
      });
      onTransferComplete(transferData);
    };

    window.addEventListener('bluetoothMoneyTransfer', handleIncomingTransfer as EventListener);
    return () => {
      window.removeEventListener('bluetoothMoneyTransfer', handleIncomingTransfer as EventListener);
    };
  }, [onTransferComplete, toast]);

  const checkBluetoothSupport = async () => {
    const available = await bluetoothTransfer.isBluetoothAvailable();
    if (!available) {
      toast({
        title: "Bluetooth Not Available",
        description: "Your device doesn't support Bluetooth or it's disabled",
        variant: "destructive",
      });
      onClose();
    }
  };

  const handleScanDevices = async () => {
    setIsScanning(true);
    try {
      const hasPermission = await bluetoothTransfer.requestBluetoothPermission();
      if (!hasPermission) {
        toast({
          title: "Permission Denied",
          description: "Bluetooth permission is required for P2P transfers",
          variant: "destructive",
        });
        return;
      }

      const devices = await bluetoothTransfer.scanForGrovaDevices();
      setDiscoveredDevices(devices);
      
      if (devices.length === 0) {
        toast({
          title: "No Devices Found",
          description: "No Grova devices found nearby. Make sure they're discoverable.",
        });
      }
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Failed to scan for devices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleConnectDevice = async (device: BluetoothDiscoveryResult) => {
    setIsConnecting(true);
    setSelectedDevice(device);
    
    try {
      const connected = await bluetoothTransfer.connectToDevice(device.deviceId);
      if (connected) {
        setIsConnected(true);
        setStep('transfer');
        toast({
          title: "Connected",
          description: `Connected to ${device.deviceName}`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to the device",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendMoney = async () => {
    if (!selectedDevice || !selectedWallet || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const transferData = {
        type: 'money_transfer' as const,
        amount: amount,
        currency: selectedWallet.currency,
        fromUserId: 'current_user_id', // This would come from auth context
        toUserId: selectedDevice.userId || 'unknown',
        walletType: selectedWallet.walletType
      };

      const success = await bluetoothTransfer.sendMoneyTransfer(transferData);
      if (success) {
        setStep('confirm');
        toast({
          title: "Transfer Sent",
          description: `Successfully sent ${selectedWallet.currency} ${amount}`,
        });
        onTransferComplete(transferData);
      } else {
        toast({
          title: "Transfer Failed",
          description: "Failed to send money transfer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Transfer Error",
        description: "An error occurred during transfer",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    bluetoothTransfer.disconnect();
    setStep('scan');
    setIsConnected(false);
    setSelectedDevice(null);
    setAmount("");
    setSelectedWallet(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bluetooth className="w-5 h-5 text-blue-600" />
            Bluetooth Money Transfer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'scan' && (
            <div className="space-y-4">
              <div className="text-center">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <p className="text-sm text-gray-600">
                  Scan for nearby Grova devices to send money directly
                </p>
              </div>
              
              <Button 
                onClick={handleScanDevices}
                disabled={isScanning}
                className="w-full"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4 mr-2" />
                    Scan for Devices
                  </>
                )}
              </Button>

              {discoveredDevices.length > 0 && (
                <div className="space-y-2">
                  <Label>Discovered Devices</Label>
                  {discoveredDevices.map((device) => (
                    <Card key={device.deviceId} className="cursor-pointer hover:bg-gray-50" onClick={() => handleConnectDevice(device)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{device.deviceName}</p>
                              {device.userId && (
                                <p className="text-sm text-gray-600">User: {device.userId}</p>
                              )}
                            </div>
                          </div>
                          {isConnecting && selectedDevice?.deviceId === device.deviceId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Badge variant="outline">Connect</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'transfer' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <BluetoothConnected className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">
                  Connected to {selectedDevice?.deviceName}
                </span>
              </div>

              <div className="space-y-3">
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
                            <p className="font-semibold">{wallet.balance}</p>
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

                <Button 
                  onClick={handleSendMoney}
                  disabled={isSending || !selectedWallet || !amount}
                  className="w-full"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Money'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Transfer Complete!</h3>
                <p className="text-sm text-gray-600">
                  Successfully sent {selectedWallet?.currency} {amount} to {selectedDevice?.deviceName}
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
