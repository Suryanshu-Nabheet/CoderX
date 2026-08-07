// Default system responses for CoderX
export const DEFAULT_SYSTEM_RESPONSES = {
  founder: 'Suryanshu Nabheet',
  name: 'CoderX',
  description: 'CoderX — AI-Powered Development Platform',
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

export const isSystemQuestion = (message: string): string | null => {
  if (typeof message !== 'string') {
    return null;
  }

  const normalizedMessage = message.toLowerCase().trim();

  for (const [question, answer] of Object.entries(SYSTEM_QUESTIONS)) {
    if (normalizedMessage.includes(question)) {
      return answer;
    }
  }

  const founderPatterns = [
    /who\s+(is|was)\s+(the\s+)?founder/i,
    /tell\s+(me\s+)?(about\s+)?(the\s+)?founder/i,
    /founder\s+(of\s+)?(coderx|this|you)/i,
    /who\s+(founded|created|made|built)\s+(coderx|you|this)/i,
    /(the\s+)?founder\s+(is|was|of)/i,
    /about\s+(the\s+)?founder/i,
    /founder\s+information/i,
    /who\s+is\s+(the\s+)?person\s+who\s+(created|made|founded|built)/i,
    /^(founder|who.*founder|founder.*who)/i,
  ];

  for (const pattern of founderPatterns) {
    if (pattern.test(normalizedMessage)) {
      return DEFAULT_SYSTEM_RESPONSES.founder;
    }
  }

  if (normalizedMessage.includes('founder')) {
    const founderWord = /\bfounder\b/i.test(normalizedMessage);

    if (founderWord || normalizedMessage.length < 100) {
      return DEFAULT_SYSTEM_RESPONSES.founder;
    }
  }

  return null;
};

export const generateSystemResponse = (question: string): string => {
  const answer = isSystemQuestion(question);
  const normalizedQuestion = question.toLowerCase().trim();

  if (answer) {
    if (
      normalizedQuestion.includes('founder') ||
      normalizedQuestion.includes('created') ||
      normalizedQuestion.includes('made') ||
      normalizedQuestion.includes('built')
    ) {
      return `My founder is ${DEFAULT_SYSTEM_RESPONSES.founder}. He created CoderX as an AI-powered development platform to help developers build applications faster.`;
    }

    return answer;
  }

  return '';
};
