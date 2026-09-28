'use client';

import { IGQLImageField, IGQLRichTextField, IGQLTextField, IGQLLinkField } from 'src/types/igql';
import {
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  withDatasourceCheck,
  useSitecore,
  ComponentRendering,
  ComponentParams,
} from '@sitecore-content-sdk/nextjs';

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

const FeaturesHeader = ({
  title,
  description,
  isEditing,
}: {
  title?: IGQLTextField;
  description?: IGQLRichTextField;
  isEditing: boolean;
}) => {
  const titleField = title?.jsonValue;
  const descriptionField = description?.jsonValue;

  return (
    <div className="features-header">
      {(titleField?.value || isEditing) && (
        <h2 className="features-heading">
          <ContentSdkText field={titleField} />
        </h2>
      )}
      {(descriptionField?.value || isEditing) && (
        <div className="features-description">
          <ContentSdkRichText field={descriptionField} />
        </div>
      )}
    </div>
  );
};

const DefaultFeatureItem = ({
  feature,
  isEditing,
}: {
  feature: FeatureFields;
  isEditing: boolean;
}) => {
  const { featureTitle, featureDescription, featureImage, featureLink } = feature || {};
  const title = featureTitle?.jsonValue;
  const description = featureDescription?.jsonValue;
  const image = featureImage?.jsonValue;
  const link = featureLink?.jsonValue;

  return (
    <li className="features-default-item">
      <div className="features-default-item-inner">
        {(image?.value?.src || isEditing) && (
          <div className="features-default-icon">
            <ContentSdkImage field={image} className="features-default-icon-image" />
          </div>
        )}
        <div className="features-default-copy">
          {(title?.value || isEditing) && (
            <h3 className="features-default-item-title">
              <ContentSdkText field={title} />
            </h3>
          )}
          {(description?.value || isEditing) && (
            <p className="features-default-item-description">
              <ContentSdkText field={description} />
            </p>
          )}
          {(link?.value?.href || link?.value?.text || isEditing) && (
            <div className="features-default-item-action">
              <ContentSdkLink field={link ?? { value: { href: '' } }} className="outline-btn" />
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

const CardFeatureItem = ({
  feature,
  isEditing,
}: {
  feature: FeatureFields;
  isEditing: boolean;
}) => {
  const { featureTitle, featureImage } = feature || {};
  const title = featureTitle?.jsonValue;
  const image = featureImage?.jsonValue;

  return (
    <li className="features-card">
      <div className="features-card-media">
        {(image?.value?.src || isEditing) && (
          <ContentSdkImage field={image} className="features-card-image" />
        )}
        {(title?.value || isEditing) && (
          <h3 className="features-card-title">
            <ContentSdkText field={title} />
          </h3>
        )}
      </div>
    </li>
  );
};

const DefaultFeatures = ({ fields, params }: FeaturesProps) => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const id = params?.RenderingIdentifier;
  const { title, description, children } = fields?.data?.datasource || {};
  const features = children?.results;

  return (
    <section
      className={`component features features--default ${params?.styles || ''}`}
      id={id || undefined}
    >
      <div className="features-inner">
        <FeaturesHeader title={title} description={description} isEditing={isEditing} />
        <ul className="features-default-grid">
          {features?.map((feature) => (
            <DefaultFeatureItem key={feature.id} feature={feature} isEditing={isEditing} />
          ))}
        </ul>
      </div>
    </section>
  );
};

const CardFeatures = ({ fields, params }: FeaturesProps) => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const id = params?.RenderingIdentifier;
  const { title, description, children } = fields?.data?.datasource || {};
  const features = children?.results;

  return (
    <section
      className={`component features features--card ${params?.styles || ''}`}
      id={id || undefined}
    >
      <div className="features-inner">
        <FeaturesHeader title={title} description={description} isEditing={isEditing} />
        <ul className="features-card-grid">
          {features?.map((feature) => (
            <CardFeatureItem key={feature.id} feature={feature} isEditing={isEditing} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export const Default = withDatasourceCheck()<FeaturesProps>(DefaultFeatures);
export const Card = withDatasourceCheck()<FeaturesProps>(CardFeatures);
