import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  useSitecore,
  Link,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Image: ImageField;
  Video: ImageField;
  Title: Field<string>;
  Description: Field<string>;
  CtaLink: LinkField;
  SecondaryCtaLink: LinkField;
  '3rdCtaLink'?: LinkField;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

const hasCta = (link?: LinkField): boolean => {
  const value = link?.value;
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Boolean(value.text || value.href);
};

export const Default = ({ params, fields }: HeroBannerProps) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;

  if (!fields) {
    return isPageEditing ? (
      <div className={`component hero-banner ${styles}`} id={id}>
        [HERO BANNER]
      </div>
    ) : (
      <></>
    );
  }

  const { Image, Video, Title, Description, CtaLink, SecondaryCtaLink } = fields || {};
  const thirdCta = fields?.['3rdCtaLink'];
  const ctas = [CtaLink, SecondaryCtaLink, thirdCta].filter((link): link is LinkField =>
    Boolean(link && (isPageEditing || hasCta(link)))
  );

  return (
    <div className={`component hero-banner ${styles}`} id={id}>
      <div className="hero-banner-media">
        {!isPageEditing && Video?.value?.src ? (
          <video
            className="hero-banner-media-asset"
            autoPlay
            muted
            loop
            playsInline
            poster={Image?.value?.src}
          >
            <source src={Video?.value?.src} type="video/webm" />
          </video>
        ) : (
          (Image?.value?.src || isPageEditing) && (
            <ContentSdkImage field={Image} className="hero-banner-media-asset" priority />
          )
        )}
      </div>
      <div className="hero-banner-shade" aria-hidden="true" />

      <div className="hero-banner-content">
        {(Title?.value || isPageEditing) && (
          <h1 className="hero-banner-title">
            <ContentSdkText field={Title} />
          </h1>
        )}
        {(Description?.value || isPageEditing) && (
          <div className="hero-banner-subtitle">
            <ContentSdkRichText field={Description} />
          </div>
        )}
        {ctas.length > 0 && (
          <div className="hero-banner-ctas">
            {ctas.map((link, index) => (
              <Link key={`hero-cta-${index}`} field={link} className="hero-banner-cta">
                <span className="hero-banner-cta-label">{link.value?.text}</span>
                <span className="hero-banner-cta-icon" aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
