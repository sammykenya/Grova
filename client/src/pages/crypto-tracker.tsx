import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Coins, 
  TrendingUp, 
  TrendingDown,
  Star,
  Search,
  RefreshCw,
  ArrowLeft,
  DollarSign,
  PieChart,
  AlertCircle,
  Plus
} from "lucide-react";
import { Link } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";

interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  circulating_supply: number;
  image: string;
  isWatched?: boolean;
}

interface Portfolio {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
  image: string;
}

export default function CryptoTracker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("market");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock cryptocurrency data (in production, this would come from a real API like CoinGecko)
  const [cryptoData, setCryptoData] = useState<CryptoCurrency[]>([
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      current_price: 43250.00,
      price_change_percentage_24h: 2.34,
      market_cap: 847234567890,
      volume_24h: 28456789012,
      circulating_supply: 19678432,
      image: "₿",
      isWatched: true
    },
    {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      current_price: 2456.78,
      price_change_percentage_24h: -1.23,
      market_cap: 295467890123,
      volume_24h: 15678901234,
      circulating_supply: 120345678,
      image: "⟠",
      isWatched: true
    },
    {
      id: "binancecoin",
      symbol: "BNB",
      name: "BNB",
      current_price: 312.45,
      price_change_percentage_24h: 0.89,
      market_cap: 47890123456,
      volume_24h: 1234567890,
      circulating_supply: 153234567,
      image: "💰",
      isWatched: false
    },
    {
      id: "cardano",
      symbol: "ADA",
      name: "Cardano",
      current_price: 0.456,
      price_change_percentage_24h: -2.67,
      market_cap: 16123456789,
      volume_24h: 567890123,
      circulating_supply: 35345678901,
      image: "♠",
      isWatched: false
    },
    {
      id: "solana",
      symbol: "SOL",
      name: "Solana",
      current_price: 89.23,
      price_change_percentage_24h: 4.56,
      market_cap: 38456789012,
      volume_24h: 2345678901,
      circulating_supply: 431234567,
      image: "◎",
      isWatched: true
    },
    {
      id: "polkadot",
      symbol: "DOT",
      name: "Polkadot",
      current_price: 6.78,
      price_change_percentage_24h: -0.45,
      market_cap: 8567890123,
      volume_24h: 345678901,
      circulating_supply: 1263456789,
      image: "●",
      isWatched: false
    }
  ]);

  const [portfolio, setPortfolio] = useState<Portfolio[]>([
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      amount: 0.0234,
      averagePrice: 41200.00,
      currentPrice: 43250.00,
      image: "₿"
    },
    {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      amount: 1.456,
      averagePrice: 2580.00,
      currentPrice: 2456.78,
      image: "⟠"
    },
    {
      id: "solana",
      symbol: "SOL",
      name: "Solana",
      amount: 12.34,
      averagePrice: 85.50,
      currentPrice: 89.23,
      image: "◎"
    }
  ]);

  const watchedCryptos = cryptoData.filter(crypto => crypto.isWatched);
  const filteredCryptos = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: amount < 1 ? 6 : 2,
    }).format(amount);
  };

  const formatMarketCap = (amount: number) => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
    return `$${amount.toFixed(0)}`;
  };

  const toggleWatchlist = (cryptoId: string) => {
    setCryptoData(cryptoData.map(crypto =>
      crypto.id === cryptoId ? { ...crypto, isWatched: !crypto.isWatched } : crypto
    ));
  };

  const refreshData = () => {
    setLastUpdated(new Date());
    // In production, this would fetch fresh data from the API
  };

  const totalPortfolioValue = portfolio.reduce((sum, holding) => 
    sum + (holding.amount * holding.currentPrice), 0
  );

  const totalPortfolioCost = portfolio.reduce((sum, holding) => 
    sum + (holding.amount * holding.averagePrice), 0
  );

  const portfolioChange = totalPortfolioValue - totalPortfolioCost;
  const portfolioChangePercent = totalPortfolioCost > 0 ? (portfolioChange / totalPortfolioCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/more">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Crypto Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track cryptocurrency prices and manage your portfolio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Coins className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Portfolio Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-r ${portfolioChange >= 0 ? 'from-grova-orange to-grova-orange' : 'from-red-500 to-red-600'} text-white border-0`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">24h Change</p>
                  <p className="text-2xl font-bold">
                    {portfolioChange >= 0 ? '+' : ''}{formatCurrency(portfolioChange)}
                  </p>
                </div>
                {portfolioChange >= 0 ? 
                  <TrendingUp className="w-8 h-8 text-black" /> : 
                  <TrendingDown className="w-8 h-8 text-red-200" />
                }
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Holdings</p>
                  <p className="text-2xl font-bold">{portfolio.length}</p>
                </div>
                <PieChart className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Watchlist</p>
                  <p className="text-2xl font-bold">{watchedCryptos.length}</p>
                </div>
                <Star className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cryptocurrencies..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Cryptocurrencies
                </CardTitle>
                <CardDescription>
                  Live cryptocurrency prices and market data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredCryptos.map((crypto) => (
                    <div key={crypto.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{crypto.image}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{crypto.name}</p>
                            <Badge variant="outline" className="text-xs">{crypto.symbol}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Market Cap: {formatMarketCap(crypto.market_cap)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatCurrency(crypto.current_price)}
                        </p>
                        <div className="flex items-center gap-1 justify-end">
                          {crypto.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="w-3 h-3 text-grova-orange" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                          <span className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-grova-orange' : 'text-red-600'}`}>
                            {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWatchlist(crypto.id)}
                        className="ml-4"
                      >
                        <Star className={`w-4 h-4 ${crypto.isWatched ? 'fill-current text-yellow-500' : ''}`} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Your Portfolio
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-xl font-bold text-orange-600">
                      {formatCurrency(totalPortfolioValue)}
                    </p>
                  </div>
                </CardTitle>
                <CardDescription>
                  Track your cryptocurrency investments and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.map((holding) => {
                      const currentValue = holding.amount * holding.currentPrice;
                      const costBasis = holding.amount * holding.averagePrice;
                      const pnl = currentValue - costBasis;
                      const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

                      return (
                        <div key={holding.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{holding.image}</span>
                              <div>
                                <p className="font-medium">{holding.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {holding.amount} {holding.symbol}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(currentValue)}</p>
                              <div className="flex items-center gap-1 justify-end">
                                {pnl >= 0 ? (
                                  <TrendingUp className="w-3 h-3 text-grova-orange" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 text-red-500" />
                                )}
                                <span className={`text-sm ${pnl >= 0 ? 'text-grova-orange' : 'text-red-600'}`}>
                                  {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)} ({pnlPercent.toFixed(2)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Current Price</p>
                              <p className="font-medium">{formatCurrency(holding.currentPrice)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Avg. Buy Price</p>
                              <p className="font-medium">{formatCurrency(holding.averagePrice)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Holdings</p>
                              <p className="font-medium">{holding.amount} {holding.symbol}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Holdings Yet</h3>
                    <p className="text-gray-600 mb-4">Start building your crypto portfolio</p>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Holding
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Your Watchlist
                </CardTitle>
                <CardDescription>
                  Keep track of cryptocurrencies you're interested in
                </CardDescription>
              </CardHeader>
              <CardContent>
                {watchedCryptos.length > 0 ? (
                  <div className="space-y-3">
                    {watchedCryptos.map((crypto) => (
                      <div key={crypto.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{crypto.image}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{crypto.name}</p>
                              <Badge variant="outline" className="text-xs">{crypto.symbol}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Vol: {formatMarketCap(crypto.volume_24h)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(crypto.current_price)}
                          </p>
                          <div className="flex items-center gap-1 justify-end">
                            {crypto.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="w-3 h-3 text-grova-orange" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-500" />
                            )}
                            <span className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-grova-orange' : 'text-red-600'}`}>
                              {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleWatchlist(crypto.id)}
                          className="ml-4"
                        >
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Watched Coins</h3>
                    <p className="text-gray-600 mb-4">Add cryptocurrencies to your watchlist</p>
                    <Button 
                      onClick={() => setActiveTab("market")}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Browse Market
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Market Info */}
        <Card className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-900 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Investment Disclaimer</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Cryptocurrency investments are highly volatile and carry significant risk. 
                  Past performance does not guarantee future results. Only invest what you can afford to lose. 
                  This is not financial advice - please do your own research before making investment decisions.
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