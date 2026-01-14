import { db } from '@/db';
import { propertyFeatures, properties } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    // Query properties to get their IDs
    const brightonManor = await db.select().from(properties).where(eq(properties.slug, 'brighton-manor')).limit(1);
    const bathSpa = await db.select().from(properties).where(eq(properties.slug, 'bath-spa-retreat')).limit(1);
    const manchesterParty = await db.select().from(properties).where(eq(properties.slug, 'manchester-party-house')).limit(1);

    if (!brightonManor[0] || !bathSpa[0] || !manchesterParty[0]) {
        throw new Error('One or more properties not found. Please seed properties first.');
    }

    const samplePropertyFeatures = [
        // Brighton Manor features
        {
            propertyId: brightonManor[0].id,
            featureName: 'Hot Tub',
            createdAt: new Date().toISOString(),
        },
        {
            propertyId: brightonManor[0].id,
            featureName: 'Pool',
            createdAt: new Date().toISOString(),
        },
        {
            propertyId: brightonManor[0].id,
            featureName: 'Parking',
            createdAt: new Date().toISOString(),
        },
        {
            propertyId: brightonManor[0].id,
            featureName: 'Games Room',
            createdAt: new Date().toISOString(),
        },
        // Bath Spa Retreat features
        {
            propertyId: bathSpa[0].id,
            featureName: 'Games Room',
            createdAt: new Date().toISOString(),
        },
        {
            propertyId: bathSpa[0].id,
            featureName: 'Cinema',
            createdAt: new Date().toISOString(),
        },
        {
            propertyId: bathSpa[0].id,
            featureName: 'Parking',
            createdAt: new Date().toISOString(),
        },
        {
            propertyId: bathSpa[0].id,
            featureName: 'Hot Tub',
            createdAt: new Date().toISOString(),
        },
        // Manchester Party House features
        {
            propertyId: manchesterParty[0].id,
            featureName: 'Hot Tub',
            createdAt: new Date().toISOString(),
        },
        {
            propertyId: manchesterParty[0].id,
            featureName: 'BBQ',
            createdAt: new Date().toISOString(),
        },
        {
            propertyId: manchesterParty[0].id,
            featureName: 'Parking',
            createdAt: new Date().toISOString(),
        },
        {
            propertyId: manchesterParty[0].id,
            featureName: 'Pet Friendly',
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(propertyFeatures).values(samplePropertyFeatures);
    
    console.log('✅ Property features seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});