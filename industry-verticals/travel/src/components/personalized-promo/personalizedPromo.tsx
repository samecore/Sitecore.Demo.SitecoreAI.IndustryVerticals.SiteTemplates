import React, { JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { LayoutStyles, PromoFlags } from '@/types/styleFlags';

type Fields = object;

export type PromoProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const isPromoReversed = props?.params?.styles?.includes(LayoutStyles.Reversed)
    ? 'order-last'
    : '';
  const hideShadow = props?.params?.styles?.includes(PromoFlags.HidePromoShadows);

  return (
    <section className={`${props.params.styles || ''} py-10 lg:py-16`} id={id ? id : undefined}>
      <div className="container">
        <div
          className={`grid grid-cols-1 overflow-hidden rounded-lg border shadow transition-shadow hover:shadow-lg lg:grid-cols-2 ${hideShadow ? '' : 'shadow hover:shadow-lg'} `}
        >
          {/* Image Section */}
          <div className={`${isPromoReversed} relative h-full w-full`}>
            <ContentSdkImage
              value="https://static.vecteezy.com/system/resources/thumbnails/016/796/170/small/delayed-flight-illustration-design-concept-illustration-for-website-landing-page-mobile-app-poster-and-banner-trendy-flat-illustration-vector.jpg"
              className="h-full w-full object-cover"
              width={600}
              height={400}
            />
          </div>

          {/* Text Section */}
          <div className="font-body relative flex flex-col justify-start p-6 py-8 lg:justify-center lg:p-20 lg:py-10">
            <div className="flex w-full flex-col">
              <div className="w-full space-y-5">
                <Text value="Status Update: Flight Delayed" tag="h3" className="w-full" />

                <div className="text-foreground w-full text-base">
                  <ContentSdkRichText value="Our apologies for the inconvience your flight is currently delayed. Please check our app for the latest status" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
