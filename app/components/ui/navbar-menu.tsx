'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';

export const Menu = ({
  setActive: _setActive,
  children,
  className,
}: {
  setActive: (item: string) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <nav
      className={classNames(
        'relative rounded-full border border-white/10 bg-white/10 backdrop-blur-md shadow-lg',
        className,
      )}
    >
      {children}
    </nav>
  );
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative">
      <motion.button
        className={classNames(
          'relative px-4 py-2 text-sm transition-colors',
          active === item ? 'text-white' : 'text-gray-300 hover:text-white',
        )}
        onMouseEnter={() => setActive(item)}
        onMouseLeave={() => setActive('')}
      >
        {item}
      </motion.button>
      {active === item && (
        <motion.div
          className="absolute top-full left-0 mt-2 rounded-lg border border-white/10 bg-white/10 backdrop-blur-md shadow-lg p-4 min-w-[200px]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export const HoveredLink = ({
  children,
  href,
  ...rest
}: {
  children: React.ReactNode;
  href: string;
  [key: string]: any;
}) => {
  return (
    <a href={href} className="text-gray-300 hover:text-white transition-colors block py-1" {...rest}>
      {children}
    </a>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
      <img src={src} alt={title} className="w-8 h-8 rounded" />
      <div>
        <div className="text-white text-sm font-medium">{title}</div>
        <div className="text-gray-400 text-xs">{description}</div>
      </div>
    </a>
  );
};
