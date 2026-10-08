'use client';

import React, { JSX, useState, useEffect } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from '@/shadcn/components/ui/drawer';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import PreviewSearch from '../non-sitecore/search/PreviewSearch';
import { PREVIEW_WIDGET_ID } from '@/constants/search';
import clsx from 'clsx';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

const OfficialMark = (): JSX.Element => (
  <svg
    className="shrink-0"
    width="20"
    height="14"
    viewBox="0 0 20 14"
    aria-hidden="true"
    focusable="false"
  >
    <rect width="20" height="14" rx="1.5" fill="#006C35" />
    <path
      d="M4.2 5.2c2.2-.7 4.3-.7 6.4 0 1.4.5 2.8.5 4.2 0"
      fill="none"
      stroke="#fff"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path d="M4 8.6h12" stroke="#fff" strokeWidth="0.7" strokeLinecap="round" />
  </svg>
);

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsSearchOpen(false);
    setIsVerifyOpen(false);
  }, [pathname, searchParams]);

  return (
    <div className={`component header ${styles ?? ''}`} id={id}>
      <div className="header-stamp">
        <div className="header-stamp-row container">
          <OfficialMark />
          <p className="header-stamp-label">
            Official government website of the Government of the Kingdom of Saudi Arabia
          </p>
          <button
            type="button"
            className="header-verify"
            aria-expanded={isVerifyOpen}
            onClick={() => setIsVerifyOpen((open) => !open)}
          >
            <span>How to verify</span>
            <ChevronDown
              className={clsx('size-4 transition-transform', isVerifyOpen && 'rotate-180')}
            />
          </button>
        </div>
        {isVerifyOpen && (
          <div className="header-verify-panel">
            <div className="header-verify-grid container">
              <div>
                <h2>Links to official Saudi websites end with gov.sa</h2>
                <p>
                  All links to official websites of government agencies in the Kingdom of Saudi
                  Arabia end with .gov.sa
                </p>
              </div>
              <div>
                <h2>Government websites use the HTTPS protocol for encryption and security.</h2>
                <p>
                  Secure websites in the Kingdom of Saudi Arabia use the HTTPS protocol for
                  encryption.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="header-bar">
        <div className="header-bar-row container">
          <div className="header-block">
            <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </div>
          <div className="header-nav">
            <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </div>

          <button
            type="button"
            onClick={() => setIsSearchOpen((open) => !open)}
            className="header-tool"
            aria-label="Search"
            aria-expanded={isSearchOpen}
          >
            <Search className="size-5" />
            <span>Search</span>
          </button>

          <div className="lg:hidden">
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="text-foreground p-2 transition-colors hover:text-[#1b8354]"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </DrawerTrigger>

              <DrawerContent className="w-xl! max-w-full! bg-white p-5">
                <div className="flex h-full flex-col">
                  <div className="mb-14 flex items-center justify-between self-end">
                    <DrawerClose asChild>
                      <button type="button" aria-label="Close menu">
                        <X className="h-5 w-5" />
                      </button>
                    </DrawerClose>
                  </div>

                  <div className="mb-6 flex flex-col gap-y-6 px-6">
                    <Placeholder
                      name={`header-nav-${DynamicPlaceholderId}`}
                      rendering={props.rendering}
                    />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="header-search-panel">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center gap-2">
              <PreviewSearch
                rfkId={PREVIEW_WIDGET_ID}
                isOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
              />

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-foreground-muted hover:text-foreground p-3 transition-colors"
                aria-label="Close search"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
