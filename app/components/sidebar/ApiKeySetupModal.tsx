import React, { useState, useEffect } from 'react';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { Button } from '~/components/ui/Button';
import { IconButton } from '~/components/ui/IconButton';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

interface ApiKeySetupModalProps {
  open: boolean;
  onClose: () => void;
}

interface ProviderApiKey {
  name: string;
  displayName: string;
  apiKey: string;
  isEnvSet: boolean;
  description: string;
  getKeyUrl: string;
}

const PROVIDERS: ProviderApiKey[] = [
  {
    name: 'openai',
    displayName: 'OpenAI',
    apiKey: '',
    isEnvSet: false,
    description: 'GPT-4, GPT-3.5 Turbo, and other OpenAI models',
    getKeyUrl: 'https://platform.openai.com/api-keys',
  },
  {
    name: 'anthropic',
    displayName: 'Anthropic',
    apiKey: '',
    isEnvSet: false,
    description: 'Claude 3.5 Sonnet, Claude 3 Haiku, and other Anthropic models',
    getKeyUrl: 'https://console.anthropic.com/',
  },
  {
    name: 'google',
    displayName: 'Google AI',
    apiKey: '',
    isEnvSet: false,
    description: 'Gemini Pro, Gemini Pro Vision, and other Google AI models',
    getKeyUrl: 'https://makersuite.google.com/app/apikey',
  },
  {
    name: 'azure-openai',
    displayName: 'Azure OpenAI',
    apiKey: '',
    isEnvSet: false,
    description: 'GPT-4 and GPT-3.5 models via Azure OpenAI Service',
    getKeyUrl: 'https://portal.azure.com/',
  },
  {
    name: 'cohere',
    displayName: 'Cohere',
    apiKey: '',
    isEnvSet: false,
    description: 'Command, Generate, and other Cohere models',
    getKeyUrl: 'https://dashboard.cohere.ai/api-keys',
  },
  {
    name: 'huggingface',
    displayName: 'Hugging Face',
    apiKey: '',
    isEnvSet: false,
    description: 'Various open-source models via Hugging Face Inference API',
    getKeyUrl: 'https://huggingface.co/settings/tokens',
  },
  {
    name: 'groq',
    displayName: 'Groq',
    apiKey: '',
    isEnvSet: false,
    description: 'Fast inference for Llama, Mixtral, and other models',
    getKeyUrl: 'https://console.groq.com/keys',
  },
  {
    name: 'mistral',
    displayName: 'Mistral AI',
    apiKey: '',
    isEnvSet: false,
    description: 'Mistral 7B, Mixtral 8x7B, and other Mistral models',
    getKeyUrl: 'https://console.mistral.ai/api-keys',
  },
  {
    name: 'perplexity',
    displayName: 'Perplexity',
    apiKey: '',
    isEnvSet: false,
    description: 'Perplexity Pro and other Perplexity models',
    getKeyUrl: 'https://www.perplexity.ai/settings/api',
  },
  {
    name: 'deepseek',
    displayName: 'DeepSeek',
    apiKey: '',
    isEnvSet: false,
    description: 'DeepSeek Coder, DeepSeek Chat, and other DeepSeek models',
    getKeyUrl: 'https://platform.deepseek.com/api_keys',
  },
];

