import { classNames } from '~/utils/classNames';
import React from 'react';

export const SpeechRecognitionButton = ({
  isListening,
  onStart,
  onStop,
  disabled,
}: {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}) => {
  return (
    <button
      onClick={isListening ? onStop : onStart}
      disabled={disabled}
      className={classNames(
        'group relative p-2.5 rounded-lg border transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        isListening
          ? 'bg-red-500/10 border-red-500/30 text-red-400'
          : 'bg-bolt-elements-background-depth-1 hover:bg-bolt-elements-background-depth-0 border-bolt-elements-borderColor/30 hover:border-bolt-elements-borderColor text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary',
      )}
      title={isListening ? 'Stop listening' : 'Start speech recognition'}
    >
      {isListening ? <div className="i-ph:microphone-slash text-xl" /> : <div className="i-ph:microphone text-xl" />}
    </button>
  );
};
