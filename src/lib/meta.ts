import { BatchSchedule, getUpcomingBatchSchedule } from './schedule';

export interface CohortPricing {
  freeMasterclass: number | string;
  workshopPrice: number;
  androidCohortPrice: number;
  currency: string;
  currencySymbol: string;
}

export const DEFAULT_COHORT_PRICING: CohortPricing = {
  freeMasterclass: 'FREE',
  workshopPrice: 499,
  androidCohortPrice: 999,
  currency: 'INR',
  currencySymbol: '₹',
};

export interface CohortMetaConfig {
  schedule?: BatchSchedule;
  pricing?: CohortPricing;
  siteUrl?: string;
  imageUrl?: string;
  customTitle?: string;
  customDescription?: string;
  locale?: string;
  siteName?: string;
  twitterHandle?: string;
}

export interface GeneratedCohortMeta {
  title: string;
  description: string;
  shortDescription: string;
  url: string;
  imageUrl: string;
  batchStartDate: string;
  batchStartDateFull: string;
  pricingSummary: string;
  openGraphTags: Record<string, string>;
  twitterTags: Record<string, string>;
}

/**
 * Generates dynamic Open Graph and social metadata based on current cohort schedule and pricing.
 */
export function generateCohortMetaData(config: CohortMetaConfig = {}): GeneratedCohortMeta {
  const schedule = config.schedule || getUpcomingBatchSchedule();
  const pricing = { ...DEFAULT_COHORT_PRICING, ...(config.pricing || {}) };
  const siteUrl = config.siteUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://codeinindia.in');
  const imageUrl = config.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80';
  const siteName = config.siteName || 'CodeInIndia';
  const twitterHandle = config.twitterHandle || '@codeinindia';
  const locale = config.locale || 'en_IN';

  const batchDate = schedule.nearestBatchFormatted;
  const batchDateFull = schedule.nearestBatchFullFormatted;
  const pricingSummary = `Intro Masterclass: ${pricing.freeMasterclass} • 1-Day Workshop: ${pricing.currencySymbol}${pricing.workshopPrice} • 2-Weekend Android Cohort: ${pricing.currencySymbol}${pricing.androidCohortPrice}`;

  const title = config.customTitle || `${siteName} — Next Live Batch: ${batchDate} | From ${pricing.currencySymbol}${pricing.workshopPrice}`;
  const description = config.customDescription || `Next live cohort kicks off ${batchDateFull}. Build & ship dynamic websites, SaaS products & Android apps with AI coding workflows. ${pricingSummary}. 100% money-back guarantee.`;
  const shortDescription = `Live coding batch starting ${batchDate}. Learn full-stack & AI workflows. Workshops from ${pricing.currencySymbol}${pricing.workshopPrice}. 100% money-back guarantee.`;

  const openGraphTags: Record<string, string> = {
    'og:title': title,
    'og:description': description,
    'og:url': `${siteUrl}/`,
    'og:type': 'website',
    'og:site_name': siteName,
    'og:locale': locale,
    'og:image': imageUrl,
    'og:image:secure_url': imageUrl,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/jpeg',
    'og:image:alt': `${siteName} live coding cohort starting ${batchDate}`,
    'og:updated_time': schedule.nearestBatch.toISOString(),
    'product:price:amount': String(pricing.workshopPrice),
    'product:price:currency': pricing.currency,
    'product:availability': 'in stock',
  };

  const twitterTags: Record<string, string> = {
    'twitter:card': 'summary_large_image',
    'twitter:title': `${siteName} — Next Live Batch: ${batchDate}`,
    'twitter:description': shortDescription,
    'twitter:image': imageUrl,
    'twitter:image:alt': `${siteName} cohort starting ${batchDate}`,
    'twitter:site': twitterHandle,
    'twitter:creator': twitterHandle,
  };

  return {
    title,
    description,
    shortDescription,
    url: `${siteUrl}/`,
    imageUrl,
    batchStartDate: batchDate,
    batchStartDateFull: batchDateFull,
    pricingSummary,
    openGraphTags,
    twitterTags,
  };
}

