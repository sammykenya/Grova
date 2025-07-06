import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Lightbulb, 
  DollarSign,
  Plus,
  Heart,
  Eye,
  MessageSquare,
  Play,
  FileText,
  Star,
  Calendar,
  MapPin,
  Building,
  Briefcase,
  Award,
  Filter,
  Search
} from "lucide-react";

interface StartupIdea {
  id: number;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  fundingGoal: string;
  currentFunding: string;
  currency: string;
  minimumInvestment: string;
  equity: string;
  stage: string;
  status: string;
  likesCount: number;
  viewsCount: number;
  tags: string[];
  createdAt: string;
}

interface Investment {
  id: number;
  investorId: string;
  ideaId: number;
  amount: string;
  status: string;
  createdAt: string;
}

export default function FoundersRoom() {
  const [activeTab, setActiveTab] = useState("browse");
  const [showCreateIdea, setShowCreateIdea] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<StartupIdea | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // New idea form state
  const [newIdea, setNewIdea] = useState({
    title: "",
    description: "",
    category: "",
    fundingGoal: "",
    minimumInvestment: "",
    equity: "",
    businessPlan: "",
    tags: ""
  });

  // Investment form state
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investmentTerms, setInvestmentTerms] = useState("");

  const { toast } = useToast();

  // Fetch startup ideas
  const { data: startupIdeas = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/startup-ideas'],
    retry: false,
  });

  // Fetch user investments
  const { data: userInvestments = [] } = useQuery({
    queryKey: ['/api/investments/user'],
    retry: false,
  });

  // Create startup idea mutation
  const createIdeaMutation = useMutation({
    mutationFn: async (ideaData: any) => {
      const response = await fetch('/api/startup-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(ideaData),
      });
      if (!response.ok) throw new Error('Failed to create idea');
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setNewIdea({
        title: "",
        description: "",
        category: "",
        fundingGoal: "",
        minimumInvestment: "",
        equity: "",
        businessPlan: "",
        tags: ""
      });
      setShowCreateIdea(false);
      toast({ title: "Success", description: "Startup idea created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create startup idea", variant: "destructive" });
    }
  });

  // Investment mutation
  const investMutation = useMutation({
    mutationFn: async (investmentData: any) => {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(investmentData),
      });
      if (!response.ok) throw new Error('Failed to invest');
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setInvestmentAmount("");
      setInvestmentTerms("");
      setShowInvestModal(false);
      toast({ title: "Success", description: "Investment submitted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit investment", variant: "destructive" });
    }
  });

  const handleCreateIdea = () => {
    if (!newIdea.title || !newIdea.description || !newIdea.category || !newIdea.fundingGoal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createIdeaMutation.mutate({
      ...newIdea,
      fundingGoal: parseFloat(newIdea.fundingGoal),
      minimumInvestment: parseFloat(newIdea.minimumInvestment) || 1000,
      equity: parseFloat(newIdea.equity) || 0,
      tags: newIdea.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  const handleInvest = () => {
    if (!selectedIdea || !investmentAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter an investment amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(investmentAmount);
    const minInvestment = parseFloat(selectedIdea.minimumInvestment);

    if (amount < minInvestment) {
      toast({
        title: "Investment Too Low",
        description: `Minimum investment is ${formatCurrency(minInvestment)}`,
        variant: "destructive",
      });
      return;
    }

    investMutation.mutate({
      ideaId: selectedIdea.id,
      amount: amount,
      terms: investmentTerms
    });
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `KES ${num.toLocaleString()}`;
  };

  const getFundingProgress = (current: string, goal: string) => {
    return (parseFloat(current) / parseFloat(goal)) * 100;
  };

  const filteredIdeas = startupIdeas.filter((idea: StartupIdea) => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || idea.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(207,90%,54%)] mx-auto mb-4"></div>
          <p>Loading startup ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/more">
              <Button variant="ghost" className="text-[hsl(207,90%,54%)] p-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h2 className="text-xl font-semibold">Founders & Investors Room</h2>
          </div>
          <Dialog open={showCreateIdea} onOpenChange={setShowCreateIdea}>
            <DialogTrigger asChild>
              <Button className="bg-[hsl(207,90%,54%)]">
                <Plus className="w-4 h-4 mr-2" />
                Pitch Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit Startup Idea</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <Label htmlFor="ideaTitle">Title *</Label>
                  <Input
                    id="ideaTitle"
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                    placeholder="Your startup idea title"
                  />
                </div>
                <div>
                  <Label htmlFor="ideaDescription">Description *</Label>
                  <Textarea
                    id="ideaDescription"
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                    placeholder="Describe your startup idea"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ideaCategory">Category *</Label>
                    <Select onValueChange={(value) => setNewIdea({...newIdea, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fintech">FinTech</SelectItem>
                        <SelectItem value="healthtech">HealthTech</SelectItem>
                        <SelectItem value="edtech">EdTech</SelectItem>
                        <SelectItem value="agritech">AgriTech</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fundingGoal">Funding Goal (KES) *</Label>
                    <Input
                      id="fundingGoal"
                      type="number"
                      value={newIdea.fundingGoal}
                      onChange={(e) => setNewIdea({...newIdea, fundingGoal: e.target.value})}
                      placeholder="1000000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minInvestment">Min Investment (KES)</Label>
                    <Input
                      id="minInvestment"
                      type="number"
                      value={newIdea.minimumInvestment}
                      onChange={(e) => setNewIdea({...newIdea, minimumInvestment: e.target.value})}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="equity">Equity Offered (%)</Label>
                    <Input
                      id="equity"
                      type="number"
                      value={newIdea.equity}
                      onChange={(e) => setNewIdea({...newIdea, equity: e.target.value})}
                      placeholder="10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="businessPlan">Business Plan</Label>
                  <Textarea
                    id="businessPlan"
                    value={newIdea.businessPlan}
                    onChange={(e) => setNewIdea({...newIdea, businessPlan: e.target.value})}
                    placeholder="Detailed business plan"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newIdea.tags}
                    onChange={(e) => setNewIdea({...newIdea, tags: e.target.value})}
                    placeholder="mobile payments, fintech, startup"
                  />
                </div>
                <Button 
                  onClick={handleCreateIdea} 
                  className="w-full"
                  disabled={createIdeaMutation.isPending}
                >
                  {createIdeaMutation.isPending ? "Creating..." : "Submit Idea"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Ideas</TabsTrigger>
            <TabsTrigger value="my-ideas">My Ideas</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          </TabsList>

          {/* Browse Ideas */}
          <TabsContent value="browse" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search startup ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="healthtech">HealthTech</SelectItem>
                  <SelectItem value="edtech">EdTech</SelectItem>
                  <SelectItem value="agritech">AgriTech</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Startup Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea: StartupIdea) => (
                <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary">{idea.category}</Badge>
                      <Badge variant={idea.status === 'open' ? 'default' : 'secondary'}>
                        {idea.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {idea.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Funding Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Funding Progress</span>
                        <span>{getFundingProgress(idea.currentFunding, idea.fundingGoal).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(getFundingProgress(idea.currentFunding, idea.fundingGoal), 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>{formatCurrency(idea.currentFunding)}</span>
                        <span>{formatCurrency(idea.fundingGoal)}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {idea.tags?.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {idea.likesCount}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {idea.viewsCount}
                      </span>
                      <span>Min: {formatCurrency(idea.minimumInvestment)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          // View details functionality
                          toast({ title: "Feature Coming Soon", description: "Detailed view will be available soon" });
                        }}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedIdea(idea);
                          setShowInvestModal(true);
                        }}
                      >
                        Invest
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredIdeas.length === 0 && (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Ideas Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || categoryFilter !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Be the first to share your startup idea!"}
                </p>
                <Button onClick={() => setShowCreateIdea(true)}>
                  Submit Your Idea
                </Button>
              </div>
            )}
          </TabsContent>

          {/* My Ideas */}
          <TabsContent value="my-ideas" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your Startup Ideas</h3>
                <p className="text-gray-600 mb-6">
                  Track the performance of your submitted ideas and manage investor interest.
                </p>
                <Button onClick={() => setShowCreateIdea(true)}>
                  Submit New Idea
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investments */}
          <TabsContent value="investments" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <DollarSign className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your Investments</h3>
                <p className="text-gray-600 mb-6">
                  Track your startup investments and returns.
                </p>
                <Button onClick={() => setActiveTab("browse")}>
                  Browse Investment Opportunities
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentorship */}
          <TabsContent value="mentorship" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mentorship Program</h3>
                <p className="text-gray-600 mb-6">
                  Connect with experienced entrepreneurs and industry experts.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Link href="/mentorship">
                    <Button variant="outline" className="w-full">Find a Mentor</Button>
                  </Link>
                  <Link href="/mentorship">
                    <Button variant="outline" className="w-full">Become a Mentor</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Investment Modal */}
      <Dialog open={showInvestModal} onOpenChange={setShowInvestModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest in {selectedIdea?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="investAmount">Investment Amount (KES)</Label>
              <Input
                id="investAmount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder={`Minimum: ${selectedIdea ? formatCurrency(selectedIdea.minimumInvestment) : '0'}`}
              />
            </div>
            <div>
              <Label htmlFor="investTerms">Investment Terms (Optional)</Label>
              <Textarea
                id="investTerms"
                value={investmentTerms}
                onChange={(e) => setInvestmentTerms(e.target.value)}
                placeholder="Any specific terms or conditions"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowInvestModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleInvest}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={investMutation.isPending}
              >
                {investMutation.isPending ? "Processing..." : "Invest Now"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}