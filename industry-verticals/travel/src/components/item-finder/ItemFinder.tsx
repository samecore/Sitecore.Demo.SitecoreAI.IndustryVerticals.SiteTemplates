'use client';

import React, { useState, useMemo, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { Field, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useI18n } from 'next-localization';
import { format } from 'date-fns';
import { Search, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import { Calendar } from '@/shadcn/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import { cn } from '@/shadcn/lib/utils';
import { event } from '@sitecore-cloudsdk/events/browser';

interface Fields {
  PlaceholderText?: Field<string>;
  SearchButtonText?: Field<string>;
}

interface ItemFinderProps extends ComponentProps {
  fields?: Fields;
}

// Simple variant - Simple search bar
export const Default = ({ params, fields }: ItemFinderProps): JSX.Element => {
  const { page } = useSitecore();
  const { t } = useI18n();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
  };

  if (!fields && !isPageEditing) {
    return <></>;
  }

  return (
    <div
      className={`component item-finder article-search mx-auto max-w-md ${styles || ''}`}
      id={id || undefined}
    >
      {isPageEditing && !fields && (
        <div className="text-foreground-muted p-4 text-center">[ITEM FINDER - SIMPLE]</div>
      )}
      {(!isPageEditing || fields) && (
        <form onSubmit={handleSubmit}>
          <div className="relative w-full">
            <div className="text-foreground-muted absolute top-1/2 left-4 -translate-y-1/2">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_articles_placeholder') || 'Search articles...'}
              className="border-border bg-background text-foreground placeholder:text-foreground-muted focus:border-accent w-full rounded-lg border px-12 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
            />
          </div>
        </form>
      )}
    </div>
  );
};

// Medium variant - Search with filters (Continent, Type, Activities)
export const Medium = ({ params, fields }: ItemFinderProps): JSX.Element => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const { t } = useI18n();
  const isPageEditing = page.mode.isEditing;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  const continentOptions = useMemo(
    () => [
      { label: t('all_label') || 'All', value: 'All' },
      { label: t('europe_label') || 'Europe', value: 'Europe' },
      { label: t('asia_label') || 'Asia', value: 'Asia' },
      { label: t('north_america_label') || 'North America', value: 'North America' },
      { label: t('south_america_label') || 'South America', value: 'South America' },
      { label: t('africa_label') || 'Africa', value: 'Africa' },
      { label: t('oceania_label') || 'Oceania', value: 'Oceania' },
    ],
    [t]
  );

  const typeOptions = useMemo(
    () => [
      { label: t('all_label') || 'All', value: 'All' },
      { label: t('city_label') || 'City', value: 'City' },
      { label: t('beach_label') || 'Beach', value: 'Beach' },
      { label: t('mountain_label') || 'Mountain', value: 'Mountain' },
      { label: t('adventure_label') || 'Adventure', value: 'Adventure' },
      { label: t('cultural_label') || 'Cultural', value: 'Cultural' },
    ],
    [t]
  );

  const activityOptions = useMemo(
    () => [
      { label: t('all_label') || 'All', value: 'All' },
      { label: t('culture_label') || 'Culture', value: 'Culture' },
      { label: t('adventure_label') || 'Adventure', value: 'Adventure' },
      { label: t('beach_label') || 'Beach', value: 'Beach' },
      { label: t('food_label') || 'Food', value: 'Food' },
      { label: t('history_label') || 'History', value: 'History' },
      { label: t('nature_label') || 'Nature', value: 'Nature' },
    ],
    [t]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
  };

  if (!fields && !isPageEditing) {
    return <></>;
  }

  const FilterDropdown = ({
    options,
    selectedValue,
    onSelect,
    placeholder,
  }: {
    options: { label: string; value: string }[];
    selectedValue: string;
    onSelect: (value: string) => void;
    placeholder: string;
  }) => {
    const selectedLabel = selectedValue
      ? options.find((opt) => opt.value === selectedValue)?.label
      : null;
    const displayText = selectedLabel || placeholder;
    const isPlaceholder = !selectedValue;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`border-border inline-flex h-9 w-auto items-center gap-2 rounded-md border bg-transparent px-4 py-1 text-xs whitespace-nowrap shadow-xs focus:outline-none ${
              isPlaceholder ? 'text-foreground-muted' : 'text-foreground'
            }`}
          >
            <span>{displayText}</span>
            <ChevronDown size={16} className="text-foreground-muted shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-36">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="flex items-center justify-between text-xs"
            >
              <span>{option.label}</span>
              {selectedValue === option.value && <Check size={16} className="ml-2 shrink-0" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div
      className={`component item-finder destination-search bg-background mx-auto max-w-4xl rounded-lg p-6 shadow-lg ${styles || ''}`}
      id={id || undefined}
    >
      {isPageEditing && !fields && (
        <div className="text-foreground-muted p-4 text-center">[ITEM FINDER - MEDIUM]</div>
      )}
      {(!isPageEditing || fields) && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search Input */}
            <div className="relative">
              <div className="text-foreground-muted pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_destinations_placeholder') || 'Search destinations...'}
                className="text-foreground placeholder:text-foreground-muted focus:outline-accent-gray/60 h-9 w-full rounded-md border bg-transparent py-1 pr-6 pl-10 text-xs shadow-xs placeholder:text-xs focus:outline-3"
              />
            </div>

            {/* Continent Dropdown */}
            <div className="shrink-0">
              <FilterDropdown
                options={continentOptions}
                selectedValue={selectedContinent}
                onSelect={setSelectedContinent}
                placeholder={t('continent_label') || 'Continent'}
              />
            </div>

            {/* Type Dropdown */}
            <div className="shrink-0">
              <FilterDropdown
                options={typeOptions}
                selectedValue={selectedType}
                onSelect={setSelectedType}
                placeholder={t('type_label') || 'Type'}
              />
            </div>

            {/* Activities Dropdown */}
            <div className="shrink-0">
              <FilterDropdown
                options={activityOptions}
                selectedValue={selectedActivity}
                onSelect={setSelectedActivity}
                placeholder={t('activities_label') || 'Activities'}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

type VacationTab = 'vacation' | 'experiences' | 'premium-vacation';

interface FinderFieldProps {
  label: string;
  displayText: string;
  isPlaceholder?: boolean;
  className?: string;
}

const FinderField = ({
  label,
  displayText,
  isPlaceholder = false,
  className,
}: FinderFieldProps) => (
  <div
    className={cn(
      'border-border relative flex min-w-0 flex-1 flex-col justify-center border-b px-5 py-4 last:border-b-0 lg:border-r lg:border-b-0 lg:px-6 lg:py-5 lg:last:border-r-0',
      className
    )}
  >
    <span className="text-foreground mb-1 text-[10px] font-bold tracking-wider uppercase">
      {label}
    </span>
    <span
      className={cn(
        'truncate pr-6 text-left text-base font-medium',
        isPlaceholder ? 'text-foreground-muted' : 'text-foreground'
      )}
    >
      {displayText}
    </span>
    <ChevronDown
      size={18}
      className="text-foreground pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 lg:right-6"
      aria-hidden
    />
  </div>
);

// Large variant - Vacation search with tabs and pill-style fields
export const Large = ({ params, fields }: ItemFinderProps): JSX.Element => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const { t } = useI18n();
  const router = useRouter();
  const isPageEditing = page.mode.isEditing;
  const [activeTab, setActiveTab] = useState<VacationTab>('vacation');
  const [holidayPackage, setHolidayPackage] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guestsRooms, setGuestsRooms] = useState('2-1');
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const tabOptions = useMemo(
    () => [
      { value: 'vacation' as const, dictKey: 'vacation_tab_label', defaultLabel: 'Vacation' },
      {
        value: 'experiences' as const,
        dictKey: 'experiences_tab_label',
        defaultLabel: 'Experiences',
      },
      {
        value: 'premium-vacation' as const,
        dictKey: 'premium_vacation_tab_label',
        defaultLabel: 'Premium Vacation',
      },
    ],
    []
  );

  const packageOptions = useMemo(
    () => [
      { label: t('package_beach_escape') || 'Beach Escape', value: 'beach-escape' },
      { label: t('package_city_break') || 'City Break', value: 'city-break' },
      { label: t('package_adventure_tour') || 'Adventure Tour', value: 'adventure-tour' },
      { label: t('package_family_fun') || 'Family Fun', value: 'family-fun' },
      { label: t('package_luxury_retreat') || 'Luxury Retreat', value: 'luxury-retreat' },
    ],
    [t]
  );

  const guestsRoomsOptions = useMemo(
    () => [
      { label: t('guests_1_adult_1_room') || '1 Adult - 1 Room', value: '1-1' },
      { label: t('guests_2_adults_1_room') || '2 Adults - 1 Room', value: '2-1' },
      { label: t('guests_2_adults_2_rooms') || '2 Adults - 2 Rooms', value: '2-2' },
      { label: t('guests_3_adults_1_room') || '3 Adults - 1 Room', value: '3-1' },
      { label: t('guests_4_adults_2_rooms') || '4 Adults - 2 Rooms', value: '4-2' },
    ],
    [t]
  );

  const selectedPackageLabel = holidayPackage
    ? packageOptions.find((opt) => opt.value === holidayPackage)?.label
    : null;

  const selectedGuestsLabel =
    guestsRoomsOptions.find((opt) => opt.value === guestsRooms)?.label ||
    t('guests_2_adults_1_room') ||
    '2 Adults - 1 Room';

  const datesPlaceholder = t('check_in_check_out_placeholder') || 'Check-in - Check-out';
  const datesDisplay =
    checkInDate && checkOutDate
      ? `${format(checkInDate, 'MMM d')} - ${format(checkOutDate, 'MMM d')}`
      : checkInDate
        ? `${format(checkInDate, 'MMM d')} - Check-out`
        : datesPlaceholder;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    event({
      type: 'HOLIDAY_SEARCH',
      channel: 'WEB',
      language: 'EN',
      currency: 'USD',
      extensionData: {
        tab: activeTab,
        guests: Number(guestsRooms.split('-')[0]),
        rooms: Number(guestsRooms.split('-')[1]),
        ...(holidayPackage ? { holidayPackage } : {}),
        ...(checkInDate ? { checkIn: format(checkInDate, 'yyyy-MM-dd') } : {}),
        ...(checkOutDate ? { checkOut: format(checkOutDate, 'yyyy-MM-dd') } : {}),
      },
    }).catch((e) => console.debug(e));
    router.push('/book');
  };

  if (!fields && !isPageEditing) {
    return <></>;
  }

  return (
    <div
      className={cn('component item-finder vacation-search-form mx-auto w-full max-w-5xl', styles)}
      id={id || undefined}
    >
      {isPageEditing && !fields && (
        <div className="text-foreground-muted p-4 text-center">[ITEM FINDER - LARGE]</div>
      )}
      {(!isPageEditing || fields) && (
        <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-4">
          <div className="bg-background inline-flex overflow-hidden rounded-full shadow-md">
            {tabOptions.map((option) => {
              const isActive = activeTab === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActiveTab(option.value)}
                  className={cn(
                    'cursor-pointer px-5 py-2.5 text-xs font-bold tracking-wide uppercase transition-colors sm:px-7 sm:py-3 sm:text-sm',
                    isActive
                      ? 'text-foreground bg-[#FFEB00]'
                      : 'text-foreground hover:bg-background-muted bg-white'
                  )}
                >
                  {t(option.dictKey) || option.defaultLabel}
                </button>
              );
            })}
          </div>

          <div className="bg-background flex w-full flex-col overflow-hidden rounded-3xl shadow-xl lg:flex-row lg:items-stretch lg:rounded-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="w-full text-left focus:outline-none">
                  <FinderField
                    label={t('choose_holiday_label') || 'Choose your holiday'}
                    displayText={
                      selectedPackageLabel || t('pick_package_placeholder') || 'Pick your Package'
                    }
                    isPlaceholder={!selectedPackageLabel}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-48">
                {packageOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setHolidayPackage(option.value)}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{option.label}</span>
                    {holidayPackage === option.value && (
                      <Check size={16} className="ml-2 shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
              <PopoverTrigger asChild>
                <button type="button" className="w-full text-left focus:outline-none">
                  <FinderField
                    label={t('choose_dates_label') || 'Choose your dates'}
                    displayText={datesDisplay}
                    isPlaceholder={!checkInDate}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="center">
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                  <div>
                    <p className="text-foreground mb-2 text-xs font-bold uppercase">
                      {t('check_in_label') || 'Check-in'}
                    </p>
                    <Calendar
                      selected={checkInDate}
                      onSelect={(date) => {
                        setCheckInDate(date);
                        if (checkOutDate && date && checkOutDate < date) {
                          setCheckOutDate(null);
                        }
                      }}
                      minDate={new Date()}
                    />
                  </div>
                  <div>
                    <p className="text-foreground mb-2 text-xs font-bold uppercase">
                      {t('check_out_label') || 'Check-out'}
                    </p>
                    <Calendar
                      selected={checkOutDate}
                      onSelect={(date) => {
                        setCheckOutDate(date);
                        if (date) {
                          setDatePopoverOpen(false);
                        }
                      }}
                      minDate={checkInDate || new Date()}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex w-full flex-col sm:flex-row lg:flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="w-full flex-1 text-left focus:outline-none">
                    <FinderField
                      label={t('choose_guests_rooms_label') || 'Choose guests & rooms'}
                      displayText={selectedGuestsLabel}
                      className="lg:border-r-0"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48">
                  {guestsRoomsOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setGuestsRooms(option.value)}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{option.label}</span>
                      {guestsRooms === option.value && (
                        <Check size={16} className="ml-2 shrink-0" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center justify-center p-3 lg:p-2 lg:pr-3">
                <button
                  type="submit"
                  className="text-foreground w-full rounded-full bg-[#FFEB00] px-8 py-3.5 text-sm font-bold tracking-wide uppercase transition-colors hover:bg-[#f5e000] focus:ring-2 focus:ring-[#FFEB00]/50 focus:ring-offset-2 focus:outline-none sm:w-auto sm:px-10"
                >
                  {fields?.SearchButtonText?.value?.toString() ||
                    t('search_button_text') ||
                    'Search'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
