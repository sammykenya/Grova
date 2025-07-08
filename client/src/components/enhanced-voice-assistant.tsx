import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Settings, 
  MessageSquare,
  Sparkles,
  Brain,
  Zap
} from "lucide-react";

interface EnhancedVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnhancedVoiceAssistant({ isOpen, onClose }: EnhancedVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'assistant';
    message: string;
    timestamp: Date;
  }>>([]);
  const [voiceSettings, setVoiceSettings] = useState({
    language: 'en-US',
    voice: 'female',
    speed: 1.0
  });
  const { toast } = useToast();

  // Advanced voice commands with AI-powered responses
  const advancedCommands = [
    {
      triggers: ['balance', 'money', 'wallet'],
      response: "Your current balance across all wallets is KES 125,000. Your fiat wallet has KES 85,000, crypto wallet has 0.02 BTC, and credits wallet has 2,500 credits.",
      action: () => toast({ title: "Balance Check", description: "Showing your wallet balances" })
    },
    {
      triggers: ['invest', 'investment', 'portfolio'],
      response: "Your investment portfolio is performing well with a 12.5% return this month. Would you like to add more to your diversified portfolio?",
      action: () => window.location.href = '/investments'
    },
    {
      triggers: ['send money', 'transfer', 'payment'],
      response: "I can help you send money. Please specify the amount and recipient, or use the send money feature.",
      action: () => window.location.href = '/send'
    },
    {
      triggers: ['budget', 'expenses', 'spending'],
      response: "You've spent KES 4,200 this month, which is 68% of your budget. Your largest expense category is housing at 40%.",
      action: () => window.location.href = '/budget-planner'
    },
    {
      triggers: ['advice', 'help', 'coach'],
      response: "Based on your spending patterns, I recommend setting aside 20% more for emergency savings and consider investing in low-risk bonds.",
      action: () => window.location.href = '/ai-coach'
    },
    {
      triggers: ['agents', 'cash out', 'withdraw'],
      response: "I found 5 cash agents within 2km of your location. The nearest one is at Nakumatt Supermarket, 500m away.",
      action: () => window.location.href = '/agent-locator'
    }
  ];

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = voiceSettings.language;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);

      if (event.results[current].isFinal) {
        processVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: "Please try again",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Add to conversation history
    const userMessage = { type: 'user' as const, message: command, timestamp: new Date() };
    setConversationHistory(prev => [...prev, userMessage]);

    // Find matching command
    const matchedCommand = advancedCommands.find(cmd => 
      cmd.triggers.some(trigger => lowerCommand.includes(trigger))
    );

    let aiResponse = "";
    if (matchedCommand) {
      aiResponse = matchedCommand.response;
      if (matchedCommand.action) {
        setTimeout(matchedCommand.action, 2000);
      }
    } else {
      // AI-powered fallback responses
      const contextualResponses = [
        "I understand you're asking about financial matters. Let me connect you with our AI coach for personalized advice.",
        "That's an interesting question! Our financial tools can help you with budgeting, investments, and money management.",
        "For specific financial queries, I recommend checking your dashboard or speaking with our certified advisors.",
        "I'm here to help with your financial journey. Try asking about your balance, investments, or budget."
      ];
      aiResponse = contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
    }

    setResponse(aiResponse);
    
    // Add AI response to conversation
    const assistantMessage = { type: 'assistant' as const, message: aiResponse, timestamp: new Date() };
    setConversationHistory(prev => [...prev, assistantMessage]);

    // Speak the response
    speakResponse(aiResponse);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSettings.speed;
      utterance.lang = voiceSettings.language;
      
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen')
      );
      
      if (femaleVoice && voiceSettings.voice === 'female') {
        utterance.voice = femaleVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="neo-modal max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="grova-headline text-center flex items-center justify-center">
            <Brain className="w-6 h-6 mr-2 text-[hsl(207,90%,54%)]" />
            AI Voice Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Voice Status */}
          <div className="text-center">
            <div className={`neo-fab mx-auto mb-4 ${isListening ? 'animate-pulse' : ''}`}>
              {isListening ? (
                <Mic className="w-6 h-6" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </div>
            <p className="grova-body text-gray-600">
              {isListening ? "I'm listening..." : "Tap to start voice command"}
            </p>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="neo-inset p-4">
              <p className="grova-body text-sm">
                <span className="text-gray-500">You said:</span><br />
                "{transcript}"
              </p>
            </div>
          )}

          {/* AI Response */}
          {response && (
            <div className="neo-card-small p-4 border-[hsl(207,90%,54%)] border-2">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-[hsl(207,90%,54%)] flex-shrink-0 mt-1" />
                <p className="grova-body text-sm">{response}</p>
              </div>
            </div>
          )}

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="neo-inset p-4 max-h-32 overflow-y-auto">
              <h4 className="grova-section-title mb-2 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Conversation
              </h4>
              <div className="space-y-2">
                {conversationHistory.slice(-3).map((msg, index) => (
                  <div key={index} className={`text-xs p-2 rounded ${
                    msg.type === 'user' 
                      ? 'bg-[hsl(207,90%,54%)]/10 text-[hsl(207,90%,54%)]' 
                      : 'bg-[hsl(25,85%,53%)]/10 text-[hsl(25,85%,53%)]'
                  }`}>
                    <span className="font-semibold">
                      {msg.type === 'user' ? 'You' : 'AI'}:
                    </span> {msg.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={startListening}
              disabled={isListening}
              className="neo-button-primary neo-ripple"
            >
              <Mic className="w-4 h-4 mr-2" />
              {isListening ? 'Listening...' : 'Start Voice'}
            </Button>
            
            <Button
              onClick={() => speakResponse("Hello! I'm your AI assistant. How can I help you today?")}
              className="neo-button-secondary neo-ripple"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Test Voice
            </Button>
          </div>

          {/* Quick Commands */}
          <div className="neo-card-small p-4">
            <h4 className="grova-section-title mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-[hsl(25,85%,53%)]" />
              Quick Commands
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-gray-50 rounded">
                <strong>"Check balance"</strong><br />
                View wallet status
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <strong>"Send money"</strong><br />
                Transfer funds
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <strong>"Investment advice"</strong><br />
                Get AI coaching
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <strong>"Find agents"</strong><br />
                Locate cash points
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}