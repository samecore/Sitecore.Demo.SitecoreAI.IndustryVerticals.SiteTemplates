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

  const searchButton = (
    <button
      type="button"
      onClick={() => setIsSearchOpen(!isSearchOpen)}
      aria-label={isSearchOpen ? 'Close search' : 'Open search'}
      className="header-search-btn text-foreground p-1 transition-opacity hover:opacity-70"
    >
      <Search className="size-5 stroke-[1.5]" />
    </button>
  );

  return (
    <div className={`component header bg-background relative ${styles}`} id={id}>
      <div className="container px-4 lg:px-8">
        {/* Top row: logo + utility links + search */}
        <div className="flex items-center justify-between gap-4 pt-4 pb-0 lg:pt-5">
          <div className="header-block header-left shrink-0">
            <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </div>

          <div className="header-utilities hidden items-center gap-6 lg:flex lg:gap-8">
            <div className="header-block">
              <Placeholder
                name={`header-right-${DynamicPlaceholderId}`}
                rendering={props.rendering}
              />
            </div>
            {searchButton}
          </div>

          {/* Mobile: search + menu */}
          <div className="flex items-center gap-1 lg:hidden">
            {searchButton}
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="text-foreground p-2 transition-opacity hover:opacity-70"
                >
                  <Menu className="size-6 stroke-[1.5]" />
                </button>
              </DrawerTrigger>

              <DrawerContent className="bg-background w-xl! max-w-full! p-5">
                <div className="flex h-full flex-col">
                  <div className="mb-10 flex items-center justify-between">
                    <Placeholder
                      name={`header-left-${DynamicPlaceholderId}`}
                      rendering={props.rendering}
                    />
                    <DrawerClose asChild>
                      <button type="button" aria-label="Close menu" className="p-2">
                        <X className="size-5" />
                      </button>
                    </DrawerClose>
                  </div>

                  <div className="mb-8 flex flex-col gap-y-5 px-2">
                    <Placeholder
                      name={`header-nav-${DynamicPlaceholderId}`}
                      rendering={props.rendering}
                    />
                  </div>
                  <div className="border-border flex flex-col gap-y-5 border-t px-2 pt-6">
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

        {/* Bottom row: main navigation */}
        <div className="header-nav-row hidden justify-end pb-3 lg:flex lg:pb-4">
          <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-border bg-background absolute top-full right-0 left-0 z-50 border-b shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
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
