import { db } from '@/db';
import { faqs } from '@/db/schema';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const sampleFaqs = [
        {
            question: 'How do I book a property?',
            answer: 'Browse our properties, select your dates, and submit an enquiry form. We\'ll respond within 24 hours with availability and a quote. Once confirmed, pay your deposit to secure the booking.',
            category: 'Booking',
            orderIndex: 0,
            isPublished: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            question: 'What is the minimum group size?',
            answer: 'Most properties accommodate 8-30 guests. Each property page shows the specific capacity.',
            category: 'Booking',
            orderIndex: 1,
            isPublished: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            question: 'Can I book last minute?',
            answer: 'Yes! Contact us directly and we\'ll check availability. Subject to availability, we can accommodate last-minute bookings.',
            category: 'Booking',
            orderIndex: 2,
            isPublished: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            question: 'How much is the deposit?',
            answer: 'The deposit is typically 25-30% of the total booking cost, payable at the time of booking to secure your dates.',
            category: 'Payments',
            orderIndex: 0,
            isPublished: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            question: 'When is the balance due?',
            answer: 'The remaining balance is due 8 weeks before your check-in date. We\'ll send you a reminder.',
            category: 'Payments',
            orderIndex: 1,
            isPublished: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'Bookings, payments and contracts are handled directly between guests and property owners. Each owner will have their own preferred payment methods and schedules.',
            category: 'Payments',
            orderIndex: 2,
            isPublished: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            question: 'What are the check-in and check-out times?',
            answer: 'Standard check-in is 4pm and check-out is 10am. Early check-in or late check-out may be available on request for an additional fee.',
            category: 'House Rules',
            orderIndex: 0,
            isPublished: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            question: 'Are hen parties allowed?',
            answer: 'Yes! Our properties are specifically designed for celebrations including hen parties, birthdays, and group getaways.',
            category: 'House Rules',
            orderIndex: 1,
            isPublished: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            question: 'Can I add experiences after booking?',
            answer: 'Yes! You can add experiences like cocktail classes, private chefs, and spa treatments at any time before your stay.',
            category: 'Add-ons',
            orderIndex: 0,
            isPublished: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            question: 'How do I book add-on experiences?',
            answer: 'Simply contact us or add them through your booking confirmation email. We\'ll arrange everything and add the cost to your balance.',
            category: 'Add-ons',
            orderIndex: 1,
            isPublished: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
    ];

    await db.insert(faqs).values(sampleFaqs);
    
    console.log('✅ FAQs seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});