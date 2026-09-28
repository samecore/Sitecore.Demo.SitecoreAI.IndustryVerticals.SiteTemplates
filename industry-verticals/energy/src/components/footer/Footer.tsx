import React, { JSX } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  ImageField,
  LinkField,
  Placeholder,
  RichTextField,
  TextField,
  Text as ContentSdkText,
  Link as ContentSdkLink,
  RichText,
  NextImage as ContentSdkImage,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  TitleOne: TextField;
  TitleTwo: TextField;
  TitleThree: TextField;
  CopyrightText: TextField;
  PolicyText: LinkField;
  CookiesText: LinkField;
  ContactText: LinkField;
  TermsText: LinkField;
  Logo: ImageField;
  LogoDark?: ImageField;
  Description: RichTextField;
}

type FooterProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

const WORDMARK_SRC =
  'https://same-taqa.sitecoresandbox.cloud/api/public/content/cbf719051bed4e7c8de1b8418ecddef8?v=68931673';
const APP_STORE_IMAGE_SRC =
  'https://same-taqa.sitecoresandbox.cloud/api/public/content/299826e333e9469cbfe05a6aba6fc6fd?v=b4f47087';
const GOOGLE_PLAY_IMAGE_SRC =
  'https://same-taqa.sitecoresandbox.cloud/api/public/content/eee6b912701544148246c5edd083ec65?v=8929e8dd';

const getImageSrc = (image?: ImageField): string => {
  if (!image?.value || typeof image.value !== 'object') {
    return '';
  }

  return image.value.src || '';
};

const getWordmarkField = (image?: ImageField): ImageField => {
  if (getImageSrc(image)) {
    return image as ImageField;
  }

  return {
    value: {
      src: WORDMARK_SRC,
      alt: 'TAQA Distribution',
      width: '751',
      height: '342',
    },
  };
};

const hasLinkText = (link?: LinkField): boolean => {
  const value = link?.value;
  return Boolean(value && (value.text || value.href));
};

/**
 * Footer chrome matched to the TAQA Distribution three-row layout.
 * Sitecore logo, legal links, and list placeholders are kept.
 */
const Footer = (props: FooterProps): JSX.Element => {
  const { fields } = props || {};
  const {
    TitleOne,
    TitleTwo,
    TitleThree,
    CopyrightText,
    PolicyText,
    CookiesText,
    ContactText,
    TermsText,
    Logo,
    LogoDark,
    Description,
  } = fields || {};

  const sxaStyles = `${props.params?.styles || ''}`;
  const id = props.params.RenderingIdentifier;
  const phKeyOne = `footer-list-first-${props?.params?.DynamicPlaceholderId}`;
  const phKeyTwo = `footer-list-second-${props?.params?.DynamicPlaceholderId}`;
  const phKeyThree = `footer-list-third-${props?.params?.DynamicPlaceholderId}`;
  const phKeyFour = `footer-list-fourth-${props?.params?.DynamicPlaceholderId}`;
  const wordmark = getWordmarkField(LogoDark);

  const sections = [
    {
      key: 'first_nav',
      title: <ContentSdkText field={TitleOne} />,
      content: <Placeholder name={phKeyOne} rendering={props.rendering} />,
    },
    {
      key: 'second_nav',
      title: <ContentSdkText field={TitleTwo} />,
      content: <Placeholder name={phKeyTwo} rendering={props.rendering} />,
    },
    {
      key: 'third_nav',
      title: <ContentSdkText field={TitleThree} />,
      content: <Placeholder name={phKeyThree} rendering={props.rendering} />,
    },
  ];

  const legalLinks = [
    { key: 'contact', field: ContactText },
    { key: 'cookies', field: CookiesText },
    { key: 'policy', field: PolicyText },
    { key: 'terms', field: TermsText },
  ].filter((item) => hasLinkText(item.field));

  return (
    <div className={`component footer ${sxaStyles}`} id={id}>
      <div className="footer-row-apps">
        <div className="footer-purple" aria-hidden="true" />
        <div className="footer-apps-panel">
          <p className="footer-apps-copy">Download our apps</p>
          <div className="footer-store-badges">
            <a
              className="footer-store-badge"
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={APP_STORE_IMAGE_SRC} alt="Download on the App Store" />
            </a>
            <a
              className="footer-store-badge"
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={GOOGLE_PLAY_IMAGE_SRC} alt="Get it on Google Play" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-row-brands">
        <div className="footer-brand-left">
          <ContentSdkImage field={Logo} width={200} />
        </div>
        <div className="footer-brand-right">
          <ContentSdkImage field={wordmark} width={250} height={114} />
        </div>
      </div>

      <div className="footer-meta">
        <div className="footer-follow">
          <p className="footer-follow-title">Follow us</p>
          <Placeholder name={phKeyFour} rendering={props.rendering} />
        </div>
        <div className="footer-bottom">
          <div className="footer-legal">
            {legalLinks.map((item, index) => (
              <React.Fragment key={item.key}>
                {index > 0 && <span className="footer-legal-sep">|</span>}
                <ContentSdkLink field={item.field} />
              </React.Fragment>
            ))}
          </div>
          <p className="footer-copyright">
            <ContentSdkText field={CopyrightText} />
          </p>
        </div>
      </div>

      <div className="footer-description">
        <RichText field={Description} />
      </div>
      <div className="footer-sitecore-lists">
        {sections.map(({ key, title, content }) => (
          <div key={key}>
            <div>{title}</div>
            <div>{content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Default = Footer;
