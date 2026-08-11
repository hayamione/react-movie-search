import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'MovieSearch';

const toAbsoluteUrl = (input: string | undefined): string | undefined => {
  if (!input) {
    return undefined;
  }
  if (/^(https?:)?\/\//.test(input)) {
    return input;
  }
  const base = window.location.origin + import.meta.env.BASE_URL;
  return new URL(input.replace(/^\/+/, ''), base).toString();
};

interface PageMetaProps {
  title: string;
  description?: string;
  /** Relative public asset or absolute URL used for og:image / twitter:image. */
  image?: string;
  /** Where the brand name appears in the title. Defaults to "suffix" (e.g. "Discover Movies | MovieSearch"). */
  brand?: 'suffix' | 'prefix';
}

const PageMeta = ({
  title,
  description,
  image = 'og-image.png',
  brand = 'suffix',
}: PageMetaProps) => {
  const fullTitle = brand === 'prefix' ? `${SITE_NAME} | ${title}` : `${title} | ${SITE_NAME}`;
  const shareImage = toAbsoluteUrl(image);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      {shareImage && <meta property="og:image" content={shareImage} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {shareImage && <meta name="twitter:image" content={shareImage} />}
    </Helmet>
  );
};

export default PageMeta;