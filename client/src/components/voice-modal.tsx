import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  Square,
  Volume2,
  Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { processVoiceCommand, startSpeechRecognition, stopSpeechRecognition } from "@/lib/voiceUtils";

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceModal({ isOpen, onClose }: VoiceModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [commandResult, setCommandResult] = useState<any>(null);
  const { toast } = useToast();

  // Process voice command mutation
  const processCommandMutation = useMutation({
    mutationFn: async (audioText: string) => {
      const response = await apiRequest('POST', '/api/voice/process', {
        audioText,
        language: 'en'
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCommandResult(data);
      if (data.confidence > 0.7) {
        toast({
          title: "Command Understood",
          description: data.action,
        });
      } else {
        toast({
          title: "Command Unclear",
          description: "Please try speaking more clearly",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Voice Processing Failed",
        description: "Unable to process voice command",
        variant: "destructive",
      });
    },
  });

  // Timer effect for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsRecording(false);
      setRecordingTime(0);
      setTranscription("");
      setCommandResult(null);
    }
  }, [isOpen]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);
      setTranscription("");
      setCommandResult(null);
      
      const result = await startSpeechRecognition();
      setTranscription(result);
      
      // Process the transcription
      if (result) {
        processCommandMutation.mutate(result);
      }
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Unable to access microphone",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    stopSpeechRecognition();
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <div className="text-center p-6">
          {/* Recording State */}
          {isRecording && (
            <div className="mb-6">
              <div className={`w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isRecording ? 'voice-recording' : ''
              }`}>
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Listening...</h3>
              <p className="text-sm text-slate-600 mb-2">
                Speak naturally in your preferred language
              </p>
              <Badge variant="secondary" className="text-red-600">
                {formatTime(recordingTime)}
              </Badge>
            </div>
          )}

          {/* Initial State */}
          {!isRecording && !transcription && !commandResult && (
            <div className="mb-6">
              <div className="w-20 h-20 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Voice Assistant</h3>
              <p className="text-sm text-slate-600 mb-4">
                Tap to start voice commands
              </p>
              <div className="space-y-2 text-xs text-slate-500">
                <p><strong>Try saying:</strong></p>
                <p>• "Send 100 shillings to mama"</p>
                <p>• "Check my balance"</p>
                <p>• "Convert crypto to fiat"</p>
              </div>
            </div>
          )}

          {/* Transcription Display */}
          {transcription && (
            <div className="mb-4 p-3 bg-slate-100 rounded-lg">
              <p className="text-sm font-medium mb-1">You said:</p>
              <p className="text-sm text-slate-700">"{transcription}"</p>
            </div>
          )}

          {/* Command Result */}
          {commandResult && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Command Result:</p>
                <Badge 
                  variant="secondary" 
                  className={getConfidenceColor(commandResult.confidence)}
                >
                  {Math.round(commandResult.confidence * 100)}%
                </Badge>
              </div>
              <p className="text-sm text-slate-700">{commandResult.action}</p>
              {commandResult.intent !== 'unknown' && (
                <Badge className="mt-2 text-xs">
                  {commandResult.intent.replace('_', ' ')}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {!isRecording ? (
              <Button 
                onClick={startRecording}
                disabled={processCommandMutation.isPending}
                className="w-full bg-[hsl(207,90%,54%)] text-white"
              >
                {processCommandMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={stopRecording}
                className="w-full bg-red-500 text-white hover:bg-red-600"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}
            
            <Button 
              onClick={onClose}
              variant="outline" 
              className="w-full"
            >
              Close
            </Button>
          </div>

          {/* Language Support Info */}
          <div className="mt-4 text-xs text-slate-500">
            <p>Supports 12 languages including English, Swahili, and French</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
