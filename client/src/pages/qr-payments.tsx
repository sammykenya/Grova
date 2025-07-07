import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Scan, Camera, Download, Share2, Copy, Check, Smartphone, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/bottom-navigation";
import { useAuth } from "@/hooks/useAuth";

interface QRPaymentData {
  recipient: string;
  amount: string;
  currency: string;
  description: string;
  expiresAt: string;
}

export default function QRPayments() {
  const [activeTab, setActiveTab] = useState("generate");
  const [paymentData, setPaymentData] = useState<QRPaymentData>({
    recipient: "",
    amount: "",
    currency: "KES",
    description: "",
    expiresAt: ""
  });
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<QRPaymentData | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const currencies = [
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "BTC", name: "Bitcoin", symbol: "₿" },
    { code: "ETH", name: "Ethereum", symbol: "Ξ" }
  ];

  // Generate QR code data
  const generateQRCode = () => {
    if (!paymentData.amount || !paymentData.currency) {
      toast({
        title: "Missing Information",
        description: "Please fill in the amount and currency",
        variant: "destructive"
      });
      return;
    }

    const qrData = {
      type: "unifi_payment",
      recipient: (user as any)?.id || "current_user",
      amount: paymentData.amount,
      currency: paymentData.currency,
      description: paymentData.description,
      timestamp: Date.now(),
      expiresAt: paymentData.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    const qrString = JSON.stringify(qrData);
    setQrCodeData(qrString);
    
    toast({
      title: "QR Code Generated",
      description: "Your payment QR code is ready to share",
    });
  };

  // Generate simple QR code SVG (basic implementation)
  const generateQRCodeSVG = (data: string) => {
    // This is a simplified QR code representation
    // In a real app, you'd use a proper QR code library
    const size = 200;
    const modules = 25;
    const moduleSize = size / modules;
    
    // Create a simple pattern based on the data
    const pattern = [];
    for (let i = 0; i < modules; i++) {
      pattern[i] = [];
      for (let j = 0; j < modules; j++) {
        // Simple hash-based pattern generation
        const hash = (data.charCodeAt((i * modules + j) % data.length) + i + j) % 3;
        pattern[i][j] = hash > 0;
      }
    }

    return (
      <svg width={size} height={size} className="border rounded-lg">
        {pattern.map((row, i) =>
          row.map((isBlack, j) => (
            <rect
              key={`${i}-${j}`}
              x={j * moduleSize}
              y={i * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill={isBlack ? "#000" : "#fff"}
            />
          ))
        )}
        <rect x={0} y={0} width={size} height={size} fill="none" stroke="#ddd" strokeWidth={2} />
      </svg>
    );
  };

  // Start camera for scanning
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Stop scanning
  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Simulate QR code scan (in real app, you'd use a QR scanner library)
  const simulateScan = () => {
    const mockData: QRPaymentData = {
      recipient: "John Doe",
      amount: "500",
      currency: "KES",
      description: "Coffee payment",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    setScannedData(mockData);
    stopScanning();
    toast({
      title: "QR Code Scanned",
      description: "Payment details loaded successfully",
    });
  };

  // Copy QR data to clipboard
  const copyToClipboard = async () => {
    if (qrCodeData) {
      await navigator.clipboard.writeText(qrCodeData);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied",
        description: "QR code data copied to clipboard",
      });
    }
  };

  // Process scanned payment
  const processPayment = async () => {
    if (!scannedData) return;

    toast({
      title: "Processing Payment",
      description: `Sending ${scannedData.amount} ${scannedData.currency} to ${scannedData.recipient}`,
    });

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully",
      });
      setScannedData(null);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Bold Blue Header */}
      <div className="bg-grova-blue text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="grova-headline text-white text-3xl mb-2">
            QR Payments
          </h1>
          <p className="grova-body text-white/90 text-lg">
            Generate QR codes for instant payments or scan to pay others quickly and securely
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 pb-20">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Bold Tab Navigation */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab("generate")}
              className={`p-4 rounded-2xl transition-all ${
                activeTab === "generate"
                  ? "bg-grova-orange text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <QrCode className="w-6 h-6 mx-auto mb-2" />
              <span className="grova-body">Generate QR</span>
            </button>
            <button
              onClick={() => setActiveTab("scan")}
              className={`p-4 rounded-2xl transition-all ${
                activeTab === "scan"
                  ? "bg-grova-orange text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Scan className="w-6 h-6 mx-auto mb-2" />
              <span className="grova-body">Scan & Pay</span>
            </button>
          </div>

          <TabsContent value="generate">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-green-600" />
                    Create Payment QR
                  </CardTitle>
                  <CardDescription>
                    Generate a QR code for others to pay you instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency *</Label>
                    <Select value={paymentData.currency} onValueChange={(value) => setPaymentData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="What's this payment for?"
                      value={paymentData.description}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <Button onClick={generateQRCode} className="w-full bg-green-600 hover:bg-green-700">
                    Generate QR Code
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Your QR Code</CardTitle>
                  <CardDescription>
                    Share this code for instant payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {qrCodeData ? (
                    <>
                      <div className="flex justify-center">
                        {generateQRCodeSVG(qrCodeData)}
                      </div>
                      
                      <div className="text-center space-y-2">
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          {currencies.find(c => c.code === paymentData.currency)?.symbol} {paymentData.amount}
                        </Badge>
                        {paymentData.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {paymentData.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button size="sm" variant="outline" onClick={copyToClipboard}>
                          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Your QR code will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scan">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-600" />
                    QR Scanner
                  </CardTitle>
                  <CardDescription>
                    Point your camera at a QR code to scan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isScanning ? (
                    <div className="space-y-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg bg-black"
                        style={{ aspectRatio: "1" }}
                      />
                      <div className="space-y-2">
                        <Button onClick={simulateScan} className="w-full bg-blue-600 hover:bg-blue-700">
                          Simulate Scan
                        </Button>
                        <Button onClick={stopScanning} variant="outline" className="w-full">
                          Stop Scanning
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                      <Button onClick={startScanning} className="bg-blue-600 hover:bg-blue-700">
                        <Camera className="w-4 h-4 mr-2" />
                        Start Scanner
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>
                    Review and confirm payment information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scannedData ? (
                    <>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Recipient:</span>
                          <span className="font-medium">{scannedData.recipient}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                          <Badge variant="default" className="text-lg">
                            {currencies.find(c => c.code === scannedData.currency)?.symbol} {scannedData.amount}
                          </Badge>
                        </div>
                        {scannedData.description && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                            <span className="font-medium">{scannedData.description}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <Check className="w-4 h-4" />
                        QR code verified and secure
                      </div>

                      <div className="space-y-2">
                        <Button onClick={processPayment} className="w-full bg-green-600 hover:bg-green-700">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Confirm Payment
                        </Button>
                        <Button onClick={() => setScannedData(null)} variant="outline" className="w-full">
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Scan a QR code to see payment details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <CardContent className="pt-6">
              <QrCode className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Quick Generate</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <CardContent className="pt-6">
              <Scan className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Quick Scan</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <CardContent className="pt-6">
              <Share2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Share Code</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800">
            <CardContent className="pt-6">
              <Download className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Save Code</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation currentPage="qr-payments" />
    </div>
  );
}