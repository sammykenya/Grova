// Voice recognition utilities for UniFi app

export interface VoiceCommand {
  intent: string;
  action: string;
  parameters: any;
  confidence: number;
}

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
}

let recognition: any = null;
let isListening = false;

// Check if browser supports speech recognition
export const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Initialize speech recognition
const initSpeechRecognition = () => {
  if (!isSpeechRecognitionSupported()) {
    throw new Error('Speech recognition not supported in this browser');
  }

  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
  recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US'; // Default to English, can be changed
  recognition.maxAlternatives = 1;
};

// Start speech recognition
export const startSpeechRecognition = (language: string = 'en-US'): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionSupported()) {
      // Fallback for unsupported browsers
      setTimeout(() => {
        resolve("Send 100 shillings to mama"); // Demo text for testing
      }, 2000);
      return;
    }

    if (!recognition) {
      initSpeechRecognition();
    }

    recognition.lang = language;
    isListening = true;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      isListening = false;
      resolve(transcript);
    };

    recognition.onerror = (event: any) => {
      isListening = false;
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.onend = () => {
      isListening = false;
    };

    try {
      recognition.start();
    } catch (error) {
      isListening = false;
      reject(error);
    }
  });
};

// Stop speech recognition
export const stopSpeechRecognition = () => {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
  }
};

// Check if currently listening
export const isCurrentlyListening = (): boolean => {
  return isListening;
};

// Process voice command locally (basic parsing)
export const processVoiceCommand = (transcript: string): VoiceCommand => {
  const text = transcript.toLowerCase();
  
  // Send money patterns
  if (text.includes('send') && (text.includes('money') || text.includes('shilling') || text.includes('dollar'))) {
    const amountMatch = text.match(/(\d+(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
    
    const recipientMatch = text.match(/to\s+(\w+)/);
    const recipient = recipientMatch ? recipientMatch[1] : null;
    
    return {
      intent: 'send_money',
      action: `Send ${amount || 'amount'} to ${recipient || 'recipient'}`,
      parameters: { amount, recipient },
      confidence: 0.8
    };
  }
  
  // Check balance patterns
  if (text.includes('balance') || text.includes('how much')) {
    return {
      intent: 'check_balance',
      action: 'Check wallet balance',
      parameters: {},
      confidence: 0.9
    };
  }
  
  // Convert currency patterns
  if (text.includes('convert') && (text.includes('crypto') || text.includes('bitcoin') || text.includes('fiat'))) {
    return {
      intent: 'convert_currency',
      action: 'Convert between currencies',
      parameters: {},
      confidence: 0.7
    };
  }
  
  // Request money patterns
  if (text.includes('request') && text.includes('money')) {
    return {
      intent: 'request_money',
      action: 'Request money from someone',
      parameters: {},
      confidence: 0.8
    };
  }
  
  // AI advice patterns
  if (text.includes('advice') || text.includes('tip') || text.includes('help')) {
    return {
      intent: 'get_advice',
      action: 'Get financial advice',
      parameters: { query: transcript },
      confidence: 0.7
    };
  }
  
  // Default fallback
  return {
    intent: 'unknown',
    action: 'Command not recognized',
    parameters: { original: transcript },
    confidence: 0.3
  };
};

// Text-to-speech functionality
export const speakText = (text: string, language: string = 'en-US'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Text-to-speech not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

    speechSynthesis.speak(utterance);
  });
};

// Get available languages for speech recognition
export const getAvailableLanguages = (): string[] => {
  return [
    'en-US', // English (US)
    'en-GB', // English (UK)
    'sw-KE', // Swahili (Kenya)
    'fr-FR', // French
    'es-ES', // Spanish
    'ar-SA', // Arabic
    'zh-CN', // Chinese
    'hi-IN', // Hindi
    'pt-BR', // Portuguese (Brazil)
    'ru-RU', // Russian
    'ja-JP', // Japanese
    'ko-KR', // Korean
  ];
};

// Convert language code to display name
export const getLanguageDisplayName = (code: string): string => {
  const languageNames: { [key: string]: string } = {
    'en-US': 'English (US)',
    'en-GB': 'English (UK)',
    'sw-KE': 'Swahili',
    'fr-FR': 'French',
    'es-ES': 'Spanish',
    'ar-SA': 'Arabic',
    'zh-CN': 'Chinese',
    'hi-IN': 'Hindi',
    'pt-BR': 'Portuguese',
    'ru-RU': 'Russian',
    'ja-JP': 'Japanese',
    'ko-KR': 'Korean',
  };
  
  return languageNames[code] || code;
};

// Voice command examples for different languages
export const getVoiceExamples = (language: string = 'en-US'): string[] => {
  const examples: { [key: string]: string[] } = {
    'en-US': [
      'Send 100 dollars to John',
      'Check my balance',
      'Convert crypto to fiat',
      'Request money from Sarah',
      'Give me financial advice'
    ],
    'sw-KE': [
      'Tuma shilingi mia moja kwa John',
      'Angalia salio yangu',
      'Badilisha crypto kuwa pesa',
      'Omba pesa kutoka Sarah',
      'Nipe ushauri wa kifedha'
    ],
    'fr-FR': [
      'Envoyer 100 euros à John',
      'Vérifier mon solde',
      'Convertir crypto en monnaie',
      'Demander de l\'argent à Sarah',
      'Donnez-moi des conseils financiers'
    ]
  };
  
  return examples[language] || examples['en-US'];
};
