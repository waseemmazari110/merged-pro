"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";
import UKServiceSchema from "@/components/UKServiceSchema";

// Inspiration posts data (should match the listing page)
const posts = [
  {
    id: 1,
    title: "How to Plan a Stress-Free Large Group Holiday",
    excerpt: "Coordinating schedules and preferences for a large group can be challenging. Our expert tips help you plan a seamless getaway that everyone will enjoy.",
    category: "Planning Tips",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-planning-che-9704c7d1-20251018105913.jpg",
    date: "15 Jan 2025",
    slug: "large-group-holiday-planning",
    content: `
      <p>Planning a <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">large group holiday</a> can feel like a full-time job. Between finding a date that works for everyone and choosing a property that meets everyone's needs, there's a lot to coordinate. However, with the right approach, it doesn't have to be stressful.</p>
      
      <h2>1. Start with a Core Planning Group</h2>
      <p>While you want everyone to feel included, having too many voices in the initial decision-making process can lead to 'analysis paralysis'. Start with a small core group of 2-3 people to narrow down dates, destinations, and a rough budget.</p>
      
      <h2>2. Define Your 'Must-Haves' Early</h2>
      <p>Does the group need <a href="/features/hot-tub" style="color: var(--color-accent-sage); text-decoration: underline;">hot tubs</a>? Are <a href="/house-styles/luxury-dog-friendly-cottages" style="color: var(--color-accent-sage); text-decoration: underline;">dog-friendly properties</a> essential? Perhaps you need a <a href="/features/ground-floor-bedroom" style="color: var(--color-accent-sage); text-decoration: underline;">ground floor bedroom</a> for less mobile guests. Identifying these non-negotiables early will save hours of searching.</p>
      
      <h2>3. Be Transparent About Costs</h2>
      <p>Money is often the biggest source of friction in group travel. Be clear about what the total cost includes (accommodation, cleaning fees, etc.) and set a firm deadline for deposits. Our <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">booking guide</a> explains our transparent pricing structure.</p>
      
      <h2>4. Choose the Right House Style</h2>
      <p>Not all large houses are created equal. A <a href="/house-styles/manor-houses" style="color: var(--color-accent-sage); text-decoration: underline;">manor house</a> offers a very different experience to a collection of <a href="/house-styles/large-cottages" style="color: var(--color-accent-sage); text-decoration: underline;">converted cottages</a>. Think about how your group likes to socialise—do you want one massive living room or multiple smaller spaces?</p>
      
      <h2>5. Don't Overschedule</h2>
      <p>The best part of a group holiday is the unplanned moments. While it's great to book a <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef</a> or a <a href="/experiences/cocktail-masterclass" style="color: var(--color-accent-sage); text-decoration: underline;">cocktail masterclass</a>, ensure there's plenty of downtime for people to just relax and catch up.</p>
      
      <p>Ready to start planning? Browse our <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">collection of large group houses</a> or <a href="/contact" style="color: var(--color-accent-sage); text-decoration: underline;">contact our team</a> for expert recommendations tailored to your group's size and needs.</p>
    `,
  },
  {
    id: 2,
    title: "Top UK Destinations for Multi-Generational Family Breaks",
    excerpt: "From the rolling hills of the Cotswolds to the rugged coast of Cornwall, discover the best locations for a family reunion that caters to all ages.",
    category: "Destination Guides",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-women-friend-01b63e10-20251018105846.jpg",
    date: "12 Jan 2025",
    slug: "family-group-destinations-uk",
    content: `
      <p>Finding a destination that keeps toddlers, teenagers, parents, and grandparents happy is no mean feat. Fortunately, the UK is home to some incredible regions that are perfect for <a href="/house-styles/family-holidays" style="color: var(--color-accent-sage); text-decoration: underline;">multi-generational family breaks</a>.</p>
      
      <h2>1. The Cotswolds: Classic Charm</h2>
      <p>With its gentle walks, historic villages, and world-class gastro pubs, the Cotswolds is a perennial favourite. Our <a href="/house-styles/manor-houses" style="color: var(--color-accent-sage); text-decoration: underline;">manor houses in the Cotswolds</a> often come with huge gardens—perfect for family games of rounders or cricket.</p>
      
      <h2>2. Cornwall: Coastal Adventures</h2>
      <p>For families who love the sea, Cornwall is hard to beat. From surfing in Newquay to exploring the Eden Project, there's something for everyone. Look for <a href="/features/direct-beach-access" style="color: var(--color-accent-sage); text-decoration: underline;">properties with direct beach access</a> to make those beach days even easier.</p>
      
      <h2>3. Bath: Culture and Relaxation</h2>
      <p>A <a href="/destinations/bath" style="color: var(--color-accent-sage); text-decoration: underline;">city break in Bath</a> offers history for the adults and plenty of entertainment for the kids. Plus, the famous Thermae Bath Spa is perfect for some multi-generational pampering. Our <a href="/destinations/bath" style="color: var(--color-accent-sage); text-decoration: underline;">Bath townhouses</a> put you right in the heart of the action.</p>
      
      <h2>4. The Peak District: For the Active Family</h2>
      <p>If your family reunion involves hiking, cycling, or climbing, the Peak District is your playground. After a day in the hills, return to a <a href="/house-styles/large-cottages" style="color: var(--color-accent-sage); text-decoration: underline;">large cottage</a> with a <a href="/features/games-room" style="color: var(--color-accent-sage); text-decoration: underline;">games room</a> to keep the competitive spirit alive.</p>
      
      <p>Each family is unique, and so is each of our properties. Whether you need a <a href="/features/swimming-pool" style="color: var(--color-accent-sage); text-decoration: underline;">house with a swimming pool</a> or a <a href="/features/tennis-court" style="color: var(--color-accent-sage); text-decoration: underline;">tennis court</a>, we can help you find the perfect base for your next reunion.</p>
    `,
  },
  {
    id: 3,
    title: "The Ultimate Guide to Booking Corporate Retreat Venues",
    excerpt: "Boost team morale and productivity with the perfect offsite location. Here's what to look for in a corporate retreat venue that balances work and play.",
    category: "Corporate",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-showing-split-c-189baecf-20251018105904.jpg",
    date: "8 Jan 2025",
    slug: "corporate-retreat-booking-guide",
    content: `
      <p>The traditional hotel conference room is a thing of the past. Today's forward-thinking companies are looking for <a href="/holiday-focus/business-offsite-corporate-accommodation" style="color: var(--color-accent-sage); text-decoration: underline;">unique corporate retreat venues</a> that inspire creativity and foster genuine team bonding.</p>
      
      <h2>Why Choose a Private House?</h2>
      <p>Booking a <a href="/house-styles/luxury-houses" style="color: var(--color-accent-sage); text-decoration: underline;">luxury private house</a> for your offsite provides a level of privacy and exclusivity that hotels simply can't match. It allows your team to relax, speak freely, and bond in a way that isn't possible in a public lobby or bar.</p>
      
      <h2>Essential Features for Work</h2>
      <p>While the goal is often 'getting away', you still need the right infrastructure. High-speed WiFi is a non-negotiable, and many of our properties offer large dining or living rooms that can be easily set up for presentations or workshops. Check out our <a href="/features" style="color: var(--color-accent-sage); text-decoration: underline;">property features guide</a> for more details.</p>
      
      <h2>Balancing Work and Play</h2>
      <p>The best retreats mix focused sessions with fun activities. Consider booking a <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef</a> for an evening of fine dining, or a <a href="/experiences/cocktail-masterclass" style="color: var(--color-accent-sage); text-decoration: underline;">cocktail masterclass</a> to lighten the mood after a productive day. Houses with <a href="/features/indoor-swimming-pool" style="color: var(--color-accent-sage); text-decoration: underline;">indoor pools</a> or <a href="/features/games-room" style="color: var(--color-accent-sage); text-decoration: underline;">games rooms</a> provide built-in entertainment.</p>
      
      <h2>Ease of Access</h2>
      <p>Choose a location that's easy for your team to get to. Our properties in <a href="/destinations/brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Brighton</a> and <a href="/destinations/bath" style="color: var(--color-accent-sage); text-decoration: underline;">Bath</a> offer excellent rail connections, making them ideal for teams coming from London or across the UK.</p>
      
      <p>Need help finding a venue that meets your specific corporate requirements? <a href="/contact" style="color: var(--color-accent-sage); text-decoration: underline;">Contact our specialist corporate team</a> for a curated selection of offsite venues.</p>
    `,
  },
  {
    id: 4,
    title: "House Spotlight: Inside The Luxury Cotswold Manor",
    excerpt: "Take a tour of one of our most impressive properties. With space for 24, an indoor pool, and acres of private grounds, it's the pinnacle of group luxury.",
    category: "House Spotlights",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-luxury-holid-f27f8e6d-20251018105853.jpg",
    date: "5 Jan 2025",
    slug: "cotswold-manor-spotlight",
    content: `
      <p>If you're looking for the ultimate in <a href="/house-styles/luxury-houses" style="color: var(--color-accent-sage); text-decoration: underline;">luxury group accommodation</a>, look no further than The Cotswold Manor. This breathtaking estate is designed specifically for large groups who refuse to compromise on style or comfort.</p>
      
      <h2>Space for Everyone</h2>
      <p>With 12 beautifully appointed bedrooms, many with en-suite bathrooms, the manor comfortably sleeps up to 24 guests. Unlike many properties that feel cramped at full capacity, The Cotswold Manor offers multiple large reception rooms, ensuring everyone has space to breathe. Browse more <a href="/house-styles/manor-houses" style="color: var(--color-accent-sage); text-decoration: underline;">stunning manor houses</a> in our collection.</p>
      
      <h2>Five-Star Facilities</h2>
      <p>The standout feature is undoubtedly the <a href="/features/indoor-swimming-pool" style="color: var(--color-accent-sage); text-decoration: underline;">indoor swimming pool</a> and spa area. Heated year-round, it's a sanctuary of relaxation whatever the weather. Outside, you'll find a <a href="/features/tennis-court" style="color: var(--color-accent-sage); text-decoration: underline;">tennis court</a>, a professional-grade BBQ area, and acres of manicured gardens.</p>
      
      <h2>A Chef's Dream Kitchen</h2>
      <p>Whether you're cooking for yourselves or hiring a <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef</a>, the kitchen is equipped to the highest standard. With triple ovens, massive fridge-freezers, and two dishwashers, hosting a banquet for 24 has never been easier.</p>
      
      <h2>Perfect for Special Occasions</h2>
      <p>From <a href="/weddings" style="color: var(--color-accent-sage); text-decoration: underline;">intimate wedding celebrations</a> to milestone 50th birthday parties, this house is built for celebration. The grand dining hall can be configured for formal sit-down meals, while the <a href="/features/games-room" style="color: var(--color-accent-sage); text-decoration: underline;">games room</a> with its full-size pool table keeps the party going late into the night.</p>
      
      <p>The Cotswold Manor isn't just a place to sleep—it's a destination in itself. <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">Search our latest availability</a> to see if this stunning property is available for your next group getaway.</p>
    `,
  },
  {
    id: 5,
    title: "Wedding Accommodation: Housing Your Guests in Style",
    excerpt: "Planning a destination wedding? Learn how to coordinate group accommodation that keeps your wedding party together and creates a festive atmosphere.",
    category: "Occasions",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-brighton-uk--0e8a0dba-20251018105838.jpg",
    date: "2 Jan 2025",
    slug: "wedding-group-accommodation-guide",
    content: `
      <p>Your wedding is about bringing people together. What better way to do that than by housing your closest friends and family in a <a href="/weddings" style="color: var(--color-accent-sage); text-decoration: underline;">grand holiday home</a> for the duration of the festivities?</p>
      
      <h2>The Benefits of 'Wed-Shedding'</h2>
      <p>Booking a <a href="/house-styles/large-holiday-homes" style="color: var(--color-accent-sage); text-decoration: underline;">large holiday home</a> for your wedding party creates a festive, communal atmosphere that hotels simply can't replicate. It allows for pre-wedding brunches, late-night chats by the fire, and a shared space for getting ready on the big day.</p>
      
      <h2>Choosing the Right Location</h2>
      <p>If your ceremony is in a remote country church, find a <a href="/house-styles/country-houses" style="color: var(--color-accent-sage); text-decoration: underline;">country house nearby</a>. For city weddings, a collection of <a href="/destinations/bath" style="color: var(--color-accent-sage); text-decoration: underline;">townhouses in Bath</a> or <a href="/destinations/brighton" style="color: var(--color-accent-sage); text-decoration: underline;">Brighton</a> can work brilliantly. Ensure there's plenty of parking for guests and easy access for wedding cars.</p>
      
      <h2>Coordination is Key</h2>
      <p>As the couple, you have enough on your plate. Appoint a 'Head of Accommodation' (perhaps a bridesmaid or usher) to manage room allocations and coordinate check-in times. Our <a href="/how-it-works" style="color: var(--color-accent-sage); text-decoration: underline;">booking management tools</a> make it easy to share house details with your group.</p>
      
      <h2>Pre and Post-Wedding Events</h2>
      <p>A <a href="/house-styles/luxury-houses" style="color: var(--color-accent-sage); text-decoration: underline;">luxury house</a> is the perfect venue for a rehearsal dinner or a 'day-after' BBQ. It extends the celebration and gives you more quality time with the people who matter most. Consider adding <a href="/experiences" style="color: var(--color-accent-sage); text-decoration: underline;">group experiences</a> to keep the energy high throughout the weekend.</p>
      
      <p>Planning a wedding is a journey, and we're here to help with the accommodation part of it. <a href="/contact" style="color: var(--color-accent-sage); text-decoration: underline;">Get in touch</a> to discuss how we can house your wedding party in style.</p>
    `,
  },
  {
    id: 6,
    title: "Self-Catering vs. Private Chef: What's Best for Your Group?",
    excerpt: "Whether you love cooking together or want a restaurant experience at home, we weigh up the pros and cons of different dining options for group stays.",
    category: "Planning Tips",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-hen-party-ac-2ed8f30b-20251018105832.jpg",
    date: "29 Dec 2024",
    slug: "group-dining-options-guide",
    content: `
      <p>One of the biggest questions for any group holiday is: "Who's cooking?" Food is central to any gathering, and choosing the right dining style can set the tone for your entire stay at one of our <a href="/properties" style="color: var(--color-accent-sage); text-decoration: underline;">group holiday houses</a>.</p>
      
      <h2>The Case for Self-Catering</h2>
      <p>Cooking together can be a brilliant bonding activity. Many of our <a href="/house-styles/luxury-houses" style="color: var(--color-accent-sage); text-decoration: underline;">luxury houses</a> feature massive kitchens that are designed for social cooking. It's also the most budget-friendly option and allows you total flexibility over when and what you eat.</p>
      
      <h2>The Luxury of a Private Chef</h2>
      <p>For a truly special occasion, nothing beats a <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef experience</a>. Imagine a restaurant-quality three-course meal served in your own dining room, with all the prep and—crucially—all the washing up handled for you. It's the ultimate stress-free way to celebrate.</p>
      
      <h2>A Hybrid Approach</h2>
      <p>Many groups choose to do a mix. Perhaps self-cater for breakfast and lunch, and hire a <a href="/experiences/private-chef" style="color: var(--color-accent-sage); text-decoration: underline;">private chef</a> for a standout 'celebration dinner' on the Saturday night. This gives you the best of both worlds.</p>
      
      <h2>Don't Forget the Extras</h2>
      <p>Beyond the main meals, think about <a href="/experiences/cocktail-masterclass" style="color: var(--color-accent-sage); text-decoration: underline;">cocktail masterclasses</a> or even local food deliveries. Many of our properties can recommend excellent local caterers who can drop off 'ready-to-heat' gourmet meals—perfect for your first night when you just want to relax. Explore our full range of <a href="/experiences" style="color: var(--color-accent-sage); text-decoration: underline;">in-house experiences</a>.</p>
      
      <p>Whichever option you choose, we can help facilitate it. From providing kitchen specs to connecting you with our network of approved private chefs, we'll ensure your group stay is delicious from start to finish. <a href="/contact" style="color: var(--color-accent-sage); text-decoration: underline;">Contact us</a> to learn more about our catering partners.</p>
    `,
  },
];

