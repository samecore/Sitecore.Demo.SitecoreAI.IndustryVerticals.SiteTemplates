'use client';

import { useCallback, useState } from 'react';
import { ComponentProps } from '@/lib/component-props';
import {
  Field,
  RichTextField,
  RichText as ContentSdkRichText,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  DateField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { Article } from '@/types/article';
import Link from 'next/link';
import { useI18n } from 'next-localization';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';

interface Fields {
  Title: Field<string>;
  Description: RichTextField;
  Articles: Array<Article>;
}

export type SelectedArticlesProps = ComponentProps & {
  fields: Fields;
};

const announcementDateFormatter = (date: Date | null): string | undefined =>
  date?.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const ArrowIcon = ({ direction }: { direction: 'prev' | 'next' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      fill="currentColor"
      fillRule="evenodd"
      d={
        direction === 'next'
          ? 'M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L11.58 10 7.3 5.7a1 1 0 0 1 0-1.4Z'
          : 'M12.7 4.3a1 1 0 0 1 0 1.4L8.42 10l4.28 4.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0Z'
      }
      clipRule="evenodd"
    />
  </svg>
);

export const Default = (props: SelectedArticlesProps) => {
  const { t } = useI18n();
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.styles || '';
  const { Title, Description, Articles } = props.fields || {};
  const articles = (Array.isArray(Articles) ? Articles : []).filter(
    (article) => article?.id || article?.url
  );
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(articles.length <= 1);

  const syncNavState = useCallback((instance: SwiperInstance) => {
    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
  }, []);

  const handlePrev = () => {
    if (isBeginning) {
      return;
    }
    swiper?.slidePrev();
  };

  const handleNext = () => {
    if (isEnd) {
      return;
    }
    swiper?.slideNext();
  };

  return (
    <section className={`component selected-articles ${styles}`} id={id || undefined}>
      <div className="selected-articles-header">
        <div className="selected-articles-heading-block">
          {(Title?.value || isEditing) && (
            <h2 className="selected-articles-heading">
              <ContentSdkText field={Title} />
            </h2>
          )}
          {(Description?.value || isEditing) && (
            <div className="selected-articles-description">
              <ContentSdkRichText field={Description} />
            </div>
          )}
        </div>
        <div className="selected-articles-nav">
          <button
            type="button"
            className={
              isBeginning ? 'selected-articles-nav-btn is-inactive' : 'selected-articles-nav-btn'
            }
            aria-label="Previous articles"
            aria-disabled={isBeginning}
            onClick={handlePrev}
          >
            <ArrowIcon direction="prev" />
          </button>
          <button
            type="button"
            className={
              isEnd ? 'selected-articles-nav-btn is-inactive' : 'selected-articles-nav-btn'
            }
            aria-label="Next articles"
            aria-disabled={isEnd}
            onClick={handleNext}
          >
            <ArrowIcon direction="next" />
          </button>
        </div>
      </div>

      {articles.length > 0 && (
        <div className="selected-articles-carousel">
          <Swiper
            modules={[Keyboard, A11y]}
            slidesPerView="auto"
            slidesPerGroup={1}
            spaceBetween={20}
            slidesOffsetBefore={70}
            slidesOffsetAfter={70}
            watchOverflow
            breakpoints={{
              0: {
                spaceBetween: 10,
                slidesOffsetBefore: 20,
                slidesOffsetAfter: 20,
              },
              1024: {
                spaceBetween: 20,
                slidesOffsetBefore: 70,
                slidesOffsetAfter: 70,
              },
            }}
            keyboard={{ enabled: true }}
            a11y={{ enabled: true }}
            onSwiper={(instance) => {
              setSwiper(instance);
              syncNavState(instance);
            }}
            onSlideChange={syncNavState}
            onResize={syncNavState}
          >
            {articles.map((article) => {
              const fields = article?.fields || {};
              const { Title: articleTitle, ShortDescription, Image, PublishedDate } = fields;

              return (
                <SwiperSlide key={article.id || article.url} className="selected-articles-slide">
                  <article className="selected-articles-card">
                    {(Image?.value?.src || isEditing) && (
                      <div className="selected-articles-card-media">
                        <ContentSdkImage field={Image} className="selected-articles-card-image" />
                      </div>
                    )}
                    <div className="selected-articles-card-body">
                      {(PublishedDate?.value || isEditing) && (
                        <p className="selected-articles-card-date">
                          <span className="selected-articles-card-date-dot" aria-hidden="true" />
                          <DateField
                            tag="span"
                            field={PublishedDate}
                            render={announcementDateFormatter}
                          />
                        </p>
                      )}
                      {(articleTitle?.value || isEditing) && (
                        <h3 className="selected-articles-card-title">
                          <ContentSdkText field={articleTitle} />
                        </h3>
                      )}
                      {(ShortDescription?.value || isEditing) && (
                        <p className="selected-articles-card-excerpt">
                          <ContentSdkText field={ShortDescription} />
                        </p>
                      )}
                      {article.url && (
                        <Link href={article.url} className="selected-articles-card-link">
                          <span className="selected-articles-card-link-icon" aria-hidden="true" />
                          {t('read_more') || 'Read More'}
                        </Link>
                      )}
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </section>
  );
};
