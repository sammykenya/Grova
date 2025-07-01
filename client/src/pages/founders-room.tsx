import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye,
  DollarSign,
  Calendar,
  Target,
  Rocket,
  Building,
  Zap,
  Award,
  Plus,
  Filter,
  Search,
  ArrowLeft,
  PlayCircle,
  FileText,
  Star
} from "lucide-react";
import { Link } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";
import { useAuth } from "@/hooks/useAuth";

interface StartupIdea {
  id: number;
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  currentFunding: number;
  currency: string;
  minimumInvestment: number;
  equity: number;
  stage: string;
  status: string;
  deadline: string;
  tags: string[];
  likesCount: number;
  viewsCount: number;
  creatorName: string;
  creatorImage: string;
  businessPlan?: string;
  pitchVideo?: string;
}

export default function FoundersRoom() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  const featuredIdeas: StartupIdea[] = [
    {
      id: 1,
      title: "AgriTech IoT Platform",
      description: "Smart farming solution using IoT sensors to optimize crop yields and reduce water usage by 40%. Our platform helps smallholder farmers in Kenya increase productivity through data-driven insights.",
      category: "Agriculture",
      fundingGoal: 2500000,
      currentFunding: 890000,
      currency: "KES",
      minimumInvestment: 5000,
      equity: 15,
      stage: "MVP",
      status: "open",
      deadline: "2025-08-15",
      tags: ["IoT", "Agriculture", "Sustainability", "Kenya"],
      likesCount: 247,
      viewsCount: 1823,
      creatorName: "Sarah Kimani",
      creatorImage: "/api/placeholder/40/40",
      businessPlan: "Comprehensive 5-year business plan available",
      pitchVideo: "https://example.com/pitch1"
    },
    {
      id: 2,
      title: "MobilePay for Rural Kenya",
      description: "Revolutionary mobile payment solution designed specifically for rural communities with limited internet connectivity. Works offline and syncs when connection is available.",
      category: "Fintech",
      fundingGoal: 5000000,
      currentFunding: 2100000,
      currency: "KES",
      minimumInvestment: 10000,
      equity: 12,
      stage: "Prototype",
      status: "open",
      deadline: "2025-09-20",
      tags: ["Fintech", "Mobile", "Rural", "Offline"],
      likesCount: 389,
      viewsCount: 2841,
      creatorName: "David Mwangi",
      creatorImage: "/api/placeholder/40/40",
      businessPlan: "Detailed market analysis included",
      pitchVideo: "https://example.com/pitch2"
    },
    {
      id: 3,
      title: "Solar-Powered Water Purification",
      description: "Affordable solar-powered water purification systems for remote communities. Each unit can serve 500 people and reduces waterborne diseases by 95%.",
      category: "Healthcare",
      fundingGoal: 1800000,
      currentFunding: 750000,
      currency: "KES",
      minimumInvestment: 2500,
      equity: 20,
      stage: "Prototype",
      status: "open",
      deadline: "2025-07-30",
      tags: ["Healthcare", "Solar", "Water", "Social Impact"],
      likesCount: 156,
      viewsCount: 1234,
      creatorName: "Grace Nyong'o",
      creatorImage: "/api/placeholder/40/40",
      businessPlan: "Impact assessment report available"
    }
  ];

  const categories = [
    "All", "Fintech", "Agriculture", "Healthcare", "Education", 
    "Technology", "Manufacturing", "Retail", "Energy", "Transport"
  ];

  const filteredIdeas = featuredIdeas.filter(idea => {
    const matchesCategory = selectedCategory === "all" || idea.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const CreateIdeaForm = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Startup Title</label>
        <Input placeholder="Enter your startup idea title" />
      </div>
      <div>
        <label className="text-sm font-medium">Category</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.slice(1).map(category => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Describe your startup idea, problem it solves, and target market..." 
          rows={4}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Funding Goal (KES)</label>
          <Input type="number" placeholder="2500000" />
        </div>
        <div>
          <label className="text-sm font-medium">Equity Offered (%)</label>
          <Input type="number" placeholder="15" max="100" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Minimum Investment (KES)</label>
          <Input type="number" placeholder="5000" />
        </div>
        <div>
          <label className="text-sm font-medium">Development Stage</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="prototype">Prototype</SelectItem>
              <SelectItem value="mvp">MVP</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Tags (comma separated)</label>
        <Input placeholder="fintech, mobile, kenya, innovation" />
      </div>
      <div className="flex gap-2 pt-4">
        <Button className="flex-1">Submit for Review</Button>
        <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/more">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Founders Investor Room
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Where revolutionary ideas meet smart capital
            </p>
          </div>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Submit Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Your Startup Idea</DialogTitle>
                <DialogDescription>
                  Share your revolutionary idea with potential investors and get funding to bring it to life.
                </DialogDescription>
              </DialogHeader>
              <CreateIdeaForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Ideas</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <Lightbulb className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Funding</p>
                  <p className="text-2xl font-bold">KES 45M</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Success Rate</p>
                  <p className="text-2xl font-bold">73%</p>
                </div>
                <Target className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Active Investors</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <Users className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="funded">Funded</TabsTrigger>
            <TabsTrigger value="my-ideas">My Ideas</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ideas, tags, or creators..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Featured Ideas */}
            <div className="space-y-6">
              {filteredIdeas.map((idea) => (
                <Card key={idea.id} className="hover:shadow-xl transition-shadow duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {idea.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {idea.stage}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${idea.status === 'open' ? 'text-green-600' : 'text-gray-600'}`}>
                            {idea.status === 'open' ? 'Open' : 'Closed'}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{idea.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {idea.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {formatCurrency(idea.currentFunding)} of {formatCurrency(idea.fundingGoal)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(idea.currentFunding, idea.fundingGoal)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{getProgressPercentage(idea.currentFunding, idea.fundingGoal).toFixed(1)}% funded</span>
                        <span>{getDaysLeft(idea.deadline)} days left</span>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Min Investment</p>
                        <p className="font-semibold">{formatCurrency(idea.minimumInvestment)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Equity Offered</p>
                        <p className="font-semibold">{idea.equity}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Likes</p>
                        <p className="font-semibold">{idea.likesCount}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Views</p>
                        <p className="font-semibold">{idea.viewsCount}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Creator & Actions */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white font-semibold">
                          {idea.creatorName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{idea.creatorName}</p>
                          <p className="text-xs text-gray-500">Founder</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="w-4 h-4 mr-1" />
                          Like
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          <Rocket className="w-4 h-4 mr-2" />
                          Invest Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trending Ideas</h3>
              <p className="text-gray-600">Most liked and viewed startup ideas this week</p>
            </div>
          </TabsContent>

          <TabsContent value="funded" className="space-y-6">
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Successfully Funded</h3>
              <p className="text-gray-600">Ideas that have reached their funding goals</p>
            </div>
          </TabsContent>

          <TabsContent value="my-ideas" className="space-y-6">
            <div className="text-center py-12">
              <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your Ideas</h3>
              <p className="text-gray-600 mb-4">Track your submitted ideas and their progress</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Your First Idea
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation currentPage="more" />
    </div>
  );
}