export default function InspirationPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = posts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Inspiration", url: "/inspiration" },
            { name: post.title, url: `/inspiration/${slug}` }
          ]
        }}
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
        <div className="max-w-[900px] mx-auto px-6">
          <Link
            href="/inspiration"
            className="inline-flex items-center gap-2 text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inspiration
          </Link>
  
          <div
            className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-6"
            style={{
              background: "var(--color-accent-sage)",
              color: "white",
            }}
          >
            {post.category}
          </div>
  
          <h1
            className="mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h1>
  
          <div className="flex items-center gap-6 text-[var(--color-neutral-dark)]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{post.date}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-[var(--color-accent-sage)] transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </section>
  
      {/* Featured Image */}
      <section className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
  
      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <div
            className="prose prose-lg max-w-none"
            style={{
              color: "var(--color-neutral-dark)",
              fontFamily: "var(--font-body)",
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>
  
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-24 bg-[var(--color-bg-primary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2
              className="mb-12 text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Related Articles
            </h2>
  
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/inspiration/${relatedPost.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
  
                    <div className="p-6">
                      <div
                        className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                        style={{
                          background: "var(--color-accent-sage)",
                          color: "white",
                        }}
                      >
                        {relatedPost.category}
                      </div>
  
                      <h3
                        className="text-xl font-semibold mb-3 group-hover:text-[var(--color-accent-sage)] transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {relatedPost.title}
                      </h3>
  
                      <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-dark)]">
                        <Calendar className="w-4 h-4" />
                        <span>{relatedPost.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
  
      <Footer />
    </div>
  );
}
