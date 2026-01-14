import { db } from '@/db';
import { properties } from '@/db/schema';

async function main() {
    const sampleProperties = [
        {
            title: 'The Brighton Manor',
            slug: 'brighton-manor',
            location: 'Brighton, East Sussex',
            region: 'South England',
            sleepsMin: 12,
            sleepsMax: 16,
            bedrooms: 8,
            bathrooms: 4,
            priceFromMidweek: 89,
            priceFromWeekend: 95,
            description: 'Stunning Victorian manor house in the heart of Brighton with hot tub, pool, and spacious living areas perfect for hen parties and group celebrations. Walking distance to Brighton\'s vibrant nightlife and beach.',
            heroImage: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-b6c21bf3-20251018131712.jpg',
            checkInOut: 'Check-in 4pm, Check-out 10am',
            featured: true,
            isPublished: true,
            houseRules: null,
            iCalURL: null,
            heroVideo: null,
            floorplanURL: null,
            mapLat: null,
            mapLng: null,
            ownerContact: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Bath Spa Retreat',
            slug: 'bath-spa-retreat',
            location: 'Bath, Somerset',
            region: 'South England',
            sleepsMin: 16,
            sleepsMax: 20,
            bedrooms: 10,
            bathrooms: 6,
            priceFromMidweek: 95,
            priceFromWeekend: 105,
            description: 'Luxurious Georgian retreat in historic Bath featuring games room, cinema, and beautiful spa-inspired interiors. Perfect for large groups seeking elegance and entertainment.',
            heroImage: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-71429268-20251018131719.jpg',
            checkInOut: 'Check-in 4pm, Check-out 10am',
            featured: true,
            isPublished: true,
            houseRules: null,
            iCalURL: null,
            heroVideo: null,
            floorplanURL: null,
            mapLat: null,
            mapLng: null,
            ownerContact: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Manchester Party House',
            slug: 'manchester-party-house',
            location: 'Manchester, Greater Manchester',
            region: 'North England',
            sleepsMin: 10,
            sleepsMax: 14,
            bedrooms: 7,
            bathrooms: 4,
            priceFromMidweek: 79,
            priceFromWeekend: 89,
            description: 'Contemporary party house in Manchester city centre with hot tub, BBQ area, and modern amenities. Close to Northern Quarter nightlife and top restaurants.',
            heroImage: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-real-estate-photograph-of-a-303caf30-20251018131730.jpg',
            checkInOut: 'Check-in 4pm, Check-out 10am',
            featured: true,
            isPublished: true,
            houseRules: null,
            iCalURL: null,
            heroVideo: null,
            floorplanURL: null,
            mapLat: null,
            mapLng: null,
            ownerContact: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(properties).values(sampleProperties);
    
    console.log('✅ Properties seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});