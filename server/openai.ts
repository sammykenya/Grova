import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface AICoachingResponse {
  tip: string;
  category: string;
  actionable_steps: string[];
  confidence: number;
}

export interface SpendingAnalysis {
  insights: string[];
  recommendations: string[];
  risk_level: "low" | "medium" | "high";
  savings_potential: number;
}

export async function generateFinancialTip(
  userSpendingData: any,
  language: string = "en"
): Promise<AICoachingResponse> {
  try {
    const prompt = `You are a professional financial advisor. Based on the following spending data, provide a personalized financial tip in ${language === "en" ? "English" : language}.

Spending Data: ${JSON.stringify(userSpendingData)}

Provide advice that is:
1. Culturally appropriate for developing economies
2. Practical and actionable
3. Encouraging and supportive
4. Focused on immediate improvements

Respond with JSON in this format: { "tip": "main advice", "category": "savings|budgeting|investment|emergency", "actionable_steps": ["step1", "step2"], "confidence": 0.8 }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable financial advisor specializing in financial inclusion for underbanked populations. Provide practical, culturally-sensitive financial advice."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      tip: result.tip || "Consider setting aside 10% of your income for savings.",
      category: result.category || "savings",
      actionable_steps: result.actionable_steps || ["Start with small amounts", "Be consistent"],
      confidence: Math.max(0, Math.min(1, result.confidence || 0.8)),
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Enhanced fallback tips array
    const fallbackTips = [
      {
        tip: "Build your emergency fund by saving just 50 KES daily - that's 1,500 KES monthly for financial security!",
        category: "savings",
        actionable_steps: ["Save 50 KES every morning", "Use M-Pesa lock savings", "Track progress with a savings journal"],
        confidence: 0.9
      },
      {
        tip: "Join a community savings group (chama) to multiply your investment power through pooled resources.",
        category: "investment", 
        actionable_steps: ["Find 10 trusted friends", "Contribute 1,000 KES monthly", "Rotate payouts every month"],
        confidence: 0.8
      },
      {
        tip: "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings and debt payments.",
        category: "budgeting",
        actionable_steps: ["Calculate monthly income", "List all expenses by category", "Allocate money before spending"],
        confidence: 0.9
      },
      {
        tip: "Start a small business with just 5,000 KES - sell airtime, snacks, or phone accessories in your area.",
        category: "investment",
        actionable_steps: ["Research local demand", "Start with small capital", "Track daily profits and losses"],
        confidence: 0.7
      },
      {
        tip: "Set up automatic savings: Save 10% of every mobile money transaction you receive.",
        category: "savings",
        actionable_steps: ["Enable M-Pesa auto-save", "Set 10% save rate", "Review monthly progress"],
        confidence: 0.8
      },
      {
        tip: "Avoid high-interest loans by building a community lending circle with trusted friends.",
        category: "emergency",
        actionable_steps: ["Form group of 5-10 people", "Contribute equally monthly", "Create emergency fund rules"],
        confidence: 0.9
      }
    ];
    
    // Return random tip from enhanced fallbacks
    const randomTip = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    return randomTip;
  }
}

export async function analyzeSpendingPatterns(
  transactions: any[],
  language: string = "en"
): Promise<SpendingAnalysis> {
  try {
    const prompt = `Analyze these financial transactions and provide spending insights in ${language === "en" ? "English" : language}.

Transactions: ${JSON.stringify(transactions)}

Focus on:
1. Spending patterns and trends
2. Potential areas for savings
3. Financial health assessment
4. Practical recommendations for improvement

Respond with JSON: { "insights": ["insight1", "insight2"], "recommendations": ["rec1", "rec2"], "risk_level": "low|medium|high", "savings_potential": percentage_number }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst helping users understand their spending patterns and find opportunities for better financial management."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      insights: result.insights || ["Your spending shows consistent patterns"],
      recommendations: result.recommendations || ["Consider tracking all expenses"],
      risk_level: result.risk_level || "medium",
      savings_potential: result.savings_potential || 15,
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    return {
      insights: ["Unable to analyze spending patterns at this time"],
      recommendations: ["Continue monitoring your expenses", "Set monthly spending limits"],
      risk_level: "medium",
      savings_potential: 10,
    };
  }
}

export async function processVoiceCommand(
  audioText: string,
  language: string = "en"
): Promise<{
  intent: string;
  action: string;
  parameters: any;
  confidence: number;
}> {
  try {
    const prompt = `Parse this voice command for a financial app: "${audioText}"

Identify the intent and extract parameters. Possible intents:
- send_money: sending money to someone
- check_balance: checking wallet balance  
- request_money: requesting money from someone
- convert_currency: converting between currencies
- set_goal: setting a financial goal
- get_advice: asking for financial advice

Respond with JSON: { "intent": "action_name", "action": "description", "parameters": {"amount": 100, "recipient": "name", "currency": "KES"}, "confidence": 0.9 }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a voice command parser for a financial application. Extract intent and parameters from natural language commands."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      intent: result.intent || "unknown",
      action: result.action || "Unable to understand command",
      parameters: result.parameters || {},
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
    };
  } catch (error) {
    console.error("Voice processing error:", error);
    return {
      intent: "unknown",
      action: "Unable to process voice command",
      parameters: {},
      confidence: 0,
    };
  }
}

export async function generatePersonalizedAdvice(
  userProfile: any,
  question: string,
  language: string = "en"
): Promise<string> {
  try {
    const prompt = `You are a personal financial advisor. Answer this question based on the user's profile.

User Profile: ${JSON.stringify(userProfile)}
Question: ${question}

Provide a helpful, personalized response in ${language === "en" ? "English" : language}. Keep it practical and encouraging.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful financial advisor who provides personalized, practical advice in a friendly and encouraging manner."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content || "I'd be happy to help you with your financial question. Could you provide more details?";
  } catch (error) {
    console.error("Advice generation error:", error);
    return "I'm here to help with your financial questions. Could you try asking again or be more specific?";
  }
}
