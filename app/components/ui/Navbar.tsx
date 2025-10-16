'use client';
import React, { useState } from 'react';
import { HoveredLink, Menu, MenuItem } from '~/components/ui/navbar-menu';
import { classNames } from '~/utils/classNames';

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  const handleDocumentClick = (href: string) => {
    window.open(href, '_blank');
  };

  return (
    <div className={classNames('fixed top-10 inset-x-0 max-w-6xl mx-auto z-50', className)}>
      <Menu setActive={setActive}>
        {/* Left side - Main navigation items */}
        <div className="flex items-center">
          <MenuItem setActive={setActive} active={active} item="Source Code">
            <div className="flex flex-col space-y-2 text-sm">
              <HoveredLink href="https://github.com/Suryanshu-Nabheet/CoderX">
                <div className="flex items-center gap-2">
                  <div className="i-ph:github-logo w-4 h-4" />
                  GitHub Repository
                </div>
              </HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="License">
            <div className="flex flex-col space-y-2 text-sm">
              <HoveredLink href="https://github.com/Suryanshu-Nabheet/CoderX/blob/main/LICENSE">
                <div className="flex items-center gap-2">
                  <div className="i-ph:file-text w-4 h-4" />
                  View License
                </div>
              </HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Code of Conduct">
            <div className="flex flex-col space-y-2 text-sm">
              <button
                onClick={() => handleDocumentClick('/CODE_OF_CONDUCT.md')}
                className="text-gray-300 hover:text-white transition-colors block py-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="i-ph:shield-check w-4 h-4" />
                  Read Code of Conduct
                </div>
              </button>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Contributing">
            <div className="flex flex-col space-y-2 text-sm">
              <button
                onClick={() => handleDocumentClick('/CONTRIBUTING.md')}
                className="text-gray-300 hover:text-white transition-colors block py-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="i-ph:handshake w-4 h-4" />
                  Contributing Guidelines
                </div>
              </button>
            </div>
          </MenuItem>
        </div>

        {/* Right side - Social links */}
        <div className="flex items-center gap-4 ml-auto">
          <a
            href="https://www.linkedin.com/in/suryanshu-nabheet/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
            title="LinkedIn"
          >
            <div className="i-ph:linkedin-logo w-5 h-5" />
          </a>

          <a
            href="https://github.com/Suryanshu-Nabheet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
            title="GitHub"
          >
            <div className="i-ph:github-logo w-5 h-5" />
          </a>

          <a
            href="https://x.com/suryanshuxdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
            title="Twitter/X"
          >
            <div className="i-ph:twitter-logo w-5 h-5" />
          </a>
        </div>
      </Menu>
    </div>
  );
}
