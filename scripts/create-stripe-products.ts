import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_TEST_KEY!);

async function createProducts() {
  const existingProducts = await stripe.products.list({ limit: 100 });
  const essentialProduct = existingProducts.data.find(p => p.name === 'Essential Listing Plan');
  const featuredProduct = existingProducts.data.find(p => p.name === 'Featured Listing Plan');

  let essentialPriceId: string | undefined, featuredPriceId: string | undefined;

  if (essentialProduct) {
    console.log('Essential product exists:', essentialProduct.id);
    const prices = await stripe.prices.list({ product: essentialProduct.id, limit: 1 });
    essentialPriceId = prices.data[0]?.id;
  } else {
    const essential = await stripe.products.create({
      name: 'Essential Listing Plan',
      description: 'Property listing on Escape Houses for 12 months with standard visibility',
    });
    const essentialPrice = await stripe.prices.create({
      product: essential.id,
      unit_amount: 45000,
      currency: 'gbp',
      recurring: { interval: 'year' },
      tax_behavior: 'exclusive',
    });
    essentialPriceId = essentialPrice.id;
    console.log('Created Essential product:', essential.id, 'Price:', essentialPriceId);
  }

  if (featuredProduct) {
    console.log('Featured product exists:', featuredProduct.id);
    const prices = await stripe.prices.list({ product: featuredProduct.id, limit: 1 });
    featuredPriceId = prices.data[0]?.id;
  } else {
    const featured = await stripe.products.create({
      name: 'Featured Listing Plan',
      description: 'Premium property listing on Escape Houses for 12 months with featured visibility and priority placement',
    });
    const featuredPrice = await stripe.prices.create({
      product: featured.id,
      unit_amount: 65000,
      currency: 'gbp',
      recurring: { interval: 'year' },
      tax_behavior: 'exclusive',
    });
    featuredPriceId = featuredPrice.id;
    console.log('Created Featured product:', featured.id, 'Price:', featuredPriceId);
  }

  console.log('\n=== Price IDs ===');
  console.log('Essential:', essentialPriceId);
  console.log('Featured:', featuredPriceId);
}

createProducts().catch(console.error);
