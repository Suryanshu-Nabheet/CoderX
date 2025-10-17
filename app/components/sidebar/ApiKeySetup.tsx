import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import type { ProviderInfo } from '~/types/model';
import type { ModelInfo } from '~/lib/modules/llm/types';

// import { useDebounce } from '~/lib/hooks/useDebounce';

interface ApiKeySetupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Removed unused API_KEY_MAPPING

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ isOpen, onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState<ProviderInfo | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [modelList, setModelList] = useState<ModelInfo[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [providerSearchQuery, setProviderSearchQuery] = useState('');
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedProviderIndex, setFocusedProviderIndex] = useState(-1);
  const [focusedModelIndex, setFocusedModelIndex] = useState(-1);

  // Simple debounce implementation
  const [debouncedProviderSearchQuery, setDebouncedProviderSearchQuery] = useState(providerSearchQuery);
  const [debouncedModelSearchQuery, setDebouncedModelSearchQuery] = useState(modelSearchQuery);

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

  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const providerSearchInputRef = useRef<HTMLInputElement>(null);
  const modelSearchInputRef = useRef<HTMLInputElement>(null);
  const providerOptionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const modelOptionsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    const query = debouncedProviderSearchQuery.toLowerCase();

    return PROVIDER_LIST.map((provider) => {
      const name = provider.name.toLowerCase();

      if (name.includes(query)) {
        const highlightedName = provider.name.replace(
          new RegExp(`(${debouncedProviderSearchQuery})`, 'gi'),
          '<mark class="bg-blue-500/20 text-blue-300">$1</mark>',
        );
        return { ...provider, highlightedName };
      }

      return provider;
    }).filter((provider) => provider.name.toLowerCase().includes(query));
  }, [debouncedProviderSearchQuery]);

  // Filter models based on search
  const filteredModels = useMemo(() => {
    if (!debouncedModelSearchQuery) {
      return modelList;
    }

    const query = debouncedModelSearchQuery.toLowerCase();

    return modelList.filter((model) => model.label.toLowerCase().includes(query));
  }, [modelList, debouncedModelSearchQuery]);

  const handleApiKeyChange = (key: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveKeys = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would save these to your backend
      console.log('Saving API keys:', apiKeys);

      // Show success message
      alert('API keys saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving API keys:', error);
      alert('Failed to save API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const clearProviderSearch = useCallback(() => {
    setProviderSearchQuery('');
    setDebouncedProviderSearchQuery('');
    providerSearchInputRef.current?.focus();
  }, []);

  const clearModelSearch = useCallback(() => {
    setModelSearchQuery('');
    setDebouncedModelSearchQuery('');
    modelSearchInputRef.current?.focus();
  }, []);

  // Keyboard navigation for providers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isProviderDropdownOpen) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedProviderIndex((prev) => Math.min(prev + 1, filteredProviders.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedProviderIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();

          if (focusedProviderIndex >= 0 && focusedProviderIndex < filteredProviders.length) {
            const provider = filteredProviders[focusedProviderIndex];
            setSelectedProvider(provider as ProviderInfo);
            setIsProviderDropdownOpen(false);
            setProviderSearchQuery('');
            setDebouncedProviderSearchQuery('');
          }

          break;
        case 'Escape':
          setIsProviderDropdownOpen(false);
          break;
        case 'k':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            clearProviderSearch();
          }

          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isProviderDropdownOpen, focusedProviderIndex, filteredProviders, clearProviderSearch]);

  // Keyboard navigation for models
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModelDropdownOpen) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedModelIndex((prev) => Math.min(prev + 1, filteredModels.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedModelIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();

          if (focusedModelIndex >= 0 && focusedModelIndex < filteredModels.length) {
            const model = filteredModels[focusedModelIndex];
            setSelectedModel(model.name);
            setIsModelDropdownOpen(false);
            setModelSearchQuery('');
            setDebouncedModelSearchQuery('');
          }

          break;
        case 'Escape':
          setIsModelDropdownOpen(false);
          break;
        case 'k':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            clearModelSearch();
          }

          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModelDropdownOpen, focusedModelIndex, filteredModels, clearModelSearch]);

  // Click outside to close dropdowns
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
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col border border-blue-500/30 overflow-hidden">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-blue-600/20 border-b border-blue-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
          <div className="relative flex items-center justify-between p-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-sm"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                  <div className="i-ph:key text-2xl text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">API Key Configuration</h2>
                <p className="text-gray-400 text-sm">Configure your AI provider credentials</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500 rounded-xl p-3 transition-all duration-200"
            >
              <div className="i-ph:x text-xl" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-transparent to-gray-900/20">
          <div className="max-w-6xl mx-auto">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Provider Selection */}
              <div className="lg:col-span-1 space-y-6">
                {/* Provider Selection Card */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-blue-500/20 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <div className="i-ph:robot text-blue-400 text-lg" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">AI Provider</h3>
                  </div>

                  <div className="relative" ref={providerDropdownRef}>
                    <div
                      className={classNames(
                        'w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                        'bg-gray-800/50 text-white backdrop-blur-sm',
                        'hover:border-blue-400/50 hover:bg-gray-700/50',
                        'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/50',
                        isProviderDropdownOpen
                          ? 'border-blue-400 ring-2 ring-blue-500/50 bg-gray-700/50'
                          : 'border-gray-600/50',
                      )}
                      onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
                      role="combobox"
                      aria-expanded={isProviderDropdownOpen}
                      aria-controls="provider-listbox"
                      aria-haspopup="listbox"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {selectedProvider && (
                            <div className="text-blue-400">
                              <div className={selectedProvider.icon} />
                            </div>
                          )}
                          <div className="truncate font-medium">{selectedProvider?.name || 'Select AI Provider'}</div>
                        </div>
                        <div
                          className={classNames(
                            'i-ph:caret-down w-5 h-5 text-gray-400 transition-transform duration-200',
                            isProviderDropdownOpen ? 'rotate-180 text-blue-400' : undefined,
                          )}
                        />
                      </div>
                    </div>

                    {isProviderDropdownOpen && (
                      <div
                        className="absolute z-20 w-full mt-3 py-2 rounded-xl border border-blue-500/30 bg-gray-800/95 backdrop-blur-md shadow-2xl"
                        role="listbox"
                        id="provider-listbox"
                      >
                        <div className="px-3 pb-3">
                          <div className="relative">
                            <input
                              ref={providerSearchInputRef}
                              type="text"
                              value={providerSearchQuery}
                              onChange={(e) => setProviderSearchQuery(e.target.value)}
                              placeholder="Search providers... (⌘K to clear)"
                              className={classNames(
                                'w-full pl-10 pr-10 py-3 rounded-lg text-sm font-medium',
                                'bg-gray-700/50 border border-gray-600/50',
                                'text-white placeholder:text-gray-400',
                                'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50',
                                'transition-all duration-200',
                              )}
                              onClick={(e) => e.stopPropagation()}
                              role="searchbox"
                              aria-label="Search providers"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              <span className="i-ph:magnifying-glass text-gray-400 text-sm" />
                            </div>
                            {providerSearchQuery && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearProviderSearch();
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-600/50 transition-colors"
                                aria-label="Clear search"
                              >
                                <span className="i-ph:x text-gray-400 text-xs" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto px-2">
                          {filteredProviders.length === 0 ? (
                            <div className="px-4 py-4 text-center">
                              <div className="text-gray-400 text-sm">
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
                                  'px-4 py-3 text-sm cursor-pointer rounded-lg transition-all duration-200',
                                  'hover:bg-gray-700/50 hover:border-blue-400/30',
                                  'text-white border border-transparent',
                                  'outline-none',
                                  selectedProvider?.name === provider.name || focusedProviderIndex === index
                                    ? 'bg-gray-700/50 border-blue-400/30'
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
                                <div className="flex items-center gap-3">
                                  <div className="text-blue-400">
                                    <div className={provider.icon} />
                                  </div>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: (provider as any).highlightedName || provider.name,
                                    }}
                                  />
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {selectedProvider && (
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-blue-500/20 shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-blue-500/20 p-3 rounded-xl">
                        <div className={classNames(selectedProvider.icon, 'text-blue-400 text-xl')} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{selectedProvider.name}</h3>
                        <p className="text-gray-400 text-sm">Configure your API credentials</p>
                      </div>
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-700/50 p-2 rounded-lg">
                          <div className="i-ph:cpu text-gray-400 text-sm" />
                        </div>
                        <Label className="text-sm font-medium text-white">
                          Model {isLoadingModels && <span className="text-xs text-gray-400">(Loading...)</span>}
                        </Label>
                      </div>
                      <div className="relative" ref={modelDropdownRef}>
                        <div
                          className={classNames(
                            'w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                            'bg-gray-800/50 text-white backdrop-blur-sm',
                            'hover:border-blue-400/50 hover:bg-gray-700/50',
                            'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/50',
                            isModelDropdownOpen
                              ? 'border-blue-400 ring-2 ring-blue-500/50 bg-gray-700/50'
                              : 'border-gray-600/50',
                          )}
                          onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                          role="combobox"
                          aria-expanded={isModelDropdownOpen}
                          aria-controls="model-listbox"
                          aria-haspopup="listbox"
                          tabIndex={0}
                        >
                          <div className="flex items-center justify-between">
                            <div className="truncate font-medium">
                              {filteredModels.find((m) => m.name === selectedModel)?.label || 'Select Model'}
                            </div>
                            <div
                              className={classNames(
                                'i-ph:caret-down w-5 h-5 text-gray-400 transition-transform duration-200',
                                isModelDropdownOpen ? 'rotate-180 text-blue-400' : undefined,
                              )}
                            />
                          </div>
                        </div>

                        {isModelDropdownOpen && (
                          <div
                            className="absolute z-20 w-full mt-3 py-2 rounded-xl border border-blue-500/30 bg-gray-800/95 backdrop-blur-md shadow-2xl"
                            role="listbox"
                            id="model-listbox"
                          >
                            <div className="px-3 pb-3">
                              <div className="relative">
                                <input
                                  ref={modelSearchInputRef}
                                  type="text"
                                  value={modelSearchQuery}
                                  onChange={(e) => setModelSearchQuery(e.target.value)}
                                  placeholder="Search models... (⌘K to clear)"
                                  className={classNames(
                                    'w-full pl-10 pr-10 py-3 rounded-lg text-sm font-medium',
                                    'bg-gray-700/50 border border-gray-600/50',
                                    'text-white placeholder:text-gray-400',
                                    'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50',
                                    'transition-all duration-200',
                                  )}
                                  onClick={(e) => e.stopPropagation()}
                                  role="searchbox"
                                  aria-label="Search models"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                  <span className="i-ph:magnifying-glass text-gray-400 text-sm" />
                                </div>
                                {modelSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      clearModelSearch();
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-600/50 transition-colors"
                                    aria-label="Clear search"
                                  >
                                    <span className="i-ph:x text-gray-400 text-xs" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="max-h-64 overflow-y-auto px-2">
                              {filteredModels.length === 0 ? (
                                <div className="px-4 py-4 text-center">
                                  <div className="text-gray-400 text-sm">
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
                                      'px-4 py-3 text-sm cursor-pointer rounded-lg transition-all duration-200',
                                      'hover:bg-gray-700/50 hover:border-blue-400/30',
                                      'text-white border border-transparent',
                                      'outline-none',
                                      selectedModel === model.name || focusedModelIndex === index
                                        ? 'bg-gray-700/50 border-blue-400/30'
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
                                      <div className="font-medium">{model.label}</div>
                                      <div className="text-xs text-gray-400">{model.maxTokenAllowed || 'N/A'}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* API Key Configuration */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-700/50 p-2 rounded-lg">
                          <div className="i-ph:key text-gray-400 text-sm" />
                        </div>
                        <Label className="text-sm font-medium text-white">API Configuration</Label>
                      </div>

                      {/* API Key Input Forms */}
                      <div className="space-y-4">
                        {selectedProvider.name === 'Amazon Bedrock' ? (
                          <>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-white">AWS Access Key ID</Label>
                              <Input
                                type="password"
                                value={apiKeys.aws_access_key_id || ''}
                                onChange={(e) => handleApiKeyChange('aws_access_key_id', e.target.value)}
                                placeholder="Enter AWS Access Key ID"
                                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-400/50 rounded-lg p-3 transition-all duration-200"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-white">AWS Secret Access Key</Label>
                              <Input
                                type="password"
                                value={apiKeys.aws_secret_access_key || ''}
                                onChange={(e) => handleApiKeyChange('aws_secret_access_key', e.target.value)}
                                placeholder="Enter AWS Secret Access Key"
                                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-400/50 rounded-lg p-3 transition-all duration-200"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-white">AWS Region</Label>
                              <Input
                                type="text"
                                value={apiKeys.aws_region || ''}
                                onChange={(e) => handleApiKeyChange('aws_region', e.target.value)}
                                placeholder="us-east-1"
                                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-400/50 rounded-lg p-3 transition-all duration-200"
                              />
                            </div>
                          </>
                        ) : selectedProvider.name === 'Supabase' ? (
                          <>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-white">Supabase URL</Label>
                              <Input
                                type="url"
                                value={apiKeys.supabase_url || ''}
                                onChange={(e) => handleApiKeyChange('supabase_url', e.target.value)}
                                placeholder="https://your-project.supabase.co"
                                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-400/50 rounded-lg p-3 transition-all duration-200"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-white">Supabase Anon Key</Label>
                              <Input
                                type="password"
                                value={apiKeys.supabase_anon_key || ''}
                                onChange={(e) => handleApiKeyChange('supabase_anon_key', e.target.value)}
                                placeholder="Enter Supabase Anon Key"
                                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-400/50 rounded-lg p-3 transition-all duration-200"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-white">API Key</Label>
                            <Input
                              type="password"
                              value={apiKeys[selectedProvider.name.toLowerCase().replace(/\s+/g, '_')] || ''}
                              onChange={(e) =>
                                handleApiKeyChange(
                                  selectedProvider.name.toLowerCase().replace(/\s+/g, '_'),
                                  e.target.value,
                                )
                              }
                              placeholder={`Enter ${selectedProvider.name} API Key`}
                              className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-400/50 rounded-lg p-3 transition-all duration-200"
                            />
                          </div>
                        )}

                        {/* Provider Information */}
                        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                          <h4 className="text-sm font-semibold text-white mb-2">Provider Information</h4>
                          <div className="text-sm text-gray-400 space-y-1">
                            <p>
                              Get your API key from:{' '}
                              <a
                                href={selectedProvider.getApiKeyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                {selectedProvider.labelForGetApiKey}
                              </a>
                            </p>
                            {selectedProvider.name === 'Amazon Bedrock' && (
                              <p className="text-xs text-gray-500 mt-2">
                                Make sure you have the necessary permissions for Bedrock access in your AWS account.
                              </p>
                            )}
                            {selectedProvider.name === 'Supabase' && (
                              <p className="text-xs text-gray-500 mt-2">
                                You can find these values in your Supabase project settings under API.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-blue-500/30 bg-gradient-to-r from-gray-900/50 to-black/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {selectedProvider ? `Configured for ${selectedProvider.name}` : 'Select a provider to get started'}
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={onClose} className="border border-blue-600 text-white hover:bg-gray-800 bg-black">
                Cancel
              </Button>
              <Button
                onClick={handleSaveKeys}
                disabled={isLoading}
                className="bg-black hover:bg-gray-800 text-white border border-blue-600"
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
