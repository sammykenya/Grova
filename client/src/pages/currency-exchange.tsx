import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe2, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  ArrowLeft,
  Clock,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";

interface ExchangeRate {
  currency: string;
  name: string;
  rate: number;
  change24h: number;
  flag: string;
}

interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

export default function CurrencyExchange() {
  const [fromCurrency, setFromCurrency] = useState("KES");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("1000");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock exchange rates (in production, this would come from a real API)
  const exchangeRates: ExchangeRate[] = [
    { currency: "USD", name: "US Dollar", rate: 0.0076, change24h: 0.12, flag: "🇺🇸" },
    { currency: "EUR", name: "Euro", rate: 0.0069, change24h: -0.08, flag: "🇪🇺" },
    { currency: "GBP", name: "British Pound", rate: 0.0059, change24h: 0.15, flag: "🇬🇧" },
    { currency: "JPY", name: "Japanese Yen", rate: 1.12, change24h: -0.25, flag: "🇯🇵" },
    { currency: "CNY", name: "Chinese Yuan", rate: 0.054, change24h: 0.05, flag: "🇨🇳" },
    { currency: "ZAR", name: "South African Rand", rate: 0.14, change24h: -0.18, flag: "🇿🇦" },
    { currency: "NGN", name: "Nigerian Naira", rate: 11.2, change24h: 0.32, flag: "🇳🇬" },
    { currency: "GHS", name: "Ghanaian Cedi", rate: 0.089, change24h: -0.12, flag: "🇬🇭" },
    { currency: "UGX", name: "Ugandan Shilling", rate: 28.5, change24h: 0.08, flag: "🇺🇬" },
    { currency: "TZS", name: "Tanzanian Shilling", rate: 18.2, change24h: -0.05, flag: "🇹🇿" }
  ];

  const currencies: Currency[] = [
    { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪", symbol: "KSh" },
    { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
    { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", symbol: "¥" },
    { code: "ZAR", name: "South African Rand", flag: "🇿🇦", symbol: "R" },
    { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬", symbol: "₦" },
    { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭", symbol: "₵" },
    { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬", symbol: "USh" },
    { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿", symbol: "TSh" }
  ];

  const getExchangeRate = (from: string, to: string): number => {
    if (from === to) return 1;
    
    if (from === "KES") {
      const rate = exchangeRates.find(r => r.currency === to);
      return rate ? rate.rate : 1;
    }
    
    if (to === "KES") {
      const rate = exchangeRates.find(r => r.currency === from);
      return rate ? 1 / rate.rate : 1;
    }
    
    // Cross currency conversion via KES
    const fromRate = exchangeRates.find(r => r.currency === from);
    const toRate = exchangeRates.find(r => r.currency === to);
    
    if (fromRate && toRate) {
      return toRate.rate / fromRate.rate;
    }
    
    return 1;
  };

  const convertCurrency = () => {
    const rate = getExchangeRate(fromCurrency, toCurrency);
    const result = parseFloat(amount) * rate;
    setConvertedAmount(result);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const refreshRates = () => {
    setLastUpdated(new Date());
    // In production, this would fetch fresh rates from an API
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return `${currency?.symbol || ''}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getCurrencyDisplay = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? `${currency.flag} ${currency.code}` : code;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-yellow-900">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/more">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Currency Exchange
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time exchange rates and currency conversion
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshRates}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Globe2 className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4" />
          <span>Last updated: {lastUpdated.toLocaleString()}</span>
        </div>

        {/* Currency Converter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              Currency Converter
            </CardTitle>
            <CardDescription>
              Convert between different currencies at real-time rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Input */}
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                className="text-lg"
              />
            </div>

            {/* Currency Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label>From</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="sm" onClick={swapCurrencies}>
                  <ArrowRightLeft className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label>To</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conversion Result */}
            {convertedAmount !== null && (
              <div className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Converted Amount</p>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {formatCurrency(convertedAmount, toCurrency)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formatCurrency(parseFloat(amount), fromCurrency)} = {formatCurrency(convertedAmount, toCurrency)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Exchange rate: 1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency).toFixed(6)} {toCurrency}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exchange Rates Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Live Exchange Rates
            </CardTitle>
            <CardDescription>
              Current exchange rates against Kenyan Shilling (KES)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exchangeRates.map((rate) => (
                <div key={rate.currency} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{rate.flag}</span>
                    <div>
                      <p className="font-medium">{rate.currency}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{rate.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">
                      1 KES = {rate.rate.toFixed(6)} {rate.currency}
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      {rate.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-grova-orange" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-xs ${rate.change24h >= 0 ? 'text-grova-orange' : 'text-red-600'}`}>
                        {rate.change24h >= 0 ? '+' : ''}{rate.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exchange Services */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Exchange Services</CardTitle>
            <CardDescription>Available currency exchange options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Bank Transfer</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Exchange through connected bank accounts with competitive rates
                </p>
                <div className="flex justify-between text-xs">
                  <span>Processing time: 1-3 business days</span>
                  <Badge variant="outline">Available</Badge>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Mobile Money</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Instant currency exchange through M-Pesa and other mobile wallets
                </p>
                <div className="flex justify-between text-xs">
                  <span>Processing time: Instant</span>
                  <Badge variant="outline">Available</Badge>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Cash Agents</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Exchange cash with verified agents in your area
                </p>
                <div className="flex justify-between text-xs">
                  <span>Processing time: Immediate</span>
                  <Badge variant="outline">Available</Badge>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Crypto Exchange</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Convert between fiat and cryptocurrencies
                </p>
                <div className="flex justify-between text-xs">
                  <span>Processing time: 5-30 minutes</span>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mt-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Exchange Rate Notice</p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Exchange rates are indicative and may vary slightly during actual transactions. 
                  Final rates are confirmed at the time of transaction execution. 
                  All exchanges are subject to regulatory compliance and verification requirements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation currentPage="more" />
    </div>
  );
}