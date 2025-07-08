
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";
import { apiRequest } from "@/lib/queryClient";

export default function AICoach() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Financial health score data
  const financialHealthData = [
    { name: 'Savings', value: 85, fullMark: 100, color: '#059669' },
    { name: 'Investment', value: 72, fullMark: 100, color: '#1D4ED8' },
    { name: 'Debt Management', value: 90, fullMark: 100, color: '#EA580C' },
    { name: 'Emergency Fund', value: 45, fullMark: 100, color: '#DC2626' },
    { name: 'Credit Score', value: 88, fullMark: 100, color: '#7C3AED' }
  ];

  // Spending pattern analysis
  const spendingPatternData = [
    { month: 'Jan', essential: 45000, leisure: 15000, savings: 25000, investment: 15000 },
    { month: 'Feb', essential: 48000, leisure: 12000, savings: 28000, investment: 12000 },
    { month: 'Mar', essential: 46000, leisure: 18000, savings: 22000, investment: 14000 },
    { month: 'Apr', essential: 47000, leisure: 16000, savings: 24000, investment: 13000 },
    { month: 'May', essential: 49000, leisure: 14000, savings: 26000, investment: 11000 },
    { month: 'Jun', essential: 45000, leisure: 13000, savings: 30000, investment: 12000 }
  ];

  // Goal progress tracking
  const goalProgressData = [
    { goal: 'Emergency Fund', target: 500000, current: 225000, progress: 45, color: '#DC2626' },
    { goal: 'House Down Payment', target: 2000000, current: 1440000, progress: 72, color: '#1D4ED8' },
    { goal: 'Investment Portfolio', target: 1000000, current: 850000, progress: 85, color: '#059669' },
    { goal: 'Education Fund', target: 800000, current: 320000, progress: 40, color: '#EA580C' },
    { goal: 'Retirement Savings', target: 5000000, current: 1250000, progress: 25, color: '#7C3AED' }
  ];

  // AI insights and recommendations
  const aiInsights = [
    {
      category: 'Spending Optimization',
      insight: 'You spend 18% more on leisure activities compared to similar income groups. Consider reducing by KSh 5,000/month.',
      impact: 'Save KSh 60,000 annually',
      priority: 'high',
      action: 'Set a monthly leisure budget limit'
    },
    {
      category: 'Investment Strategy',
      insight: 'Your portfolio is underexposed to growth assets. Consider allocating 15% more to equity investments.',
      impact: 'Potential 4.2% higher returns',
      priority: 'medium',
      action: 'Rebalance portfolio allocation'
    },
    {
      category: 'Emergency Fund',
      insight: 'Your emergency fund covers only 3.2 months of expenses. Financial experts recommend 6-8 months.',
      impact: 'Improved financial security',
      priority: 'high',
      action: 'Increase automatic savings by KSh 8,000/month'
    },
    {
      category: 'Tax Optimization',
      insight: 'You can save KSh 45,000 in taxes by maximizing your pension contributions.',
      impact: 'Save KSh 45,000 annually',
      priority: 'medium',
      action: 'Increase pension contributions to maximum allowable'
    }
  ];

  // Learning modules progress
  const learningModules = [
    { title: 'Personal Budgeting Mastery', progress: 95, duration: '2 hours', rating: 4.8, completed: true },
    { title: 'Investment Fundamentals', progress: 78, duration: '3 hours', rating: 4.9, completed: false },
    { title: 'Debt Management Strategies', progress: 100, duration: '1.5 hours', rating: 4.7, completed: true },
    { title: 'Retirement Planning', progress: 45, duration: '4 hours', rating: 4.6, completed: false },
    { title: 'Tax Optimization', progress: 25, duration: '2.5 hours', rating: 4.5, completed: false },
    { title: 'Real Estate Investing', progress: 0, duration: '5 hours', rating: 4.8, completed: false }
  ];

  // Achievement data
  const achievements = [
    { title: 'Savings Champion', description: 'Saved more than 25% of income for 3 months', earned: true, points: 500 },
    { title: 'Investment Pioneer', description: 'Made your first investment', earned: true, points: 300 },
    { title: 'Budget Master', description: 'Stayed within budget for 6 months', earned: true, points: 750 },
    { title: 'Debt Free', description: 'Paid off all consumer debt', earned: false, points: 1000 },
    { title: 'Emergency Ready', description: 'Build 6-month emergency fund', earned: false, points: 800 },
    { title: 'Portfolio Diversifier', description: 'Invest in 5+ different assets', earned: false, points: 600 }
  ];

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {`${entry.dataKey}: KSh ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Bold Blue Header */}
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
                <p className="grova-body text-white/80 text-sm">Excellent</p>
              </div>
              <Brain className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-grova-orange text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Savings Rate</p>
                <p className="grova-data text-white text-2xl font-black">32%</p>
                <p className="grova-body text-white/80 text-sm">Above Average</p>
              </div>
              <Target className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">Goals on Track</p>
                <p className="grova-data text-white text-2xl font-black">3/5</p>
                <p className="grova-body text-white/80 text-sm">Good Progress</p>
              </div>
              <Award className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-purple-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="grova-body text-white/80 mb-2">AI Score</p>
                <p className="grova-data text-white text-2xl font-black">1,250</p>
                <p className="grova-body text-white/80 text-sm">Learning Points</p>
              </div>
              <Star className="w-8 h-8" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Financial Health Radar */}
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Financial Health Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={financialHealthData}>
                      <RadialBar 
                        minAngle={15} 
                        label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }} 
                        background 
                        clockWise 
                        dataKey="value" 
                      />
                      <Legend 
                        iconSize={12} 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center" 
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Spending Pattern Analysis */}
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Spending Pattern Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={spendingPatternData}>
                      <defs>
                        <linearGradient id="essentialGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="leisureGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#666' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#666' }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="essential" stackId="1" stroke="#DC2626" fill="url(#essentialGradient)" name="Essential" />
                      <Area type="monotone" dataKey="leisure" stackId="1" stroke="#EA580C" fill="url(#leisureGradient)" name="Leisure" />
                      <Area type="monotone" dataKey="savings" stackId="1" stroke="#059669" fill="url(#savingsGradient)" name="Savings" />
                      <Area type="monotone" dataKey="investment" stackId="1" stroke="#1D4ED8" fill="url(#investmentGradient)" name="Investment" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Daily Tip and AI Chat */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Enhanced Daily Tip */}
              {dailyTip && (
                <Card className="bg-gradient-to-br from-grova-orange to-orange-600 text-white p-6 rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center">
                      <Lightbulb className="w-6 h-6 mr-3" />
                      Today's AI Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="grova-body text-white mb-4 text-base leading-relaxed">
                      {dailyTip.tip}
                    </p>
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" className="text-white hover:bg-white/20 p-0">
                        <Play className="w-5 h-5 mr-2" />
                        Listen to Tip
                      </Button>
                      <Badge className="bg-white/20 text-white">
                        Personalized
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Chat Interface */}
              <Card className="neo-card p-6">
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
                          className="text-left justify-start w-full text-sm text-gray-600 hover:text-grova-blue"
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
              {aiInsights.map((insight, index) => (
                <Card key={index} className="neo-card p-6">
                  <CardContent>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          insight.priority === 'high' ? 'bg-red-100 text-red-600' :
                          insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {insight.category === 'Spending Optimization' ? <DollarSign className="w-5 h-5" /> :
                           insight.category === 'Investment Strategy' ? <TrendingUp className="w-5 h-5" /> :
                           insight.category === 'Emergency Fund' ? <Shield className="w-5 h-5" /> :
                           <Zap className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{insight.category}</h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              insight.priority === 'high' ? 'border-red-500 text-red-600' :
                              insight.priority === 'medium' ? 'border-yellow-500 text-yellow-600' :
                              'border-green-500 text-green-600'
                            }`}
                          >
                            {insight.priority} priority
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" className="bg-grova-blue hover:bg-blue-700">
                        Take Action
                      </Button>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{insight.insight}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-green-800">Expected Impact</p>
                        <p className="text-sm text-green-700">{insight.impact}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-blue-800">Recommended Action</p>
                        <p className="text-sm text-blue-700">{insight.action}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Learning Progress */}
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Learning Modules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {learningModules.map((module, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-grova-blue transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            module.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {module.completed ? <Award className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{module.title}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{module.duration}</span>
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="ml-1">{module.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant={module.completed ? "outline" : "default"}>
                          {module.completed ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                      <Progress value={module.progress} className="mb-2" />
                      <p className="text-xs text-gray-600">{module.progress}% complete</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`p-4 border rounded-xl ${
                      achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            achievement.earned ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`font-semibold ${achievement.earned ? 'text-green-900' : 'text-gray-600'}`}>
                              {achievement.title}
                            </p>
                            <p className={`text-sm ${achievement.earned ? 'text-green-700' : 'text-gray-500'}`}>
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`}>
                            {achievement.points} pts
                          </p>
                          {achievement.earned && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Earned</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals">
            <div className="space-y-6">
              <Card className="neo-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="grova-section-title">Financial Goals Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={goalProgressData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#666' }} />
                      <YAxis type="category" dataKey="goal" tick={{ fontSize: 12, fill: '#666' }} width={150} />
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, 'Progress']}
                        labelFormatter={(label) => `Goal: ${label}`}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '12px'
                        }}
                      />
                      <Bar dataKey="progress" fill="#1D4ED8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {goalProgressData.map((goal, index) => (
                  <Card key={index} className="neo-card p-6">
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{goal.goal}</h3>
                        <Badge style={{ backgroundColor: goal.color, color: 'white' }}>
                          {goal.progress}%
                        </Badge>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>KSh {goal.current.toLocaleString()}</span>
                          <span>KSh {goal.target.toLocaleString()}</span>
                        </div>
                        <Progress value={goal.progress} className="h-3" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          KSh {(goal.target - goal.current).toLocaleString()} remaining
                        </span>
                        <Button size="sm" variant="outline">
                          Adjust Goal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
