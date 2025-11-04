// Default system responses for CoderX
export const DEFAULT_SYSTEM_RESPONSES = {
  founder: 'Suryanshu Nabheet',
  name: 'CoderX',
  description: 'An AI-powered coding assistant and development platform',
  version: '1.0.0',
  purpose: 'To help developers build, code, and create amazing projects',
};

// System questions and their responses
export const SYSTEM_QUESTIONS = {
  'who is your founder': DEFAULT_SYSTEM_RESPONSES.founder,
  'who is the founder': DEFAULT_SYSTEM_RESPONSES.founder,
  'who was the founder': DEFAULT_SYSTEM_RESPONSES.founder,
  'what is your name': DEFAULT_SYSTEM_RESPONSES.name,
  'who created you': DEFAULT_SYSTEM_RESPONSES.founder,
  'what are you': DEFAULT_SYSTEM_RESPONSES.description,
  'who made you': DEFAULT_SYSTEM_RESPONSES.founder,
  "what's your name": DEFAULT_SYSTEM_RESPONSES.name,
  founder: DEFAULT_SYSTEM_RESPONSES.founder,
  creator: DEFAULT_SYSTEM_RESPONSES.founder,
  developer: DEFAULT_SYSTEM_RESPONSES.founder,
  'who built you': DEFAULT_SYSTEM_RESPONSES.founder,
  'what is coderx': DEFAULT_SYSTEM_RESPONSES.description,
  'about coderx': DEFAULT_SYSTEM_RESPONSES.description,
  'tell me about the founder': DEFAULT_SYSTEM_RESPONSES.founder,
  'tell me about founder': DEFAULT_SYSTEM_RESPONSES.founder,
  'founder of coderx': DEFAULT_SYSTEM_RESPONSES.founder,
  'who founded coderx': DEFAULT_SYSTEM_RESPONSES.founder,
};

// Check if a message contains system questions
export const isSystemQuestion = (message: string): string | null => {
  // Handle non-string input (safety check)
  if (typeof message !== 'string') {
    console.error('isSystemQuestion received non-string:', typeof message, message);
    return null;
  }

  const normalizedMessage = message.toLowerCase().trim();

  // DEBUG: Log if we see "founder" in the message
  if (normalizedMessage.includes('founder')) {
    console.error('🔍 isSystemQuestion checking message with "founder":', normalizedMessage);
  }

  // Check for exact matches first
  for (const [question, answer] of Object.entries(SYSTEM_QUESTIONS)) {
    if (normalizedMessage.includes(question)) {
      console.error('✅ MATCHED SYSTEM_QUESTIONS:', question, '->', answer);
      return answer;
    }
  }

  /*
   * Enhanced matching for founder-related questions
   * Check for variations like "who is the founder", "tell me about founder", etc.
   */
  const founderPatterns = [
    /who\s+(is|was)\s+(the\s+)?founder/i,
    /tell\s+(me\s+)?(about\s+)?(the\s+)?founder/i,
    /founder\s+(of\s+)?(coderx|this|you)/i,
    /who\s+(founded|created|made|built)\s+(coderx|you|this)/i,
    /(the\s+)?founder\s+(is|was|of)/i,
    /about\s+(the\s+)?founder/i,
    /founder\s+information/i,
    /who\s+is\s+(the\s+)?person\s+who\s+(created|made|founded|built)/i,

    // Additional patterns for better coverage
    /^(founder|who.*founder|founder.*who)/i, // Simple patterns at start
  ];

  for (const pattern of founderPatterns) {
    if (pattern.test(normalizedMessage)) {
      console.error('✅ MATCHED FOUNDER PATTERN:', pattern.toString());
      return DEFAULT_SYSTEM_RESPONSES.founder;
    }
  }

  // Final fallback: if message contains "founder" anywhere (very aggressive)
  if (normalizedMessage.includes('founder')) {
    // Check if it's not part of a longer word
    const founderWord = /\bfounder\b/i.test(normalizedMessage);

    if (founderWord || normalizedMessage.length < 100) {
      console.error('✅ MATCHED FOUNDER FALLBACK');
      return DEFAULT_SYSTEM_RESPONSES.founder;
    }
  }

  return null;
};

// Generate a system response
export const generateSystemResponse = (question: string): string => {
  const answer = isSystemQuestion(question);
  const normalizedQuestion = question.toLowerCase().trim();

  if (answer) {
    // Check if this is specifically a founder-related question
    const isFounderQuestion =
      normalizedQuestion.includes('founder') ||
      normalizedQuestion.includes('creator') ||
      normalizedQuestion.includes('developer') ||
      normalizedQuestion.includes('created') ||
      normalizedQuestion.includes('made') ||
      normalizedQuestion.includes('built') ||
      normalizedQuestion.includes('founded');

    if (isFounderQuestion && answer === DEFAULT_SYSTEM_RESPONSES.founder) {
      return `My founder is ${DEFAULT_SYSTEM_RESPONSES.founder}. I'm ${DEFAULT_SYSTEM_RESPONSES.name}, ${DEFAULT_SYSTEM_RESPONSES.description}. I'm powered by various AI models through OpenRouter, but I always maintain my identity as CoderX. How can I help you with your coding needs today?`;
    }

    return `I'm ${DEFAULT_SYSTEM_RESPONSES.name}, ${DEFAULT_SYSTEM_RESPONSES.description}. My founder is ${DEFAULT_SYSTEM_RESPONSES.founder}. I'm powered by various AI models through OpenRouter, but I always maintain my identity as CoderX. How can I help you with your coding needs today?`;
  }

  return '';
};
