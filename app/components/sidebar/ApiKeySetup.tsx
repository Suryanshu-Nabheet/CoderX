import React, { useState, useRef, useEffect, useMemo } from 'react';
import { classNames } from '~/utils/classNames';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { toast } from 'react-toastify';
import type { ProviderInfo } from '~/types/model';
import type { ModelInfo } from '~/lib/modules/llm/types';
import {
  OpenAIProvider,
  AnthropicProvider,
  CohereProvider,
  DeepseekProvider,
  GoogleProvider,
  GroqProvider,
  HuggingFaceProvider,
  LMStudioProvider,
  MistralProvider,
  OllamaProvider,
  OpenRouterProvider,
  OpenAILikeProvider,
  PerplexityProvider,
  TogetherProvider,
  XAIProvider,
  HyperbolicProvider,
  AmazonBedrockProvider,
  GithubProvider,
  MoonshotProvider,
} from '~/lib/modules/llm/registry';

interface ApiKeySetupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtendedProviderInfo extends Omit<ProviderInfo, 'staticModels'> {
  highlightedName?: string;
  category?: string;
  staticModels?: ModelInfo[];
}

interface ExtendedModelInfo extends ModelInfo {
  highlightedName?: string;
  highlightedLabel?: string;
}

// Provider instance mapping
const PROVIDER_INSTANCES = {
  OpenAI: new OpenAIProvider(),
  Anthropic: new AnthropicProvider(),
  Cohere: new CohereProvider(),
  DeepSeek: new DeepseekProvider(),
  Google: new GoogleProvider(),
  Groq: new GroqProvider(),
  'Hugging Face': new HuggingFaceProvider(),
  'LM Studio': new LMStudioProvider(),
  Mistral: new MistralProvider(),
  Ollama: new OllamaProvider(),
  OpenRouter: new OpenRouterProvider(),
  'OpenAI Like': new OpenAILikeProvider(),
  Perplexity: new PerplexityProvider(),
  Together: new TogetherProvider(),
  XAI: new XAIProvider(),
  Hyperbolic: new HyperbolicProvider(),
  'Amazon Bedrock': new AmazonBedrockProvider(),
  GitHub: new GithubProvider(),
  Moonshot: new MoonshotProvider(),
};

const getProviderInstance = (providerName: string) => {
  return PROVIDER_INSTANCES[providerName as keyof typeof PROVIDER_INSTANCES];
};

