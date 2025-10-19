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
};

// Check if a message contains system questions
export const isSystemQuestion = (message: string): string | null => {
  const normalizedMessage = message.toLowerCase().trim();

  for (const [question, answer] of Object.entries(SYSTEM_QUESTIONS)) {
    if (normalizedMessage.includes(question)) {
      return answer;
    }
  }

  return null;
};

// Generate a system response
export const generateSystemResponse = (question: string): string => {
  const answer = isSystemQuestion(question);

  if (answer) {
    return `I'm ${DEFAULT_SYSTEM_RESPONSES.name}, ${DEFAULT_SYSTEM_RESPONSES.description}. My founder is ${DEFAULT_SYSTEM_RESPONSES.founder}. How can I help you with your coding needs today?`;
  }

  return '';
};
