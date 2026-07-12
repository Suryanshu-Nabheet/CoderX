import { atom } from 'nanostores';
import type { GitHubConnection } from '~/types/GitHub';

const storedConnection = typeof window !== 'undefined' ? localStorage.getItem('github_connection') : null;
const initialConnection: GitHubConnection = storedConnection
  ? JSON.parse(storedConnection)
  : {
      user: null,
      token: '',
      tokenType: 'classic',
    };

export const githubConnection = atom<GitHubConnection>(initialConnection);
export const isConnecting = atom<boolean>(false);

export const updateGitHubConnection = (updates: Partial<GitHubConnection>) => {
  const currentState = githubConnection.get();
  const newState = { ...currentState, ...updates };
  githubConnection.set(newState);

  if (typeof window !== 'undefined') {
    localStorage.setItem('github_connection', JSON.stringify(newState));
  }
};
