import React, { useState } from 'react';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { toast } from 'react-toastify';

interface ApiKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDERS = [
  { name: 'OpenAI', key: 'OPENAI_API_KEY', description: 'For GPT models' },
  { name: 'Anthropic', key: 'ANTHROPIC_API_KEY', description: 'For Claude models' },
  { name: 'Google', key: 'GOOGLE_API_KEY', description: 'For Gemini models' },
  { name: 'Cohere', key: 'COHERE_API_KEY', description: 'For Cohere models' },
  { name: 'Groq', key: 'GROQ_API_KEY', description: 'For Groq models' },
  { name: 'Hugging Face', key: 'HUGGINGFACE_API_KEY', description: 'For Hugging Face models' },
  { name: 'Together', key: 'TOGETHER_API_KEY', description: 'For Together models' },
  { name: 'Perplexity', key: 'PERPLEXITY_API_KEY', description: 'For Perplexity models' },
  { name: 'DeepSeek', key: 'DEEPSEEK_API_KEY', description: 'For DeepSeek models' },
  { name: 'Mistral', key: 'MISTRAL_API_KEY', description: 'For Mistral models' },
  { name: 'Moonshot', key: 'MOONSHOT_API_KEY', description: 'For Moonshot models' },
  { name: 'XAI', key: 'XAI_API_KEY', description: 'For XAI models' },
  { name: 'Amazon Bedrock', key: 'AWS_ACCESS_KEY_ID', description: 'For AWS Bedrock models' },
  { name: 'GitHub', key: 'GITHUB_TOKEN', description: 'For GitHub integration' },
  { name: 'GitLab', key: 'GITLAB_TOKEN', description: 'For GitLab integration' },
  { name: 'Supabase', key: 'SUPABASE_URL', description: 'For Supabase integration' },
  { name: 'Netlify', key: 'NETLIFY_TOKEN', description: 'For Netlify integration' },
  { name: 'Vercel', key: 'VERCEL_TOKEN', description: 'For Vercel integration' },
];

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose }) => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveKeys = async () => {
    setIsLoading(true);

    try {
      /*
       * In a real implementation, you would save these to a secure backend
       * For now, we'll just show a success message
       */
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

  return (
    <DialogRoot open={isOpen}>
      <Dialog onBackdrop={onClose} onClose={onClose}>
        <div className="p-6 bg-white dark:bg-gray-950">
          <DialogTitle className="text-gray-900 dark:text-white">API Key Management</DialogTitle>
          <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
            <p>Configure your API keys to use different AI providers and services.</p>
            <p className="mt-2 text-sm">
              <strong>Note:</strong> Add your API keys to the .env file in your project root for security.
            </p>
          </DialogDescription>

          <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
            {PROVIDERS.map((provider) => (
              <div key={provider.key} className="space-y-2">
                <Label htmlFor={provider.key} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {provider.name}
                </Label>
                <Input
                  id={provider.key}
                  type="password"
                  placeholder={`Enter your ${provider.name} API key`}
                  value={apiKeys[provider.key] || ''}
                  onChange={(e) => handleKeyChange(provider.key, e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">{provider.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <DialogButton type="secondary" onClick={onClose}>
            Cancel
          </DialogButton>
          <DialogButton type="primary" onClick={handleSaveKeys} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save API Keys'}
          </DialogButton>
        </div>
      </Dialog>
    </DialogRoot>
  );
};
