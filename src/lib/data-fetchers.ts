import { db } from '@/db';
import { properties, experiences, reviews as reviewsTable } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// Placeholder image for invalid URLs
const PLACEHOLDER_IMAGE = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/elegant-luxury-property-placeholder-imag-83731ee8-20251207154036.jpg';

function validateImageUrl(url: string | null): string {
  if (!url || url === '/placeholder-property.jpg') return PLACEHOLDER_IMAGE;
  if (url.includes('gstatic.com') || url.includes('google.com/images') || url.includes('googleusercontent.com')) return PLACEHOLDER_IMAGE;
  const hasImageExtension = /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(url);
  const isImageCDN = 
    url.includes('supabase.co/storage') ||
    url.includes('unsplash.com') ||
    url.includes('fal.media');
  if (!hasImageExtension && !isImageCDN) return PLACEHOLDER_IMAGE;
  return url;
}

export async function getFeaturedProperties(limit = 3) {
  try {
    const results = await db
      .select()
      .from(properties)
      .where(and(eq(properties.featured, true), eq(properties.isPublished, true)))
      .orderBy(desc(properties.createdAt))
      .limit(limit);

    return results.map(prop => ({
      id: prop.id.toString(),
      title: prop.title,
      location: prop.location,
      sleeps: prop.sleepsMax,
      bedrooms: prop.bedrooms,
      priceFrom: prop.priceFromWeekend,
      image: validateImageUrl(prop.heroImage),
      features: [],
      slug: prop.slug,
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export async function getFeaturedExperiences(limit = 6) {
  try {
    const results = await db
      .select()
      .from(experiences)
      .where(eq(experiences.isPublished, true))
      .orderBy(desc(experiences.createdAt))
      .limit(limit);

    return results.map(exp => ({
      title: exp.title,
      duration: exp.duration,
      priceFrom: exp.priceFrom,
      groupSize: `${exp.groupSizeMin}-${exp.groupSizeMax} guests`,
      image: validateImageUrl(exp.heroImage),
      slug: exp.slug,
    }));
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}

export async function getFeaturedReviews(limit = 6) {
  try {
    const results = await db
      .select()
      .from(reviewsTable)
      .where(and(eq(reviewsTable.isApproved, true), eq(reviewsTable.isPublished, true)))
      .orderBy(desc(reviewsTable.reviewDate))
      .limit(limit);

    return results.map(review => ({
      name: review.guestName,
      rating: review.rating,
      comment: review.comment,
      date: new Date(review.reviewDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      property: review.propertyId ? 'Property' : undefined,
      image: review.guestImage || undefined,
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}
