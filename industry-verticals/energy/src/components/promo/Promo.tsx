import {
  Text as ContentSdkText,
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  RichTextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

type TextField = Field<string>;

interface Fields {
  PromoImageOne: ImageField;
  PromoImageTwo?: ImageField;
  PromoImageThree?: ImageField;
  PromoTitle: TextField;
  PromoSubTitle: TextField;
  PromoDescription: RichTextField;
  PromoMoreInfo: LinkField;
  AppstoreTitle?: TextField;
}

export type PromoProps = ComponentProps & {
  fields: Fields;
};

const APP_STORE_HREF = 'https://apps.apple.com';
const GOOGLE_PLAY_HREF = 'https://play.google.com';

const hasImage = (field?: ImageField): boolean => Boolean(field?.value?.src);
const hasText = (field?: TextField | RichTextField): boolean => Boolean(field?.value);

const StoreBadgeLink = ({
  field,
  href,
  isEditing,
}: {
  field?: ImageField;
  href: string;
  isEditing: boolean;
}) => {
  if (!hasImage(field) && !isEditing) {
    return null;
  }

  return (
    <a className="promo-store-link" href={href} target="_blank" rel="noopener noreferrer">
      <ContentSdkImage field={field} className="promo-store-badge" />
    </a>
  );
};

export const Default = (props: PromoProps) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = props.params;
  const isEditing = page.mode.isEditing;
  const { fields } = props;

  if (!fields) {
    return isEditing ? (
      <div className={`component promo ${styles}`} id={id}>
        [PROMO]
      </div>
    ) : (
      <></>
    );
  }

  const {
    PromoImageOne,
    PromoImageTwo,
    PromoImageThree,
    PromoTitle,
    PromoSubTitle,
    PromoDescription,
    AppstoreTitle,
  } = fields || {};

  const showStores =
    isEditing || hasImage(PromoImageTwo) || hasImage(PromoImageThree) || hasText(AppstoreTitle);

  return (
    <div className={`component promo ${styles}`} id={id ? id : undefined}>
      {(hasImage(PromoImageOne) || isEditing) && (
        <div className="promo-media">
          <ContentSdkImage field={PromoImageOne} className="promo-media-asset" />
        </div>
      )}

      <div className="promo-content">
        {(hasText(PromoSubTitle) || isEditing) && (
          <ContentSdkText field={PromoSubTitle} tag="p" className="promo-subtitle" />
        )}

        <div className="promo-main">
          {(hasText(PromoTitle) || isEditing) && (
            <ContentSdkText field={PromoTitle} tag="h2" className="promo-title" />
          )}
          {(hasText(PromoDescription) || isEditing) && (
            <ContentSdkRichText field={PromoDescription} className="promo-description" />
          )}
        </div>

        {showStores && (
          <div className="promo-app">
            {(hasText(AppstoreTitle) || isEditing) && (
              <ContentSdkText field={AppstoreTitle} tag="p" className="promo-app-title" />
            )}
            <div className="promo-app-stores">
              <StoreBadgeLink field={PromoImageTwo} href={APP_STORE_HREF} isEditing={isEditing} />
              <StoreBadgeLink
                field={PromoImageThree}
                href={GOOGLE_PLAY_HREF}
                isEditing={isEditing}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Stacked = (props: PromoProps) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = props.params;
  const isEditing = page.mode.isEditing;
  const { fields } = props;

  if (!fields) {
    return isEditing ? (
      <div className={`component promo promo-stacked ${styles}`} id={id}>
        [PROMO]
      </div>
    ) : (
      <></>
    );
  }

  const {
    PromoImageOne,
    PromoImageTwo,
    PromoImageThree,
    PromoTitle,
    PromoSubTitle,
    PromoDescription,
  } = fields || {};

  const showStores = isEditing || hasImage(PromoImageTwo) || hasImage(PromoImageThree);

  return (
    <div className={`component promo promo-stacked ${styles}`} id={id ? id : undefined}>
      <div className="promo-stack">
        {(hasImage(PromoImageOne) || isEditing) && (
          <div className="promo-stack-image">
            <ContentSdkImage field={PromoImageOne} className="promo-stack-image-asset" />
          </div>
        )}

        {(hasText(PromoSubTitle) || isEditing) && (
          <ContentSdkText field={PromoSubTitle} tag="p" className="promo-stack-subtitle" />
        )}
        {(hasText(PromoTitle) || isEditing) && (
          <ContentSdkText field={PromoTitle} tag="h2" className="promo-stack-title" />
        )}
        {(hasText(PromoDescription) || isEditing) && (
          <ContentSdkRichText field={PromoDescription} className="promo-stack-description" />
        )}

        {showStores && (
          <div className="promo-stack-stores">
            <StoreBadgeLink field={PromoImageTwo} href={APP_STORE_HREF} isEditing={isEditing} />
            <StoreBadgeLink field={PromoImageThree} href={GOOGLE_PLAY_HREF} isEditing={isEditing} />
          </div>
        )}
      </div>
    </div>
  );
};
