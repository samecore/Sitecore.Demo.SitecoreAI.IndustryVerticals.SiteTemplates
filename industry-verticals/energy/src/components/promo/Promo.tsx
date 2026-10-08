import React, { JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Link as ContentSdkLink,
  ImageField,
  LinkField,
  RichTextField,
  Text as ContentSdkText,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { LayoutStyles } from '@/types/styleFlags';
import clsx from 'clsx';

interface Fields {
  PromoImageOne: ImageField;
  PromoTitle: TextField;
  PromoSubTitle: TextField;
  PromoDescription: RichTextField;
  PromoMoreInfo: LinkField;
}

export type PromoProps = ComponentProps & {
  fields: Fields;
};

const PromoBanner = ({
  fields,
  id,
  sxaStyles,
}: {
  fields: Fields;
  id?: string;
  sxaStyles: string;
}): JSX.Element => {
  const isReversed = sxaStyles?.includes(LayoutStyles.Reversed);

  return (
    <section
      className={`component promo relative flex min-h-[32rem] items-center overflow-hidden lg:min-h-[36rem] ${sxaStyles}`}
      id={id}
    >
      <ContentSdkImage
        field={fields?.PromoImageOne}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className={clsx(
          'absolute inset-0',
          isReversed
            ? 'bg-linear-to-l from-[#0e1621]/85 via-[#0e1621]/50 to-[#0e1621]/15'
            : 'bg-linear-to-r from-[#0e1621]/85 via-[#0e1621]/50 to-[#0e1621]/15'
        )}
      />
      <div
        className={clsx('relative z-10 container flex py-16 lg:py-24', isReversed && 'justify-end')}
      >
        <div className={clsx('max-w-3xl', isReversed && 'text-right')}>
          <ContentSdkText
            tag="p"
            className="mb-4 text-sm font-medium text-white/80"
            field={fields?.PromoSubTitle}
          />
          <ContentSdkText
            tag="h2"
            className="text-4xl leading-tight font-bold text-white lg:text-6xl"
            field={fields?.PromoTitle}
          />
          <ContentSdkRichText
            className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90 **:text-white/90"
            field={fields?.PromoDescription}
          />
          <ContentSdkLink
            field={fields?.PromoMoreInfo}
            className="mt-8 inline-flex items-center rounded-lg bg-white px-5 py-3 text-base font-medium text-[#161616] no-underline shadow-sm transition after:ms-2 after:content-['→'] hover:bg-neutral-100"
          />
        </div>
      </div>
    </section>
  );
};

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;

  return <PromoBanner fields={props.fields} id={id} sxaStyles={sxaStyles} />;
};

const PromoCard = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <article
      className={`border-border flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm ${sxaStyles}`}
      id={id}
    >
      <div className="bg-accent/10 mb-5 flex size-12 items-center justify-center rounded-full">
        <ContentSdkImage field={props.fields?.PromoImageOne} className="size-6 object-contain" />
      </div>
      <ContentSdkText
        tag="h3"
        className="text-lg leading-snug font-bold"
        field={props.fields?.PromoTitle}
      />
      <ContentSdkRichText
        className="text-foreground-light mt-2 line-clamp-3 text-sm leading-relaxed"
        field={props.fields?.PromoDescription}
      />
      <div className="mt-auto pt-6">
        <ContentSdkLink
          field={props.fields?.PromoMoreInfo}
          className="bg-accent hover:bg-accent-dark inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-white no-underline after:ms-1.5 after:content-['↗']"
        />
      </div>
    </article>
  );
};

export const Card = PromoCard;
export const Stacked = PromoCard;
