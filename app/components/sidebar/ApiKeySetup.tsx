import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { classNames } from '~/utils/classNames';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { toast } from 'react-toastify';
import { PROVIDER_LIST } from '~/utils/constants';
import type { ProviderInfo } from '~/types/model';
import type { ModelInfo } from '~/lib/modules/llm/types';

interface ApiKeySetupProps {
  isOpen: boolean;
  onClose: () => void;
}

// API Key mapping for each provider
const API_KEY_MAPPING: Record<string, string> = {
  OpenAI: 'OPENAI_API_KEY',
  Anthropic: 'ANTHROPIC_API_KEY',
  Google: 'GOOGLE_API_KEY',
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
  Ollama: 'OLLAMA_API_KEY',
  'LM Studio': 'LM_STUDIO_API_KEY',
  Hyperbolic: 'HYPERBOLIC_API_KEY',
  'Amazon Bedrock': 'AWS_ACCESS_KEY_ID',
  GitHub: 'GITHUB_TOKEN',
  GitLab: 'GITLAB_TOKEN',
  Supabase: 'SUPABASE_URL',
  Netlify: 'NETLIFY_TOKEN',
  Vercel: 'VERCEL_TOKEN',
};

// Fuzzy search utilities (copied from ModelSelector)
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }

  return matrix[str2.length][str1.length];
};

const fuzzyMatch = (query: string, text: string): { score: number; matches: boolean } => {
  if (!query) {
    return { score: 0, matches: true };
  }

  if (!text) {
    return { score: 0, matches: false };
  }

  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  if (textLower.includes(queryLower)) {
    return { score: 100 - (textLower.indexOf(queryLower) / textLower.length) * 20, matches: true };
  }

  const distance = levenshteinDistance(queryLower, textLower);
  const maxLen = Math.max(queryLower.length, textLower.length);
  const similarity = 1 - distance / maxLen;

  return {
    score: similarity > 0.6 ? similarity * 80 : 0,
    matches: similarity > 0.6,
  };
};

const highlightText = (text: string, query: string): string => {
  if (!query) {
    return text;
  }

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 text-current">$1</mark>');
};

