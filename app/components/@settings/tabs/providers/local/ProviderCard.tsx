import React from 'react';
import { Switch } from '~/components/ui/Switch';
import { Card, CardContent } from '~/components/ui/Card';
import { Link, Server, Monitor, Globe } from 'lucide-react';
import { classNames } from '~/utils/classNames';
import type { IProviderConfig } from '~/types/model';
import { PROVIDER_DESCRIPTIONS } from './types';

// Provider Card Component
interface ProviderCardProps {
  provider: IProviderConfig;
  onToggle: (enabled: boolean) => void;
  onUpdateBaseUrl: (url: string) => void;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
}

function ProviderCard({
  provider,
  onToggle,
  onUpdateBaseUrl,
  isEditing,
  onStartEditing,
  onStopEditing,
}: ProviderCardProps) {
  const getIcon = (providerName: string) => {
    switch (providerName) {
      case 'Ollama':
        return Server;
      case 'LMStudio':
        return Monitor;
      case 'OpenAILike':
        return Globe;
      default:
        return Server;
    }
  };

  const Icon = getIcon(provider.name);

  return (
    <Card className="bg-coderx-elements-background-depth-2 hover:bg-coderx-elements-background-depth-3 transition-all duration-300 shadow-sm hover:shadow-md border border-coderx-elements-borderColor hover:border-blue-500/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4 min-h-[100px]">
          <div className="flex items-center gap-4 flex-1">
            <div
              className={classNames(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0',
                provider.settings.enabled
                  ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 ring-1 ring-blue-500/30'
                  : 'bg-coderx-elements-background-depth-3',
              )}
            >
              <Icon
                className={classNames(
                  'w-6 h-6 transition-all duration-300',
                  provider.settings.enabled ? 'text-blue-500' : 'text-coderx-elements-textTertiary',
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-coderx-elements-textPrimary">{provider.name}</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 font-medium">Local</span>
              </div>
              <p className="text-sm text-coderx-elements-textSecondary mb-4">
                {PROVIDER_DESCRIPTIONS[provider.name as keyof typeof PROVIDER_DESCRIPTIONS]}
              </p>

              {provider.settings.enabled && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-coderx-elements-textPrimary">API Endpoint</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={provider.settings.baseUrl}
                      placeholder={`Enter ${provider.name} base URL`}
                      className="w-full px-4 py-3 rounded-lg text-sm bg-coderx-elements-background-depth-4 border border-blue-500/30 text-coderx-elements-textPrimary placeholder-coderx-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onUpdateBaseUrl(e.currentTarget.value);
                          onStopEditing();
                        } else if (e.key === 'Escape') {
                          onStopEditing();
                        }
                      }}
                      onBlur={(e) => {
                        onUpdateBaseUrl(e.target.value);
                        onStopEditing();
                      }}
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={onStartEditing}
                      className="w-full px-4 py-3 rounded-lg text-sm bg-coderx-elements-background-depth-1 border border-coderx-elements-borderColor hover:border-coderx-elements-item-backgroundAccent hover:bg-coderx-elements-background-depth-2 hover:shadow-sm transition-all duration-200 text-left group flex items-center justify-between"
                    >
                      <span className="font-mono text-coderx-elements-textSecondary group-hover:text-coderx-elements-textPrimary transition-colors">
                        {provider.settings.baseUrl || 'Click to set base URL'}
                      </span>
                      <div className="flex items-center gap-2 text-coderx-elements-textTertiary group-hover:text-coderx-elements-item-contentAccent transition-colors text-xs">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                        <Link className="w-3 h-3" />
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Switch
              checked={provider.settings.enabled}
              onCheckedChange={onToggle}
              aria-label={`Toggle ${provider.name} provider`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProviderCard;
