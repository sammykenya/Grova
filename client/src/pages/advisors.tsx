import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MessageCircle, Phone, Video, Clock, Award, TrendingUp } from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";

// Import the professional advisor images
import advisor1 from "@assets/assets_task_01jz41n37vf9hafxpkfkbm1g6q_1751409047_img_0_1751409140962.webp";
import advisor2 from "@assets/assets_task_01jz41n37vf9hafxpkfkbm1g6q_1751409047_img_1_1751409140891.webp";
import advisor3 from "@assets/assets_task_01jz407qnje9daejy4r5s2kgps_1751407479_img_0_1751409140999.webp";
import advisor4 from "@assets/assets_task_01jz407qnje9daejy4r5s2kgps_1751407479_img_1_1751409141040.webp";
import advisor5 from "@assets/A 4K ultra-realistic, full-body portrait of a professional individual standing naturally in a neutral stud...ng, sharp focus on facial features and hands, soft depth of field that keeps the entire body in focus, photorealism style._1751409141073.png";

interface Advisor {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  reviews: number;
  hourlyRate: number;
  currency: string;
  languages: string[];
  availability: string;
  image: string;
  experience: string;
  bio: string;
  achievements: string[];
}

const advisors: Advisor[] = [
  {
    id: "1",
    name: "Dr. Amara Okafor",
    title: "Senior Financial Strategist",
    specialties: ["Investment Planning", "Wealth Management", "Retirement Planning"],
    rating: 4.9,
    reviews: 247,
    hourlyRate: 150,
    currency: "USD",
    languages: ["English", "Swahili", "French"],
    availability: "Available Now",
    image: advisor1,
    experience: "15+ years",
    bio: "Dr. Okafor specializes in comprehensive financial planning for emerging markets. She has helped over 1,000 clients build sustainable wealth through strategic investment and savings plans.",
    achievements: ["Forbes Top 40 Under 40", "CFA Charter Holder", "PhD in Financial Economics"]
  },
  {
    id: "2", 
    name: "Sarah Mwangi",
    title: "Microfinance Expert",
    specialties: ["Small Business Finance", "Community Banking", "Mobile Money"],
    rating: 4.8,
    reviews: 189,
    hourlyRate: 85,
    currency: "USD",
    languages: ["English", "Swahili", "Kikuyu"],
    availability: "Available Today",
    image: advisor2,
    experience: "8+ years",
    bio: "Sarah focuses on financial inclusion and helps small business owners and entrepreneurs access capital and manage cash flow effectively.",
    achievements: ["Microfinance Leader Award", "Certified Financial Planner", "TEDx Speaker"]
  },
  {
    id: "3",
    name: "James Richardson",
    title: "Investment Banking Director", 
    specialties: ["Corporate Finance", "Mergers & Acquisitions", "Capital Markets"],
    rating: 4.7,
    reviews: 156,
    hourlyRate: 300,
    currency: "USD",
    languages: ["English", "German", "French"],
    availability: "Available Tomorrow",
    image: advisor3,
    experience: "20+ years",
    bio: "James brings two decades of Wall Street experience to help high-net-worth individuals and corporations with complex financial structures and investment strategies.",
    achievements: ["Former Goldman Sachs VP", "Harvard MBA", "Chartered Financial Analyst"]
  },
  {
    id: "4",
    name: "Grace Nyong",
    title: "Cryptocurrency & DeFi Specialist",
    specialties: ["Blockchain Finance", "DeFi Protocols", "Crypto Trading"],
    rating: 4.6,
    reviews: 98,
    hourlyRate: 120,
    currency: "USD", 
    languages: ["English", "Swahili", "Spanish"],
    availability: "Available Now",
    image: advisor4,
    experience: "5+ years",
    bio: "Grace is a pioneer in cryptocurrency adoption in Africa. She helps clients navigate the digital asset landscape safely and profitably.",
    achievements: ["Blockchain Expert Certification", "Crypto Trading Champion", "DeFi Protocol Advisor"]
  },
  {
    id: "5",
    name: "Marcus Thompson",
    title: "Financial Technology Consultant",
    specialties: ["Fintech Innovation", "Digital Banking", "API Integration"], 
    rating: 4.8,
    reviews: 134,
    hourlyRate: 200,
    currency: "USD",
    languages: ["English", "Mandarin", "Spanish"],
    availability: "Available This Week",
    image: advisor5,
    experience: "12+ years",
    bio: "Marcus specializes in fintech solutions and helps businesses integrate modern financial technologies to improve efficiency and customer experience.",
    achievements: ["Former PayPal Director", "MIT Technology Review Innovator", "Fintech Startup Advisor"]
  }
];

export default function Advisors() {
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredAdvisors = advisors.filter(advisor => {
    if (activeTab === "all") return true;
    if (activeTab === "investment") return advisor.specialties.some(s => s.toLowerCase().includes("investment") || s.toLowerCase().includes("wealth"));
    if (activeTab === "business") return advisor.specialties.some(s => s.toLowerCase().includes("business") || s.toLowerCase().includes("corporate"));
    if (activeTab === "crypto") return advisor.specialties.some(s => s.toLowerCase().includes("crypto") || s.toLowerCase().includes("blockchain"));
    return true;
  });

  const handleBookConsultation = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    // In a real app, this would open a booking modal or redirect to calendar
    alert(`Booking consultation with ${advisor.name}. This feature will redirect to calendar scheduling.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Professional Financial Advisors
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with certified financial experts who understand emerging markets and can guide your wealth journey
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All Experts</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="crypto">Crypto & DeFi</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAdvisors.map((advisor) => (
                <Card key={advisor.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 relative">
                      <Avatar className="w-24 h-24 border-4 border-blue-200 dark:border-blue-800">
                        <AvatarImage 
                          src={advisor.image} 
                          alt={advisor.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {advisor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Online
                      </div>
                    </div>
                    <CardTitle className="text-xl">{advisor.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {advisor.title}
                    </CardDescription>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{advisor.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({advisor.reviews} reviews)</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {advisor.specialties.slice(0, 2).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {advisor.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{advisor.specialties.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                        <span className="font-medium">{advisor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                        <span className="font-bold text-green-600">${advisor.hourlyRate}/hour</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Languages:</span>
                        <span className="font-medium">{advisor.languages.join(", ")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {advisor.availability}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => alert("Chat feature coming soon!")}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => alert("Phone feature coming soon!")}
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => alert("Video feature coming soon!")}
                      >
                        <Video className="w-4 h-4" />
                        Video
                      </Button>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={() => handleBookConsultation(advisor)}
                    >
                      Book Consultation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Success Metrics Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-0">
            <CardContent className="pt-6">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">98%</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-0">
            <CardContent className="pt-6">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">500+</div>
              <div className="text-sm text-green-600 dark:text-green-400">Clients Served</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-0">
            <CardContent className="pt-6">
              <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">4.8</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Avg Rating</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 border-0">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">24/7</div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Available</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation currentPage="advisors" />
    </div>
  );
}