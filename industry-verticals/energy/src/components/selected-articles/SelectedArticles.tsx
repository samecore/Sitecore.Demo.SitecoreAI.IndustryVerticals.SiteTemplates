import { ComponentProps } from '@/lib/component-props';
import {
  Field,
  RichTextField,
  RichText as ContentSdkRichText,
  Image as ContentSdkImage,
  Text as ContentSdkText,
  DateField,
} from '@sitecore-content-sdk/nextjs';
import { Article } from '@/types/article';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Fields {
  Title: Field<string>;
  Description: RichTextField;
  Articles: Array<Article>;
}

export type SelectedArticlesProps = ComponentProps & {
  fields: Fields;
};

const formatArticleDate = (date: Date | null): string => {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};

export const Default = (props: SelectedArticlesProps) => {
  const id = props.params.RenderingIdentifier;
  const styles = props.params.styles || '';
  const articles = props.fields?.Articles || [];

  return (
    <section className={`py-16 ${styles}`} id={id}>
      <div className="container">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl leading-tight font-bold">
            <ContentSdkText field={props.fields?.Title} />
          </h2>
          <ContentSdkRichText
            className="text-foreground-light mt-2 text-base"
            field={props.fields?.Description}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {articles.map((article) => {
            const readMoreLabel = article.fields?.Title?.value
              ? `Read ${article.fields.Title.value}`
              : 'Read article';

            return (
              <article
                key={article.id}
                className="bg-background border-border flex flex-col rounded-2xl border p-3 shadow-sm"
              >
                <ContentSdkImage
                  field={article.fields?.Image}
                  className="h-40 w-full shrink-0 rounded-xl object-cover"
                />
                <div className="flex grow flex-col px-2 pt-4 pb-2">
                  <h3 className="line-clamp-2 text-base leading-snug font-bold">
                    <ContentSdkText field={article.fields?.Title} />
                  </h3>
                  <ContentSdkRichText
                    className="text-foreground-light mt-2 line-clamp-2 text-sm leading-relaxed"
                    field={article.fields?.ShortDescription}
                  />
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    {article.fields?.PublishedDate?.value ? (
                      <div className="text-accent flex items-center gap-1.5 text-sm">
                        <Calendar className="size-4 shrink-0" aria-hidden="true" />
                        <DateField
                          tag="span"
                          field={article.fields.PublishedDate}
                          render={formatArticleDate}
                        />
                      </div>
                    ) : (
                      <span />
                    )}
                    {article.url && (
                      <Link
                        href={article.url}
                        aria-label={readMoreLabel}
                        className="border-border text-foreground hover:border-accent hover:text-accent flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors"
                      >
                        <ArrowRight className="size-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
