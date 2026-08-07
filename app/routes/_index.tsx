import { json, type MetaFunction } from '@remix-run/node';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  const title = 'CoderX — AI-Powered Development Platform';
  const description = 'CoderX — AI-Powered Development Platform created by Suryanshu Nabheet.';
  const author = 'Suryanshu Nabheet';
  const copyright = '© 2026 Suryanshu Nabheet. All rights reserved.';

  return [
    { title },
    { name: 'description', content: description },
    { name: 'author', content: author },
    { name: 'copyright', content: copyright },
    { name: 'keywords', content: 'CoderX, AI-Powered Development Platform, Suryanshu Nabheet, AI Coding, WebContainer, Fullstack' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: '/social_preview_index.jpg' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: '/social_preview_index.jpg' },
    { name: 'twitter:creator', content: '@suryanshuxdev' },
  ];
};

export const loader = () => json({});

/**
 * Landing page component for CoderX
 * Note: Settings functionality should ONLY be accessed through the sidebar menu.
 * Do not add settings button/panel to this landing page as it was intentionally removed
 * to keep the UI clean and consistent with the design system.
 */
export default function Index() {
  return (
    <div className="flex flex-col h-full w-full bg-coderx-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}
