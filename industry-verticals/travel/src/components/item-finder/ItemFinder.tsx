'use client';

import React, { useState, useMemo, JSX } from 'react';
import { Field, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useI18n } from 'next-localization';
import {
  Search,
  PlaneTakeoff,
  PlaneLanding,
  ChevronDown,
  Check,
  ArrowLeftRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import { DatePicker } from '@/shadcn/components/ui/date-picker';
import { event } from '@sitecore-cloudsdk/events/browser';
import { format } from 'date-fns';

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

const flightDestinations = [
  'Riyadh',
  'Jeddah',
  'Dubai',
  'London',
  'Paris',
  'Istanbul',
  'Barcelona',
  'Singapore',
  'Phuket',
  'Bali',
];

// Large variant - Complex form with date pickers
export const Large = ({ params, fields }: ItemFinderProps): JSX.Element => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const { t } = useI18n();
  const isPageEditing = page.mode.isEditing;
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [children, setChildren] = useState(0);
  const [flightClass, setFlightClass] = useState<
    'economy' | 'premium' | 'business' | 'first-class'
  >('economy');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showChildrenDropdown, setShowChildrenDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const closeAllDropdowns = () => {
    setShowPassengerDropdown(false);
    setShowChildrenDropdown(false);
    setShowClassDropdown(false);
  };

  const passengerOptions = useMemo(
    () => [
      { label: t('1adult') || '1 Adult', value: 1 },
      { label: t('2adults') || '2 Adults', value: 2 },
      { label: t('3adults') || '3 Adults', value: 3 },
      { label: t('4-plus-adults') || '4+ Adults', value: 4 },
    ],
    [t]
  );

  const childrenOptions = useMemo(
    () => [
      { label: t('0_children') || '0 Children', value: 0 },
      { label: t('1_child') || '1 Child', value: 1 },
      { label: t('2_children') || '2 Children', value: 2 },
      { label: t('3_children') || '3 Children', value: 3 },
      { label: t('4-plus-children') || '4+ Children', value: 4 },
    ],
    [t]
  );

  const flightClassOptions = useMemo(
    () => [
      { label: t('economy_class') || 'Economy', value: 'economy' as const },
      { label: t('premium_class') || 'Premium', value: 'premium' as const },
      { label: t('business_class') || 'Business', value: 'business' as const },
      { label: t('first_class') || 'First Class', value: 'first-class' as const },
    ],
    [t]
  );

  const tripTypeOptions = useMemo(
    () => [
      { value: 'round-trip' as const, dictKey: 'round_trip_label', defaultLabel: 'Round Trip' },
      { value: 'one-way' as const, dictKey: 'one_way_label', defaultLabel: 'One Way' },
      { value: 'multi-city' as const, dictKey: 'multi_city_label', defaultLabel: 'Multi-city' },
    ],
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    event({
      type: 'FLIGHT_SEARCH',
      channel: 'WEB',
      language: 'EN',
      currency: 'USD',
      extensionData: {
        tripType,
        origin: from,
        destination: to,
        ...(departureDate ? { departureDate: format(departureDate, 'yyyy-MM-dd') } : {}),
        ...(returnDate ? { returnDate: format(returnDate, 'yyyy-MM-dd') } : {}),
        passengers,
        children,
        flightClass,
      },
    }).catch((e) => console.debug(e));
  };

  const handleSwapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  const selectedPassengerLabel =
    passengerOptions.find((opt) => opt.value === passengers)?.label || t('1adult') || '1 Adult';

  const selectedChildrenLabel =
    childrenOptions.find((opt) => opt.value === children)?.label || t('0_children') || '0 Children';

  const selectedFlightClassLabel =
    flightClassOptions.find((opt) => opt.value === flightClass)?.label ||
    t('economy_class') ||
    'Economy';

  const BookingSelectField = <T extends string | number>({
    label,
    valueLabel,
    isOpen,
    onToggle,
    options,
    selectedValue,
    onSelect,
  }: {
    label: string;
    valueLabel: string;
    isOpen: boolean;
    onToggle: () => void;
    options: { label: string; value: T }[];
    selectedValue: T;
    onSelect: (value: T) => void;
  }) => (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flight-booking-field-trigger"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flight-booking-field-trigger-content">
          <span className="flight-booking-field-label">{label}</span>
          <span className="flight-booking-field-value">{valueLabel}</span>
        </div>
        <ChevronDown className="flight-booking-field-trigger-icon" size={18} aria-hidden="true" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={closeAllDropdowns} aria-hidden="true" />
          <div
            role="listbox"
            className="absolute top-full right-0 z-20 mt-1 min-w-full rounded-md border border-[#e8e8e8] bg-white py-1 shadow-lg"
          >
            {options.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                role="option"
                aria-selected={selectedValue === option.value}
                onClick={() => {
                  onSelect(option.value);
                  closeAllDropdowns();
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-[var(--flight-text)] transition-colors hover:bg-[#f2f2f2]"
              >
                <span>{option.label}</span>
                {selectedValue === option.value && (
                  <Check size={16} className="ml-2 shrink-0 text-[var(--flight-primary)]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (!fields && !isPageEditing) {
    return <></>;
  }

  return (
    <div
      className={`component item-finder flight-booking-form ${styles || ''}`}
      id={id || undefined}
    >
      {isPageEditing && !fields && (
        <div className="text-foreground-muted p-4 text-center">[ITEM FINDER - LARGE]</div>
      )}
      {(!isPageEditing || fields) && (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flight-booking-card">
            <div className="flight-booking-trip-types">
              {tripTypeOptions.map((option) => (
                <label key={option.value} className="flight-booking-radio">
                  <input
                    type="radio"
                    name="trip-type"
                    value={option.value}
                    checked={tripType === option.value}
                    onChange={() => setTripType(option.value)}
                  />
                  <span className="flight-booking-radio-indicator" aria-hidden="true" />
                  <span>{t(option.dictKey) || option.defaultLabel}</span>
                </label>
              ))}
            </div>

            <div className="flight-booking-grid">
              <div className="flight-booking-grid__from">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flight-booking-field-trigger"
                      aria-label={t('from_label') || 'From'}
                    >
                      <div className="flight-booking-field-trigger-content">
                        <span className="flight-booking-field-label">
                          {t('from_label') || 'From'}
                        </span>
                        <span
                          className={
                            from ? 'flight-booking-field-value' : 'flight-booking-field-value-muted'
                          }
                        >
                          {from || t('select_airport_placeholder') || 'Select city'}
                        </span>
                      </div>
                      <PlaneTakeoff
                        className="flight-booking-field-trigger-icon"
                        size={20}
                        aria-hidden="true"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-48">
                    {flightDestinations.map((city) => (
                      <DropdownMenuItem
                        key={city}
                        onClick={() => setFrom(city)}
                        className="flex items-center justify-between"
                      >
                        <span>{city}</span>
                        {from === city && (
                          <Check size={16} className="ml-2 shrink-0 text-[var(--flight-primary)]" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <button
                type="button"
                onClick={handleSwapLocations}
                className="flight-booking-swap flight-booking-grid__swap"
                aria-label={t('swap_locations_label') || 'Swap locations'}
              >
                <ArrowLeftRight size={18} />
              </button>

              <div className="flight-booking-grid__to">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flight-booking-field-trigger"
                      aria-label={t('to_label') || 'To'}
                    >
                      <div className="flight-booking-field-trigger-content">
                        <span className="flight-booking-field-label">{t('to_label') || 'To'}</span>
                        <span
                          className={
                            to ? 'flight-booking-field-value' : 'flight-booking-field-value-muted'
                          }
                        >
                          {to || t('select_airport_placeholder') || 'Select city'}
                        </span>
                      </div>
                      <PlaneLanding
                        className="flight-booking-field-trigger-icon"
                        size={20}
                        aria-hidden="true"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-48">
                    {flightDestinations.map((city) => (
                      <DropdownMenuItem
                        key={city}
                        onClick={() => setTo(city)}
                        className="flex items-center justify-between"
                      >
                        <span>{city}</span>
                        {to === city && (
                          <Check size={16} className="ml-2 shrink-0 text-[var(--flight-primary)]" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className={`flight-booking-grid__departure ${tripType !== 'round-trip' ? 'flight-booking-grid__departure--one-way' : ''}`}
              >
                <DatePicker
                  selected={departureDate}
                  onChange={(date: Date | null) => {
                    setDepartureDate(date);
                  }}
                  label={t('departure_label') || 'Departing'}
                  placeholderText={t('select_date_placeholder') || 'Select date'}
                  dateFormat="EEE, MMM d, yyyy"
                  minDate={new Date()}
                  showIcon={true}
                  iconPosition="right"
                  triggerClassName="flight-booking-field-trigger border-0 shadow-none"
                />
              </div>

              {tripType === 'round-trip' && (
                <div className="flight-booking-grid__return">
                  <DatePicker
                    selected={returnDate}
                    onChange={(date: Date | null) => {
                      setReturnDate(date);
                    }}
                    label={t('return_label') || 'Returning'}
                    placeholderText={t('select_date_placeholder') || 'Select date'}
                    dateFormat="EEE, MMM d, yyyy"
                    minDate={departureDate || new Date()}
                    showIcon={true}
                    iconPosition="right"
                    triggerClassName="flight-booking-field-trigger border-0 shadow-none"
                  />
                </div>
              )}

              <div
                className={`flight-booking-grid__class ${tripType !== 'round-trip' ? 'flight-booking-grid__class--one-way' : ''}`}
              >
                <BookingSelectField
                  label={t('flight_class_label') || 'Class'}
                  valueLabel={selectedFlightClassLabel}
                  isOpen={showClassDropdown}
                  onToggle={() => {
                    const willOpen = !showClassDropdown;
                    closeAllDropdowns();
                    if (willOpen) setShowClassDropdown(true);
                  }}
                  options={flightClassOptions}
                  selectedValue={flightClass}
                  onSelect={setFlightClass}
                />
              </div>

              <div className="flight-booking-grid__passengers">
                <BookingSelectField
                  label={t('passengers_label') || 'Passengers'}
                  valueLabel={selectedPassengerLabel}
                  isOpen={showPassengerDropdown}
                  onToggle={() => {
                    const willOpen = !showPassengerDropdown;
                    closeAllDropdowns();
                    if (willOpen) setShowPassengerDropdown(true);
                  }}
                  options={passengerOptions}
                  selectedValue={passengers}
                  onSelect={setPassengers}
                />
              </div>

              <div className="flight-booking-grid__children">
                <BookingSelectField
                  label={t('children_label') || 'Children'}
                  valueLabel={selectedChildrenLabel}
                  isOpen={showChildrenDropdown}
                  onToggle={() => {
                    const willOpen = !showChildrenDropdown;
                    closeAllDropdowns();
                    if (willOpen) setShowChildrenDropdown(true);
                  }}
                  options={childrenOptions}
                  selectedValue={children}
                  onSelect={setChildren}
                />
              </div>
            </div>

            <div className="flight-booking-actions">
              <button type="submit" className="flight-booking-submit">
                <Search size={18} aria-hidden="true" />
                <span>
                  {fields?.SearchButtonText?.value || t('search_button_text') || 'Search Flights'}
                </span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
