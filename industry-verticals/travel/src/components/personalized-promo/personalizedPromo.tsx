import React, { JSX, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ComponentProps } from 'lib/component-props';
import { LayoutStyles, PromoFlags } from '@/types/styleFlags';
import { getPersonalizedPromo, personalizeResponse } from '@/lib/datalayerhelper';

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

  const [title, setTitle] = useState<string | null>('');
  const [description, setDescription] = useState<string | null>('');
  const [image, setImage] = useState<string | null>('');

  useEffect(() => {
    (async () => {
      try {
        const response = (await getPersonalizedPromo()) as personalizeResponse;
        if (response) {
          setTitle(response?.decisionOffers?.[0]?.attributes?.Title);
          setDescription(response?.decisionOffers?.[0]?.attributes?.Description);
          setImage(response?.decisionOffers?.[0]?.attributes?.Image);
        }
      } catch (e) {
        console.error('Failed to get guest Data:', e);
      }
    })();
  }, []);

  const hasImage = Boolean(image);
  const showStatusUpdateWarning = Boolean(
    title && String(title).toLowerCase().includes('status update')
  );

  return (
    <section className={`${props.params.styles || ''} py-10 lg:py-16`} id={id ? id : undefined}>
      <div className="container">
        {/* @container: side-by-side only when card is wide (≥28rem); in narrow columns we stack so text gets full width */}
        <div
          className={`@container grid grid-cols-1 overflow-hidden rounded-lg border shadow transition-shadow hover:shadow-lg ${hasImage ? '@md:grid-cols-2' : ''} ${hideShadow ? '' : 'shadow hover:shadow-lg'}`}
        >
          {/* Image Section - fixed size when image URL is populated from personalize */}
          {hasImage && (
            <div
              className={`${isPromoReversed} relative h-[500px] w-full max-w-full shrink-0 overflow-hidden`}
            >
              <img
                src={image ?? ''}
                alt={title ?? 'Promo'}
                className="h-full w-full object-cover"
                width={400}
                height={400}
              />
            </div>
          )}

          {/* Text Section - min-w-0 so text can wrap; when stacked, description gets full width */}
          <div className="font-body relative flex min-w-0 flex-col justify-start bg-white p-6 py-8 lg:p-20 lg:py-10 @md:justify-center @md:p-8">
            <div className="flex min-w-0 flex-col">
              <div className="w-full min-w-0 space-y-3">
                <h3 className="flex items-center gap-2 text-lg leading-tight font-semibold sm:text-xl">
                  {showStatusUpdateWarning && (
                    <AlertTriangle className="size-5 shrink-0 text-amber-500" aria-hidden />
                  )}
                  {title}
                </h3>
                <p className="text-foreground text-base leading-snug">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
