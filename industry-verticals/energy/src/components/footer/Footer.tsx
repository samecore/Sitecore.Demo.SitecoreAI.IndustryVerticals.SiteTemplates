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
  Description: RichTextField;
}

type FooterProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

const Footer = (props: FooterProps): JSX.Element => {
  // styles
  const sxaStyles = `${props.params?.styles || ''}`;

  // rendering item id
  const id = props.params.RenderingIdentifier;

  // placeholders keys
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
    <div className={`site-footer ${sxaStyles}`} id={id}>
      <div className="site-footer-main">
        <div className="site-footer-grid container">
          {sections.map(({ key, title, content }) => (
            <div key={key}>
              <div className="site-footer-heading">{title}</div>
              {content}
            </div>
          ))}
          <div>
            <Placeholder name={phKeyFour} rendering={props.rendering} />
          </div>
        </div>
      </div>

      <div className="site-footer-bar">
        <div className="site-footer-bar-row container">
          <div className="site-footer-legal">
            <RichText field={props.fields.Description} />
            <p>
              <ContentSdkText field={props.fields.CopyrightText} />
            </p>
            <div className="site-footer-links">
              <ContentSdkLink field={props.fields.PolicyText} />
              <ContentSdkLink field={props.fields.TermsText} />
              <ContentSdkLink field={props.fields.CookiesText} />
              <ContentSdkLink field={props.fields.ContactText} />
            </div>
          </div>
          <ContentSdkImage field={props.fields.Logo} className="site-footer-logo" />
        </div>
      </div>
    </div>
  );
};

export const Default = Footer;
