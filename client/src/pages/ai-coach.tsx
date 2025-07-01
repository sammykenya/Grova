import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Mic, 
  Play, 
  Send,
  Lightbulb,
  TrendingUp,
  Target,
  PieChart
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AICoach() {
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  // Fetch daily tip
  const { data: dailyTip, isLoading: tipLoading } = useQuery({
    queryKey: ['/api/ai-coach/daily-tip'],
    retry: false,
  });

  // Fetch spending analysis
  const { data: spendingAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['/api/ai-coach/spending-analysis'],
    retry: false,
  });

  // Ask AI question mutation
  const askQuestionMutation = useMutation({
    mutationFn: async (userQuestion: string) => {
      const response = await apiRequest('POST', '/api/ai-coach/ask', {
        question: userQuestion,
        language: 'en'
      });
      return response.json();
    },
    onSuccess: (data) => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date()
        }
      ]);
      setQuestion("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
    },
  });

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    askQuestionMutation.mutate(question);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
      setQuestion("How can I save more money this month?");
      toast({
        title: "Voice Recorded",
        description: "Voice converted to text",
      });
    }, 3000);
  };

  const playVoiceAdvice = () => {
    toast({
      title: "Voice Tip",
      description: "Playing audio advice...",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" className="text-[hsl(207,90%,54%)] p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h2 className="text-xl font-semibold">AI Coach</h2>
          <div className="ml-auto">
            <Button
              variant="ghost"
              onClick={startVoiceRecording}
              className={`text-purple-600 p-0 ${isRecording ? 'voice-recording' : ''}`}
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Today's Tip */}
        {dailyTip && (
          <Card className="ai-coach-gradient text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Today's Tip
                </h3>
                <Button
                  variant="ghost"
                  onClick={playVoiceAdvice}
                  className="bg-white/20 p-2 rounded-full"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-purple-100 mb-4">{dailyTip.tip}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white">
                  💰 {dailyTip.category}
                </Badge>
                {dailyTip.actionable_steps?.slice(0, 2).map((step: string, index: number) => (
                  <Badge key={index} className="bg-white/20 text-white">
                    {step}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Spending Summary */}
        {spendingAnalysis && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Spending Analysis
              </h3>
              
              <div className="space-y-3 mb-4">
                {spendingAnalysis.insights?.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p className="text-sm text-slate-700">{insight}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Savings Potential</span>
                  <span className="text-lg font-bold text-green-600">
                    {spendingAnalysis.savings_potential}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${spendingAnalysis.savings_potential}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Interface */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Mic className="w-5 h-5 mr-2" />
                Voice Assistant
              </h3>
              <div className="text-sm text-slate-500">Available in 12 languages</div>
            </div>
            
            <div className="mb-4">
              <Button 
                onClick={startVoiceRecording}
                disabled={isRecording}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  isRecording 
                    ? 'bg-red-100 text-red-700 voice-recording' 
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                }`}
              >
                <Mic className="w-4 h-4 mr-2" />
                {isRecording ? 'Recording...' : 'Tap to speak'}
              </Button>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600">
              <p><strong>Try saying:</strong></p>
              <p>• "How much did I spend on food this week?"</p>
              <p>• "Send 100 shillings to mama"</p>
              <p>• "What's my savings goal progress?"</p>
            </div>
          </CardContent>
        </Card>

        {/* Chat with AI */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Ask Your Coach
            </h3>
            
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-slate-100 ml-8'
                      : 'bg-purple-100 mr-8'
                  }`}
                >
                  <strong>
                    {message.type === 'user' ? 'You: ' : 'AI Coach: '}
                  </strong>
                  {message.content}
                </div>
              ))}
              
              {chatMessages.length === 0 && (
                <div className="bg-slate-100 p-3 rounded-lg text-sm">
                  <strong>AI Coach:</strong> Hello! I'm here to help you with your financial goals. 
                  Ask me anything about budgeting, saving, or managing your money.
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmitQuestion} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 border-slate-300 focus:ring-purple-500 focus:border-transparent"
              />
              <Button 
                type="submit"
                disabled={askQuestionMutation.isPending || !question.trim()}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
