'use client';

import { IGQLImageField, IGQLRichTextField, IGQLTextField, IGQLLinkField } from 'src/types/igql';
import {
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  withDatasourceCheck,
  ComponentRendering,
  ComponentParams,
} from '@sitecore-content-sdk/nextjs';
import { TrendingUp } from 'lucide-react';

interface Fields {
  data: {
    datasource: {
      children: {
        results: FeatureFields[];
      };
      title: IGQLTextField;
      description: IGQLRichTextField;
    };
  };
}

interface FeatureFields {
  id: string;
  featureTitle: IGQLTextField;
  featureDescription: IGQLTextField;
  featureImage: IGQLImageField;
  featureImageDark?: IGQLImageField;
  featureLink?: IGQLLinkField;
}

type FeaturesProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

const FeatureItem = ({
  feature,
  layout = 'vertical',
}: {
  feature: FeatureFields;
  layout: 'vertical' | 'horizontal';
}) => {
  if (layout === 'horizontal') {
    // Card variant: horizontal layout with button
    return (
      <li key={feature?.id} className="border-border flex flex-col gap-4 rounded-lg border p-6">
        <div className="mb-3.5 flex items-center gap-1">
          <ContentSdkImage
            field={feature?.featureImage?.jsonValue}
            className="h-8 w-8 flex-shrink-0 object-contain"
          />
          <h5 className="text-base leading-none font-bold">
            <ContentSdkText field={feature?.featureTitle?.jsonValue} />
          </h5>
        </div>
        <p>
          <ContentSdkText field={feature?.featureDescription?.jsonValue} />
        </p>
        {feature?.featureLink?.jsonValue ? (
          <div className="mt-2">
            <ContentSdkLink field={feature.featureLink.jsonValue} className="outline-btn" />
          </div>
        ) : null}
      </li>
    );
  }

  const hasImage = !!feature?.featureImage?.jsonValue?.value?.src;

  return (
    <li key={feature?.id} className="flex flex-col items-center px-2 text-center">
      <div className="bg-accent/10 mb-4 flex size-12 items-center justify-center rounded-full">
        {hasImage ? (
          <ContentSdkImage
            field={feature?.featureImage?.jsonValue}
            className="size-6 object-contain"
          />
        ) : (
          <TrendingUp className="text-accent size-5" aria-hidden="true" />
        )}
      </div>
      <ContentSdkText
        tag="p"
        className="text-accent text-3xl leading-none font-semibold tracking-tight"
        field={feature?.featureTitle?.jsonValue}
      />
      <ContentSdkText
        tag="p"
        className="text-foreground-light mt-3 text-sm leading-snug"
        field={feature?.featureDescription?.jsonValue}
      />
    </li>
  );
};

const DefaultFeatures = ({ fields, params }: FeaturesProps) => {
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;

  return (
    <section className={`relative py-10 lg:py-16 ${params?.styles || ''}`} id={id || undefined}>
      <div className="container">
        <h2 className="mb-2 text-left text-3xl leading-tight font-bold">
          <ContentSdkText field={fields?.data?.datasource?.title?.jsonValue} />
        </h2>
        <ContentSdkRichText
          className="text-foreground-light max-w-2xl text-base"
          field={fields?.data?.datasource?.description?.jsonValue}
        />

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {features?.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} layout="vertical" />
          ))}
        </ul>
      </div>
    </section>
  );
};

const CardFeatures = ({ fields, params }: FeaturesProps) => {
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;

  return (
    <div className={`relative py-10 lg:py-16 ${params?.styles || ''}`} id={id || undefined}>
      <div className="container">
        <h2 className="mb-6 text-3xl font-bold">
          <ContentSdkText field={fields?.data?.datasource?.title?.jsonValue} />
        </h2>
        <ul className="grid gap-6 lg:grid-cols-3">
          {features?.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} layout="horizontal" />
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Default = withDatasourceCheck()<FeaturesProps>(DefaultFeatures);
export const Card = withDatasourceCheck()<FeaturesProps>(CardFeatures);
