'use client';

import { ComponentProps } from '@/lib/component-props';
import { Field, NextImage as ContentSdkImage, Text } from '@sitecore-content-sdk/nextjs';
import { Destination } from '@/types/destination';
import Link from 'next/link';
import { useI18n } from 'next-localization';
import { ChevronRight } from 'lucide-react';
import { LayoutStyles } from '@/types/styleFlags';

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
    <section
      className={`component selected-destinations ${props.params.styles} py-10`}
      id={id ? id : undefined}
    >
      <div className="container mx-auto px-4">
        <div className="selected-destinations-header">
          <div className="selected-destinations-header-inner">
            <h2 className="selected-destinations-title">
              <Text field={props.fields?.Title} />
            </h2>

            <p className="selected-destinations-description">
              <Text field={props.fields.Description} />
            </p>
          </div>
        </div>

        <div className={`${hasJustifyAround ? 'my-10 flex w-full justify-around' : ''}`}>
          <div className="selected-destinations-grid">
            {destinations.map((destination, index) => (
              <div key={index} className="selected-destinations-card">
                {destination.fields.Image && (
                  <Link href={destination.url} className="selected-destinations-card-image block">
                    <ContentSdkImage
                      field={destination.fields.Image}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                )}

                <div className="selected-destinations-card-body">
                  <h3 className="selected-destinations-card-title">
                    <Link href={destination.url} className="hover:underline">
                      <Text field={destination.fields.Title} />
                    </Link>
                  </h3>

                  <Link href={destination.url} className="selected-destinations-card-link">
                    {t('read_more') || 'Read More'}
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
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
    <section
      className={`component selected-destinations ${props.params.styles} py-10`}
      id={id ? id : undefined}
    >
      <div className="container mx-auto px-4">
        <div className="selected-destinations-header">
          <div className="selected-destinations-header-inner">
            <h2 className="selected-destinations-title">
              <Text field={props.fields.Title} />
            </h2>

            <p className="selected-destinations-description">
              <Text field={props.fields.Description} />
            </p>
          </div>
        </div>

        <div className={`${hasJustifyAround ? 'my-10 flex w-full justify-around' : ''}`}>
          <div className="selected-destinations-grid">
            {destinations.map((destination, index) => (
              <Link key={index} href={destination.url} className="selected-destinations-card group">
                {destination.fields.Image && (
                  <div className="selected-destinations-card-image">
                    <ContentSdkImage
                      field={destination.fields.Image}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {destination.fields.Price && (
                      <div className="selected-destinations-card-badge">
                        <Text field={destination.fields.Price} />
                      </div>
                    )}
                  </div>
                )}

                <div className="selected-destinations-card-body">
                  <h3 className="selected-destinations-card-title">
                    <Text field={destination.fields.Title} />
                  </h3>

                  {destination.fields.Country && (
                    <p className="selected-destinations-card-meta">
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
