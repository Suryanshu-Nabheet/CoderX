import { classNames } from '~/utils/classNames';
import type { TabVisibilityConfig } from '~/components/@settings/core/types';
import { TAB_LABELS, TAB_ICONS } from '~/components/@settings/core/constants';

interface TabTileProps {
  tab: TabVisibilityConfig;
  onClick?: () => void;
  isActive?: boolean;
  hasUpdate?: boolean;
  statusMessage?: string;
  description?: string;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const TabTile: React.FC<TabTileProps> = ({
  tab,
  onClick,
  isActive,
  hasUpdate,
  statusMessage,
  description,
  isLoading,
  className,
  children,
}: TabTileProps) => {
  return (
    <div className={classNames('min-h-[160px] list-none', className || '')}>
      <div className="relative h-full rounded-xl border border-coderx-elements-borderColor p-0.5">
        <div
          onClick={onClick}
          className={classNames(
            'relative flex flex-col items-center justify-center h-full p-4 rounded-lg',
            'bg-coderx-elements-background-depth-2',
            'cursor-pointer',
            isActive ? 'bg-blue-500/5 dark:bg-blue-500/10' : '',
            isLoading ? 'cursor-wait opacity-70 pointer-events-none' : '',
          )}
        >
          {/* Icon */}
          <div
            className={classNames(
              'relative',
              'w-14 h-14',
              'flex items-center justify-center',
              'rounded-xl',
              'bg-coderx-elements-background-depth-3',
              'ring-1 ring-coderx-elements-borderColor',
              isActive ? 'bg-blue-500/10 dark:bg-blue-500/10 ring-blue-500/30 dark:ring-blue-500/20' : '',
            )}
          >
            {(() => {
              const IconComponent = TAB_ICONS[tab.id];
              return (
                <IconComponent
                  className={classNames(
                    'w-8 h-8',
                    'text-coderx-elements-textSecondary',
                    isActive ? 'text-blue-500 dark:text-blue-400/90' : '',
                  )}
                />
              );
            })()}
          </div>

          {/* Label and Description */}
          <div className="flex flex-col items-center mt-4 w-full">
            <h3
              className={classNames(
                'text-[15px] font-medium leading-snug mb-2',
                'text-coderx-elements-textPrimary',
                isActive ? 'text-blue-500 dark:text-blue-400/90' : '',
              )}
            >
              {TAB_LABELS[tab.id]}
            </h3>
            {description && (
              <p
                className={classNames(
                  'text-[13px] leading-relaxed',
                  'text-coderx-elements-textSecondary',
                  'max-w-[85%]',
                  'text-center',
                  isActive ? 'text-blue-400 dark:text-blue-400/80' : '',
                )}
              >
                {description}
              </p>
            )}
          </div>

          {/* Update indicator */}
          {hasUpdate && (
            <div
              title={statusMessage}
              aria-label={statusMessage}
              className="absolute right-4 top-4 h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"
            />
          )}

          {/* Children (e.g. Beta Label) */}
          {children}
        </div>
      </div>
    </div>
  );
};
