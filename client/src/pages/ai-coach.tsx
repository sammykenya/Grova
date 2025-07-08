import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Mic, 
  Play, 
  Send,
  Lightbulb,
  TrendingUp,
  Target,
  PieChart,
  Brain,
  Star,
  Award,
  BookOpen,
  Clock,
  DollarSign,
  Shield,
  Zap
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from "recharts";
import { apiRequest } from "@/lib/queryClient";

export default function AICoach() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Mock data for charts
  const financialHealthData = [
    { subject: 'Savings', A: 85, fullMark: 100 },
    { subject: 'Investment', A: 72, fullMark: 100 },
    { subject: 'Debt Management', A: 90, fullMark: 100 },
    { subject: 'Emergency Fund', A: 45, fullMark: 100 },
    { subject: 'Credit Score', A: 88, fullMark: 100 }
  ];

  const spendingData = [
    { month: 'Jan', essential: 45000, leisure: 15000, savings: 25000 },
    { month: 'Feb', essential: 48000, leisure: 12000, savings: 28000 },
    { month: 'Mar', essential: 46000, leisure: 18000, savings: 22000 },
    { month: 'Apr', essential: 47000, leisure: 16000, savings: 24000 },
    { month: 'May', essential: 49000, leisure: 14000, savings: 26000 },
    { month: 'Jun', essential: 45000, leisure: 13000, savings: 30000 }
  ];

  const goalData = [
    { name: 'Emergency Fund', progress: 45, target: 500000, current: 225000 },
    { name: 'House Down Payment', progress: 72, target: 2000000, current: 1440000 },
    { name: 'Investment Portfolio', progress: 85, target: 1000000, current: 850000 },
    { name: 'Education Fund', progress: 40, target: 800000, current: 320000 }
  ];

  const COLORS = ['#1D4ED8', '#EA580C', '#DC2626', '#059669'];

  const { data: dailyTip } = useQuery({
    queryKey: ['/api/ai-coach/daily-tip'],
    retry: false,
  });

  const askCoachMutation = useMutation({
    mutationFn: async (question: string) => {
      return await apiRequest('POST', '/api/ai-coach/ask', { question });
    },
    onSuccess: (data) => {
      toast({
        title: "AI Coach Response",
        description: data.advice,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Unable to get advice at the moment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAskQuestion = () => {
    if (question.trim()) {
      askCoachMutation.mutate(question);
      setQuestion("");
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice Input",
        description: "Listening... Ask your financial question",
      });

      setTimeout(() => {
        setIsListening(false);
        setQuestion("How can I improve my savings rate?");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-grova-blue text-white px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/more">
            <Button variant="ghost" className="text-white p-0 hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="grova-headline text-white text-xl mb-2">AI Financial Coach</h1>
            <p className="grova-body text-white/90 text-sm">Personalized financial guidance powered by AI</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-grova-blue text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Financial Health</p>
                <p className="grova-data text-white text-2xl font-black">8.2/10</p>
              </div>
              <Brain className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-grova-orange text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Savings Rate</p>
                <p className="grova-data text-white text-2xl font-black">32%</p>
              </div>
              <Target className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Goals on Track</p>
                <p className="grova-data text-white text-2xl font-black">3/4</p>
              </div>
              <Award className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-purple-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">AI Score</p>
                <p className="grova-data text-white text-2xl font-black">1,250</p>
              </div>
              <Star className="w-8 h-8" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Financial Health Chart */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Financial Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={financialHealthData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ subject, A }) => `${subject}: ${A}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="A"
                      >
                        {financialHealthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Spending Pattern */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Spending Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={spendingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="essential" fill="#DC2626" />
                      <Bar dataKey="leisure" fill="#EA580C" />
                      <Bar dataKey="savings" fill="#059669" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Daily Tip */}
              {dailyTip && (
                <Card className="bg-gradient-to-r from-grova-orange to-orange-600 text-white p-6 rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center">
                      <Lightbulb className="w-6 h-6 mr-3" />
                      Today's AI Tip
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="grova-body text-white mb-4">
                      {dailyTip.tip}
                    </p>
                    <Button variant="ghost" className="text-white hover:bg-white/20">
                      <Play className="w-4 h-4 mr-2" />
                      Listen to Tip
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* AI Chat */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Ask Your AI Coach</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask about investments, budgeting, goals..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleVoiceInput}
                      variant="outline"
                      className={`${isListening ? 'bg-red-500 text-white' : ''}`}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleAskQuestion} className="bg-grova-blue hover:bg-blue-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">Quick Questions:</p>
                    <div className="space-y-2">
                      {[
                        "How can I improve my credit score?",
                        "What's the best investment strategy for my age?",
                        "How much should I save for emergencies?",
                        "Should I pay off debt or invest first?"
                      ].map((q, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="text-left justify-start w-full text-sm"
                          onClick={() => setQuestion(q)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">AI Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Spending Optimization</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          You spend 18% more on leisure activities compared to similar income groups. Consider reducing by KSh 5,000/month.
                        </p>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">High Impact</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Investment Strategy</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Your portfolio is underexposed to growth assets. Consider allocating 15% more to equity investments.
                        </p>
                        <Badge className="bg-green-100 text-green-800 text-xs">Medium Impact</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-6 h-6 text-orange-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Emergency Fund</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Your emergency fund covers only 3.2 months of expenses. Aim for 6-8 months coverage.
                        </p>
                        <Badge className="bg-orange-100 text-orange-800 text-xs">High Priority</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Goal Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goalData.map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">{goal.name}</span>
                          <span className="text-sm text-gray-600">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>KSh {goal.current.toLocaleString()}</span>
                          <span>KSh {goal.target.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="learning">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Learning Modules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Personal Budgeting", progress: 95, duration: "2 hours" },
                    { title: "Investment Basics", progress: 78, duration: "3 hours" },
                    { title: "Debt Management", progress: 60, duration: "1.5 hours" },
                    { title: "Retirement Planning", progress: 45, duration: "4 hours" },
                    { title: "Tax Optimization", progress: 25, duration: "2.5 hours" }
                  ].map((module, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-5 h-5 text-grova-blue" />
                          <span className="font-semibold text-gray-900">{module.title}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{module.duration}</span>
                        </div>
                      </div>
                      <Progress value={module.progress} className="mb-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{module.progress}% complete</span>
                        <Button size="sm" variant="outline">
                          {module.progress === 100 ? 'Review' : 'Continue'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Savings Champion", desc: "Saved 25% of income for 3 months", earned: true },
                    { title: "Investment Pioneer", desc: "Made your first investment", earned: true },
                    { title: "Budget Master", desc: "Stayed within budget for 6 months", earned: true },
                    { title: "Debt Free", desc: "Paid off all consumer debt", earned: false },
                    { title: "Emergency Ready", desc: "Build 6-month emergency fund", earned: false }
                  ].map((achievement, index) => (
                    <div key={index} className={`p-4 rounded-xl ${achievement.earned ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-3">
                        <Award className={`w-6 h-6 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                        <div>
                          <p className={`font-semibold ${achievement.earned ? 'text-green-900' : 'text-gray-600'}`}>
                            {achievement.title}
                          </p>
                          <p className={`text-sm ${achievement.earned ? 'text-green-700' : 'text-gray-500'}`}>
                            {achievement.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}