export const ApiKeySetupModal: React.FC<ApiKeySetupModalProps> = ({ open, onClose }) => {
  const [providers, setProviders] = useState<ProviderApiKey[]>(PROVIDERS);
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState('');

  useEffect(() => {
    if (open) {
      loadApiKeys();
      checkEnvKeys();
    }
  }, [open]);

  const loadApiKeys = () => {
    const storedApiKeys = Cookies.get('apiKeys');

    if (storedApiKeys) {
      const apiKeys = JSON.parse(storedApiKeys);
      setProviders((prev) =>
        prev.map((provider) => ({
          ...provider,
          apiKey: apiKeys[provider.name] || '',
        })),
      );
    }
  };

  const checkEnvKeys = async () => {
    for (const provider of providers) {
      try {
        const response = await fetch(`/api/check-env-key?provider=${encodeURIComponent(provider.name)}`);
        const data = await response.json();
        const isSet = (data as { isSet: boolean }).isSet;

        setProviders((prev) => prev.map((p) => (p.name === provider.name ? { ...p, isEnvSet: isSet } : p)));
      } catch (error) {
        console.error(`Failed to check environment key for ${provider.name}:`, error);
      }
    }
  };

  const handleSaveApiKey = (providerName: string) => {
    const currentKeys = Cookies.get('apiKeys');
    const apiKeys = currentKeys ? JSON.parse(currentKeys) : {};
    apiKeys[providerName] = tempApiKey;
    Cookies.set('apiKeys', JSON.stringify(apiKeys));

    setProviders((prev) => prev.map((p) => (p.name === providerName ? { ...p, apiKey: tempApiKey } : p)));

    setEditingProvider(null);
    setTempApiKey('');
    toast.success(`${providerName} API key saved successfully!`);
  };

  const handleDeleteApiKey = (providerName: string) => {
    const currentKeys = Cookies.get('apiKeys');
    const apiKeys = currentKeys ? JSON.parse(currentKeys) : {};
    delete apiKeys[providerName];
    Cookies.set('apiKeys', JSON.stringify(apiKeys));

    setProviders((prev) => prev.map((p) => (p.name === providerName ? { ...p, apiKey: '' } : p)));

    toast.success(`${providerName} API key removed!`);
  };

  const startEditing = (provider: ProviderApiKey) => {
    setEditingProvider(provider.name);
    setTempApiKey(provider.apiKey);
  };

  const cancelEditing = () => {
    setEditingProvider(null);
    setTempApiKey('');
  };

  return (
    <DialogRoot open={open}>
      <Dialog onBackdrop={onClose} onClose={onClose}>
        <div className="p-6 bg-white dark:bg-gray-950 max-w-5xl max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <DialogTitle className="text-gray-900 dark:text-white text-2xl font-bold mb-3">
              API Key Configuration
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              Configure your API keys for different AI providers. You can either set them here (stored in browser
              cookies) or add them to your .env file for better security.
            </DialogDescription>
          </div>

          {/* Providers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-gray-50 dark:bg-gray-900"
              >
                {/* Provider Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{provider.displayName}</h3>
                    {provider.isEnvSet && (
                      <span className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-medium">
                        Configured via .env
                      </span>
                    )}
                  </div>
                </div>

                {/* Provider Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{provider.description}</p>

                {/* API Key Input */}
                {editingProvider === provider.name ? (
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder={`Enter your ${provider.displayName} API key`}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={cancelEditing}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleSaveApiKey(provider.name)} disabled={!tempApiKey.trim()}>
                        Save API Key
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(provider.getKeyUrl, '_blank')}>
                        Get API Key
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => startEditing(provider)}>
                        {provider.apiKey ? 'Edit' : 'Add'} API Key
                      </Button>
                    </div>
                    {provider.apiKey && !provider.isEnvSet && (
                      <IconButton
                        title="Delete API Key"
                        onClick={() => handleDeleteApiKey(provider.name)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <span className="i-ph:trash h-4 w-4" />
                      </IconButton>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Environment Variables Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Using Environment Variables (Recommended)
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
              For better security, you can set API keys as environment variables in your .env file:
            </p>
            <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono overflow-x-auto">
              <div># Copy example.env to .env and fill in your keys</div>
              <div>OPENAI_API_KEY=your_openai_api_key_here</div>
              <div>ANTHROPIC_API_KEY=your_anthropic_api_key_here</div>
              <div>GOOGLE_API_KEY=your_google_api_key_here</div>
              <div># ... and so on for other providers</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <DialogButton type="secondary" onClick={onClose}>
            Close
          </DialogButton>
        </div>
      </Dialog>
    </DialogRoot>
  );
};
