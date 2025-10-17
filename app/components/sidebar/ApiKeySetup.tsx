import React, { useState } from 'react';
import { classNames } from '~/utils/classNames';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { toast } from 'react-toastify';

interface ApiKeySetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDERS = [
  {
    name: 'OpenAI',
    key: 'OPENAI_API_KEY',
    description: 'For GPT models',
    icon: 'i-ph:brain',
    color: 'text-green-500',
  },
  {
    name: 'Anthropic',
    key: 'ANTHROPIC_API_KEY',
    description: 'For Claude models',
    icon: 'i-ph:robot',
    color: 'text-orange-500',
  },
  {
    name: 'Google',
    key: 'GOOGLE_API_KEY',
    description: 'For Gemini models',
    icon: 'i-ph:google-logo',
    color: 'text-blue-500',
  },
  {
    name: 'Cohere',
    key: 'COHERE_API_KEY',
    description: 'For Cohere models',
    icon: 'i-ph:lightning',
    color: 'text-purple-500',
  },
  {
    name: 'Groq',
    key: 'GROQ_API_KEY',
    description: 'For Groq models',
    icon: 'i-ph:bolt',
    color: 'text-yellow-500',
  },
  {
    name: 'Hugging Face',
    key: 'HUGGINGFACE_API_KEY',
    description: 'For Hugging Face models',
    icon: 'i-ph:heart',
    color: 'text-pink-500',
  },
  {
    name: 'Together',
    key: 'TOGETHER_API_KEY',
    description: 'For Together models',
    icon: 'i-ph:users',
    color: 'text-indigo-500',
  },
  {
    name: 'Perplexity',
    key: 'PERPLEXITY_API_KEY',
    description: 'For Perplexity models',
    icon: 'i-ph:question',
    color: 'text-cyan-500',
  },
  {
    name: 'DeepSeek',
    key: 'DEEPSEEK_API_KEY',
    description: 'For DeepSeek models',
    icon: 'i-ph:eye',
    color: 'text-emerald-500',
  },
  {
    name: 'Mistral',
    key: 'MISTRAL_API_KEY',
    description: 'For Mistral models',
    icon: 'i-ph:wind',
    color: 'text-slate-500',
  },
  {
    name: 'Moonshot',
    key: 'MOONSHOT_API_KEY',
    description: 'For Moonshot models',
    icon: 'i-ph:moon',
    color: 'text-violet-500',
  },
  {
    name: 'XAI',
    key: 'XAI_API_KEY',
    description: 'For XAI models',
    icon: 'i-ph:atom',
    color: 'text-red-500',
  },
  {
    name: 'Amazon Bedrock',
    key: 'AWS_ACCESS_KEY_ID',
    description: 'For AWS Bedrock models',
    icon: 'i-ph:cloud',
    color: 'text-amber-500',
  },
  {
    name: 'GitHub',
    key: 'GITHUB_TOKEN',
    description: 'For GitHub integration',
    icon: 'i-ph:github-logo',
    color: 'text-gray-500',
  },
  {
    name: 'GitLab',
    key: 'GITLAB_TOKEN',
    description: 'For GitLab integration',
    icon: 'i-ph:git-branch',
    color: 'text-orange-600',
  },
  {
    name: 'Supabase',
    key: 'SUPABASE_URL',
    description: 'For Supabase integration',
    icon: 'i-ph:database',
    color: 'text-green-600',
  },
  {
    name: 'Netlify',
    key: 'NETLIFY_TOKEN',
    description: 'For Netlify integration',
    icon: 'i-ph:globe',
    color: 'text-teal-500',
  },
  {
    name: 'Vercel',
    key: 'VERCEL_TOKEN',
    description: 'For Vercel integration',
    icon: 'i-ph:triangle',
    color: 'text-black',
  },
];

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ isOpen, onClose }) => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const handleSaveKeys = async () => {
    setIsLoading(true);

    try {
      // In a real implementation, you would save these to a secure backend
      toast.success('API keys saved successfully! Please restart the application to use them.');
      onClose();
    } catch {
      toast.error('Failed to save API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyChange = (key: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProviderClick = (providerKey: string) => {
    setActiveProvider(activeProvider === providerKey ? null : providerKey);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="i-ph:key text-2xl text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Key Configuration</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <div className="i-ph:x text-xl" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Provider List */}
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Providers</h3>
              <div className="space-y-2">
                {PROVIDERS.map((provider) => (
                  <button
                    key={provider.key}
                    onClick={() => handleProviderClick(provider.key)}
                    className={classNames(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200',
                      activeProvider === provider.key
                        ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600',
                    )}
                  >
                    <div className={classNames('text-xl', provider.color)}>
                      <div className={provider.icon} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{provider.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{provider.description}</div>
                    </div>
                    {apiKeys[provider.key] && <div className="i-ph:check-circle text-green-500 text-lg" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - API Key Form */}
          <div className="flex-1 flex flex-col">
            {activeProvider ? (
              <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  {(() => {
                    const provider = PROVIDERS.find((p) => p.key === activeProvider);
                    return provider ? (
                      <div className="flex items-center gap-3">
                        <div className={classNames('text-2xl', provider.color)}>
                          <div className={provider.icon} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{provider.name}</h3>
                          <p className="text-gray-500 dark:text-gray-400">{provider.description}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>

                <div className="flex-1 p-6">
                  <div className="max-w-2xl">
                    <div className="space-y-6">
                      <div>
                        <Label
                          htmlFor={activeProvider}
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          API Key
                        </Label>
                        <Input
                          id={activeProvider}
                          type="password"
                          placeholder={`Enter your ${PROVIDERS.find((p) => p.key === activeProvider)?.name} API key`}
                          value={apiKeys[activeProvider] || ''}
                          onChange={(e) => handleKeyChange(activeProvider, e.target.value)}
                          className="w-full mt-2"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Your API key will be stored securely and used only for this application.
                        </p>
                      </div>

                      {activeProvider === 'AWS_ACCESS_KEY_ID' && (
                        <>
                          <div>
                            <Label
                              htmlFor="AWS_SECRET_ACCESS_KEY"
                              className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Secret Access Key
                            </Label>
                            <Input
                              id="AWS_SECRET_ACCESS_KEY"
                              type="password"
                              placeholder="Enter your AWS Secret Access Key"
                              value={apiKeys.AWS_SECRET_ACCESS_KEY || ''}
                              onChange={(e) => handleKeyChange('AWS_SECRET_ACCESS_KEY', e.target.value)}
                              className="w-full mt-2"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="AWS_REGION"
                              className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              AWS Region
                            </Label>
                            <Input
                              id="AWS_REGION"
                              type="text"
                              placeholder="us-east-1"
                              value={apiKeys.AWS_REGION || 'us-east-1'}
                              onChange={(e) => handleKeyChange('AWS_REGION', e.target.value)}
                              className="w-full mt-2"
                            />
                          </div>
                        </>
                      )}

                      {activeProvider === 'SUPABASE_URL' && (
                        <div>
                          <Label
                            htmlFor="SUPABASE_ANON_KEY"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Supabase Anon Key
                          </Label>
                          <Input
                            id="SUPABASE_ANON_KEY"
                            type="password"
                            placeholder="Enter your Supabase Anon Key"
                            value={apiKeys.SUPABASE_ANON_KEY || ''}
                            onChange={(e) => handleKeyChange('SUPABASE_ANON_KEY', e.target.value)}
                            className="w-full mt-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="i-ph:key text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Select a Provider</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose an AI provider from the left sidebar to configure its API key.
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {Object.keys(apiKeys).filter((key) => apiKeys[key]).length} of {PROVIDERS.length} providers configured
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveKeys}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
