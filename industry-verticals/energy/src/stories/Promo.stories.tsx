import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default as Promo, PromoProps, Stacked as PromoStacked } from '../components/promo/Promo';
import { CommonParams, CommonRendering } from './common/commonData';
import { createImageField, createLinkField, createTextField } from './helpers/createFields';
import {
  BackgroundColorArgs,
  backgroundColorArgTypes,
  defaultBackgroundColorArgs,
} from './common/commonControls';
import clsx from 'clsx';
import { LayoutStyles } from '@/types/styleFlags';

type StoryProps = PromoProps &
  BackgroundColorArgs & {
    Reversed: boolean;
  };

const meta = {
  title: 'Page Content/Promo',
  component: Promo,
  argTypes: {
    ...backgroundColorArgTypes,
    Reversed: {
      control: 'boolean',
      name: 'Promo Reversed',
    },
  },
  args: {
    Reversed: false,
    ...defaultBackgroundColorArgs,
  },
  tags: ['autodocs'],
} satisfies Meta<StoryProps>;
export default meta;

type Story = StoryObj<StoryProps>;

const baseParams = {
  ...CommonParams,
};

const baseRendering = {
  ...CommonRendering,
  componentName: 'Promo',
  params: baseParams,
};

const baseFields = {
  PromoImageOne: createImageField('placeholder'),
  PromoTitle: createTextField('An enhanced app with improved features'),
  PromoDescription: {
    value: '<p>Take control of your TAQA Distribution account</p>',
  },
  PromoSubTitle: createTextField('Powering Communities'),
  PromoMoreInfo: createLinkField('Read More'),
  AppstoreTitle: createTextField('Upgrade to a new experience'),
  PromoImageTwo: {
    value: {
      src: '/footer/app-store.png',
      alt: 'Download on the App Store',
      width: '154',
      height: '60',
    },
  },
  PromoImageThree: {
    value: {
      src: '/footer/google-play.png',
      alt: 'Get it on Google Play',
      width: '154',
      height: '60',
    },
  },
};

export const Default: Story = {
  render: (args) => {
    const promoStyles = clsx(
      baseParams.styles,
      args.BackgroundColor,
      args.Reversed && LayoutStyles.Reversed
    );

    const params = {
      ...baseParams,
      styles: promoStyles,
    };
    return <Promo params={params} rendering={baseRendering} fields={baseFields} />;
  },
};

export const Stacked: Story = {
  render: (args) => {
    const promoStyles = clsx(
      baseParams.styles,
      args.BackgroundColor,
      args.Reversed && LayoutStyles.Reversed
    );

    const params = {
      ...baseParams,
      styles: promoStyles,
    };
    return <PromoStacked params={params} rendering={baseRendering} fields={baseFields} />;
  },
};
