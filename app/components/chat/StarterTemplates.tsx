import React from 'react';
import { Link } from '@remix-run/react';
import type { Template } from '~/types/template';
import { STARTER_TEMPLATES } from '~/utils/constants';

interface FrameworkLinkProps {
  template: Template;
}

const FrameworkLink: React.FC<FrameworkLinkProps> = ({ template }) => {
  const iconMap: Record<string, string> = {
    'Expo App': '/icons/expo.svg',
    'Basic Astro': '/icons/astro.svg',
    'NextJS Shadcn': '/icons/nextjs.svg',
    'Vite Shadcn': '/icons/shadcn.svg',
    'Qwik Typescript': '/icons/qwik.svg',
    'Remix Typescript': '/icons/remix.svg',
    Slidev: '/icons/slidev.svg',
    Sveltekit: '/icons/svelte.svg',
    'Vanilla Vite': '/icons/vite.svg',
    'Vite React': '/icons/react.svg',
    'Vite Typescript': '/icons/typescript.svg',
    Vue: '/icons/vue.svg',
    Angular: '/icons/angular.svg',
    SolidJS: '/icons/solidjs.svg',
  };

  const iconSrc = iconMap[template.name] || '/icons/vite.svg';

  return (
    <Link
      to={`/?starter=${encodeURIComponent(template.name)}`}
      data-state="closed"
      data-discover="true"
      className="items-center justify-center"
      title={`Start with ${template.label}`}
    >
      <img
        src={iconSrc}
        alt={template.label}
        className="w-8 h-8 transition-all duration-200 grayscale hover:grayscale-0 hover:scale-110 opacity-60 hover:opacity-100"
      />
    </Link>
  );
};

const StarterTemplates: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-sm text-gray-500">or start a blank app with your favorite stack</span>
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center items-center gap-4 max-w-sm">
          {STARTER_TEMPLATES.map((template) => (
            <FrameworkLink key={template.name} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarterTemplates;