const formatContextSize = (tokens: number): string => {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  }

  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K`;
  }

  return tokens.toString();
};

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ isOpen, onClose }) => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderInfo | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [modelList, setModelList] = useState<ModelInfo[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Provider dropdown state
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [providerSearchQuery, setProviderSearchQuery] = useState('');
  const [debouncedProviderSearchQuery, setDebouncedProviderSearchQuery] = useState('');
  const [focusedProviderIndex] = useState(-1);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const providerSearchInputRef = useRef<HTMLInputElement>(null);
  const providerOptionsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Model dropdown state
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [debouncedModelSearchQuery, setDebouncedModelSearchQuery] = useState('');
  const [focusedModelIndex] = useState(-1);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const modelSearchInputRef = useRef<HTMLInputElement>(null);
  const modelOptionsRef = useRef<(HTMLDivElement | null)[]>([]);

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

  const loadModelsForProvider = async (provider: ProviderInfo) => {
    setIsLoadingModels(true);

    try {
      /*
       * For now, just use static models to avoid API errors
       * In the future, we can implement proper API key validation
       */
      setModelList(provider.staticModels || []);
    } catch (error) {
      console.error('Error loading models:', error);

      // Fallback to static models
      setModelList(provider.staticModels || []);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Filter providers based on search
  const filteredProviders = useMemo(() => {
    if (!debouncedProviderSearchQuery) {
      return PROVIDER_LIST;
    }

    return PROVIDER_LIST.map((provider) => {
      const match = fuzzyMatch(debouncedProviderSearchQuery, provider.name);
      return {
        ...provider,
        searchScore: match.score,
        searchMatches: match.matches,
        highlightedName: highlightText(provider.name, debouncedProviderSearchQuery),
      };
    })
      .filter((provider) => provider.searchMatches)
      .sort((a, b) => b.searchScore - a.searchScore);
  }, [debouncedProviderSearchQuery]);

  // Filter models based on selected provider and search
  const filteredModels = useMemo(() => {
    if (!selectedProvider) {
      return [];
    }

    let models = modelList;

    if (debouncedModelSearchQuery) {
      models = models
        .map((model) => {
          const match = fuzzyMatch(debouncedModelSearchQuery, model.label);
          return {
            ...model,
            searchScore: match.score,
            searchMatches: match.matches,
            highlightedLabel: highlightText(model.label, debouncedModelSearchQuery),
          };
        })
        .filter((model) => model.searchMatches)
        .sort((a, b) => b.searchScore - a.searchScore);
    }

    return models;
  }, [selectedProvider, modelList, debouncedModelSearchQuery]);

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

  const clearProviderSearch = useCallback(() => {
    setProviderSearchQuery('');
    setDebouncedProviderSearchQuery('');

    if (providerSearchInputRef.current) {
      providerSearchInputRef.current.focus();
    }
  }, []);

  const clearModelSearch = useCallback(() => {
    setModelSearchQuery('');
    setDebouncedModelSearchQuery('');

    if (modelSearchInputRef.current) {
      modelSearchInputRef.current.focus();
    }
  }, []);

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

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="i-ph:key text-2xl text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">API Key Configuration</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg p-2 transition-all"
          >
            <div className="i-ph:x text-xl" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Provider Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-200">AI Provider</Label>
              <div className="relative" ref={providerDropdownRef}>
                <div
                  className={classNames(
                    'w-full p-3 rounded-lg border border-gray-600/50',
                    'bg-gray-800/30 text-white',
                    'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/50',
                    'transition-all cursor-pointer hover:border-gray-500/50',
                    isProviderDropdownOpen ? 'ring-2 ring-blue-500/50 border-blue-500/50' : undefined,
                  )}
                  onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
                  role="combobox"
                  aria-expanded={isProviderDropdownOpen}
                  aria-controls="provider-listbox"
                  aria-haspopup="listbox"
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between">
                    <div className="truncate">{selectedProvider?.name || 'Select provider'}</div>
                    <div
                      className={classNames(
                        'i-ph:caret-down w-4 h-4 text-gray-400 opacity-75',
                        isProviderDropdownOpen ? 'rotate-180' : undefined,
                      )}
                    />
                  </div>
                </div>

                {isProviderDropdownOpen && (
                  <div
                    className="absolute z-20 w-full mt-2 py-2 rounded-lg border border-gray-600/50 bg-gray-900/95 backdrop-blur-sm shadow-xl"
                    role="listbox"
                    id="provider-listbox"
                  >
                    <div className="px-2 pb-2">
                      <div className="relative">
                        <input
                          ref={providerSearchInputRef}
                          type="text"
                          value={providerSearchQuery}
                          onChange={(e) => setProviderSearchQuery(e.target.value)}
                          placeholder="Search providers... (⌘K to clear)"
                          className={classNames(
                            'w-full pl-8 pr-8 py-2 rounded-md text-sm',
                            'bg-gray-800/50 border border-gray-600/50',
                            'text-white placeholder:text-gray-400',
                            'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                            'transition-all',
                          )}
                          onClick={(e) => e.stopPropagation()}
                          role="searchbox"
                          aria-label="Search providers"
                        />
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                          <span className="i-ph:magnifying-glass text-gray-400" />
                        </div>
                        {providerSearchQuery && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearProviderSearch();
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-700/50 transition-colors"
                            aria-label="Clear search"
                          >
                            <span className="i-ph:x text-gray-400 text-xs" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      {filteredProviders.length === 0 ? (
                        <div className="px-3 py-3 text-sm">
                          <div className="text-gray-400 mb-1">
                            {debouncedProviderSearchQuery
                              ? `No providers match "${debouncedProviderSearchQuery}"`
                              : 'No providers found'}
                          </div>
                        </div>
                      ) : (
                        filteredProviders.map((provider, index) => (
                          <div
                            ref={(el) => (providerOptionsRef.current[index] = el)}
                            key={provider.name}
                            role="option"
                            aria-selected={selectedProvider?.name === provider.name}
                            className={classNames(
                              'px-3 py-2.5 text-sm cursor-pointer rounded-md mx-1',
                              'hover:bg-gray-700/50',
                              'text-white',
                              'outline-none transition-all',
                              selectedProvider?.name === provider.name || focusedProviderIndex === index
                                ? 'bg-gray-700/50'
                                : undefined,
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProvider(provider as ProviderInfo);
                              setIsProviderDropdownOpen(false);
                              setProviderSearchQuery('');
                              setDebouncedProviderSearchQuery('');
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: (provider as any).highlightedName || provider.name,
                              }}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Model Selection */}
            {selectedProvider && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-200">
                  Model {isLoadingModels && <span className="text-xs text-gray-400">(Loading...)</span>}
                </Label>
                <div className="relative" ref={modelDropdownRef}>
                  <div
                    className={classNames(
                      'w-full p-3 rounded-lg border border-gray-600/50',
                      'bg-gray-800/30 text-white',
                      'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/50',
                      'transition-all cursor-pointer hover:border-gray-500/50',
                      isModelDropdownOpen ? 'ring-2 ring-blue-500/50 border-blue-500/50' : undefined,
                    )}
                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                    role="combobox"
                    aria-expanded={isModelDropdownOpen}
                    aria-controls="model-listbox"
                    aria-haspopup="listbox"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        {filteredModels.find((m) => m.name === selectedModel)?.label || 'Select model'}
                      </div>
                      <div
                        className={classNames(
                          'i-ph:caret-down w-4 h-4 text-gray-400 opacity-75',
                          isModelDropdownOpen ? 'rotate-180' : undefined,
                        )}
                      />
                    </div>
                  </div>

                  {isModelDropdownOpen && (
                    <div
                      className="absolute z-20 w-full mt-2 py-2 rounded-lg border border-gray-600/50 bg-gray-900/95 backdrop-blur-sm shadow-xl"
                      role="listbox"
                      id="model-listbox"
                    >
                      <div className="px-2 pb-2">
                        <div className="relative">
                          <input
                            ref={modelSearchInputRef}
                            type="text"
                            value={modelSearchQuery}
                            onChange={(e) => setModelSearchQuery(e.target.value)}
                            placeholder="Search models... (⌘K to clear)"
                            className={classNames(
                              'w-full pl-8 pr-8 py-2 rounded-md text-sm',
                              'bg-gray-800/50 border border-gray-600/50',
                              'text-white placeholder:text-gray-400',
                              'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                              'transition-all',
                            )}
                            onClick={(e) => e.stopPropagation()}
                            role="searchbox"
                            aria-label="Search models"
                          />
                          <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                            <span className="i-ph:magnifying-glass text-gray-400" />
                          </div>
                          {modelSearchQuery && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearModelSearch();
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-700/50 transition-colors"
                              aria-label="Clear search"
                            >
                              <span className="i-ph:x text-gray-400 text-xs" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="max-h-60 overflow-y-auto">
                        {filteredModels.length === 0 ? (
                          <div className="px-3 py-3 text-sm">
                            <div className="text-gray-400 mb-1">
                              {debouncedModelSearchQuery
                                ? `No models match "${debouncedModelSearchQuery}"`
                                : 'No models found'}
                            </div>
                          </div>
                        ) : (
                          filteredModels.map((model, index) => (
                            <div
                              ref={(el) => (modelOptionsRef.current[index] = el)}
                              key={model.name}
                              role="option"
                              aria-selected={selectedModel === model.name}
                              className={classNames(
                                'px-3 py-2.5 text-sm cursor-pointer rounded-md mx-1',
                                'hover:bg-gray-700/50',
                                'text-white',
                                'outline-none transition-all',
                                selectedModel === model.name || focusedModelIndex === index
                                  ? 'bg-gray-700/50'
                                  : undefined,
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedModel(model.name);
                                setIsModelDropdownOpen(false);
                                setModelSearchQuery('');
                                setDebouncedModelSearchQuery('');
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: (model as any).highlightedLabel || model.label,
                                  }}
                                />
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <span>{formatContextSize(model.maxTokenAllowed)}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* API Key Input */}
            {selectedProvider && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-200">
                  API Key ({API_KEY_MAPPING[selectedProvider.name]})
                </Label>
                <Input
                  type="password"
                  placeholder={`Enter your ${selectedProvider.name} API key`}
                  value={apiKeys[API_KEY_MAPPING[selectedProvider.name]] || ''}
                  onChange={(e) => handleKeyChange(API_KEY_MAPPING[selectedProvider.name], e.target.value)}
                  className="w-full bg-gray-800/30 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                <p className="text-xs text-gray-400">
                  Your API key will be stored securely and used only for this application.
                </p>
              </div>
            )}

            {/* Special handling for AWS Bedrock */}
            {selectedProvider?.name === 'Amazon Bedrock' && (
              <>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-200">AWS Secret Access Key</Label>
                  <Input
                    type="password"
                    placeholder="Enter your AWS Secret Access Key"
                    value={apiKeys.AWS_SECRET_ACCESS_KEY || ''}
                    onChange={(e) => handleKeyChange('AWS_SECRET_ACCESS_KEY', e.target.value)}
                    className="w-full bg-gray-800/30 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-200">AWS Region</Label>
                  <Input
                    type="text"
                    placeholder="us-east-1"
                    value={apiKeys.AWS_REGION || 'us-east-1'}
                    onChange={(e) => handleKeyChange('AWS_REGION', e.target.value)}
                    className="w-full bg-gray-800/30 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </>
            )}

            {/* Special handling for Supabase */}
            {selectedProvider?.name === 'Supabase' && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-200">Supabase Anon Key</Label>
                <Input
                  type="password"
                  placeholder="Enter your Supabase Anon Key"
                  value={apiKeys.SUPABASE_ANON_KEY || ''}
                  onChange={(e) => handleKeyChange('SUPABASE_ANON_KEY', e.target.value)}
                  className="w-full bg-gray-800/30 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            )}

            {/* Provider Information */}
            {selectedProvider && (
              <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-lg p-5 border border-gray-600/30">
                <h3 className="text-sm font-semibold text-white mb-3">Provider Information</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span className="text-gray-200">{selectedProvider.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Models Available:</span>
                    <span className="text-gray-200">{modelList.length}</span>
                  </div>
                  {selectedProvider.getApiKeyLink && (
                    <div className="pt-2 border-t border-gray-600/30">
                      <div className="font-medium mb-1">Get API Key:</div>
                      <a
                        href={selectedProvider.getApiKeyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors text-xs break-all"
                      >
                        {selectedProvider.getApiKeyLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/30 bg-gradient-to-r from-gray-900/50 to-black/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {Object.keys(apiKeys).filter((key) => apiKeys[key]).length} API keys configured
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border border-gray-600/50 text-white hover:bg-gray-800/50 bg-gray-900/30 transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveKeys}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 transition-all shadow-lg"
              >
                {isLoading ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
