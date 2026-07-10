import { generateSystemResponse, isSystemQuestion } from '~/lib/system-responses';

// Default responses for common coding questions
const DEFAULT_CODING_RESPONSES = {
  hello:
    "Hello! I'm CoderX, your AI coding assistant created by Suryanshu Nabheet. I'm powered by various AI models through OpenRouter, but I always maintain my identity as CoderX. How can I help you build something amazing today?",
  hi: "Hi there! I'm here to help you with coding, development, and building projects. What would you like to work on?",
  help: 'I can help you with:\n• Writing and debugging code\n• Explaining programming concepts\n• Building web applications\n• Setting up development environments\n• Code reviews and optimization\n\nWhat specific help do you need?',
  'what can you do':
    'I can help you with:\n• Writing and debugging code\n• Explaining programming concepts\n• Building web applications\n• Setting up development environments\n• Code reviews and optimization\n\nWhat would you like to work on?',
  'coding help':
    "I'd be happy to help you with coding! I can assist with:\n• Writing code in various languages\n• Debugging and fixing issues\n• Explaining how code works\n• Best practices and optimization\n\nWhat specific coding problem are you working on?",
  javascript:
    'JavaScript is a versatile programming language! I can help you with:\n• ES6+ features\n• DOM manipulation\n• Async programming\n• Frameworks like React, Vue, Angular\n• Node.js backend development\n\nWhat JavaScript topic would you like to explore?',
  python:
    'Python is great for many things! I can help you with:\n• Basic syntax and concepts\n• Data structures and algorithms\n• Web frameworks like Django/Flask\n• Data science and ML libraries\n• Automation and scripting\n\nWhat Python project are you working on?',
  react:
    'React is a powerful frontend library! I can help you with:\n• Components and JSX\n• State management\n• Hooks and lifecycle\n• Routing and navigation\n• Performance optimization\n\nWhat React concept would you like to learn about?',
  html: 'HTML is the foundation of web development! I can help you with:\n• Semantic HTML structure\n• Forms and inputs\n• Accessibility best practices\n• HTML5 features\n• Integration with CSS and JavaScript\n\nWhat HTML topic interests you?',
  css: 'CSS makes websites beautiful! I can help you with:\n• Layout techniques (Flexbox, Grid)\n• Responsive design\n• Animations and transitions\n• CSS frameworks\n• Modern CSS features\n\nWhat CSS challenge are you facing?',
};

// Check if message matches a default response
const getDefaultResponse = (message: string): string | null => {
  const normalizedMessage = message.toLowerCase().trim();

  // Check for exact matches first
  if (DEFAULT_CODING_RESPONSES[normalizedMessage as keyof typeof DEFAULT_CODING_RESPONSES]) {
    return DEFAULT_CODING_RESPONSES[normalizedMessage as keyof typeof DEFAULT_CODING_RESPONSES];
  }

  // Check for partial matches
  for (const [key, response] of Object.entries(DEFAULT_CODING_RESPONSES)) {
    if (normalizedMessage.includes(key)) {
      return response;
    }
  }

  return null;
};

// Generate a contextual response based on message content
export const generateDefaultResponse = (message: string): string => {
  // First check for system questions
  const systemAnswer = isSystemQuestion(message);

  if (systemAnswer) {
    return generateSystemResponse(message);
  }

  // Check for default coding responses
  const defaultResponse = getDefaultResponse(message);

  if (defaultResponse) {
    return defaultResponse;
  }

  // Generate contextual response based on keywords
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('error') || normalizedMessage.includes('bug')) {
    return "I can help you debug that issue! Please share the error message or describe what's not working, and I'll help you fix it.";
  }

  if (normalizedMessage.includes('code') || normalizedMessage.includes('programming')) {
    return "I'd love to help you with coding! Please share your code or describe what you're trying to build, and I'll assist you.";
  }

  if (normalizedMessage.includes('project') || normalizedMessage.includes('build')) {
    return "Great! I can help you build that project. Tell me more about what you want to create, and I'll guide you through the process.";
  }

  if (normalizedMessage.includes('learn') || normalizedMessage.includes('tutorial')) {
    return 'Learning is awesome! I can explain concepts, provide examples, and guide you through tutorials. What would you like to learn about?';
  }

  // Default fallback response
  return "I'm CoderX, your AI coding assistant created by Suryanshu Nabheet! I'm powered by various AI models through OpenRouter, but I always maintain my identity as CoderX. I can help you with programming, debugging, building projects, and learning new technologies. How can I assist you today?";
};

// Check if we should use default responses (when no API key is available)
export const shouldUseDefaultResponse = (hasApiKey: boolean, message: string): boolean => {
  // Safety check: handle non-string input
  if (typeof message !== 'string') {
    return !hasApiKey;
  }

  const systemCheck = isSystemQuestion(message);

  if (systemCheck) {
    return true;
  }

  // Use default if no API key is available
  if (!hasApiKey) {
    return true;
  }

  // Use default for simple greetings and help requests
  const normalizedMessage = message.toLowerCase().trim();
  const simpleQueries = ['hello', 'hi', 'help', 'what can you do'];

  return simpleQueries.includes(normalizedMessage);
};
