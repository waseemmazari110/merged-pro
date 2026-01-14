import { db } from '@/db';
import { destinations } from '@/db/schema';

async function main() {
    const now = new Date().toISOString();
    
    const sampleDestinations = [
        {
            cityName: 'London',
            slug: 'london',
            region: 'South England',
            overview: 'The UK\'s vibrant capital offers iconic attractions, world-class nightlife, and endless entertainment options for group celebrations.',
            heroImage: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-london-citysc-8f325788-20251019170619.jpg?',
            travelTips: 'Book accommodation in Zone 2 or 3 for better value. Use the Underground for easy transport. Pre-book popular restaurants and bars.',
            topVenues: ['Sky Garden', 'Shoreditch nightlife', 'Borough Market', 'West End shows', 'Covent Garden'],
            isPublished: true,
            mapArea: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            cityName: 'Brighton',
            slug: 'brighton',
            region: 'South England',
            overview: 'The UK\'s most popular seaside destination for hen parties, combining beach vibes with legendary nightlife and quirky charm.',
            heroImage: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/wide-angle-photograph-of-brighton-seafro-11bd7734-20251017161212.jpg',
            travelTips: 'Stay in Hove for quieter accommodation. The beach is a 10-minute walk from most party houses. Book restaurants on The Lanes in advance.',
            topVenues: ['The Lanes shopping', 'Brighton Pier', 'Beach clubs', 'North Laine bars', 'Royal Pavilion'],
            isPublished: true,
            mapArea: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            cityName: 'Bath',
            slug: 'bath',
            region: 'South England',
            overview: 'Historic Georgian city combining spa culture, stunning architecture, and sophisticated nightlife for memorable group stays.',
            heroImage: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/historic-bath-city-center-photograph%2c--eef16b18-20251017161220.jpg',
            travelTips: 'Book the Thermae Bath Spa in advance. The city centre is compact and walkable. Try afternoon tea at the Pump Room.',
            topVenues: ['Roman Baths', 'Thermae Bath Spa', 'Pulteney Bridge', 'George Street bars', 'Bath Abbey'],
            isPublished: true,
            mapArea: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            cityName: 'Manchester',
            slug: 'manchester',
            region: 'North England',
            overview: 'Northern powerhouse with legendary nightlife, vibrant culture, and excellent party venues for unforgettable celebrations.',
            heroImage: 'https://v3b.fal.media/files/b/tiger/TnJnPy7geHZHAjOwxZKxO_output.png',
            travelTips: 'Northern Quarter is best for nightlife. Book a table at Dishoom for group dining. Taxis are essential after midnight.',
            topVenues: ['Northern Quarter', 'Spinningfields', 'Deansgate bars', 'Manchester Arena', 'Warehouse Project'],
            isPublished: true,
            mapArea: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            cityName: 'Newquay',
            slug: 'newquay',
            region: 'South West England',
            overview: 'Cornwall\'s surf capital offering stunning beaches, coastal adventures, and relaxed beach bar vibes for active groups.',
            heroImage: 'https://media.istockphoto.com/id/1211485656/photo/surfboard-and-palm-tree-on-beach-background.jpg?s=612x612&w=0&k=20&c=sjiA2xKDegW63sCAOc_b95aE6aDOuFIHUtasbKXFw7M=',
            travelTips: 'Book surf lessons in advance during summer. Fistral Beach is the main surf spot. Rent cars for exploring the coast.',
            topVenues: ['Fistral Beach', 'Watergate Bay', 'Newquay Zoo', 'Beach bars', 'Coastal walks'],
            isPublished: true,
            mapArea: null,
            createdAt: now,
            updatedAt: now,
        },
        {
            cityName: 'Liverpool',
            slug: 'liverpool',
            region: 'North England',
            overview: 'Beatles heritage meets waterfront bars and friendly Northern hospitality for memorable group weekends.',
            heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            travelTips: 'Visit the Beatles Story museum. Concert Square is the nightlife hub. Book a ferry across the Mersey for views.',
            topVenues: ['Albert Dock', 'Beatles Story', 'Concert Square', 'Cavern Quarter', 'Baltic Market'],
            isPublished: true,
            mapArea: null,
            createdAt: now,
            updatedAt: now,
        },
    ];

    await db.insert(destinations).values(sampleDestinations);
    
    console.log('✅ Destinations seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});