/**
 * Utility helper to set or create a <meta> tag in document.head
 */
function setOrUpdateMetaTag(key: string, value: string, isProperty = true): HTMLMetaElement {
  const attributeName = isProperty ? 'property' : 'name';
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attributeName}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', value);
  return element;
}

/**
 * Updates or injects JSON-LD Structured Data for Course, Event, and Offers into document.head
 */
export function updateJsonLdCourseSchema(
  schedule: BatchSchedule,
  pricing: CohortPricing = DEFAULT_COHORT_PRICING,
  siteUrl = 'https://codeinindia.in'
): void {
  if (typeof document === 'undefined') return;

  const scriptId = 'codeinindia-dynamic-cohort-jsonld';
  let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = scriptId;
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
  }

  const startDateIso = schedule.nearestBatch.toISOString();
  // Cohort ends 4 weeks after start
  const endDate = new Date(schedule.nearestBatch.getTime() + 28 * 24 * 60 * 60 * 1000);
  const endDateIso = endDate.toISOString();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationEvent',
    'name': `CodeInIndia Live AI Coding Cohort (${schedule.nearestBatchFormatted})`,
    'description': `Live interactive coding cohort teaching dynamic websites, SaaS billing, and Android apps with AI pair-programming. Starting ${schedule.nearestBatchFullFormatted}.`,
    'startDate': startDateIso,
    'endDate': endDateIso,
    'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode',
    'eventStatus': 'https://schema.org/EventScheduled',
    'location': {
      '@type': 'VirtualLocation',
      'url': `${siteUrl}/`,
    },
    'image': [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    ],
    'organizer': {
      '@type': 'Organization',
      'name': 'CodeInIndia',
      'url': siteUrl,
    },
    'offers': [
      {
        '@type': 'Offer',
        'name': 'Live AI Masterclass',
        'price': '0',
        'priceCurrency': pricing.currency,
        'url': `${siteUrl}/#register`,
        'availability': 'https://schema.org/InStock',
        'validFrom': new Date().toISOString(),
      },
      {
        '@type': 'Offer',
        'name': '1-Day Dynamic Website Workshop',
        'price': String(pricing.workshopPrice),
        'priceCurrency': pricing.currency,
        'url': `${siteUrl}/#pricing`,
        'availability': 'https://schema.org/InStock',
        'validFrom': new Date().toISOString(),
      },
      {
        '@type': 'Offer',
        'name': '2 Weekend Android App Cohort',
        'price': String(pricing.androidCohortPrice),
        'priceCurrency': pricing.currency,
        'url': `${siteUrl}/#pricing`,
        'availability': 'https://schema.org/InStock',
        'validFrom': new Date().toISOString(),
      },
    ],
  };

  scriptTag.textContent = JSON.stringify(structuredData, null, 2);
}

/**
 * Injects and updates all Open Graph and social preview meta tags into document.head
 * dynamically based on the active cohort schedule and pricing.
 */
export function injectOpenGraphMeta(config: CohortMetaConfig = {}): GeneratedCohortMeta {
  if (typeof document === 'undefined') {
    return generateCohortMetaData(config);
  }

  const metaData = generateCohortMetaData(config);
  const schedule = config.schedule || getUpcomingBatchSchedule();
  const pricing = { ...DEFAULT_COHORT_PRICING, ...(config.pricing || {}) };

  // 1. Inject or update Open Graph properties
  Object.entries(metaData.openGraphTags).forEach(([property, content]) => {
    setOrUpdateMetaTag(property, content, true);
  });

  // 2. Inject or update Twitter Card tags
  Object.entries(metaData.twitterTags).forEach(([name, content]) => {
    setOrUpdateMetaTag(name, content, false);
  });

  // 3. Inject or update standard document description
  setOrUpdateMetaTag('description', metaData.description, false);

  // 4. Update JSON-LD structured data for rich previews
  updateJsonLdCourseSchema(schedule, pricing, metaData.url);

  return metaData;
}
