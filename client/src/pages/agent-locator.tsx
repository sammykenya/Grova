import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Search, 
  Map, 
  List, 
  MapPin,
  Star,
  Wifi,
  WifiOff
} from "lucide-react";

export default function AgentLocator() {
  const [searchLocation, setSearchLocation] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Fetch cash agents
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['/api/cash-agents'],
    retry: false,
  });

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  const formatRating = (rating: string | number, totalRatings: number) => {
    const ratingNum = typeof rating === 'string' ? parseFloat(rating) : rating;
    return `${ratingNum.toFixed(1)} (${totalRatings})`;
  };

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
          <Link href="/">
            <Button variant="ghost" className="text-[hsl(207,90%,54%)] p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h2 className="text-xl font-semibold">Cash Agents</h2>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-transparent"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        </div>
      </div>

      <div className="p-4 space-y-4 pb-20">
        {/* Map Placeholder */}
        <div className="bg-slate-200 h-48 rounded-xl flex items-center justify-center">
          <div className="text-center text-slate-500">
            <Map className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Interactive map with agent locations</p>
            <p className="text-xs text-slate-400">Map integration coming soon</p>
          </div>
        </div>

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
          {agents.length > 0 ? (
            agents.map((agent: any) => (
              <Card key={agent.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{agent.businessName}</h3>
                      <p className="text-sm text-slate-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {agent.location}
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
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      disabled={!agent.isOnline}
                      className={`text-sm font-medium ${
                        agent.isOnline 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Cash In
                    </Button>
                    <Button
                      disabled={!agent.isOnline}
                      className={`text-sm font-medium ${
                        agent.isOnline 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Cash Out
                    </Button>
                  </div>
                  
                  {agent.services && (
                    <div className="flex flex-wrap gap-1 mt-2">
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
              <Button className="bg-[hsl(207,90%,54%)] text-white">
                Become an Agent
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
