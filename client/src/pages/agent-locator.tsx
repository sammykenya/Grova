The user wants to update the UI style of the AgentLocator component to match the main project's style, focusing on background gradients, button styles, and card appearances.
```

```replit_final_file
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

interface CashAgent {
  id: string;
  businessName: string;
  location: string;
  latitude: string;
  longitude: string;
  isOnline: boolean;
  rating: number;
  totalRatings: number;
  services: string[];
}

export default function AgentLocator() {
  const [searchLocation, setSearchLocation] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<CashAgent | null>(null);
  const [transactionType, setTransactionType] = useState<'cash_in' | 'cash_out'>('cash_in');
  const [transactionAmount, setTransactionAmount] = useState('');
  const { toast } = useToast();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");

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

  const handleBookAgent = (agent: CashAgent) => {
    setSelectedAgent(agent);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedAgent || !serviceType) {
      toast({
        title: "Missing Information", 
        description: "Please select a service type",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/cash-agents/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          agentId: selectedAgent.id,
          serviceType,
          notes: bookingNotes,
          scheduledTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
        }),
      });

      if (!response.ok) throw new Error('Failed to create booking');

      toast({
        title: "Booking Confirmed",
        description: `Your ${serviceType.replace('_', ' ')} appointment with ${selectedAgent.businessName} has been confirmed`,
      });

      setShowBookingModal(false);
      setSelectedAgent(null);
      setServiceType("");
      setBookingNotes("");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
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
    <div className="mobile-container">
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6 pt-2">
            <Link href="/more">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-unifi-blue bg-clip-text text-transparent">
              Agent Locator
            </h1>
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
              
              <Card key={agent.id} className="mb-4 border-0 shadow-lg bg-gradient-to-r from-card via-card to-muted/5 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-unifi-blue text-white font-semibold">
                        {agent.businessName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{agent.businessName}</h3>
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {formatDistance(agent)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{agent.services}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {formatRating(agent.rating || 0, agent.totalRatings || 0)}
                        </span>
                        <span>{agent.totalRatings} reviews</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-unifi-blue hover:opacity-90 transition-opacity">
                      Contact
                    </Button>
                  </div>
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