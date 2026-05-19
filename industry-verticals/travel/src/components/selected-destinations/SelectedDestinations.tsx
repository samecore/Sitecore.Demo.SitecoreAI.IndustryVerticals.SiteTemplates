'use client';

import { ComponentProps } from '@/lib/component-props';
import { Field, NextImage as ContentSdkImage, Text } from '@sitecore-content-sdk/nextjs';
import { Destination } from '@/types/destination';
import Link from 'next/link';
import { useI18n } from 'next-localization';
import { LayoutStyles } from '@/types/styleFlags';

const promoCardImageClass =
  'relative aspect-[3/2] w-full overflow-hidden rounded-3xl bg-background-muted';
const promoCardTitleClass =
  'font-heading text-lg font-bold uppercase leading-snug tracking-tight text-[#002147] lg:text-xl';
const promoCardDescriptionClass = 'text-base leading-relaxed text-[#586376]';
const promoCtaClass =
  'inline-flex w-fit items-center justify-center rounded-full border-[3px] border-[#ffe100] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#002147] transition-colors hover:bg-[#fffbeb]';

interface Fields {
  Title: Field<string>;
  Description: Field<string>;
  Destinations: Array<Destination>;
}

export type SelectedDestinationsProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SelectedDestinationsProps) => {
  const { t } = useI18n();
  const id = props.params.RenderingIdentifier;
  const destinations = props.fields?.Destinations || [];
  const hasJustifyAround = props?.params?.styles?.includes(LayoutStyles.JustyfyAround);

  return (
    <section className={`${props.params.styles} py-10`} id={id ? id : undefined}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="mb-4">
            <Text field={props.fields?.Title} />
          </h2>

          <p className="text-foreground-light text-xl">
            <Text field={props.fields.Description} />
          </p>
        </div>

        {/* Cards */}
        <div className={`${hasJustifyAround ? 'my-10 flex w-full justify-around' : ''}`}>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination, index) => (
              <article key={index} className="flex h-full flex-col gap-5">
                {destination.fields.Image && (
                  <div className={promoCardImageClass}>
                    <ContentSdkImage
                      field={destination.fields.Image}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-4">
                  <h6 className={promoCardTitleClass}>
                    <Text field={destination.fields.Title} />
                  </h6>

                  {destination.fields.ShortDescription && (
                    <p className={promoCardDescriptionClass}>
                      <Text field={destination.fields.ShortDescription} />
                    </p>
                  )}

                  <div className="mt-auto">
                    <Link href={destination.url} className={promoCtaClass}>
                      {t('read_more') || 'Book Package'}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const WithStartingPrice = (props: SelectedDestinationsProps) => {
  const id = props.params.RenderingIdentifier;
  const destinations = props.fields?.Destinations || [];
  const hasJustifyAround = props?.params?.styles?.includes(LayoutStyles.JustyfyAround);

  return (
    <section className={`${props.params.styles} py-10`} id={id ? id : undefined}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="mb-4">
            <Text field={props.fields.Title} />
          </h2>

          <p className="text-foreground-light text-xl">
            <Text field={props.fields.Description} />
          </p>
        </div>

        {/* Cards */}
        <div className={`${hasJustifyAround ? 'my-10 flex w-full justify-around' : ''}`}>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination, index) => (
              <Link
                key={index}
                href={destination.url}
                className="group flex h-full cursor-pointer flex-col gap-5 no-underline transition-opacity hover:opacity-90"
              >
                {destination.fields.Image && (
                  <div className={promoCardImageClass}>
                    <ContentSdkImage
                      field={destination.fields.Image}
                      className="h-full w-full object-cover"
                    />

                    {destination.fields.Price && (
                      <div className="absolute top-4 right-4 rounded-full bg-[#ffe100] px-3 py-1 text-xs font-bold text-black shadow-md">
                        <Text field={destination.fields.Price} />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-4">
                  <h6 className={promoCardTitleClass}>
                    <Text field={destination.fields.Title} />
                  </h6>

                  {destination.fields.Country && (
                    <p className="text-sm font-medium text-[#586376]">
                      <Text field={destination.fields.Country} />
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
