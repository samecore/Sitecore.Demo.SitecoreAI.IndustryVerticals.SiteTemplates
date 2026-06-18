'use client';

import React, { JSX, useState, useEffect } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from '@/shadcn/components/ui/drawer';
import { Menu, Search, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import PreviewSearch from '../non-sitecore/search/PreviewSearch';
import { PREVIEW_WIDGET_ID } from '@/constants/search';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Close search when route changes
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname, searchParams]);

  return (
    <div className={`component header ${styles}`} id={id}>
      <div className="container flex items-center gap-4 py-3 lg:gap-6 lg:py-4">
        <div className="header-block max-lg:w-full max-lg:justify-between lg:shrink-0">
          <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>

        <div className="hidden! min-w-0 flex-1 lg:flex! lg:justify-center">
          <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>

        <div className="header-block header-block-right hidden! lg:flex! lg:shrink-0">
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Open search"
            aria-expanded={isSearchOpen}
            className="header-search-trigger"
          >
            <span className="header-search-placeholder">AI search</span>
            <Search className="size-5 shrink-0" />
          </button>

          <Placeholder name={`header-right-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>

        {/* Mobile Drawer Trigger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Open search"
            aria-expanded={isSearchOpen}
            className="header-search-trigger"
          >
            <span className="header-search-placeholder">AI search</span>
            <Search className="size-5 shrink-0" />
          </button>
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="p-2 text-[#3d3d3d] transition-colors hover:text-[#007a48]"
              >
                <Menu className="h-6 w-6" />
              </button>
            </DrawerTrigger>

            <DrawerContent className="w-xl! max-w-full! bg-[#f2ede4] p-5">
              <div className="flex h-full flex-col">
                <div className="mb-14 flex items-center justify-between self-end">
                  <DrawerClose asChild>
                    <button type="button" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </button>
                  </DrawerClose>
                </div>

                <div className="mb-6 flex flex-col gap-y-6 px-12">
                  <Placeholder
                    name={`header-nav-${DynamicPlaceholderId}`}
                    rendering={props.rendering}
                  />
                </div>
                <div className="flex flex-col gap-y-6 px-12">
                  <Placeholder
                    name={`header-right-${DynamicPlaceholderId}`}
                    rendering={props.rendering}
                  />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {isSearchOpen && (
        <div className="absolute top-full right-0 left-0 z-50 border-b border-[var(--header-border)] bg-[var(--header-bg)] shadow-lg">
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
                aria-label="Close search"
                className="p-3 text-[#3d3d3d] transition-colors hover:text-[#007a48]"
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
