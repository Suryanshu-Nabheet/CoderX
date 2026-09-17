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
    <Card className="border border-coderx-elements-borderColor bg-coderx-elements-background-depth-2 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className={classNames(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                provider.settings.enabled
                  ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 ring-1 ring-blue-500/30'
                  : 'bg-coderx-elements-background-depth-3',
              )}
            >
              <Icon
                className={classNames(
                  'h-5 w-5',
                  provider.settings.enabled ? 'text-blue-500' : 'text-coderx-elements-textTertiary',
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-base font-semibold text-coderx-elements-textPrimary">{provider.name}</h3>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                  Local
                </span>
              </div>
              <p className="mb-3 text-sm text-coderx-elements-textSecondary">
                {PROVIDER_DESCRIPTIONS[provider.name as keyof typeof PROVIDER_DESCRIPTIONS]}
              </p>

              {provider.settings.enabled && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-coderx-elements-textPrimary">API Endpoint</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={provider.settings.baseUrl}
                      placeholder={`Enter ${provider.name} base URL`}
                      className="w-full rounded-lg border border-blue-500/30 bg-coderx-elements-background-depth-4 px-3 py-2 text-sm text-coderx-elements-textPrimary placeholder-coderx-elements-textTertiary shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                      className="flex w-full items-center justify-between rounded-lg border border-coderx-elements-borderColor bg-coderx-elements-background-depth-1 px-3 py-2 text-left text-sm"
                    >
                      <span className="font-mono text-coderx-elements-textSecondary transition-colors">
                        {provider.settings.baseUrl || 'Click to set base URL'}
                      </span>
                      <div className="flex items-center gap-2 text-coderx-elements-textTertiary transition-colors text-xs">
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
