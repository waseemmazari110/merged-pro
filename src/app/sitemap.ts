import { MetadataRoute } from 'next';
import { db } from '@/db';
import { properties, experiences, blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { experiencesData } from '@/data/experiences';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.groupescapehouses.co.uk';
  const currentDate = new Date().toISOString();
  
  // Static routes with optimized priorities for AI search
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/inspiration`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/our-story`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/house-styles-and-features`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/occasions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/booking-terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch dynamic properties
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    if (db) {
      const publishedProperties = await db
        .select()
        .from(properties)
        .where(eq(properties.isPublished, true));
      
      propertyRoutes = publishedProperties.map((property) => ({
        url: `${baseUrl}/properties/${property.slug}`,
        lastModified: property.updatedAt || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
  }

  // Use static experiences data for reliability
  const experienceRoutes: MetadataRoute.Sitemap = Object.keys(experiencesData).map((slug) => ({
    url: `${baseUrl}/experiences/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Destinations
  const allDestinationSlugs = [
    'london', 'lake-district', 'brighton', 'bath', 'manchester', 'bournemouth', 
    'york', 'cardiff', 'newcastle', 'liverpool', 'newquay', 'bristol', 
    'cambridge', 'oxford', 'leeds', 'nottingham', 'sheffield', 'exeter', 
    'chester', 'durham', 'canterbury', 'blackpool', 'cotswolds', 'margate', 
    'harrogate', 'st-ives', 'windsor', 'stratford-upon-avon', 'plymouth', 
    'cheltenham', 'birmingham', 'cornwall', 'devon', 'yorkshire', 'norfolk', 
    'suffolk', 'sussex', 'peak-district'
  ];

  const destinationRoutes: MetadataRoute.Sitemap = allDestinationSlugs.map((slug) => ({
    url: `${baseUrl}/destinations/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedBlogPosts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true));
    
    blogRoutes = publishedBlogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Feature pages
  const featureRoutes: MetadataRoute.Sitemap = [
    'hot-tub', 'swimming-pool', 'indoor-swimming-pool', 'games-room', 
    'cinema-room', 'tennis-court', 'direct-beach-access', 'ev-charging', 
    'fishing-lake', 'ground-floor-bedroom'
  ].map((slug) => ({
    url: `${baseUrl}/features/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // House styles pages
  const houseStyleRoutes: MetadataRoute.Sitemap = [
    'manor-houses', 'party-houses', 'castles', 'country-houses', 
    'stately-houses', 'luxury-houses', 'large-holiday-homes', 
    'large-cottages', 'luxury-cottages-with-sea-views', 
    'luxury-dog-friendly-cottages', 'unusual-and-quirky', 'family-holidays'
  ].map((slug) => ({
    url: `${baseUrl}/house-styles/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // SEO Category pages
  const categoryRoutes: MetadataRoute.Sitemap = [
    'large-group-accommodation', 'large-holiday-houses', 
    'houses-with-hot-tubs', 'houses-with-games-rooms'
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Occasions and direct routes
  const occasionRoutes: MetadataRoute.Sitemap = [
    'hen-party-houses', 'weddings', 'special-celebrations', 'weekend-breaks', 
    'christmas', 'new-year', 'easter', 'stag-do-houses', 'spa-treatments'
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Inspiration routes (filtering out redirected ones)
  const inspirationRoutes: MetadataRoute.Sitemap = [
    'brighton-hen-do-guide',
  ].map((slug) => ({
    url: `${baseUrl}/inspiration/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Holiday Focus routes
  const holidayFocusRoutes: MetadataRoute.Sitemap = [
    'adventure-holidays', 'book-private-chef', 'business-offsite-corporate-accommodation',
    'girls-weekend-getaways', 'group-city-breaks', 'multi-generational-holidays',
    'retreat-venues', 'rural-retreats', 'youth-school-group-accommodation'
  ].map((slug) => ({
    url: `${baseUrl}/holiday-focus/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Guides
  const guideRoutes: MetadataRoute.Sitemap = [
    'how-to-choose-large-group-accommodation-uk', 
    'large-group-house-vs-hotel', 
    'best-uk-destinations-for-large-group-weekends', 
    'what-to-check-when-booking-accommodation-for-20-plus-guests', 
    'noise-rules-and-neighbour-considerations-for-group-stays'
  ].map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    {
      url: `${baseUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...categoryRoutes,
    ...propertyRoutes,
    ...experienceRoutes,
    ...inspirationRoutes,
    ...destinationRoutes,
    ...blogRoutes,
    ...guideRoutes,
    ...featureRoutes,
    ...houseStyleRoutes,
    ...occasionRoutes,
    ...holidayFocusRoutes,
  ];
}
