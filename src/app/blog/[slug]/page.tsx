import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import BlogClientWrapper from "@/components/blog/BlogClientWrapper";
import UKServiceSchema from "@/components/UKServiceSchema";

// Blog posts data
const posts = [
  {
    id: 1,
    title: "10 Hen Party Ideas That Aren't the Usual Spa Day",
    excerpt: "Looking for something different? From cocktail making to life drawing, here are our favourite alternative hen party activities that your group will love.",
    category: "Hen Do Ideas",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-hen-party-ac-2ed8f30b-20251018105832.jpg",
    date: "15 Jan 2025",
    slug: "alternative-hen-party-ideas",
    content: `
      <p>Planning a <a href="/hen-party-houses" style="color: var(--color-accent-sage); text-decoration: underline;">hen party</a> and tired of the same old spa day suggestions? You're not alone. While there's nothing wrong with a relaxing <a href="/spa-treatments" style="color: var(--color-accent-sage); text-decoration: underline;">spa treatment</a>, today's hen parties are all about creating unique memories that reflect the bride's personality.</p>
      
      <h2>1. Cocktail Making Masterclass</h2>
      <p>Learn to shake, stir, and muddle like a pro. A <a href="/experiences/cocktail-masterclass" style="color: var(--color-accent-sage); text-decoration: underline;">cocktail making class</a> is interactive, fun, and gives everyone new skills to show off at future parties. Plus, you get to drink your creations. Available at most of our <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">hen party houses</a>, this activity works brilliantly in <a href="/destinations/brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Brighton</a> or <a href="/destinations/bath" style="color: var(--color-accent-sage); text-decoration: underline;">Bath</a>.</p>
      
      <h2>2. Life Drawing with a Twist</h2>
      <p>Whether it's a professional model or one of the classic '<a href="/experiences/life-drawing" style="color: var(--color-accent-sage); text-decoration: underline;">butler in the buff</a>' sessions, life drawing adds a cheeky edge to your hen party. It's surprisingly relaxing and guaranteed to create some hilarious moments. This is one of our most popular <a href="/experiences" style="color: var(--color-accent-sage); text-decoration: underline;">hen party experiences</a>.</p>
      
      <h2>3. Dance Workshop</h2>
      <p>From burlesque to street dance, learning a routine together is a brilliant bonding experience. Many instructors can even choreograph something special for the bride. Check our <a href="/experiences" style="color: var(--color-accent-sage); text-decoration: underline;">experiences page</a> for available dance workshops in your chosen destination.</p>
      
      <h2>4. Private Chef Experience</h2>
      <p>Why go out when you can bring a Michelin-trained chef to your <a href="/house-styles/luxury-houses" style="color: var(--color-accent-sage); text-decoration: underline;">holiday house</a>? Enjoy restaurant-quality food without leaving your pyjamas. Our <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef service</a> is perfect for groups who want to enjoy fine dining in the comfort of their own space.</p>
      
      <h2>5. Outdoor Adventures</h2>
      <p>For the active bride, consider coasteering, paddleboarding, or even a wild swimming session followed by hot chocolate and cake. Our properties in <a href="/destinations/bournemouth" style="color: var(--color-accent-sage); text-decoration: underline;">Bournemouth</a> and <a href="/destinations/cornwall" style="color: var(--color-accent-sage); text-decoration: underline;">Cornwall</a> are perfect for outdoor activities.</p>
      
      <h2>6. Perfume Making Workshop</h2>
      <p>Create a signature scent that will forever remind you of this special weekend. It's creative, luxurious, and everyone leaves with a unique gift. This activity works particularly well in cities like <a href="/destinations/bath" style="color: var(--color-accent-sage); text-decoration: underline;">Bath</a> with its spa heritage.</p>
      
      <h2>7. Food Tours</h2>
      <p>Explore a new city through its food scene. From <a href="/destinations/brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Brighton's indie cafes</a> to <a href="/destinations/bath" style="color: var(--color-accent-sage); text-decoration: underline;">Bath's historic tea rooms</a>, a guided food tour combines sightseeing with eating. <a href="/blog/brighton-hen-do-guide" style="color: var(--color-accent-sage); text-decoration: underline;">Read our Brighton guide</a> for the best food spots.</p>
      
      <h2>8. Glamping Experience</h2>
      <p>Luxury camping with proper beds, <a href="/houses-with-hot-tubs" style="color: var(--color-accent-sage); text-decoration: underline;">hot tubs</a>, and fire pits. It's the perfect middle ground between adventure and comfort. Browse our <a href="/house-styles/unusual-and-quirky" style="color: var(--color-accent-sage); text-decoration: underline;">unusual and quirky properties</a> for unique glamping options.</p>
      
      <h2>9. Pottery or Art Class</h2>
      <p>Channel your inner artist. Whether it's throwing pots or painting canvases, creative activities are wonderfully therapeutic and you'll have keepsakes to take home. Many of our <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">group houses</a> can arrange art workshops.</p>
      
      <h2>10. Murder Mystery Evening</h2>
      <p>Turn your hen party into an interactive whodunnit. Professional companies will come to your <a href="/house-styles/party-houses" style="color: var(--color-accent-sage); text-decoration: underline;">holiday house</a> and transform your evening into an immersive theatre experience. Perfect for houses with <a href="/houses-with-games-rooms" style="color: var(--color-accent-sage); text-decoration: underline;">games rooms</a>.</p>
      
      <p>The best hen parties are the ones that reflect who the bride really is. Don't feel pressured to follow trends – pick activities that will make your group laugh, bond, and create memories that last long after the wedding. Need help planning? Check out our <a href="/blog/hen-party-checklist" style="color: var(--color-accent-sage); text-decoration: underline;">complete hen party planning checklist</a> or learn about <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">how to book your perfect house</a>.</p>
    `,
  },
  {
    id: 2,
    title: "The Ultimate Brighton Hen Do Guide: Where to Stay, Eat & Party",
    excerpt: "Brighton is the UK's hen party capital for a reason. Our complete guide covers the best houses, restaurants, bars, and activities for an unforgettable weekend.",
    category: "City Guides",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-brighton-uk--0e8a0dba-20251018105838.jpg",
    date: "12 Jan 2025",
    slug: "brighton-hen-do-guide",
    content: `
      <p>Brighton has earned its reputation as the UK's <a href="/hen-party-houses" style="color: var(--color-accent-sage); text-decoration: underline;">hen party capital</a>, and for good reason. This vibrant seaside city combines beach vibes with city energy, quirky independent shops with high-end boutiques, and a nightlife scene that caters to every taste.</p>
      
      <h2>Where to Stay</h2>
      <p>Brighton and the surrounding areas offer some of the <a href="/destinations/brighton" style="color: var(--color-accent-sage); text-decoration: underline;">best hen party houses in the UK</a>. Look for <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">properties</a> in Hove for a quieter vibe, or stay central in Brighton for easy access to everything. Must-have features include <a href="/houses-with-hot-tubs" style="color: var(--color-accent-sage); text-decoration: underline;">hot tubs</a>, spacious living areas, and walking distance to the seafront. Our <a href="/house-styles/luxury-houses" style="color: var(--color-accent-sage); text-decoration: underline;">luxury houses</a> in Brighton sleep 12-20 guests comfortably.</p>
      
      <h2>Brunch Spots</h2>
      <p><strong>The Ivy in the Lanes</strong> - Classic and elegant, perfect for a civilised start to the day.</p>
      <p><strong>Pompoko</strong> - Quick, affordable Japanese food that's become a Brighton institution.</p>
      <p><strong>Mange Tout</strong> - Cosy cafe with excellent vegetarian options and the best coffee in town.</p>
      
      <h2>Afternoon Activities</h2>
      <p>Explore the famous Lanes for vintage shopping and independent boutiques. Walk the pier for classic seaside fun. Book a <a href="/experiences/cocktail-masterclass" style="color: var(--color-accent-sage); text-decoration: underline;">cocktail making class</a> or <a href="/experiences/life-drawing" style="color: var(--color-accent-sage); text-decoration: underline;">life drawing session</a> at one of the many venues that specialise in hen parties. Check out our <a href="/blog/alternative-hen-party-ideas" style="color: var(--color-accent-sage); text-decoration: underline;">10 alternative hen party ideas</a> for more inspiration.</p>
      
      <h2>Dinner Destinations</h2>
      <p><strong>The Coal Shed</strong> - Upscale steakhouse perfect for a celebration meal.</p>
      <p><strong>Terre à Terre</strong> - Renowned vegetarian restaurant that even meat-eaters rave about.</p>
      <p><strong>The Salt Room</strong> - Seafood restaurant with stunning views of the pier.</p>
      <p>Can't decide where to go? Consider booking a <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef</a> to cook at your <a href="/house-styles/party-houses" style="color: var(--color-accent-sage); text-decoration: underline;">party house</a> instead.</p>
      
      <h2>Nightlife</h2>
      <p>Brighton's nightlife is legendary. Start with cocktails at The Plotting Parlour or Bohemia. Move on to Patterns for dancing, or Revolution for a livelier crowd. End the night at Pryzm or Coalition for proper club vibes.</p>
      
      <h2>Sunday Recovery</h2>
      <p>Head to Hove for a gentler Sunday. Walk along the seafront, grab fish and chips, and maybe brave a dip in the sea if you're feeling adventurous. The Urchin pub does an excellent roast dinner. Return to your house with a <a href="/houses-with-hot-tubs" style="color: var(--color-accent-sage); text-decoration: underline;">hot tub</a> for the ultimate recovery session.</p>
      
      <h2>Top Tips</h2>
      <ul>
        <li>Book restaurants in advance, especially for large groups</li>
        <li>The weather can be unpredictable - pack layers</li>
        <li>Walking is the best way to get around, but Ubers are plentiful</li>
        <li>Brighton Pride is in August - avoid that weekend unless you want to join the party</li>
      </ul>
      
      <p>Brighton is the perfect hen party destination because it genuinely has something for everyone. Whether your group wants to party all night or prefer boutique shopping and afternoon tea, this city delivers. Still deciding between cities? Read our <a href="/blog/bath-vs-brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Bath vs Brighton comparison</a>. Ready to book? Check out <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">how it works</a> or <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">browse our Brighton properties</a>.</p>
    `,
  },
  {
    id: 3,
    title: "How to Split Costs Fairly on a Hen Weekend",
    excerpt: "Money can be awkward, but it doesn't have to be. Our practical tips for managing group expenses, deposits, and add-ons without the drama.",
    category: "Planning Tips",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-showing-split-c-189baecf-20251018105904.jpg",
    date: "8 Jan 2025",
    slug: "split-costs-hen-weekend",
    content: `
      <p>Let's talk about the most awkward part of planning a <a href="/hen-party-houses" style="color: var(--color-accent-sage); text-decoration: underline;">hen party</a>: money. Getting the finances right can make or break the weekend, but with clear communication and fair systems, it doesn't have to be stressful. This guide complements our <a href="/blog/hen-party-checklist" style="color: var(--color-accent-sage); text-decoration: underline;">complete planning checklist</a>.</p>
      
      <h2>Set a Budget Early</h2>
      <p>Before <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">booking anything</a>, poll the group. What's everyone comfortable spending? Be honest about the fact that hen parties aren't cheap, but also make sure no one feels pressured to go beyond their means. Check our <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">booking guide</a> to understand typical costs.</p>
      
      <h2>The Bride Shouldn't Pay</h2>
      <p>This is standard practice. Split the bride's share between the other guests. If there are 10 people total, each guest pays 1/9th of the total costs, not 1/10th.</p>
      
      <h2>Break Down the Costs</h2>
      <p>Be transparent from the start:</p>
      <ul>
        <li><strong>Accommodation</strong> - Usually the biggest expense. Our <a href="/house-styles/luxury-houses" style="color: var(--color-accent-sage); text-decoration: underline;">luxury houses</a> range from £2,000-£5,000 for a weekend.</li>
        <li><strong>Activities</strong> - <a href="/experiences/cocktail-masterclass" style="color: var(--color-accent-sage); text-decoration: underline;">Cocktail classes</a>, <a href="/experiences/life-drawing" style="color: var(--color-accent-sage); text-decoration: underline;">life drawing</a>, etc.</li>
        <li><strong>Group meals</strong> - Dinner, brunch, or a <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef</a></li>
        <li><strong>Decorations and supplies</strong> - Balloons, sashes, games</li>
        <li><strong>Shared transport</strong> - If hiring a minibuss</li>
      </ul>
      
      <h2>Use Money Management Apps</h2>
      <p>Apps like Splitwise or Monzo's group tabs make tracking expenses much easier. Everyone can see what's been paid and what they owe in real time.</p>
      
      <h2>Deposit Strategy</h2>
      <p>Collect deposits early – ideally 50% when booking and the balance 6-8 weeks before the event. This gives people time to budget rather than hitting them with a large bill all at once. Learn more about our <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">payment terms and deposit schedule</a>.</p>
      
      <h2>Optional Add-Ons</h2>
      <p>Not everyone will want (or can afford) every activity. Make some things optional. For example:</p>
      <ul>
        <li>Core package: <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">accommodation</a>, Saturday dinner, one activity</li>
        <li>Optional extras: <a href="/spa-treatments" style="color: var(--color-accent-sage); text-decoration: underline;">spa treatments</a>, additional <a href="/experiences" style="color: var(--color-accent-sage); text-decoration: underline;">experiences</a>, upgraded rooms</li>
      </ul>
      
      <h2>The Organiser's Expenses</h2>
      <p>If you're doing the organising, it's fair to have your expenses covered (taxi to collect supplies, printing costs, etc.). Just be upfront about this.</p>
      
      <h2>What If Someone Can't Afford It?</h2>
      <p>This is tricky. Options include:</p>
      <ul>
        <li>Adjust the overall budget down</li>
        <li>Let them opt out of certain activities without judgement</li>
        <li>If the bride wants that person there regardless, she might choose to subsidise them</li>
      </ul>
      
      <h2>Cancellation Scenario</h2>
      <p>Have a plan for what happens if someone drops out. Most <a href="/booking-terms" style="color: var(--color-accent-sage); text-decoration: underline;">house bookings</a> have strict cancellation policies, so the group needs to know whether they'll absorb that person's share or if deposits are non-refundable.</p>
      
      <h2>Final Payment Deadline</h2>
      <p>Set a clear deadline for final payments – at least a month before the trip. This gives you time to chase any stragglers without last-minute stress.</p>
      
      <p>The key to avoiding money drama is overcommunication. Send clear breakdowns, set expectations early, and make sure everyone knows what they're signing up for before they commit. For a complete overview of planning timelines and costs, see our <a href="/blog/hen-party-checklist" style="color: var(--color-accent-sage); text-decoration: underline;">hen party planning checklist</a>. Ready to start planning? <a href="/contact" style="color: var(--color-accent-sage); text-decoration: underline;">Get in touch</a> with our team for a personalised quote.</p>
    `,
  },
  {
    id: 4,
    title: "House Spotlight: Inside The Brighton Manor",
    excerpt: "Take a tour of one of our most popular properties. With space for 16, a hot tub, games room, and walking distance to the beach, it's perfect for hen parties.",
    category: "House Spotlights",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-luxury-holid-f27f8e6d-20251018105853.jpg",
    date: "5 Jan 2025",
    slug: "brighton-manor-spotlight",
    content: `
      <p>We're pulling back the curtain on one of our most-booked <a href="/hen-party-houses" style="color: var(--color-accent-sage); text-decoration: underline;">hen party houses</a>: The Brighton Manor. This stunning property consistently gets 5-star reviews, and after spending a weekend there, we can see exactly why. Looking for more <a href="/destinations/brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Brighton properties</a>? Check out our complete guide.</p>
      
      <h2>First Impressions</h2>
      <p>Located in a quiet residential street just 10 minutes' walk from <a href="/destinations/brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Brighton</a> seafront, the house strikes the perfect balance between peaceful retreat and city access. The Victorian exterior is elegant without being stuffy. This is exactly the kind of <a href="/house-styles/luxury-houses" style="color: var(--color-accent-sage); text-decoration: underline;">luxury house</a> that makes hen weekends special.</p>
      
      <h2>Inside the Property</h2>
      <p><strong>Sleeping Arrangements</strong> - Eight bedrooms sleeping up to 16 guests. Mix of doubles, twins, and bunk rooms. Every bedroom has its own character, from the master suite with en-suite bathroom to the cosy attic rooms with sea glimpses. See our <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">booking guide</a> to understand how group sizes work.</p>
      
      <p><strong>Living Spaces</strong> - The real star is the open-plan kitchen-living area. It's huge. There's a 12-seater dining table, comfy sofas arranged around a feature fireplace, and a kitchen that would make any <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef</a> happy. Bi-fold doors open onto the garden when the weather's nice.</p>
      
      <h2>The Game Changer: Outdoor Hot Tub</h2>
      <p>Positioned in a private corner of the garden, the <a href="/houses-with-hot-tubs" style="color: var(--color-accent-sage); text-decoration: underline;">hot tub</a> seats eight comfortably. It's heated, lit with mood lighting, and surrounded by screens for privacy. This is where most groups spend their Friday night, prosecco in hand. See all our <a href="/houses-with-hot-tubs" style="color: var(--color-accent-sage); text-decoration: underline;">houses with hot tubs</a>.</p>
      
      <h2>Entertainment Options</h2>
      <p>The basement <a href="/houses-with-games-rooms" style="color: var(--color-accent-sage); text-decoration: underline;">games room</a> includes a pool table, table football, and a cocktail bar setup. There's also a Smart TV and sound system for karaoke or movie nights. WiFi throughout is fast and reliable. Perfect for booking a <a href="/experiences/cocktail-masterclass" style="color: var(--color-accent-sage); text-decoration: underline;">cocktail masterclass</a> in-house.</p>
      
      <h2>Little Luxuries</h2>
      <ul>
        <li>Welcome hamper with prosecco and local treats</li>
        <li>High-quality linens and towels included</li>
        <li>Toiletries in every bathroom</li>
        <li>Nespresso machine and tea selection</li>
        <li>Private parking for two cars (plus street parking)</li>
      </ul>
      
      <h2>Location Benefits</h2>
      <p>The real win is the location. You're close enough to walk into town (or Uber for £5), but the street itself is quiet and residential. Perfect for groups who want to <a href="/house-styles/party-houses" style="color: var(--color-accent-sage); text-decoration: underline;">party</a> but also need somewhere to recover. Read our full <a href="/blog/brighton-hen-do-guide" style="color: var(--color-accent-sage); text-decoration: underline;">Brighton hen do guide</a> for area tips.</p>
      
      <p>Within walking distance:</p>
      <ul>
        <li>Hove seafront and beach - 10 mins</li>
        <li>Brighton Lanes shopping - 15 mins</li>
        <li>Multiple supermarkets - 5 mins</li>
        <li>Restaurant and cafe strip - 8 mins</li>
      </ul>
      
      <h2>Hen Party Friendly Features</h2>
      <p>The owners genuinely welcome hen parties (not all properties do). They've thought about what groups need: plenty of fridge space, a big dining table for group meals, a sound system that actually works, and enough bathrooms that there's never a queue. Check our <a href="/blog/hen-party-checklist" style="color: var(--color-accent-sage); text-decoration: underline;">planning checklist</a> for what to look for in a house.</p>
      
      <h2>Booking Details</h2>
      <p><strong>Sleeps:</strong> 16 guests<br>
      <strong>Bedrooms:</strong> 8<br>
      <strong>Bathrooms:</strong> 4<br>
      <strong>Weekend (Fri-Sun):</strong> From £2,400<br>
      <strong>Midweek (Mon-Fri):</strong> From £1,800</p>
      
      <p>When you break down the weekend rate between 15 guests (remember, the bride doesn't pay), it works out to £160 per person for two nights in a gorgeous property. Factor in that you're not paying for hotels, and it's excellent value. See our guide on <a href="/blog/split-costs-hen-weekend" style="color: var(--color-accent-sage); text-decoration: underline;">how to split costs fairly</a>.</p>
      
      <h2>Guest Reviews</h2>
      <p>"Perfect house for our hen do. The hot tub was the highlight, and the games room kept us entertained when we needed a quieter night." - Sarah's hen party, March 2024</p>
      
      <p>The Brighton Manor is popular for a reason. It delivers on space, style, location, and those little extras that transform a good hen weekend into a great one. Book well in advance – weekends get snapped up quickly. Ready to book? Learn <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">how it works</a> or <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">browse all properties</a>. Want to add extras? Explore our <a href="/experiences" style="color: var(--color-accent-sage); text-decoration: underline;">experiences</a>.</p>
    `,
  },
  {
    id: 5,
    title: "Bath vs Brighton: Which City for Your Hen Weekend?",
    excerpt: "Can't decide between these two amazing cities? We break down the pros and cons of Bath and Brighton to help you choose the perfect destination.",
    category: "City Guides",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-women-friend-01b63e10-20251018105846.jpg",
    date: "2 Jan 2025",
    slug: "bath-vs-brighton",
    content: `
      <p>Two of the UK's most popular <a href="/hen-party-houses" style="color: var(--color-accent-sage); text-decoration: underline;">hen party destinations</a> couldn't be more different. <a href="/destinations/bath" style="color: var(--color-accent-sage); text-decoration: underline;">Bath</a> brings Georgian elegance and spa culture, while <a href="/destinations/brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Brighton</a> delivers beach vibes and big nightlife. We're breaking down both to help you decide. Already decided? Read our detailed <a href="/blog/brighton-hen-do-guide" style="color: var(--color-accent-sage); text-decoration: underline;">Brighton guide</a>.</p>
      
      <h2>The Vibe</h2>
      <p><strong>Bath</strong> - Sophisticated, cultured, and undeniably pretty. This is the choice for groups who want beautiful surroundings, historic charm, and a more refined pace. Browse our <a href="/destinations/bath" style="color: var(--color-accent-sage); text-decoration: underline;">Bath properties</a>.</p>
      
      <p><strong>Brighton</strong> - Energetic, eclectic, and party-ready. Choose Brighton if your group loves nightlife, wants beach access, and enjoys a more alternative, quirky atmosphere. See our <a href="/destinations/brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Brighton houses</a>.</p>
      
      <h2>Accommodation</h2>
      <p><strong>Bath</strong> - Georgian townhouses with period features. Expect high ceilings, sash windows, and elegant interiors. Properties tend to be in the city or surrounding Cotswold villages. Our <a href="/house-styles/manor-houses" style="color: var(--color-accent-sage); text-decoration: underline;">manor houses</a> work beautifully here.</p>
      
      <p><strong>Brighton</strong> - More variety, from Victorian villas to modern apartments. Often come with <a href="/houses-with-hot-tubs" style="color: var(--color-accent-sage); text-decoration: underline;">hot tubs</a> and <a href="/houses-with-games-rooms" style="color: var(--color-accent-sage); text-decoration: underline;">games rooms</a>. Easy to find places within walking distance of everything. Browse our <a href="/house-styles/party-houses" style="color: var(--color-accent-sage); text-decoration: underline;">party houses</a>.</p>
      
      <h2>Food Scene</h2>
      <p><strong>Bath</strong> - Fine dining and afternoon tea reign supreme. The Ivy, The Pump Room, and Sotto Sotto for Italian. Excellent brunch spots in the Lanes. Consider booking a <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef</a> for a special meal.</p>
      
      <p><strong>Brighton</strong> - More casual and diverse. Brilliant vegetarian scene, fantastic brunches, street food markets, and everything from fish and chips to Michelin-starred restaurants.</p>
      
      <h2>Activities</h2>
      <p><strong>Bath</strong></p>
      <ul>
        <li>Thermae Bath Spa (the rooftop pool is Instagram gold) - perfect for <a href="/spa-treatments" style="color: var(--color-accent-sage); text-decoration: underline;">spa treatments</a></li>
        <li>Roman Baths tour</li>
        <li>Afternoon tea experiences</li>
        <li><a href="/experiences/cocktail-masterclass" style="color: var(--color-accent-sage); text-decoration: underline;">Cocktail making classes</a></li>
        <li>Countryside walks in the Cotswolds</li>
      </ul>
      
      <p><strong>Brighton</strong></p>
      <ul>
        <li>Beach and pier activities</li>
        <li>Lanes shopping</li>
        <li><a href="/experiences/life-drawing" style="color: var(--color-accent-sage); text-decoration: underline;">Life drawing classes</a></li>
        <li><a href="/experiences/cocktail-masterclass" style="color: var(--color-accent-sage); text-decoration: underline;">Cocktail making</a></li>
        <li>Burlesque or dance workshops - see all our <a href="/experiences" style="color: var(--color-accent-sage); text-decoration: underline;">experiences</a></li>
      </ul>
      
      <h2>Nightlife</h2>
      <p><strong>Bath</strong> - More limited but improving. Good cocktail bars and a few late-night venues. Most groups do dinner and drinks rather than clubbing. Expect things to wind down by 2am.</p>
      
      <p><strong>Brighton</strong> - Legendary. Bars, clubs, and live music venues everywhere. You can party until 6am if that's your thing. Much better for groups who want a proper night out.</p>
      
      <h2>Getting There</h2>
      <p><strong>Bath</strong> - 1.5 hours from London by train. Driving can be tricky, and parking is expensive. Most groups get the train and use taxis or walk around the compact city centre.</p>
      
      <p><strong>Brighton</strong> - 1 hour from London, excellent train connections. Easier to drive to with better parking options. More accessible from various parts of the UK.</p>
      
      <h2>Weather Considerations</h2>
      <p><strong>Bath</strong> - All-weather destination. Most activities work rain or shine, and the city is beautiful in any season.</p>
      
      <p><strong>Brighton</strong> - Better in good weather when you can enjoy the beach and seafront. Still fun in winter but the experience is different.</p>
      
      <h2>Budget</h2>
      <p><strong>Bath</strong> - Generally more expensive. Accommodation, restaurants, and activities tend to cost more. Budget £300-400 per person for a weekend. Read our guide on <a href="/blog/split-costs-hen-weekend" style="color: var(--color-accent-sage); text-decoration: underline;">splitting costs fairly</a>.</p>
      
      <p><strong>Brighton</strong> - More options across price ranges. Easier to do Brighton on a budget if needed. Expect £250-350 per person.</p>
      
      <h2>The Verdict</h2>
      <p><strong>Choose Bath if:</strong></p>
      <ul>
        <li>Your group prefers elegant and sophisticated</li>
        <li><a href="/spa-treatments" style="color: var(--color-accent-sage); text-decoration: underline;">Spa experiences</a> appeal more than nightclubs</li>
        <li>You want beautiful, Instagrammable surroundings</li>
        <li>The bride isn't into big party vibes</li>
      </ul>
      
      <p><strong>Choose Brighton if:</strong></p>
      <ul>
        <li>Nightlife is a priority</li>
        <li>Your group loves the beach</li>
        <li>You want more variety in <a href="/blog/alternative-hen-party-ideas" style="color: var(--color-accent-sage); text-decoration: underline;">activities</a> and food</li>
        <li>Budget is a concern</li>
        <li>Accessibility matters (it's easier to get to)</li>
      </ul>
      
      <p>Honestly, both cities are brilliant for hen parties. The "right" choice depends entirely on your group's personality and what kind of weekend you want. Can't decide? Bath for a refined celebration, Brighton for a party weekend. Need more help planning? Check our <a href="/blog/hen-party-checklist" style="color: var(--color-accent-sage); text-decoration: underline;">complete planning checklist</a> or learn <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">how booking works</a>. Ready to start? <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">Browse all properties</a> or <a href="/contact" style="color: var(--color-accent-sage); text-decoration: underline;">contact our team</a> for personalised recommendations.</p>
    `,
  },
  {
    id: 6,
    title: "Your Complete Hen Party Planning Checklist",
    excerpt: "From booking the house to coordinating activities, this step-by-step checklist ensures nothing gets forgotten when planning the perfect hen weekend.",
    category: "Planning Tips",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-planning-che-9704c7d1-20251018105913.jpg",
    date: "29 Dec 2024",
    slug: "hen-party-checklist",
    content: `
      <p>Planning a <a href="/hen-party-houses" style="color: var(--color-accent-sage); text-decoration: underline;">hen party</a> can feel overwhelming, but breaking it down into manageable steps makes the whole process much easier. Here's your complete checklist to ensure nothing gets forgotten. Complement this with our guides on <a href="/blog/split-costs-hen-weekend" style="color: var(--color-accent-sage); text-decoration: underline;">splitting costs</a> and <a href="/blog/alternative-hen-party-ideas" style="color: var(--color-accent-sage); text-decoration: underline;">alternative activities</a>.</p>
      
      <h2>6-8 Months Before</h2>
      
      <h3>Initial Planning</h3>
      <ul>
        <li>Talk to the bride about her vision (or surprise her, if that's the plan)</li>
        <li>Confirm the guest list</li>
        <li>Set a realistic budget - see our <a href="/blog/split-costs-hen-weekend" style="color: var(--color-accent-sage); text-decoration: underline;">budgeting guide</a></li>
        <li>Choose dates (send out a poll to find what works for most people)</li>
        <li>Decide on destination - compare <a href="/blog/bath-vs-brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Bath vs Brighton</a> or browse all <a href="/destinations" style="color: var(--color-accent-sage); text-decoration: underline;">destinations</a></li>
      </ul>
      
      <h3>Accommodation</h3>
      <ul>
        <li>Research <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">properties</a> that fit your group size and budget</li>
        <li>Check availability for your preferred dates</li>
        <li>Read reviews carefully</li>
        <li>Book the house and pay deposit - understand our <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">booking process</a></li>
        <li>Add booking protection/cancellation insurance if offered - check <a href="/booking-terms" style="color: var(--color-accent-sage); text-decoration: underline;">booking terms</a></li>
      </ul>
      
      <h2>4-6 Months Before</h2>
      
      <h3>Activities & Experiences</h3>
      <ul>
        <li>Research and book activities - explore our <a href="/experiences" style="color: var(--color-accent-sage); text-decoration: underline;">experiences page</a></li>
        <li><a href="/experiences/cocktail-masterclass" style="color: var(--color-accent-sage); text-decoration: underline;">Cocktail classes</a>, <a href="/spa-treatments" style="color: var(--color-accent-sage); text-decoration: underline;">spa treatments</a>, <a href="/experiences/life-drawing" style="color: var(--color-accent-sage); text-decoration: underline;">life drawing</a></li>
        <li>Reserve group dining for Saturday night or book a <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef</a></li>
        <li>Look into hen party packages or add-ons</li>
        <li>Book any transport needed (minibus, taxi for activities)</li>
      </ul>
      
      <h3>Money Management</h3>
      <ul>
        <li>Create a detailed budget breakdown - full guide on <a href="/blog/split-costs-hen-weekend" style="color: var(--color-accent-sage); text-decoration: underline;">cost splitting</a></li>
        <li>Set up a group payment system (Splitwise, Monzo, etc.)</li>
        <li>Collect initial deposits from guests</li>
        <li>Keep receipts for everything</li>
      </ul>
      
      <h2>2-3 Months Before</h2>
      
      <h3>Finalise Details</h3>
      <ul>
        <li>Confirm final guest numbers</li>
        <li>Collect remaining payments from everyone</li>
        <li>Make final payment on accommodation - review <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">payment schedule</a></li>
        <li>Confirm all activity bookings</li>
        <li>Sort room allocations (who's sharing with who)</li>
      </ul>
      
      <h3>Extras & Decorations</h3>
      <ul>
        <li>Order personalised items (sashes, t-shirts if wanted)</li>
        <li>Plan decorations for the house - great for houses with <a href="/houses-with-games-rooms" style="color: var(--color-accent-sage); text-decoration: underline;">games rooms</a></li>
        <li>Organise party games or activities for downtime</li>
        <li>Create playlist for the house</li>
      </ul>
      
      <h2>1 Month Before</h2>
      
      <h3>Communication</h3>
      <ul>
        <li>Send out detailed itinerary to all guests</li>
        <li>Include house address and access details</li>
        <li>Share packing list suggestions</li>
        <li>Confirm dietary requirements for group meals</li>
        <li>Set up group chat if not already done</li>
      </ul>
      
      <h3>Shopping & Supplies</h3>
      <ul>
        <li>Order balloons, banners, photo props</li>
        <li>Buy party supplies (games, decorations)</li>
        <li>Get hen party accessories (sashes, badges)</li>
        <li>Sort welcome gifts or survival kits if doing them</li>
      </ul>
      
      <h2>1 Week Before</h2>
      
      <h3>Final Preparations</h3>
      <ul>
        <li>Reconfirm all bookings (accommodation, activities, restaurants)</li>
        <li>Check weather forecast</li>
        <li>Plan food shop or pre-order delivery to the house</li>
        <li>Assign any roles (who's doing breakfast, who's decorating)</li>
        <li>Pack decorations and supplies</li>
      </ul>
      
      <h3>Practical Tasks</h3>
      <ul>
        <li>Print any tickets or confirmations needed</li>
        <li>Create emergency contact list</li>
        <li>Check house rules and note check-in/check-out times - review <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">house rules</a></li>
        <li>Prepare games and activities for the house</li>
      </ul>
      
      <h2>Day Before</h2>
      
      <ul>
        <li>Do main food shop or confirm delivery</li>
        <li>Pack personal items</li>
        <li>Charge cameras, phones, speakers</li>
        <li>Download offline playlists</li>
        <li>Prep any games or activities that need setup</li>
        <li>Have cash ready for taxis, tips, etc.</li>
      </ul>
      
      <h2>On Arrival</h2>
      
      <ul>
        <li>Check house thoroughly (note any damage to avoid deposit issues)</li>
        <li>Put up decorations</li>
        <li>Assign rooms</li>
        <li>Do welcome drinks</li>
        <li>Brief everyone on the schedule and <a href="/blog/alternative-hen-party-ideas" style="color: var(--color-accent-sage); text-decoration: underline;">activities planned</a></li>
        <li>Start making memories!</li>
      </ul>
      
      <h2>Before Leaving</h2>
      
      <ul>
        <li>Clean the house to required standard</li>
        <li>Check for any damage that needs reporting</li>
        <li>Take down decorations</li>
        <li>Do final sweep for forgotten items</li>
        <li>Take final group photos</li>
        <li>Leave house secure and locked</li>
      </ul>
      
      <h2>After the Weekend</h2>
      
      <ul>
        <li>Share photos with the group</li>
        <li>Settle any outstanding expenses</li>
        <li>Send thank you message to hosts/venues if appropriate</li>
        <li>Leave <a href="/reviews" style="color: var(--color-accent-sage); text-decoration: underline;">reviews</a> for the property and any suppliers</li>
        <li>Create photo album or gift for the bride</li>
      </ul>
      
      <h2>Top Tips</h2>
      
      <ul>
        <li><strong>Start early</strong> - Popular houses and weekends book up fast. Browse <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">available properties</a> now.</li>
        <li><strong>Overcommunicate</strong> - Keep everyone in the loop about costs and plans</li>
        <li><strong>Build in downtime</strong> - Don't overschedule every minute. Houses with <a href="/houses-with-hot-tubs" style="color: var(--color-accent-sage); text-decoration: underline;">hot tubs</a> are perfect for relaxing.</li>
        <li><strong>Have backup plans</strong> - Weather, cancellations, or people running late</li>
        <li><strong>Designate a co-organiser</strong> - Don't try to do everything solo</li>
        <li><strong>Remember the bride</strong> - This is about her, so include what she'd love</li>
      </ul>
      
      <p>Planning a hen party takes organisation, but following this checklist means you won't miss anything important. The key is starting early and keeping track of everything in one place. Your future self (and the bride) will thank you. Need inspiration? Read our guide to <a href="/blog/alternative-hen-party-ideas" style="color: var(--color-accent-sage); text-decoration: underline;">10 alternative hen party ideas</a>. Deciding between cities? Check our <a href="/blog/bath-vs-brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Bath vs Brighton comparison</a>. Ready to book? Learn <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">how it works</a>, explore our <a href="/experiences" style="color: var(--color-accent-sage); text-decoration: underline;">experiences</a>, or <a href="/contact" style="color: var(--color-accent-sage); text-decoration: underline;">get in touch</a> for personalised help.</p>
    `,
  },
];

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = posts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

    return (
      <div className="min-h-screen">
        <Header />
  
        <UKServiceSchema 
          type="breadcrumb" 
          data={{
            breadcrumbs: [
              { name: "Home", url: "/" },
              { name: "Blog", url: "/blog" },
              { name: post.title, url: `/blog/${slug}` }
            ]
          }}
        />

        <BlogClientWrapper 
          post={post}
          relatedPosts={relatedPosts}
        />


      <Footer />
    </div>
  );
}
