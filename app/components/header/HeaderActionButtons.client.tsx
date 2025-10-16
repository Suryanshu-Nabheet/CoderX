import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { DeployButton } from '~/components/deploy/DeployButton';

interface HeaderActionButtonsProps {
  chatStarted: boolean;
}

export function HeaderActionButtons({ chatStarted: _chatStarted }: HeaderActionButtonsProps) {
  const [activePreviewIndex] = useState(0);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];

  const shouldShowButtons = activePreview;

  return (
    <div className="flex items-center gap-3">
      {/* Deploy Button */}
      {shouldShowButtons && <DeployButton />}

      {/* Debug Tools */}
      {shouldShowButtons && (
        <div className="flex border border-gray-600 rounded-lg overflow-hidden text-sm bg-gray-800/50 backdrop-blur-sm">
          <button
            onClick={() => window.open('https://github.com/Suryanshu-Nabheet/CoderX/issues/new', '_blank')}
            className="rounded-l-lg items-center justify-center px-4 py-2 text-sm bg-gray-700/50 text-gray-200 hover:bg-gray-600/70 hover:text-white transition-all duration-200 flex gap-2 border-r border-gray-600"
            title="Report Bug"
          >
            <div className="i-ph:bug w-4 h-4" />
            <span>Report Bug</span>
          </button>
          <button
            onClick={async () => {
              try {
                const { downloadDebugLog } = await import('~/utils/debugLogger');
                await downloadDebugLog();
              } catch (error) {
                console.error('Failed to download debug log:', error);
              }
            }}
            className="rounded-r-lg items-center justify-center px-4 py-2 text-sm bg-gray-700/50 text-gray-200 hover:bg-gray-600/70 hover:text-white transition-all duration-200 flex gap-2"
            title="Download Debug Log"
          >
            <div className="i-ph:download w-4 h-4" />
            <span>Debug Log</span>
          </button>
        </div>
      )}
    </div>
  );
}
