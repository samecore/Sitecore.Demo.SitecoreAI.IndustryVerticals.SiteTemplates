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

const UTILITY_ITEMS = [
  { id: 'residential', label: 'Residential', active: true },
  { id: 'business', label: 'Business', active: false },
  { id: 'partners', label: 'Partners', active: false },
  { id: 'group', label: 'TAQA Group', active: false },
] as const;

/**
 * Site header chrome styled after TAQA Distribution.
 * Sitecore placeholders keep existing logo and Home navigation items.
 */
export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname, searchParams]);

  return (
    <div className={`component header ${styles}`} id={id}>
      <div className="header-utility">
        <button type="button" className="header-utility-item header-utility-outages">
          Outages and Maintenance
        </button>
        {UTILITY_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.active ? 'header-utility-item is-active' : 'header-utility-item'}
          >
            {item.label}
          </button>
        ))}
        <button type="button" className="header-utility-item" aria-label="Switch to Arabic">
          عربي
        </button>
        <button
          type="button"
          className="header-utility-item header-utility-icon"
          aria-label="Open search"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="size-5" />
        </button>
      </div>

      <div className="header-main">
        <div className="header-logo">
          <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
        <div className="header-nav">
          <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
        <div className="header-actions">
          <div className="lg:hidden">
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="header-menu-trigger p-2 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="w-xl! max-w-full! bg-white p-5">
                <div className="flex h-full flex-col">
                  <div className="mb-10 flex items-center justify-between self-end">
                    <DrawerClose asChild>
                      <button type="button" aria-label="Close menu">
                        <X className="h-5 w-5" />
                      </button>
                    </DrawerClose>
                  </div>
                  <div className="flex flex-col gap-y-6 px-8">
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
        <div className="absolute top-full right-0 left-0 z-50 border-b border-[#e5e5e5] bg-white shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center gap-2">
              <PreviewSearch
                rfkId={PREVIEW_WIDGET_ID}
                isOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-3 text-[#1a1a1d] transition-colors hover:text-[#0ab3a1]"
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
