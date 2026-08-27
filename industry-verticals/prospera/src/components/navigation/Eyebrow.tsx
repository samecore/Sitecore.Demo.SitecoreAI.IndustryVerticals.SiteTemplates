'use client';

import { ComponentMap, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { JSX } from 'react';

export type EyebrowProps = ComponentProps & {
  fields: {
    LogoImage: ImageField;
  };
  componentMap: ComponentMap;
};

export const Default = (_props: EyebrowProps): JSX.Element | null => {
  return null;
};
