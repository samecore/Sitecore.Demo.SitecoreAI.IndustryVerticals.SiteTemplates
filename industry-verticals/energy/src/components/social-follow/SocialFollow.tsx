import React from 'react';
import { LinkField, Link as ContentSdkLink, Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Fields {
  SocialTitle: Field<string>;
  FacebookLink: LinkField;
  YoutubeLink: LinkField;
  InstagramLink: LinkField;
  TwitterLink: LinkField;
  LinkedinLink: LinkField;
  PinterestLink: LinkField;
}

type SocialFollowProps = ComponentProps & {
  fields: Fields;
  params: { [key: string]: string };
};

export const Default = (props: SocialFollowProps) => {
  const id = props.params.RenderingIdentifier;

  const socialLinks = [
    { icon: faFacebookF, field: props.fields.FacebookLink, key: 'facebook' },
    { icon: faTwitter, field: props.fields.TwitterLink, key: 'twitter' },
    { icon: faInstagram, field: props.fields.InstagramLink, key: 'instagram' },
    { icon: faLinkedinIn, field: props.fields.LinkedinLink, key: 'linkedin' },
    { icon: faYoutube, field: props.fields.YoutubeLink, key: 'youtube' },
  ];

  return (
    <div className="component social-follow flex flex-wrap gap-2" id={id}>
      {socialLinks
        .filter(({ field }) => field?.value?.href)
        .map(({ icon, field, key }) => (
          <ContentSdkLink field={field} key={key} aria-label={key}>
            <FontAwesomeIcon icon={icon} className="h-4 w-4" />
          </ContentSdkLink>
        ))}
    </div>
  );
};