// Comprehensive API Key mapping for ALL major AI providers and services
const API_KEY_MAPPING: Record<string, string> = {
  // Core AI Providers
  OpenAI: 'OPENAI_API_KEY',
  Anthropic: 'ANTHROPIC_API_KEY',
  Google: 'GOOGLE_GENERATIVE_AI_API_KEY',
  Cohere: 'COHERE_API_KEY',
  Groq: 'GROQ_API_KEY',
  'Hugging Face': 'HUGGINGFACE_API_KEY',
  Together: 'TOGETHER_API_KEY',
  Perplexity: 'PERPLEXITY_API_KEY',
  DeepSeek: 'DEEPSEEK_API_KEY',
  Mistral: 'MISTRAL_API_KEY',
  Moonshot: 'MOONSHOT_API_KEY',
  XAI: 'XAI_API_KEY',
  OpenRouter: 'OPEN_ROUTER_API_KEY',
  Ollama: 'OLLAMA_API_BASE_URL',
  'LM Studio': 'LMSTUDIO_API_BASE_URL',
  Hyperbolic: 'HYPERBOLIC_API_KEY',

  // Cloud Providers
  'Amazon Bedrock': 'AWS_ACCESS_KEY_ID',
  'AWS Secret Access Key': 'AWS_SECRET_ACCESS_KEY',
  'AWS Region': 'AWS_REGION',

  // Development & Deployment Services
  GitHub: 'GITHUB_TOKEN',
  GitLab: 'GITLAB_TOKEN',
  Supabase: 'SUPABASE_URL',
  'Supabase Anon Key': 'SUPABASE_ANON_KEY',
  Netlify: 'NETLIFY_TOKEN',
  Vercel: 'VERCEL_TOKEN',

  // Additional AI Services
  'OpenAI Like': 'OPENAI_LIKE_API_KEY',
  'OpenAI Like Base URL': 'OPENAI_LIKE_API_BASE_URL',
  'OpenAI Like Models': 'OPENAI_LIKE_API_MODELS',
  'Together Base URL': 'TOGETHER_API_BASE_URL',

  // Local Development
  'Ollama Base URL': 'OLLAMA_API_BASE_URL',
  'LM Studio Base URL': 'LMSTUDIO_API_BASE_URL',

  // Additional Cloud Services
  'Azure OpenAI': 'AZURE_OPENAI_API_KEY',
  'Azure OpenAI Endpoint': 'AZURE_OPENAI_ENDPOINT',
  'Azure OpenAI Deployment': 'AZURE_OPENAI_DEPLOYMENT',
  'Azure OpenAI API Version': 'AZURE_OPENAI_API_VERSION',

  // Specialized AI Services
  Replicate: 'REPLICATE_API_TOKEN',
  'Stability AI': 'STABILITY_API_KEY',
  ElevenLabs: 'ELEVENLABS_API_KEY',
  AssemblyAI: 'ASSEMBLYAI_API_KEY',
  Speechify: 'SPEECHIFY_API_KEY',
  Whisper: 'WHISPER_API_KEY',

  // Database & Storage
  Pinecone: 'PINECONE_API_KEY',
  Weaviate: 'WEAVIATE_API_KEY',
  Chroma: 'CHROMA_API_KEY',
  Qdrant: 'QDRANT_API_KEY',
  Milvus: 'MILVUS_API_KEY',

  // Monitoring & Analytics
  LangSmith: 'LANGSMITH_API_KEY',
  'Weights & Biases': 'WANDB_API_KEY',
  MLflow: 'MLFLOW_TRACKING_URI',
  Neptune: 'NEPTUNE_API_TOKEN',

  // Additional Services
  SendGrid: 'SENDGRID_API_KEY',
  Twilio: 'TWILIO_ACCOUNT_SID',
  'Twilio Auth Token': 'TWILIO_AUTH_TOKEN',
  Stripe: 'STRIPE_SECRET_KEY',
  PayPal: 'PAYPAL_CLIENT_ID',
  'PayPal Secret': 'PAYPAL_CLIENT_SECRET',
};

