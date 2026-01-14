
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";
import { MapPin, TrendingUp, Instagram, ArrowRight, Sparkles, Clock, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DestinationsPage() {
  const destinations = [
    {
      name: "London",
      region: "Greater London",
      propertyCount: 35,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-london-citysc-8f325788-20251019170619.jpg",
      slug: "london",
      description: "The ultimate hen party destination with world-class entertainment, dining and iconic landmarks.",
      bio: "The capital offers world-class entertainment, dining and iconic landmarks.",
      featured: true
    },
    {
      name: "Brighton",
      region: "East Sussex",
      propertyCount: 18,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-brighton-uk--cf923885-20251018100341.jpg",
      slug: "brighton",
      description: "Vibrant seaside city with amazing nightlife and stunning Regency architecture.",
      bio: "Vibrant seaside city combining beach vibes with legendary nightlife.",
      featured: true
    },
    {
      name: "Bath",
      region: "Somerset",
      propertyCount: 15,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-bath-uk-city-79258396-20251018100352.jpg",
      slug: "bath",
      description: "Historic spa city with Roman baths, Georgian architecture and luxury experiences.",
      bio: "Historic spa city with Roman baths and Georgian architecture.",
      featured: true
    },
    {
      name: "Manchester",
      region: "Greater Manchester",
      propertyCount: 22,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-manchester-u-fdc0037c-20251018100402.jpg",
      slug: "manchester",
      description: "Vibrant city with world-class shopping, dining and legendary nightlife.",
      bio: "Northern powerhouse with vibrant nightlife and warm hospitality.",
      featured: true
    },
    {
      name: "York",
      region: "North Yorkshire",
      propertyCount: 12,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-york-uk%2c-m-7d6cc34e-20251018100412.jpg",
      slug: "york",
      description: "Medieval city with cobbled streets, historic walls and charming riverside pubs.",
      bio: "Medieval city with cobbled streets and charming riverside pubs.",
      featured: true
    },
    {
      name: "Liverpool",
      region: "Merseyside",
      propertyCount: 19,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-liverpool-wat-563898e7-20251019170646.jpg",
      slug: "liverpool",
      description: "Iconic waterfront city with legendary nightlife, Beatles heritage and vibrant atmosphere.",
      bio: "Iconic waterfront city with legendary nightlife and Beatles heritage.",
      featured: true
    },
    {
      name: "Newquay",
      region: "Cornwall",
      propertyCount: 8,
      image: "https://media.istockphoto.com/id/1211485656/photo/surfboard-and-palm-tree-on-beach-background.jpg?s=612x612&w=0&k=20&c=sjiA2xKDegW63sCAOc_b95aE6aDOuFIHUtasbKXFw7M=",
      slug: "newquay",
      description: "Stunning surf beaches, coastal walks and vibrant nightlife in Cornwall's party town.",
      bio: "Surf beaches meet vibrant nightlife in Cornwall's coastal party town.",
      featured: false
    },
    {
      name: "Lake District",
      region: "Cumbria",
      propertyCount: 16,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-lake-district-51198f8c-20251019170636.jpg",
      slug: "lake-district",
      description: "Breathtaking landscapes, luxury lodges and peaceful retreats in England's stunning national park.",
      bio: "Stunning landscapes with luxury lodges and peaceful mountain retreats.",
      featured: false
    },
    {
      name: "Bristol",
      region: "South West England",
      propertyCount: 17,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-bristol-harbo-235d69cd-20251019170653.jpg",
      slug: "bristol",
      description: "Creative harbour city with fantastic food scene, nightlife and cultural attractions.",
      bio: "Creative harbour city with fantastic food scene and vibrant culture.",
      featured: false
    },
    {
      name: "Cambridge",
      region: "Cambridgeshire",
      propertyCount: 10,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cambridge-uni-706b7fc1-20251019170701.jpg",
      slug: "cambridge",
      description: "Historic university city with beautiful colleges, punting and sophisticated dining.",
      bio: "Historic university city with beautiful colleges and riverside charm.",
      featured: false
    },
    {
      name: "Oxford",
      region: "Oxfordshire",
      propertyCount: 11,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-oxford-univer-e05e954c-20251019170708.jpg",
      slug: "oxford",
      description: "Stunning architecture, world-famous university and elegant bars and restaurants.",
      bio: "Stunning spires, world-famous university and elegant atmosphere.",
      featured: false
    },
    {
      name: "Leeds",
      region: "West Yorkshire",
      propertyCount: 15,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-leeds-city-ce-2b3778ad-20251019170714.jpg",
      slug: "leeds",
      description: "Buzzing northern city with incredible shopping, dining and legendary nightlife.",
      bio: "Dynamic northern city with incredible shopping and nightlife.",
      featured: false
    },
    {
      name: "Nottingham",
      region: "Nottinghamshire",
      propertyCount: 13,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-nottingham-ci-c74b1381-20251019170721.jpg",
      slug: "nottingham",
      description: "Historic city with Robin Hood heritage, great nightlife and vibrant student scene.",
      bio: "Historic city with legendary nightlife and vibrant atmosphere.",
      featured: false
    },
    {
      name: "Sheffield",
      region: "South Yorkshire",
      propertyCount: 9,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-sheffield-cit-c9093e0d-20251019170737.jpg",
      slug: "sheffield",
      description: "Green city surrounded by Peak District with friendly locals and great value.",
      bio: "Green city near Peak District with friendly locals and great value.",
      featured: false
    },
    {
      name: "Exeter",
      region: "Devon",
      propertyCount: 8,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-exeter-cathed-62bbdacd-20251019170745.jpg",
      slug: "exeter",
      description: "Cathedral city with Roman history, beautiful quayside and Devon countryside.",
      bio: "Cathedral city with Roman history and beautiful Devon setting.",
      featured: false
    },
    {
      name: "Chester",
      region: "Cheshire",
      propertyCount: 7,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-chester-city--d1134f79-20251019170752.jpg",
      slug: "chester",
      description: "Roman walled city with unique shopping rows and riverside walks.",
      bio: "Roman walled city with unique shopping and riverside charm.",
      featured: false
    },
    {
      name: "Durham",
      region: "County Durham",
      propertyCount: 6,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-durham-cathed-5ca6e566-20251019170759.jpg",
      slug: "durham",
      description: "UNESCO World Heritage site with stunning cathedral and historic university.",
      bio: "UNESCO World Heritage site with stunning cathedral and castle.",
      featured: false
    },
    {
      name: "Canterbury",
      region: "Kent",
      propertyCount: 7,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-canterbury-ca-dca05dc1-20251019170811.jpg",
      slug: "canterbury",
      description: "Medieval city with famous cathedral, cobbled streets and charming tea rooms.",
      bio: "Medieval city with famous cathedral and cobbled streets.",
      featured: false
    },
    {
      name: "Blackpool",
      region: "Lancashire",
      propertyCount: 10,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-blackpool-tow-64085652-20251019170818.jpg",
      slug: "blackpool",
      description: "Classic seaside resort with famous tower, pleasure beach and lively entertainment.",
      bio: "Classic seaside resort with famous tower and lively entertainment.",
      featured: false
    },
    {
      name: "Cotswolds",
      region: "South West England",
      propertyCount: 14,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cotswolds-cou-81699b79-20251019170824.jpg",
      slug: "cotswolds",
      description: "Picturesque villages, rolling hills and luxury country retreats.",
      bio: "Picturesque villages with rolling hills and luxury country homes.",
      featured: false
    },
    {
      name: "Margate",
      region: "Kent",
      propertyCount: 8,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-margate-seafr-9f3138d3-20251019170830.jpg",
      slug: "margate",
      description: "Trendy seaside town with sandy beaches, vintage shops and creative scene.",
      bio: "Trendy seaside town with sandy beaches and creative vibe.",
      featured: false
    },
    {
      name: "Harrogate",
      region: "North Yorkshire",
      propertyCount: 9,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-harrogate-tow-ef6ad8e6-20251019170838.jpg",
      slug: "harrogate",
      description: "Elegant spa town with beautiful gardens, boutique shops and afternoon tea.",
      bio: "Elegant spa town with beautiful gardens and afternoon tea.",
      featured: false
    },
    {
      name: "St Ives",
      region: "Cornwall",
      propertyCount: 7,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-st-ives-harbo-608d18b9-20251019170846.jpg",
      slug: "st-ives",
      description: "Stunning harbour town with golden beaches, art galleries and seafood restaurants.",
      bio: "Stunning harbour with golden beaches and artistic charm.",
      featured: false
    },
    {
      name: "Windsor",
      region: "Berkshire",
      propertyCount: 6,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-windsor-castl-304247da-20251019170853.jpg",
      slug: "windsor",
      description: "Royal town with historic castle, Thames riverside and elegant hotels.",
      bio: "Royal town with historic castle and Thames-side elegance.",
      featured: false
    },
    {
      name: "Stratford-upon-Avon",
      region: "Warwickshire",
      propertyCount: 8,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-stratford-upo-660c5853-20251019170900.jpg",
      slug: "stratford-upon-avon",
      description: "Shakespeare's birthplace with Tudor buildings, theatre and riverside walks.",
      bio: "Shakespeare's birthplace with Tudor buildings and theatre.",
      featured: false
    },
    {
      name: "Plymouth",
      region: "Devon",
      propertyCount: 9,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-plymouth-wate-a14909bf-20251019170907.jpg",
      slug: "plymouth",
      description: "Historic waterfront city with maritime heritage and stunning coastal views.",
      bio: "Historic waterfront city with maritime heritage and coastal views.",
      featured: false
    },
    {
      name: "Cheltenham",
      region: "Gloucestershire",
      propertyCount: 7,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cheltenham-to-be3b5273-20251019170915.jpg",
      slug: "cheltenham",
      description: "Regency spa town famous for festivals, horse racing and elegant architecture.",
      bio: "Regency spa town famous for festivals and elegant architecture.",
      featured: false
    },
    {
      name: "Cardiff",
      region: "South Wales",
      propertyCount: 14,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/cardiff-city-center-photograph%2c-iconic-caf939c9-20251017161252.jpg",
      slug: "cardiff",
      description: "Wales' vibrant capital with fantastic value, warm hospitality and stunning bay.",
      bio: "Wales' vibrant capital with fantastic value and warm hospitality.",
      featured: false
    },
    {
      name: "Bournemouth",
      region: "Dorset",
      propertyCount: 14,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-bournemouth--f4900618-20251018100420.jpg",
      slug: "bournemouth",
      description: "Beautiful beaches, vibrant nightlife and stunning coastal walks.",
      bio: "Beautiful beaches with vibrant nightlife and coastal walks.",
      featured: false
    },
    {
      name: "Newcastle",
      region: "Tyne and Wear",
      propertyCount: 9,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-newcastle-upo-1cea0fd5-20251019170922.jpg",
      slug: "newcastle",
      description: "Friendly northern city famous for nightlife and stunning quayside.",
      bio: "Friendly northern city famous for nightlife and stunning quayside.",
      featured: false
    },
    {
      name: "Birmingham",
      region: "West Midlands",
      propertyCount: 11,
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-birmingham-ci-2022de45-20251019170730.jpg",
      slug: "birmingham",
      description: "Britain's second city with world-class shopping, diverse dining and buzzing nightlife.",
      bio: "Dynamic city with world-class shopping and diverse entertainment.",
      featured: false
    },
  ];

  const featuredDestinations = destinations.filter((d) => d.featured);
  
  const coastalDestinations = [
    "brighton", "bournemouth", "newquay", "st-ives", "margate", "blackpool", "plymouth"
  ].map(slug => destinations.find(d => d.slug === slug)).filter(Boolean);

  const cityDestinations = [
    "london", "manchester", "bath", "york", "liverpool", "bristol", "cambridge", "oxford", "leeds", "nottingham", "sheffield", "newcastle", "birmingham", "cardiff"
  ].map(slug => destinations.find(d => d.slug === slug)).filter(Boolean);

  const natureDestinations = [
    "lake-district", "cotswolds", "peak-district", "cornwall", "devon", "yorkshire", "norfolk", "suffolk", "sussex"
  ].map(slug => destinations.find(d => d.slug === slug)).filter(Boolean);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Destinations", url: "/destinations" }
          ]
        }}
      />
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-8 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/80 backdrop-blur-sm mb-6">
            <MapPin className="w-4 h-4 text-[var(--color-accent-pink)]" />
            <span className="text-sm font-medium">Explore UK Destinations</span>
          </div>
          <h1 className="mb-4 text-4xl md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            The Best UK Hen Party Destinations
          </h1>
          <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto mb-6">
            Discover 30+ handpicked cities and regions across the UK for your group celebration
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-[var(--color-accent-sage)]">
            <a href="#popular" className="hover:underline">Popular Cities</a>
            <span>•</span>
            <a href="#coastal" className="hover:underline">Coastal Escapes</a>
            <span>•</span>
            <a href="#nature" className="hover:underline">Countryside & Nature</a>
          </div>
        </div>
      </section>

        {/* Most Popular */}
        <section id="popular" className="py-12 bg-[var(--color-bg-secondary)] scroll-mt-24">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center gap-2 mb-4 border-b border-[var(--color-accent-pink)]/20 pb-4">
              <TrendingUp className="w-6 h-6 text-[var(--color-accent-pink)]" />
              <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Most Popular Cities
              </h2>
            </div>
            <p className="text-[var(--color-neutral-dark)] mb-8 max-w-3xl">
              These are our most-booked cities for <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen parties</Link> and large group celebrations. Each offers a unique blend of culture, nightlife, and <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">luxury accommodation</Link>.
            </p>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination: any) => (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-[400px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url('${destination.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      {destination.name}
                    </h3>
                    <p className="text-sm opacity-90 mb-4">{destination.bio}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                      <span>View {destination.propertyCount} Properties</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coastal Escapes */}
      <section id="coastal" className="py-12 bg-white scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-8 border-b border-[var(--color-accent-sage)]/20 pb-4">
            <Waves className="w-6 h-6 text-[var(--color-accent-sage)]" />
            <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Coastal Escapes
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {coastalDestinations.map((destination: any) => (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}`}
                className="group flex flex-col gap-3"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-sage)] transition-colors">
                    {destination.name}
                  </h3>
                  <p className="text-xs text-[var(--color-neutral-dark)]">{destination.propertyCount} Properties</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Countryside & Nature */}
      <section id="nature" className="py-12 bg-[var(--color-bg-secondary)] scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-8 border-b border-[var(--color-accent-gold)]/20 pb-4">
            <Sparkles className="w-6 h-6 text-[var(--color-accent-gold)]" />
            <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Countryside & Nature
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {natureDestinations.map((destination: any) => (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}`}
                className="group flex flex-col gap-3"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold)] transition-colors">
                    {destination.name}
                  </h3>
                  <p className="text-xs text-[var(--color-neutral-dark)]">{destination.propertyCount} Properties</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section 2 - After All Destinations */}
      <section className="bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="rounded-3xl p-12 md:p-16 text-center shadow-2xl" style={{ background: "linear-gradient(135deg, var(--color-accent-sage), var(--color-accent-gold))" }}>
            <h2 className="text-4xl md:text-5xl mb-4 text-white" style={{ fontFamily: "var(--font-display)" }}>
              Not Sure Where to Go?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get a free personalised quote and let us help you find the perfect destination and house for your group celebration
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-12 py-7 text-lg font-semibold transition-all duration-200 hover:shadow-2xl hover:scale-105 group"
              style={{
                background: "white",
                color: "var(--color-text-primary)"
              }}>

              <Link href="/contact" className="inline-flex items-center gap-2">
                Get Your Free Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-0 scroll-reveal" style={{ background: "var(--color-accent-pink)" }}>
        <div className="max-w-full !text-[10px]">
          {/* Top Row: Text */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-0 gap-2 max-w-[1400px] mx-auto px-6">
            <h2
              className="text-2xl md:text-3xl m-0"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>

              We're on Instagram
            </h2>
            <a
              href="https://instagram.com/groupescapehouses"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xl md:text-2xl font-semibold hover:opacity-80 transition-opacity"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>

              <Instagram className="w-6 h-6" />
              @groupescapehouses
            </a>
          </div>

          {/* Bottom Row: Photo Strip with Animation */}
          <div className="overflow-hidden">
            <div className="flex gap-3 animate-slide-left">
              {[
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=90",
              "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=90",
              "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=90",
              "https://images.unsplash.com/photo-1543051932-6ef9fecfbc80?w=800&q=90",
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=90",
              "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=90",
              // Duplicate for seamless loop
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=90",
              "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=90",
              "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=90",
              "https://images.unsplash.com/photo-1543051932-6ef9fecfbc80?w=800&q=90"].
              map((image, index) =>
              <a
                key={index}
                href="https://instagram.com/groupescapehouses"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">

                  <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image}')` }}>
                </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Instagram className="w-7 h-7" style={{ color: "var(--color-accent-pink)" }} />
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="pt-6 pb-12 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-center mb-16" style={{ fontFamily: "var(--font-display)" }}>
            Why Choose Group Escape Houses?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg"
                style={{ background: "var(--color-accent-pink)" }}>

                🏡
              </div>
              <h3 className="text-xl font-semibold mb-3">Prime Locations</h3>
              <p className="text-[var(--color-neutral-dark)]">
                Properties in the best areas, close to nightlife, restaurants and attractions
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg"
                style={{ background: "var(--color-accent-sage)" }}>

                ⭐
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Expertise</h3>
              <p className="text-[var(--color-neutral-dark)]">
                Insider tips and recommendations for the best experiences in every city
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg"
                style={{ background: "var(--color-accent-gold)" }}>

                🎊
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Packages</h3>
              <p className="text-[var(--color-neutral-dark)]">
                Combine accommodation with experiences for a hassle-free celebration
              </p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                style={{
                  background: "var(--color-accent-sage)",
                  color: "white"
                }}>

                <Link href="/properties">Browse Houses</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl px-10 py-6 font-medium border-2 transition-all duration-200 hover:bg-[var(--color-accent-gold)] hover:text-white hover:border-[var(--color-accent-gold)]"
                style={{
                  borderColor: "var(--color-accent-gold)",
                  color: "var(--color-text-primary)"
                }}>

                <Link href="/contact">Get a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours Section */}
      <section className="py-12 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/80 backdrop-blur-sm mb-4">
                <Clock className="w-4 h-4 text-[var(--color-accent-pink)]" />
                <span className="text-sm font-medium">Office Hours</span>
              </div>
              <h2 className="text-3xl font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Opening Hours
              </h2>
              <p className="text-[var(--color-neutral-dark)]">
                Our team is available to help with your enquiries during the following times
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-bg-secondary)]">
                  <span className="font-medium text-[var(--color-text-primary)]">Monday - Friday</span>
                  <span className="text-[var(--color-neutral-dark)]">9am - 8pm</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--color-bg-secondary)]">
                  <span className="font-medium text-[var(--color-text-primary)]">Saturday</span>
                  <span className="text-[var(--color-neutral-dark)]">10am - 6pm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[var(--color-text-primary)]">Sunday</span>
                  <span className="text-[var(--color-neutral-dark)]">10am - 6pm</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[var(--color-bg-secondary)] text-center">
                <p className="text-sm text-[var(--color-neutral-dark)] mb-4">
                  Need to get in touch?
                </p>
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-8 py-3 font-medium transition-all duration-200"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white"
                  }}>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>);

}