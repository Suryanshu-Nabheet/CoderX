import { useParams } from '@remix-run/react';
import { classNames } from '~/utils/classNames';
import { type ChatHistoryItem } from '~/lib/persistence';
import WithTooltip from '~/components/ui/Tooltip';
import { useEditChatDescription } from '~/lib/hooks';
import { forwardRef, type ForwardedRef, useCallback } from 'react';
import { Checkbox } from '~/components/ui/Checkbox';

interface HistoryItemProps {
  item: ChatHistoryItem;
  onDelete?: (event: React.UIEvent) => void;
  onDuplicate?: (id: string) => void;
  exportChat: (id?: string) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
}

export function HistoryItem({
  item,
  onDelete,
  onDuplicate,
  exportChat,
  selectionMode = false,
  isSelected = false,
  onToggleSelection,
}: HistoryItemProps) {
  const { id: urlId } = useParams();
  const isActiveChat = urlId === item.urlId;

  const { editing, handleChange, handleBlur, handleSubmit, handleKeyDown, currentDescription, toggleEditMode } =
    useEditChatDescription({
      initialDescription: item.description,
      customChatId: item.id,
      syncWithGlobalStore: isActiveChat,
    });

  const handleItemClick = useCallback(
    (e: React.MouseEvent) => {
      if (selectionMode) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Item clicked in selection mode:', item.id);
        onToggleSelection?.(item.id);
      }
    },
    [selectionMode, item.id, onToggleSelection],
  );

  const handleCheckboxChange = useCallback(() => {
    console.log('Checkbox changed for item:', item.id);
    onToggleSelection?.(item.id);
  }, [item.id, onToggleSelection]);

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      console.log('Delete button clicked for item:', item.id);

      if (onDelete) {
        onDelete(event as unknown as React.UIEvent);
      }
    },
    [onDelete, item.id],
  );

  return (
    <div
      className={classNames(
        'group rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800/30 overflow-hidden flex justify-between items-center px-3 py-2 transition-colors',
        { 'text-white bg-gray-800/30': isActiveChat },
        { 'cursor-pointer': selectionMode },
      )}
      onClick={selectionMode ? handleItemClick : undefined}
    >
      {selectionMode && (
        <div className="flex items-center mr-2" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            id={`select-${item.id}`}
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="h-5 w-5"
          />
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-gray-900 text-white rounded-md px-3 py-1.5 text-sm border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400/50"
            autoFocus
            value={currentDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="i-ph-check h-4 w-4 text-gray-700 hover:text-blue-400 transition-colors"
            onMouseDown={handleSubmit}
          />
        </form>
      ) : (
        <a
          href={`/chat/${item.urlId}`}
          className="flex w-full relative truncate block"
          onClick={selectionMode ? handleItemClick : undefined}
        >
          <WithTooltip tooltip={currentDescription}>
            <span className="truncate pr-24">{currentDescription}</span>
          </WithTooltip>
          <div
            className={classNames(
              'absolute right-0 top-0 bottom-0 flex items-center bg-transparent px-2 transition-colors',
            )}
          >
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChatActionButton
                toolTipContent="Export"
                icon="i-ph-download-simple h-4 w-4"
                onClick={(event) => {
                  event.preventDefault();
                  exportChat(item.id);
                }}
              />
              {onDuplicate && (
                <ChatActionButton
                  toolTipContent="Duplicate"
                  icon="i-ph-copy h-4 w-4"
                  onClick={(event) => {
                    event.preventDefault();
                    onDuplicate?.(item.id);
                  }}
                />
              )}
              <ChatActionButton
                toolTipContent="Rename"
                icon="i-ph-pencil-simple h-4 w-4"
                onClick={(event) => {
                  event.preventDefault();
                  toggleEditMode();
                }}
              />
              <ChatActionButton
                toolTipContent="Delete"
                icon=""
                className="hover:text-red-400 dark:hover:text-red-400"
                onClick={handleDeleteClick}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </ChatActionButton>
            </div>
          </div>
        </a>
      )}
    </div>
  );
}

const ChatActionButton = forwardRef(
  (
    {
      toolTipContent,
      icon,
      className,
      onClick,
      children,
    }: {
      toolTipContent: string;
      icon: string;
      className?: string;
      onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
      btnTitle?: string;
      children?: React.ReactNode;
    },
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <WithTooltip tooltip={toolTipContent} position="bottom" sideOffset={4}>
        <button
          ref={ref}
          type="button"
          className={`flex items-center justify-center text-gray-700 hover:text-blue-400 transition-all duration-200 hover:scale-105 ${className ? className : ''}`}
          onClick={onClick}
          aria-label={toolTipContent}
        >
          {children || <div className={icon}></div>}
        </button>
      </WithTooltip>
    );
  },
);
