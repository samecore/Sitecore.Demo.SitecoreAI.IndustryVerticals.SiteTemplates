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
  Image as ContentSdkImage,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  TitleOne: TextField;
  TitleTwo: TextField;
  TitleThree: TextField;
  CopyrightText: TextField;
  PolicyText: LinkField;
  CookiesText: LinkField;
  TermsText: LinkField;
  Logo: ImageField;
  Description: RichTextField;
}

type FooterProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

const Footer = (props: FooterProps): JSX.Element => {
  const sxaStyles = `${props.params?.styles || ''}`;
  const id = props.params.RenderingIdentifier;

  const phKeyOne = `footer-list-first-${props?.params?.DynamicPlaceholderId}`;
  const phKeyTwo = `footer-list-second-${props?.params?.DynamicPlaceholderId}`;
  const phKeyThree = `footer-list-third-${props?.params?.DynamicPlaceholderId}`;
  const phKeyFour = `footer-list-fourth-${props?.params?.DynamicPlaceholderId}`;

  const sections = [
    {
      key: 'first_nav',
      title: <ContentSdkText field={props.fields.TitleOne} />,
      content: <Placeholder name={phKeyOne} rendering={props.rendering} />,
    },
    {
      key: 'second_nav',
      title: <ContentSdkText field={props.fields.TitleTwo} />,
      content: <Placeholder name={phKeyTwo} rendering={props.rendering} />,
    },
    {
      key: 'third_nav',
      title: <ContentSdkText field={props.fields.TitleThree} />,
      content: <Placeholder name={phKeyThree} rendering={props.rendering} />,
    },
  ];

  return (
    <footer className={`component footer ${sxaStyles}`} id={id}>
      <div className="container mx-auto px-4">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <ContentSdkImage field={props.fields.Logo} />
            </div>

            <div className="footer-description">
              <RichText field={props.fields.Description} />
            </div>

            <div className="footer-brand-extra">
              <Placeholder name={phKeyFour} rendering={props.rendering} />
            </div>
          </div>

          <div className="footer-nav">
            {sections.map(({ key, title, content }) => (
              <div key={key} className="footer-nav-column">
                <div className="footer-nav-title">{title}</div>
                <div>{content}</div>
              </div>
            ))}
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copyright">
            <ContentSdkText field={props.fields.CopyrightText} />
          </p>

          <div className="footer-legal">
            <ContentSdkLink field={props.fields.PolicyText} />
            <ContentSdkLink field={props.fields.TermsText} />
            <ContentSdkLink field={props.fields.CookiesText} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Default = Footer;
