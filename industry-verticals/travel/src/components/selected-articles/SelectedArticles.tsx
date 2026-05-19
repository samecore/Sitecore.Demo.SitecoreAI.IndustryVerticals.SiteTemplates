import { ComponentProps } from '@/lib/component-props';
import {
  Field,
  LinkField,
  Link as ContentSdkLink,
  RichTextField,
  RichText as ContentSdkRichText,
  Image as ContentSdkImage,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { Article } from '@/types/article';
import Link from 'next/link';
import { useI18n } from 'next-localization';

const articleCardImageClass =
  'relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-background-muted';
const articleCardTitleClass =
  'font-heading text-lg font-bold uppercase leading-snug tracking-tight text-[#002147] lg:text-xl';
const articleCardDescriptionClass = 'text-base leading-relaxed text-[#586376]';
const articleCtaClass =
  'inline-flex w-fit items-center justify-center rounded-full border-[3px] border-[#ffe100] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#002147] transition-colors hover:bg-[#fffbeb]';

interface Fields {
  Title: Field<string>;
  Description: RichTextField;
  ExploreLink: LinkField;
  Articles: Array<Article>;
}

export type CarouselProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: CarouselProps) => {
  const { t } = useI18n();
  const id = props.params.RenderingIdentifier;
  const styles = props.params.styles || [];
  const articles = props.fields?.Articles || [];

  return (
    <section className={`py-16 ${styles}`} id={id}>
      <div className="container px-4">
        {/* title section */}
        <div className="container in-[.column-splitter]:px-0">
          <div className="mb-12 text-center">
            <h2 className="mb-4">
              <ContentSdkText field={props.fields.Title} />
            </h2>
            <div className="text-foreground-light text-xl">
              <ContentSdkRichText field={props.fields.Description} />
            </div>
          </div>
        </div>

        {/* article list section */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article, index) => (
            <article key={index} className="flex h-full flex-col gap-4 text-center">
              <div className={articleCardImageClass}>
                <ContentSdkImage
                  field={article.fields.Image}
                  className="h-full w-full object-cover"
                />
              </div>

              <h6 className={articleCardTitleClass} role="heading" aria-level={3}>
                <ContentSdkText field={article.fields.Title} />
              </h6>

              <div className={`${articleCardDescriptionClass} line-clamp-3`}>
                <ContentSdkRichText field={article.fields.ShortDescription} />
              </div>

              <div className="mt-auto flex justify-center pt-2">
                <Link href={article.url} className={articleCtaClass}>
                  {t('read_more') || 'Explore Theme Park'}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* cta section */}
        <div className="container mt-12 flex items-center justify-center">
          <ContentSdkLink
            field={props.fields.ExploreLink}
            className={articleCtaClass}
            aria-label={`link to ${props.fields.ExploreLink?.value?.text || 'explore more'}`}
          />
        </div>
      </div>
    </section>
  );
};
