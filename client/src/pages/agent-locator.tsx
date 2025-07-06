
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Search, 
  Map, 
  List, 
  MapPin,
  Star,
  Wifi,
  WifiOff,
  Navigation,
  Phone,
  Clock
} from "lucide-react";

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function AgentLocator() {
  const [searchLocation, setSearchLocation] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [transactionType, setTransactionType] = useState<'cash_in' | 'cash_out'>('cash_in');
  const [transactionAmount, setTransactionAmount] = useState('');
  const { toast } = useToast();

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setLocationError(error.message);
          console.error("Error getting location:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch cash agents based on location
  const { data: agents = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/cash-agents', userLocation?.latitude, userLocation?.longitude],
    enabled: !!userLocation,
    retry: false,
  });

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatDistance = (agent: any) => {
    if (!userLocation || !agent.latitude || !agent.longitude) return "Distance unknown";
    
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      parseFloat(agent.latitude),
      parseFloat(agent.longitude)
    );
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  const formatRating = (rating: string | number, totalRatings: number) => {
    const ratingNum = typeof rating === 'string' ? parseFloat(rating) : rating;
    return `${ratingNum.toFixed(1)} (${totalRatings})`;
  };

  const handleTransaction = async (agent: any, type: 'cash_in' | 'cash_out') => {
    if (!transactionAmount || parseFloat(transactionAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would initiate the transaction
    toast({
      title: "Transaction Initiated",
      description: `${type === 'cash_in' ? 'Cash In' : 'Cash Out'} of KES ${transactionAmount} with ${agent.businessName}`,
    });

    setSelectedAgent(null);
    setTransactionAmount('');
  };

  const sortedAgents = agents
    .filter(agent => 
      searchLocation === '' || 
      agent.businessName.toLowerCase().includes(searchLocation.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchLocation.toLowerCase())
    )
    .sort((a, b) => {
      if (!userLocation) return 0;
      
      const distanceA = calculateDistance(
        userLocation.latitude, userLocation.longitude,
        parseFloat(a.latitude || 0), parseFloat(a.longitude || 0)
      );
      const distanceB = calculateDistance(
        userLocation.latitude, userLocation.longitude,
        parseFloat(b.latitude || 0), parseFloat(b.longitude || 0)
      );
      
      return distanceA - distanceB;
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(207,90%,54%)] mx-auto mb-4"></div>
          <p>Finding nearby agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link href="/more">
            <Button variant="ghost" className="text-[hsl(207,90%,54%)] p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h2 className="text-xl font-semibold">Cash Agents</h2>
          {userLocation && (
            <Badge variant="secondary" className="text-xs">
              <Navigation className="w-3 h-3 mr-1" />
              Location enabled
            </Badge>
          )}
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search agents or location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-transparent"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        </div>
      </div>

      <div className="p-4 space-y-4 pb-20">
        {/* Location Status */}
        {locationError && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-yellow-700">
                <MapPin className="w-4 h-4" />
                <p className="text-sm">Location access denied. Showing all agents.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Toggle */}
        <div className="flex bg-slate-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2 px-4 rounded-md font-medium ${
              viewMode === 'list' 
                ? 'bg-white text-[hsl(207,90%,54%)] shadow-sm' 
                : 'text-slate-600'
            }`}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            onClick={() => setViewMode('map')}
            className={`flex-1 py-2 px-4 rounded-md font-medium ${
              viewMode === 'map' 
                ? 'bg-white text-[hsl(207,90%,54%)] shadow-sm' 
                : 'text-slate-600'
            }`}
          >
            <Map className="w-4 h-4 mr-2" />
            Map
          </Button>
        </div>

        {/* Agent List */}
        <div className="space-y-3">
          {sortedAgents.length > 0 ? (
            sortedAgents.map((agent: any) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{agent.businessName}</h3>
                      <p className="text-sm text-slate-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {agent.location}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDistance(agent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center text-sm mb-1 ${
                        agent.isOnline ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {agent.isOnline ? (
                          <Wifi className="w-3 h-3 mr-1" />
                        ) : (
                          <WifiOff className="w-3 h-3 mr-1" />
                        )}
                        {agent.isOnline ? 'Online' : 'Offline'}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        {formatRating(agent.rating || 0, agent.totalRatings || 0)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          disabled={!agent.isOnline}
                          onClick={() => {
                            setSelectedAgent(agent);
                            setTransactionType('cash_in');
                          }}
                          className={`text-sm font-medium ${
                            agent.isOnline 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Cash In
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cash In - {agent.businessName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="amount">Amount (KES)</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={transactionAmount}
                              onChange={(e) => setTransactionAmount(e.target.value)}
                              placeholder="Enter amount"
                            />
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{agent.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>Available now</span>
                          </div>
                          <Button 
                            onClick={() => handleTransaction(agent, 'cash_in')}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            Confirm Cash In
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          disabled={!agent.isOnline}
                          onClick={() => {
                            setSelectedAgent(agent);
                            setTransactionType('cash_out');
                          }}
                          className={`text-sm font-medium ${
                            agent.isOnline 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Cash Out
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cash Out - {agent.businessName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="amount">Amount (KES)</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={transactionAmount}
                              onChange={(e) => setTransactionAmount(e.target.value)}
                              placeholder="Enter amount"
                            />
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{agent.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>Available now</span>
                          </div>
                          <Button 
                            onClick={() => handleTransaction(agent, 'cash_out')}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            Confirm Cash Out
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {agent.services && (
                    <div className="flex flex-wrap gap-1">
                      {agent.services.map((service: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Agents Found</h3>
              <p className="text-slate-600 mb-4">
                There are no cash agents available in your area at the moment.
              </p>
              <Button 
                onClick={() => refetch()}
                className="bg-[hsl(207,90%,54%)] text-white mr-2"
              >
                Refresh
              </Button>
              <Button className="bg-green-600 text-white">
                Become an Agent
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
