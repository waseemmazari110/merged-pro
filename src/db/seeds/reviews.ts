import { db } from '@/db';
import { reviews } from '@/db/schema';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const sampleReviews = [
        {
            guestName: 'Sophie M',
            rating: 5,
            comment: 'Absolutely incredible weekend! The house was stunning, hot tub was perfect, and the cocktail class was so much fun. Can\'t recommend enough for hen parties!',
            reviewDate: '2025-01-15',
            guestImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
            isApproved: true,
            isPublished: true,
            propertyId: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            guestName: 'Emma L',
            rating: 5,
            comment: 'Best hen do ever! The team were so helpful from start to finish. The house had everything we needed and more. The private chef was a lovely touch!',
            reviewDate: '2024-12-10',
            guestImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
            isApproved: true,
            isPublished: true,
            propertyId: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            guestName: 'Rachel K',
            rating: 5,
            comment: 'Planning was so easy and the house exceeded expectations. Games room kept us entertained for hours. Would definitely book again!',
            reviewDate: '2024-11-20',
            guestImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
            isApproved: true,
            isPublished: true,
            propertyId: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            guestName: 'Lucy T',
            rating: 5,
            comment: 'The perfect hen weekend venue. Beautiful house, great location, and the add-on experiences made it extra special. Highly recommend!',
            reviewDate: '2024-10-15',
            guestImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
            isApproved: true,
            isPublished: true,
            propertyId: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            guestName: 'Hannah P',
            rating: 5,
            comment: 'Fantastic service from booking to checkout. The house was immaculate and had all the facilities we needed. Will be back!',
            reviewDate: '2024-09-05',
            guestImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
            isApproved: true,
            isPublished: true,
            propertyId: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            guestName: 'Olivia S',
            rating: 5,
            comment: 'Could not fault anything. The house was gorgeous, pool was amazing, and the whole experience was seamless. Thank you!',
            reviewDate: '2024-08-12',
            guestImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
            isApproved: true,
            isPublished: true,
            propertyId: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
    ];

    await db.insert(reviews).values(sampleReviews);
    
    console.log('✅ Reviews seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});