// Comprehensive provider list with all major AI providers and services
const COMPREHENSIVE_PROVIDER_LIST: ExtendedProviderInfo[] = [
  // Core AI Providers
  {
    name: 'OpenAI',
    category: 'AI Provider',
    icon: 'i-ph:brain',
    getApiKeyLink: 'https://platform.openai.com/api-keys',
  },
  {
    name: 'Anthropic',
    category: 'AI Provider',
    icon: 'i-ph:robot',
    getApiKeyLink: 'https://console.anthropic.com/',
  },
  {
    name: 'Google',
    category: 'AI Provider',
    icon: 'i-ph:google-logo',
    getApiKeyLink: 'https://makersuite.google.com/app/apikey',
  },
  {
    name: 'Cohere',
    category: 'AI Provider',
    icon: 'i-ph:lightning',
    getApiKeyLink: 'https://dashboard.cohere.ai/api-keys',
  },
  {
    name: 'Groq',
    category: 'AI Provider',
    icon: 'i-ph:bolt',
    getApiKeyLink: 'https://console.groq.com/keys',
  },
  {
    name: 'Hugging Face',
    category: 'AI Provider',
    icon: 'i-ph:heart',
    getApiKeyLink: 'https://huggingface.co/settings/tokens',
  },
  {
    name: 'Together',
    category: 'AI Provider',
    icon: 'i-ph:users',
    getApiKeyLink: 'https://api.together.xyz/settings/api-keys',
  },
  {
    name: 'Perplexity',
    category: 'AI Provider',
    icon: 'i-ph:question',
    getApiKeyLink: 'https://www.perplexity.ai/settings/api',
  },
  {
    name: 'DeepSeek',
    category: 'AI Provider',
    icon: 'i-ph:eye',
    getApiKeyLink: 'https://platform.deepseek.com/api_keys',
  },
  {
    name: 'Mistral',
    category: 'AI Provider',
    icon: 'i-ph:wind',
    getApiKeyLink: 'https://console.mistral.ai/api-keys/',
  },
  {
    name: 'Moonshot',
    category: 'AI Provider',
    icon: 'i-ph:moon',
    getApiKeyLink: 'https://platform.moonshot.ai/console/api-keys',
  },
  {
    name: 'XAI',
    category: 'AI Provider',
    icon: 'i-ph:x-logo',
    getApiKeyLink: 'https://console.x.ai/',
  },
  {
    name: 'OpenRouter',
    category: 'AI Provider',
    icon: 'i-ph:router',
    getApiKeyLink: 'https://openrouter.ai/keys',
  },
  {
    name: 'Ollama',
    category: 'Local AI',
    icon: 'i-ph:desktop',
    getApiKeyLink: 'https://ollama.ai/',
  },
  { name: 'LM Studio', category: 'Local AI', icon: 'i-ph:laptop', getApiKeyLink: 'https://lmstudio.ai/' },
  {
    name: 'Hyperbolic',
    category: 'AI Provider',
    icon: 'i-ph:infinity',
    getApiKeyLink: 'https://hyperbolic.ai/',
  },

  // Cloud Providers
  {
    name: 'Amazon Bedrock',
    category: 'Cloud AI',
    icon: 'i-ph:cloud',
    getApiKeyLink: 'https://aws.amazon.com/bedrock/',
  },
  {
    name: 'Azure OpenAI',
    category: 'Cloud AI',
    icon: 'i-ph:microsoft-logo',
    getApiKeyLink: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
  },

  // Development & Deployment Services
  {
    name: 'GitHub',
    category: 'Development',
    icon: 'i-ph:github-logo',
    getApiKeyLink: 'https://github.com/settings/tokens',
  },
  {
    name: 'GitLab',
    category: 'Development',
    icon: 'i-ph:git-branch',
    getApiKeyLink: 'https://gitlab.com/-/profile/personal_access_tokens',
  },
  {
    name: 'Supabase',
    category: 'Database',
    icon: 'i-ph:database',
    getApiKeyLink: 'https://supabase.com/dashboard/account/tokens',
  },
  {
    name: 'Netlify',
    category: 'Deployment',
    icon: 'i-ph:globe',
    getApiKeyLink: 'https://app.netlify.com/user/applications#personal-access-tokens',
  },
  {
    name: 'Vercel',
    category: 'Deployment',
    icon: 'i-ph:rocket',
    getApiKeyLink: 'https://vercel.com/account/tokens',
  },

  // Additional AI Services
  {
    name: 'OpenAI Like',
    category: 'AI Provider',
    icon: 'i-ph:link',
    getApiKeyLink: undefined,
  },
  {
    name: 'Together Base URL',
    category: 'AI Provider',
    icon: 'i-ph:link',
    getApiKeyLink: 'https://api.together.xyz/',
  },

  // Local Development
  {
    name: 'Ollama Base URL',
    category: 'Local AI',
    icon: 'i-ph:desktop',
    getApiKeyLink: 'https://ollama.ai/',
  },
  {
    name: 'LM Studio Base URL',
    category: 'Local AI',
    icon: 'i-ph:laptop',
    getApiKeyLink: 'https://lmstudio.ai/',
  },

  // Additional Cloud Services
  {
    name: 'Azure OpenAI',
    category: 'Cloud AI',
    icon: 'i-ph:microsoft-logo',
    getApiKeyLink: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
  },
  {
    name: 'Azure OpenAI Endpoint',
    category: 'Cloud AI',
    icon: 'i-ph:microsoft-logo',
    getApiKeyLink: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
  },
  {
    name: 'Azure OpenAI Deployment',
    category: 'Cloud AI',
    icon: 'i-ph:microsoft-logo',
    getApiKeyLink: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
  },
  {
    name: 'Azure OpenAI API Version',
    category: 'Cloud AI',
    icon: 'i-ph:microsoft-logo',
    getApiKeyLink: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
  },

  // Specialized AI Services
  {
    name: 'Replicate',
    category: 'AI Provider',
    icon: 'i-ph:robot',
    getApiKeyLink: 'https://replicate.com/account/api-tokens',
  },
  {
    name: 'Stability AI',
    category: 'AI Provider',
    icon: 'i-ph:image',
    getApiKeyLink: 'https://platform.stability.ai/account/keys',
  },
  {
    name: 'ElevenLabs',
    category: 'AI Provider',
    icon: 'i-ph:microphone',
    getApiKeyLink: 'https://elevenlabs.io/app/settings/api-keys',
  },
  {
    name: 'AssemblyAI',
    category: 'AI Provider',
    icon: 'i-ph:microphone',
    getApiKeyLink: 'https://www.assemblyai.com/dashboard/signup',
  },
  {
    name: 'Speechify',
    category: 'AI Provider',
    icon: 'i-ph:speaker-high',
    getApiKeyLink: 'https://speechify.com/',
  },
  {
    name: 'Whisper',
    category: 'AI Provider',
    icon: 'i-ph:microphone',
    getApiKeyLink: 'https://openai.com/research/whisper',
  },

  // Database & Storage
  {
    name: 'Pinecone',
    category: 'Database',
    icon: 'i-ph:database',
    getApiKeyLink: 'https://app.pinecone.io/organizations/-/api-keys',
  },
  {
    name: 'Weaviate',
    category: 'Database',
    icon: 'i-ph:database',
    getApiKeyLink: 'https://console.weaviate.cloud/',
  },
  {
    name: 'Chroma',
    category: 'Database',
    icon: 'i-ph:database',
    getApiKeyLink: 'https://www.trychroma.com/',
  },
  {
    name: 'Qdrant',
    category: 'Database',
    icon: 'i-ph:database',
    getApiKeyLink: 'https://cloud.qdrant.io/',
  },
  {
    name: 'Milvus',
    category: 'Database',
    icon: 'i-ph:database',
    getApiKeyLink: 'https://milvus.io/',
  },

  // Monitoring & Analytics
  {
    name: 'LangSmith',
    category: 'Monitoring',
    icon: 'i-ph:chart-line',
    getApiKeyLink: 'https://smith.langchain.com/',
  },
  {
    name: 'Weights & Biases',
    category: 'Monitoring',
    icon: 'i-ph:chart-line',
    getApiKeyLink: 'https://wandb.ai/authorize',
  },
  {
    name: 'MLflow',
    category: 'Monitoring',
    icon: 'i-ph:chart-line',
    getApiKeyLink: 'https://mlflow.org/',
  },
  {
    name: 'Neptune',
    category: 'Monitoring',
    icon: 'i-ph:chart-line',
    getApiKeyLink: 'https://neptune.ai/',
  },

  // Additional Services
  {
    name: 'SendGrid',
    category: 'Communication',
    icon: 'i-ph:envelope',
    getApiKeyLink: 'https://app.sendgrid.com/settings/api_keys',
  },
  {
    name: 'Twilio',
    category: 'Communication',
    icon: 'i-ph:phone',
    getApiKeyLink: 'https://console.twilio.com/us1/develop/api-keys',
  },
  {
    name: 'Twilio Auth Token',
    category: 'Communication',
    icon: 'i-ph:phone',
    getApiKeyLink: 'https://console.twilio.com/us1/develop/api-keys',
  },
  {
    name: 'Stripe',
    category: 'Payment',
    icon: 'i-ph:credit-card',
    getApiKeyLink: 'https://dashboard.stripe.com/apikeys',
  },
  {
    name: 'PayPal',
    category: 'Payment',
    icon: 'i-ph:credit-card',
    getApiKeyLink: 'https://developer.paypal.com/developer/applications/',
  },
  {
    name: 'PayPal Secret',
    category: 'Payment',
    icon: 'i-ph:credit-card',
    getApiKeyLink: 'https://developer.paypal.com/developer/applications/',
  },
];

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ isOpen, onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState<ExtendedProviderInfo | null>(null);
  const [selectedModel, setSelectedModel] = useState<ExtendedModelInfo | null>(null);
  const [modelList, setModelList] = useState<ExtendedModelInfo[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => {
    // Load existing API keys from localStorage
    const keys: Record<string, string> = {};
    Object.keys(API_KEY_MAPPING).forEach((providerName) => {
      const envKey = API_KEY_MAPPING[providerName];
      const storedKey = localStorage.getItem(`CODERX_API_KEY_${envKey}`);

      if (storedKey) {
        keys[envKey] = storedKey;
      }
    });

    return keys;
  });
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [providerSearchQuery, setProviderSearchQuery] = useState('');
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [debouncedProviderSearchQuery, setDebouncedProviderSearchQuery] = useState('');
  const [debouncedModelSearchQuery, setDebouncedModelSearchQuery] = useState('');
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProviderSearchQuery(providerSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [providerSearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedModelSearchQuery(modelSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [modelSearchQuery]);

  // Load models when provider changes
  useEffect(() => {
    if (selectedProvider) {
      loadModelsForProvider(selectedProvider);
    }
  }, [selectedProvider]);

  // Reload models when API keys change
  useEffect(() => {
    if (selectedProvider && Object.keys(apiKeys).length > 0) {
      loadModelsForProvider(selectedProvider);
    }
  }, [apiKeys]);

  const loadModelsForProvider = async (provider: ExtendedProviderInfo) => {
    setIsLoadingModels(true);

    try {
      // Use the actual provider's getDynamicModels method
      const providerInstance = getProviderInstance(provider.name);

      if (providerInstance && typeof providerInstance.getDynamicModels === 'function') {
        // Pass the current API keys to the provider
        const dynamicModels = await providerInstance.getDynamicModels(apiKeys);
        setModelList(dynamicModels);
      } else {
        // Fallback to empty array if no dynamic loading available
        setModelList([]);
      }
    } catch (error) {
      console.error('Error loading models:', error);

      // Fallback to empty array
      setModelList([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Filter providers based on search
  const filteredProviders = useMemo(() => {
    const providers = COMPREHENSIVE_PROVIDER_LIST;

    if (!debouncedProviderSearchQuery) {
      return providers;
    }

    const fuzzyMatch = (query: string, text: string): boolean => {
      const queryLower = query.toLowerCase();
      const textLower = text.toLowerCase();
      let queryIndex = 0;

      for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
        if (textLower[i] === queryLower[queryIndex]) {
          queryIndex++;
        }
      }

      return queryIndex === queryLower.length;
    };

    const highlightText = (text: string, query: string): string => {
      if (!query) {
        return text;
      }

      const regex = new RegExp(`(${query})`, 'gi');

      return text.replace(regex, '<mark>$1</mark>');
    };

    return providers
      .filter((provider) => {
        const match = fuzzyMatch(debouncedProviderSearchQuery, provider.name);
        return match;
      })
      .map((provider) => ({
        ...provider,
        highlightedName: highlightText(provider.name, debouncedProviderSearchQuery),
      }));
  }, [debouncedProviderSearchQuery]);

  // Filter models based on search
  const filteredModels = useMemo(() => {
    if (!debouncedModelSearchQuery) {
      return modelList;
    }

    const fuzzyMatch = (query: string, text: string): boolean => {
      const queryLower = query.toLowerCase();
      const textLower = text.toLowerCase();
      let queryIndex = 0;

      for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
        if (textLower[i] === queryLower[queryIndex]) {
          queryIndex++;
        }
      }

      return queryIndex === queryLower.length;
    };

    const highlightText = (text: string, query: string): string => {
      if (!query) {
        return text;
      }

      const regex = new RegExp(`(${query})`, 'gi');

      return text.replace(regex, '<mark>$1</mark>');
    };

    return modelList
      .filter((model) => {
        const match =
          fuzzyMatch(debouncedModelSearchQuery, model.name) || fuzzyMatch(debouncedModelSearchQuery, model.label);
        return match;
      })
      .map((model) => ({
        ...model,
        highlightedName: highlightText(model.name, debouncedModelSearchQuery),
        highlightedLabel: highlightText(model.label, debouncedModelSearchQuery),
      }));
  }, [modelList, debouncedModelSearchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (providerDropdownRef.current && !providerDropdownRef.current.contains(event.target as Node)) {
        setIsProviderDropdownOpen(false);
      }

      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProviderSelect = (provider: ExtendedProviderInfo) => {
    setSelectedProvider(provider);
    setSelectedModel(null);
    setIsProviderDropdownOpen(false);
    setProviderSearchQuery('');
  };

  const handleModelSelect = (model: ExtendedModelInfo) => {
    setSelectedModel(model);
    setIsModelDropdownOpen(false);
    setModelSearchQuery('');
  };

  const handleApiKeyChange = (key: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveConfiguration = () => {
    // Save API keys to localStorage for demonstration
    Object.entries(apiKeys).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(`CODERX_API_KEY_${key}`, value);
      }
    });

    toast.success('API keys saved successfully!');
    onClose();
  };

  const getApiKeyField = (provider: ExtendedProviderInfo) => {
    const apiKeyName = API_KEY_MAPPING[provider.name];

    if (!apiKeyName) {
      return null;
    }

    if (provider.name === 'Amazon Bedrock') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="aws-access-key" className="text-white">
              AWS Access Key ID
            </Label>
            <Input
              id="aws-access-key"
              type="password"
              value={apiKeys.AWS_ACCESS_KEY_ID || ''}
              onChange={(e) => handleApiKeyChange('AWS_ACCESS_KEY_ID', e.target.value)}
              placeholder="Enter AWS Access Key ID"
              className="w-full bg-black/20 backdrop-blur-lg border border-blue-500/30 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <div>
            <Label htmlFor="aws-secret-key" className="text-white">
              AWS Secret Access Key
            </Label>
            <Input
              id="aws-secret-key"
              type="password"
              value={apiKeys.AWS_SECRET_ACCESS_KEY || ''}
              onChange={(e) => handleApiKeyChange('AWS_SECRET_ACCESS_KEY', e.target.value)}
              placeholder="Enter AWS Secret Access Key"
              className="w-full bg-black/20 backdrop-blur-lg border border-blue-500/30 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <div>
            <Label htmlFor="aws-region" className="text-white">
              AWS Region
            </Label>
            <Input
              id="aws-region"
              type="text"
              value={apiKeys.AWS_REGION || ''}
              onChange={(e) => handleApiKeyChange('AWS_REGION', e.target.value)}
              placeholder="Enter AWS Region (e.g., us-east-1)"
              className="w-full bg-black/20 backdrop-blur-lg border border-blue-500/30 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      );
    }

    if (provider.name === 'Supabase') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="supabase-url" className="text-white">
              Supabase URL
            </Label>
            <Input
              id="supabase-url"
              type="url"
              value={apiKeys.SUPABASE_URL || ''}
              onChange={(e) => handleApiKeyChange('SUPABASE_URL', e.target.value)}
              placeholder="Enter Supabase URL"
              className="w-full bg-black/20 backdrop-blur-lg border border-blue-500/30 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <div>
            <Label htmlFor="supabase-anon-key" className="text-white">
              Supabase Anon Key
            </Label>
            <Input
              id="supabase-anon-key"
              type="password"
              value={apiKeys.SUPABASE_ANON_KEY || ''}
              onChange={(e) => handleApiKeyChange('SUPABASE_ANON_KEY', e.target.value)}
              placeholder="Enter Supabase Anon Key"
              className="w-full bg-black/20 backdrop-blur-lg border border-blue-500/30 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      );
    }

    return (
      <div>
        <Label htmlFor={apiKeyName} className="text-white">
          {provider.name} API Key
        </Label>
        <Input
          id={apiKeyName}
          type="password"
          value={apiKeys[apiKeyName] || ''}
          onChange={(e) => handleApiKeyChange(apiKeyName, e.target.value)}
          placeholder={`Enter ${provider.name} API Key`}
          className="w-full bg-black/20 backdrop-blur-lg border border-blue-500/30 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        />
        <p className="text-gray-400 text-sm mt-1">
          Get your API key from{' '}
          <a
            href={provider.getApiKeyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {provider.getApiKeyLink}
          </a>
        </p>
      </div>
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-blue-500/30 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/30 bg-black/10 backdrop-blur-lg rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="i-ph:key text-blue-400 text-xl" />
            <h2 className="text-xl font-semibold text-white">API Key Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
          >
            <div className="i-ph:x text-lg" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-transparent">
          <div className="space-y-8">
            {/* Provider Selection */}
            <div className="space-y-3">
              <Label className="text-white font-semibold">Select AI Provider</Label>
              <div className="relative" ref={providerDropdownRef}>
                <div
                  className={classNames(
                    'w-full p-3 rounded-lg border border-blue-500/30 bg-black/20 backdrop-blur-lg text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/50 transition-all cursor-pointer hover:border-blue-500/50',
                    isProviderDropdownOpen ? 'ring-2 ring-blue-500/50 border-blue-500/50' : undefined,
                  )}
                  onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">
                      {selectedProvider ? selectedProvider.name : 'Choose a provider...'}
                    </span>
                    <div className="i-ph:caret-down text-gray-400" />
                  </div>
                </div>

                {isProviderDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 py-2 rounded-lg border border-blue-500/30 bg-black/30 backdrop-blur-xl shadow-xl">
                    <div className="px-3 py-2 border-b border-blue-500/20">
                      <div className="relative">
                        <div className="i-ph:magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search providers..."
                          value={providerSearchQuery}
                          onChange={(e) => setProviderSearchQuery(e.target.value)}
                          className="pl-10 bg-black/20 backdrop-blur-lg border border-blue-500/30 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                        {providerSearchQuery && (
                          <button
                            onClick={() => setProviderSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            <div className="i-ph:x text-sm" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredProviders.length > 0 ? (
                        filteredProviders.map((provider) => (
                          <div
                            key={provider.name}
                            className="px-3 py-2.5 text-sm cursor-pointer rounded-md mx-1 hover:bg-gray-700/50 text-white transition-colors"
                            onClick={() => handleProviderSelect(provider)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={classNames(provider.icon, 'text-lg')} />
                              <span dangerouslySetInnerHTML={{ __html: provider.highlightedName || provider.name }} />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-400 text-sm">
                          {debouncedProviderSearchQuery
                            ? `No providers match "${debouncedProviderSearchQuery}"`
                            : 'No providers available'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Model Selection */}
            {selectedProvider && (
              <div className="space-y-3">
                <Label className="text-white font-semibold">Select Model</Label>
                <div className="relative" ref={modelDropdownRef}>
                  <div
                    className={classNames(
                      'w-full p-3 rounded-lg border border-blue-500/30 bg-black/20 backdrop-blur-lg text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/50 transition-all cursor-pointer hover:border-blue-500/50',
                      isModelDropdownOpen ? 'ring-2 ring-blue-500/50 border-blue-500/50' : undefined,
                    )}
                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">
                        {selectedModel
                          ? selectedModel.label
                          : isLoadingModels
                            ? 'Loading models...'
                            : 'Choose a model...'}
                      </span>
                      <div className="i-ph:caret-down text-gray-400" />
                    </div>
                  </div>

                  {isModelDropdownOpen && (
                    <div className="absolute z-20 w-full mt-2 py-2 rounded-lg border border-blue-500/30 bg-black/30 backdrop-blur-xl shadow-xl">
                      <div className="px-3 py-2 border-b border-blue-500/20">
                        <div className="relative">
                          <div className="i-ph:magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search models..."
                            value={modelSearchQuery}
                            onChange={(e) => setModelSearchQuery(e.target.value)}
                            className="pl-10 bg-black/20 backdrop-blur-lg border border-blue-500/30 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          />
                          {modelSearchQuery && (
                            <button
                              onClick={() => setModelSearchQuery('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              <div className="i-ph:x text-sm" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredModels.length > 0 ? (
                          filteredModels.map((model) => (
                            <div
                              key={model.name}
                              className="px-3 py-2.5 text-sm cursor-pointer rounded-md mx-1 hover:bg-gray-700/50 text-white transition-colors"
                              onClick={() => handleModelSelect(model)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div
                                    className="font-medium"
                                    dangerouslySetInnerHTML={{ __html: model.highlightedLabel || model.label }}
                                  />
                                  <div className="text-gray-400 text-xs">{model.name}</div>
                                </div>
                                <div className="text-gray-400 text-xs">
                                  {model.maxTokenAllowed ? `${Math.round(model.maxTokenAllowed / 1000)}K` : 'N/A'}{' '}
                                  tokens
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-400 text-sm">
                            {isLoadingModels ? 'Loading models...' : 'No models available'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* API Key Input */}
            {selectedProvider && getApiKeyField(selectedProvider)}

            {/* Provider Information */}
            {selectedProvider && (
              <div className="bg-black/20 backdrop-blur-lg rounded-lg p-5 border border-blue-500/30">
                <h3 className="text-white font-semibold mb-2">{selectedProvider.name}</h3>
                <p className="text-sm text-gray-300 mb-3">
                  {selectedProvider.category} • {selectedProvider.name} provides AI models and services for various use
                  cases.
                </p>
                <a
                  href={selectedProvider.getApiKeyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
                >
                  Get API Key →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-blue-500/30 bg-black/10 backdrop-blur-lg rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              {selectedProvider ? `Configure ${selectedProvider.name} API key` : 'Select a provider to configure'}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border border-gray-600/50 text-white hover:bg-gray-800/50 bg-gray-900/30"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveConfiguration}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 transition-all shadow-lg"
                disabled={!selectedProvider || !Object.values(apiKeys).some((key) => key)}
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
