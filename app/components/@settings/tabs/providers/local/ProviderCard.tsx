import React, { useEffect, useRef, useState } from 'react';
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
  const [draftUrl, setDraftUrl] = useState(provider.settings.baseUrl ?? '');
  const hasCommittedDraft = useRef(false);

  useEffect(() => {
    if (!isEditing) {
      setDraftUrl(provider.settings.baseUrl ?? '');
      hasCommittedDraft.current = false;
    }
  }, [isEditing, provider.settings.baseUrl]);

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
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
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-coderx-elements-textPrimary">{provider.name}</h3>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                  Local
                </span>
              </div>
              <p className="mt-1 text-sm text-coderx-elements-textSecondary">
                {PROVIDER_DESCRIPTIONS[provider.name as keyof typeof PROVIDER_DESCRIPTIONS]}
              </p>
            </div>
          </div>

          {provider.settings.enabled && (
            <div className="w-full shrink-0 space-y-1.5 sm:w-[min(420px,42%)]">
              <label className="text-xs font-medium text-coderx-elements-textPrimary">API Endpoint</label>
              {isEditing ? (
                <input
                  type="text"
                  value={draftUrl}
                  placeholder={`Enter ${provider.name} base URL`}
                  aria-label={`${provider.name} API endpoint`}
                  className="w-full rounded-lg border border-blue-500/30 bg-coderx-elements-background-depth-4 px-3 py-2 text-sm text-coderx-elements-textPrimary placeholder-coderx-elements-textTertiary shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      hasCommittedDraft.current = true;
                      onUpdateBaseUrl(draftUrl.trim());
                      onStopEditing();
                    } else if (e.key === 'Escape') {
                      hasCommittedDraft.current = true;
                      onStopEditing();
                    }
                  }}
                  onBlur={(e) => {
                    if (hasCommittedDraft.current) {
                      return;
                    }

                    hasCommittedDraft.current = true;
                    onUpdateBaseUrl(e.target.value.trim());
                    onStopEditing();
                  }}
                  onChange={(e) => setDraftUrl(e.target.value)}
                  autoFocus
                />
              ) : (
                <button
                  onClick={onStartEditing}
                  className="flex w-full items-center justify-between rounded-lg border border-coderx-elements-borderColor bg-coderx-elements-background-depth-1 px-3 py-2 text-left text-sm"
                >
                  <span className="min-w-0 truncate font-mono text-coderx-elements-textSecondary">
                    {provider.settings.baseUrl || 'Click to set base URL'}
                  </span>
                  <Link className="ml-2 h-3 w-3 shrink-0 text-coderx-elements-textTertiary" />
                </button>
              )}
            </div>
          )}

          <div className="shrink-0 self-end sm:self-center">
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
