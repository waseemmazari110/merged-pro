"use client";

import { useState, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import UKServiceSchema from "@/components/UKServiceSchema";
import { TrustBadges } from "@/components/TrustBadges";
import { MapPin, Navigation, Coffee, Moon, Sparkles, UtensilsCrossed, ChevronDown, Calendar, Home, Waves, PoundSterling, Users, PartyPopper, Train, Plane, Car, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddExperiencesToStay from "@/components/AddExperiencesToStay";

interface DestinationClientProps {
  slug: string;
}

export default function DestinationClient({ slug }: DestinationClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = useCallback((imageId: string) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  }, []);

  // Full destinations data - moved from server to client
  const destinationsData: Record<string, any> = {
    london: {
      name: "London",
      region: "Greater London",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-london-citysc-8f325788-20251019170619.jpg",
      overview: "London is the capital of luxury group accommodation, offering world-class entertainment, Michelin-starred dining, and iconic landmarks. Perfect for hen parties seeking sophistication, culture, and unforgettable nightlife in one of the world's most vibrant cities.",
      quickFacts: {
        fromLondon: "You're already here! Easy access to all properties via tube and train",
        bestTime: "Year-round destination with theatres, shopping, and dining always available",
        nightlife: "World-class! Shoreditch clubs, West End bars, Soho cocktail lounges, rooftop terraces",
        dining: "Michelin-starred restaurants, Borough Market, Brick Lane curries, afternoon tea at The Ritz",
        beachAccess: "No beach but stunning Thames riverside walks, parks, and rooftop bars",
        accommodation: "Luxury townhouses in Kensington, modern lofts in Shoreditch, period properties in Chelsea",
        priceRange: "£95-£140 per night for premium central London properties",
        activities: "West End shows, Thames boat trips, museums, shopping Oxford Street, afternoon tea"
      },
      gettingThere: [
        { icon: Train, text: "Excellent tube network connects all areas" },
        { icon: Car, text: "Easy access via M25 and major motorways" },
        { icon: Bus, text: "24-hour bus services throughout the city" },
        { icon: Plane, text: "Five major airports: Heathrow, Gatwick, Stansted, Luton, City" }
      ],
      nightlife: [
        { name: "Shoreditch Clubs", description: "Trendy East London nightlife district", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
        { name: "West End Bars", description: "Sophisticated cocktail bars and lounges", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" },
        { name: "Soho Nightlife", description: "Vibrant bars and entertainment venues", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" }
      ],
      brunch: [
        { name: "The Ivy", description: "Iconic British dining experience", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Dishoom", description: "Bombay-style brunch with bottomless chai", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", link: "#" },
        { name: "Sketch", description: "Instagram-worthy pink dining room", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "West End Shows", description: "World-famous theatre district", image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80" },
        { name: "Thames River Cruise", description: "See London's landmarks from the water", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80" },
        { name: "Afternoon Tea", description: "Classic British tradition at luxury hotels", image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80" }
      ]
    },
    "lake-district": {
      name: "Lake District",
      region: "Cumbria",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-lake-district-51198f8c-20251019170636.jpg",
      overview: "The Lake District is England's most stunning national park, offering breathtaking landscapes, luxury lodges, and peaceful mountain retreats perfect for group celebrations. With dramatic fells, pristine lakes, and charming villages, it's the ideal destination for groups seeking natural beauty combined with luxury accommodation.",
      quickFacts: {
        fromLondon: "4-5 hours by train to Windermere or 5-6 hours by car via M6",
        bestTime: "May to September for hiking and boat trips, winter for cosy retreats with log fires",
        nightlife: "Traditional Lakeland pubs with local ales, cosy inns with live folk music",
        dining: "Award-winning gastropubs, Michelin-starred restaurants, traditional afternoon tea with lake views",
        beachAccess: "No beaches but 16 stunning lakes including Windermere, Ullswater and Derwentwater for boat trips",
        accommodation: "Luxury lakeside lodges with hot tubs, mountain-view retreats, converted barns with spa facilities",
        priceRange: "£80-£120 per night with premium lodges featuring private hot tubs and saunas",
        activities: "Lake cruises, fell walking, spa treatments, kayaking, scenic drives, mountain biking"
      },
      gettingThere: [
        { icon: Train, text: "Regular train services to Windermere and Penrith from London Euston (4-5 hours)" },
        { icon: Car, text: "Scenic drive via M6 motorway (approx 5-6 hours from London)" },
        { icon: Bus, text: "National Express coaches run daily services to major Lake District towns" },
        { icon: Plane, text: "Nearest airports: Manchester (2 hours) or Newcastle (2.5 hours)" }
      ],
      nightlife: [
        { name: "The Drunken Duck", description: "Award-winning pub with craft beers and stunning views", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80" },
        { name: "Zeffirellis", description: "Popular cinema and jazz bar in Ambleside", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80" },
        { name: "The Old Dungeon Ghyll", description: "Traditional climbers' pub with live music", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-traditional-c-9f271f04-20251022073931.jpg" }
      ],
      brunch: [
        { name: "The Jumble Room", description: "Quirky restaurant with creative brunch menu", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-quirky-eclect-9dc02dd6-20251022073924.jpg", link: "#" },
        { name: "Doi Intanon", description: "Thai restaurant with lakeside views", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-thai-restaura-a5539b7a-20251022073930.jpg", link: "#" },
        { name: "The Cottage in the Wood", description: "Fine dining with panoramic fell views", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Windermere Lake Cruise", description: "Scenic boat tours on England's largest lake", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" },
        { name: "Spa Treatments", description: "Luxury spa experiences in stunning settings", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80" },
        { name: "Mountain Hiking", description: "Guided walks and fell climbing adventures", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80" }
      ]
    },
    brighton: {
      name: "Brighton",
      region: "East Sussex",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-brighton-uk--cf923885-20251018100341.jpg",
      overview: "Brighton is the UK's premier hen party destination, combining stunning Regency architecture with legendary nightlife, a vibrant beach scene, and endless entertainment options. From cocktail bars to beachfront clubs, this seaside city offers the perfect blend of sophistication and fun for unforgettable group celebrations.",
      quickFacts: {
        fromLondon: "Just 1 hour by direct train from Victoria or London Bridge - perfect for quick escapes",
        bestTime: "Year-round destination! May-September for beach clubs and seafront, October-April for cheaper rates",
        nightlife: "Legendary! Coalition (5 floors), Patterns seafront club, The Arch cocktail bar, PRYZM superclub",
        dining: "Outstanding seafood at Riddle & Finns, The Ivy in the Lanes, bottomless brunch at Plateau",
        beachAccess: "Direct beach access! 5 miles of pebble beach, Brighton Pier, beach volleyball, water sports",
        accommodation: "Regency townhouses with hot tubs, seafront villas with games rooms, modern lofts near The Lanes",
        priceRange: "£75-£110 per night, split between groups makes it very affordable",
        activities: "Beach clubs, The Lanes shopping, Brighton Pier rides, paddleboarding, comedy clubs, cocktail classes"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Victoria or London Bridge (1 hour)" },
        { icon: Car, text: "Easy drive via M23 and A23 (approx 1.5 hours from London)" },
        { icon: Bus, text: "National Express and Megabus services from London Victoria" },
        { icon: Plane, text: "Gatwick Airport is 30 minutes away with direct train connections" }
      ],
      nightlife: [
        { name: "Coalition", description: "Multi-room club with varied music across 5 floors", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-large-multi-e060105c-20251021225447.jpg" },
        { name: "Patterns", description: "Seafront club with top DJs and stunning terrace", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-seafront-ni-845a7016-20251021225429.jpg" },
        { name: "The Arch", description: "Boutique venue with cocktails and live music", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-an-upscale-bo-dede2298-20251021225429.jpg" }
      ],
      brunch: [
        { name: "The Ivy in the Lanes", description: "Elegant all-day dining in historic setting", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-an-elegant-up-8951bf0f-20251021225427.jpg", link: "https://theivybrighton.com" },
        { name: "Plateau", description: "Rooftop restaurant with bottomless brunch", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-chic-roofto-e8a24100-20251021225428.jpg", link: "https://www.plateaubrighton.co.uk" },
        { name: "Riddle & Finns", description: "Premium seafood and champagne bar", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-premium-sea-2a93d3c3-20251021225430.jpg", link: "https://www.riddleandfinn.co.uk" }
      ],
      activities: [
        { name: "Beach Clubs", description: "Spend the day at Brighton's famous beach clubs", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-brighton-beac-c00ed960-20251021225429.jpg" },
        { name: "Shopping in The Lanes", description: "Explore quirky boutiques and vintage shops", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-lanes-sho-5a58ff3e-20251021225428.jpg" },
        { name: "Brighton Pier", description: "Classic seaside fun with rides and arcades", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-brighton-pala-91beb56d-20251021225428.jpg" }
      ]
    },
    bath: {
      name: "Bath",
      region: "Somerset",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-bath-uk-city-79258396-20251018100352.jpg",
      overview: "Bath is a stunning UNESCO World Heritage city combining Roman history, Georgian elegance, and world-class spa experiences. Perfect for sophisticated hen parties seeking culture, relaxation, and refined entertainment in one of England's most beautiful cities.",
      quickFacts: {
        fromLondon: "Just 1.5 hours by direct train from Paddington - ideal for elegant weekend escapes",
        bestTime: "Year-round elegance! Spring (Apr-May) for festivals, December for Christmas markets and lights",
        nightlife: "Sophisticated scene - Sub 13 underground cocktails, The Dark Horse speakeasy, champagne at The Bath Priory",
        dining: "Fine dining capital! The Pump Room in Roman Baths, Sally Lunn's historic buns, Society Café bottomless brunch",
        beachAccess: "No beach but beautiful River Avon walks, punting, and the stunning Royal Crescent gardens",
        accommodation: "Georgian townhouses with period features, luxury spas with hot tubs, Bath stone manors with games rooms",
        priceRange: "£85-£120 per night for authentic Georgian properties with modern luxury",
        activities: "Thermae Bath Spa rooftop pools, Roman Baths tours, Jane Austen Centre, afternoon tea, boutique shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (1.5 hours)" },
        { icon: Car, text: "M4 motorway via Bristol (approx 2.5 hours from London)" },
        { icon: Bus, text: "National Express coaches from London Victoria" },
        { icon: Plane, text: "Bristol Airport is 30 minutes away" }
      ],
      nightlife: [
        { name: "Sub 13", description: "Underground cocktail bar in vaulted cellars", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
        { name: "The Bell Inn", description: "Historic pub with live music nights", image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80" },
        { name: "The Dark Horse", description: "Cocktail bar with speakeasy vibes", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Pump Room", description: "Elegant dining in historic Roman Baths setting", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Society Café", description: "Stylish all-day dining and cocktails", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Colonna & Small's", description: "Award-winning coffee and brunch", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Thermae Bath Spa", description: "Rooftop thermal pools with city views", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80" },
        { name: "Roman Baths", description: "Ancient Roman bathing complex", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
        { name: "Royal Crescent", description: "Iconic Georgian architecture and gardens", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" }
      ]
    },
    manchester: {
      name: "Manchester",
      region: "Greater Manchester",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-manchester-u-fdc0037c-20251018100402.jpg",
      overview: "Manchester is the vibrant Northern powerhouse with world-class shopping, incredible nightlife, and warm Northern hospitality. Perfect for hen parties seeking a cosmopolitan city break with legendary music venues, trendy bars, and industrial-chic accommodation.",
      quickFacts: {
        fromLondon: "Just 2 hours by direct train from Euston - easy Northern city escape",
        bestTime: "Year-round party city! Summer for rooftop bars, winter for Christmas markets",
        nightlife: "Legendary music scene! Warehouse Project, The Deaf Institute, Northern Quarter bars",
        dining: "Diverse and trendy - Northern Quarter street food, Spinningfields fine dining, curry mile",
        beachAccess: "No beach but vibrant canal-side bars and MediaCityUK waterfront",
        accommodation: "Industrial loft conversions with hot tubs, modern apartments, Victorian warehouses",
        priceRange: "£70-£95 per night - great value for a major city",
        activities: "Shopping Trafford Centre, Northern Quarter vintage, football tours, music venues"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Euston (2 hours)" },
        { icon: Plane, text: "Manchester Airport with global connections" },
        { icon: Car, text: "M6 and M62 motorways (approx 3.5 hours from London)" },
        { icon: Bus, text: "Frequent coach services from major cities" }
      ],
        nightlife: [
          { name: "Adonis Cabaret", description: "The ultimate cabaret show with hunks, drag, and comedy", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Bar And Club Night", description: "VIP entry to Manchester's hottest bars and clubs", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
          { name: "Comedy Club", description: "A night of laughter with top stand-up comedians", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Drag Extravaganza", description: "Fabulous drag show with glitz, glamour, and performance", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Dreamboys", description: "The UK's most famous male strip show", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Warehouse Project", description: "Legendary electronic music venue", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Northern Quarter", description: "Trendy bars and independent venues", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" },
          { name: "Deansgate Locks", description: "Canalside bars and clubs", image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80" }
        ],
        brunch: [
          { name: "Abba Bottomless Brunch", description: "Dancing Queen vibes with bottomless bubbles and brunch", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
          { name: "Banyan Brunch", description: "Stylish brunch in the heart of the city", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" },
          { name: "Boozy Bottomless Brunch", description: "The ultimate boozy weekend start", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
          { name: "Bottomless Brunch", description: "Unlimited bubbles and delicious brunch dishes", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
          { name: "Boy Toy Bottomless Brunch", description: "Brunch served with a side of hunks", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
          { name: "Buff Bingo Brunch", description: "Bingo, brunch, and buff butlers", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
          { name: "Burger & Booze Afternoon Tea", description: "A cheeky twist on the classic afternoon tea", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" },
          { name: "Cosy Club Brunch", description: "Sophisticated brunch in a stunning setting", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
          { name: "Cuban Bottomless Brunch", description: "Latino vibes with bottomless cocktails and tapas", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
          { name: "Dirty Dancing Brunch Show", description: "Immersive brunch with live performances", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
          { name: "Drag Bottomless Brunch", description: "Manchester's best drag brunch experience", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
          { name: "Federal Bar", description: "Australian-inspired brunch in Northern Quarter", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
          { name: "Grindsmith", description: "Specialty coffee and creative brunch", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" },
          { name: "The Ivy Spinningfields", description: "Elegant all-day dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" }
        ],
        activities: [
          { name: "ABBA Dance Class", description: "Learn the moves to your favorite ABBA hits", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "Alcotraz Prison Cocktail Experience", description: "Smuggle your liquor into this immersive prison bar", image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80" },
          { name: "Archery Tag", description: "High-energy combat archery experience", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" },
          { name: "Axe Throwing", description: "Compete with your group in this urban axe throwing experience", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80" },
          { name: "Back To The 80s Dance Class", description: "Retro moves and big hair vibes", image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&q=80" },
          { name: "Back To The 90s Dance Class", description: "Relive the 90s with this nostalgic dance class", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&q=80" },
          { name: "Barbie Dance Class", description: "Come on Barbie, let's go party!", image: "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80" },
          { name: "Belly Dancing Lessons", description: "Learn the art of belly dancing", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "Bespoke Fragrance Design", description: "Create your own unique signature scent", image: "https://images.unsplash.com/photo-1547881338-796562095856?w=800&q=80" },
          { name: "Betrayers Party", description: "Immersive mystery and betrayal game", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" },
          { name: "Beyonce Dancing", description: "Channel your inner Queen Bey", image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&q=80" },
          { name: "Body Painting", description: "Get creative with this body art experience", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80" },
          { name: "Bollywood Dancing", description: "Vibrant and energetic Indian dance style", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "Boom Battle Bar Package", description: "Games, cocktails, and fun at Boom Battle Bar", image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80" },
          { name: "Bubble Football", description: "Hilarious football in giant inflatable bubbles", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" },
          { name: "Bubble Mayhen", description: "Bubble games designed for hen parties", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" },
          { name: "Butlers in the Buff", description: "Cheeky service from handsome butlers", image: "https://butlersinthebuff.co.uk/wp-content/uploads/2023/05/fun_friendly.jpg.webp" },
          { name: "Bunting Making", description: "Crafty fun creating beautiful bunting", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80" },
          { name: "Burlesque Lessons", description: "The art of tease and performance", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "Can-Can Lessons", description: "High-kicking fun with this classic dance", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "Challenge Point Game", description: "Compete in various fun and creative challenges", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" },
          { name: "Charleston", description: "Learn the moves to this 1920s classic", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "Cheeky Challenge Arena", description: "Fun and games in a cheeky arena setting", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" },
          { name: "Cheerleading Lessons", description: "Pompoms and high energy fun", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "Chicago Dancing", description: "All that jazz with this Chicago-themed class", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "Chicken Rush", description: "Hilarious and competitive group game", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" },
          { name: "Chocolate Making", description: "Indulgent chocolate creation experience", image: "https://images.unsplash.com/photo-1547881338-796562095856?w=800&q=80" },
          { name: "Chocolate Making Masterclass", description: "Master the art of chocolate making", image: "https://images.unsplash.com/photo-1547881338-796562095856?w=800&q=80" },
          { name: "Choose Your Pop Star Dance Class", description: "Pick your favorite pop star and learn their moves", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "City Treasure Hunt", description: "Explore Manchester with this competitive hunt", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" },
          { name: "Clay Shooting", description: "Traditional country sport experience", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80" },
          { name: "Cocktail Making", description: "Learn to mix your favorite cocktails", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Cocktail Mixing & Meal", description: "Cocktail class followed by a delicious meal", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Cocktail Party", description: "Private cocktail party at your accommodation", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Cosy Club", description: "Sophisticated drinks and dining at Cosy Club", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80" },
          { name: "Cuban Cocktail Class With Tapas", description: "Latino flavors and cocktail mixing", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Dirty Dancing", description: "Learn the iconic moves from the movie", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "Disney Dance Class", description: "Magical dance moves to Disney favorites", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
          { name: "DIY Crafting Kit", description: "Creative crafting fun at your own pace", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80" },
          { name: "DIY Vamp That Vulva Kit", description: "Unique and creative crafting kit", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80" },
          { name: "Dodgeball", description: "High-energy competitive group game", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" },
          { name: "Dominatrix Lesson", description: "Intriguing and educational lesson", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" },
          { name: "Trafford Centre Shopping", description: "Massive shopping and entertainment complex", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
          { name: "Football Stadium Tours", description: "Visit Old Trafford or Etihad Stadium", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80" },
          { name: "Northern Quarter", description: "Vintage shopping and street art", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" }
        ]
    },
    bournemouth: {
      name: "Bournemouth",
      region: "Dorset",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-bournemouth--f4900618-20251018100420.jpg",
      overview: "Bournemouth offers seven miles of golden sandy beaches, vibrant nightlife, and beautiful gardens. Perfect for hen parties wanting a classic British seaside experience with beach clubs, water sports, and stunning cliff-top walks.",
      quickFacts: {
        fromLondon: "2 hours by direct train from Waterloo - easy seaside escape",
        bestTime: "May to September for beach activities, year-round for nightlife",
        nightlife: "Buzzing seafront scene! The Old Fire Station, Cameo nightclub, beach bars",
        dining: "Fresh seafood on the pier, West Cliff restaurants, Boscombe food scene",
        beachAccess: "7 miles of award-winning sandy beaches - perfect for beach activities",
        accommodation: "Victorian villas near beach, modern seafront apartments, clifftop houses with sea views",
        priceRange: "£75-£105 per night - affordable seaside luxury",
        activities: "Beach sports, paddleboarding, cliff walks, pier entertainment, shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Waterloo (2 hours)" },
        { icon: Car, text: "M3 and A338 (approx 2.5 hours from London)" },
        { icon: Bus, text: "National Express coaches from London" },
        { icon: Plane, text: "Bournemouth Airport with connections across Europe" }
      ],
      nightlife: [
        { name: "The Old Fire Station", description: "Iconic student and live music venue", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
        { name: "Halo", description: "Vibrant nightclub in a converted church", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "West Beach", description: "Award-winning seafood and brunch by the sand", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Paddleboarding", description: "Explore the coast from the water", image: "https://images.unsplash.com/photo-1517176642928-5803ef5ce6d4?w=800&q=80" },
        { name: "Pier Zip Line", description: "High-speed adventure over the waves", image: "https://images.unsplash.com/photo-1521330784833-ce9a10df3f0d?w=800&q=80" },
        { name: "Beach Club", description: "Relaxed daytime vibes with sea views", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" }
      ]
    },
      york: {
        name: "York",
        region: "North Yorkshire",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-york-uk%2c-m-7d6cc34e-20251018100412.jpg",
        overview: "York is a historic walled city combining medieval charm, world-class museums, and vibrant nightlife. Perfect for hen parties seeking culture, history, and sophisticated entertainment in one of England's most picturesque cities.",
        quickFacts: {
          fromLondon: "2 hours by direct train from King's Cross",
          bestTime: "Year-round charm! Spring for gardens, December for Christmas markets",
          nightlife: "Medieval pubs, Shambles bars, Micklegate nightlife district",
          dining: "Betty's Tea Rooms, riverside restaurants, historic pub dining",
          beachAccess: "No beach but beautiful river walks and city walls",
          accommodation: "Georgian townhouses, medieval properties, modern apartments in city walls",
          priceRange: "£75-£100 per night - great value historic city",
          activities: "York Minster, Shambles shopping, ghost walks, afternoon tea, city walls walk"
        },
        gettingThere: [
          { icon: Train, text: "Direct trains from London King's Cross (2 hours)" },
          { icon: Car, text: "A1(M) motorway (approx 4 hours from London)" },
          { icon: Bus, text: "National Express coaches from London" },
          { icon: Plane, text: "Leeds Bradford Airport is 45 minutes away" }
        ],
        nightlife: [
          { name: "The Shambles Bars", description: "Quirky cocktail bars in medieval buildings", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Micklegate Nightlife", description: "Vibrant area with clubs and late-night bars", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
        ],
        brunch: [
          { name: "Betty's Tea Rooms", description: "World-famous afternoon tea and brunch", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" }
        ],
        activities: [
          { name: "Ghost Walks", description: "Explore Europe's most haunted city at night", image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&q=80" },
          { name: "York Minster", description: "Stunning Gothic cathedral tours", image: "https://images.unsplash.com/photo-1515542641795-85ed383ce282?w=800&q=80" },
          { name: "Punting on the Ouse", description: "Relaxing boat trips through the city", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" }
        ]
      },

      cardiff: {
        name: "Cardiff",
        region: "South Wales",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/cardiff-city-center-photograph%2c-iconic-caf939c9-20251017161252.jpg",
        overview: "Cardiff is Wales's vibrant capital with a stunning castle, Cardiff Bay waterfront, and legendary Welsh hospitality. Perfect for hen parties seeking a compact city with great nightlife, rugby culture, and easy access to Welsh countryside.",
        quickFacts: {
          fromLondon: "2 hours by direct train from Paddington",
          bestTime: "Year-round destination! Spring for Principality Stadium events, summer for Cardiff Bay",
          nightlife: "St Mary Street clubs, Cardiff Bay bars, Roath nightlife",
          dining: "Welsh lamb, Cardiff Bay restaurants, St Mary Street curry houses",
          beachAccess: "Cardiff Bay waterfront, Penarth beach 20 minutes away",
          accommodation: "Victorian terraces, Bay apartments, city centre townhouses",
          priceRange: "£70-£95 per night - excellent value capital city",
          activities: "Cardiff Castle, Principality Stadium tours, Cardiff Bay, shopping arcades"
        },
        gettingThere: [
          { icon: Train, text: "Direct trains from London Paddington (2 hours)" },
          { icon: Car, text: "M4 motorway (approx 2.5 hours from London)" },
          { icon: Bus, text: "Megabus and National Express from London" },
          { icon: Plane, text: "Cardiff Airport with UK and European flights" }
        ],
        nightlife: [
          { name: "St Mary Street", description: "The heart of Cardiff's nightlife with clubs and bars", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "Cardiff Bay", description: "Upscale bars and restaurants with water views", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
        ],
        brunch: [
          { name: "Bill's Cardiff Bay", description: "Vibrant brunch spot overlooking the water", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" }
        ],
        activities: [
          { name: "Cardiff Castle", description: "Historic castle tours in the city centre", image: "https://images.unsplash.com/photo-1515542641795-85ed383ce282?w=800&q=80" },
          { name: "White Water Rafting", description: "Exciting rafting at Cardiff International White Water", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" },
          { name: "Principality Stadium", description: "Behind-the-scenes tours of the iconic stadium", image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&q=80" }
        ]
      },
      newcastle: {
        name: "Newcastle",
        region: "Tyne and Wear",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-newcastle-upo-1cea0fd5-20251019170922.jpg",
        overview: "Newcastle offers legendary nightlife, warm Geordie hospitality, and stunning bridges over the Tyne. Perfect for hen parties seeking big nights out, fantastic value, and one of the UK's most friendly cities.",
        quickFacts: {
          fromLondon: "3 hours by direct train from King's Cross",
          bestTime: "Year-round party city! Summer for Quayside, any time for nightlife",
          nightlife: "Legendary! Diamond Strip, Bigg Market, Quayside bars, digital nightclub",
          dining: "Geordie classics, Quayside restaurants, Grey Street fine dining",
          beachAccess: "Tynemouth beach 20 minutes away - surfing and seaside charm",
          accommodation: "Quayside apartments, city centre townhouses, Victorian terraces",
          priceRange: "£65-£90 per night - best value major UK city",
          activities: "Quayside walks, Tyne Bridge, shopping Eldon Square, Baltic art gallery"
        },
        gettingThere: [
          { icon: Train, text: "Direct trains from London King's Cross (3 hours)" },
          { icon: Car, text: "A1(M) motorway (approx 5 hours from London)" },
          { icon: Bus, text: "National Express coaches from London" },
          { icon: Plane, text: "Newcastle Airport with excellent UK and European connections" }
        ],
        nightlife: [
          { name: "Diamond Strip", description: "Upscale bars and clubs frequented by celebs", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
          { name: "The Quayside", description: "Trendy bars with views of the Tyne Bridge", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
        ],
        brunch: [
          { name: "The Botanist", description: "Stunning rooftop bar and brunch spot", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" }
        ],
        activities: [
          { name: "Tyne Bridge Walk", description: "Iconic walk with stunning river views", image: "https://images.unsplash.com/photo-1515542641795-85ed383ce282?w=800&q=80" },
          { name: "Baltic Art Gallery", description: "Contemporary art in a converted flour mill", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" },
          { name: "Tynemouth Surfing", description: "Learn to surf just 20 mins from city centre", image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&q=80" }
        ]
      },

    liverpool: {
      name: "Liverpool",
      region: "Merseyside",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-liverpool-wat-563898e7-20251019170646.jpg",
      overview: "Liverpool offers iconic waterfront, legendary nightlife, Beatles heritage and vibrant atmosphere.",
      quickFacts: {
        fromLondon: "2.5 hours by direct train from Euston",
        bestTime: "Year-round destination",
        nightlife: "Concert Square, Cavern Quarter, Albert Dock bars",
        dining: "Waterfront restaurants, Baltic Triangle food scene",
        beachAccess: "Crosby Beach 30 minutes away",
        accommodation: "Waterfront apartments, Georgian townhouses",
        priceRange: "£70-£95 per night",
        activities: "Beatles tours, waterfront walks, shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Euston (2.5 hours)" },
        { icon: Car, text: "M6 motorway (approx 4 hours from London)" },
        { icon: Bus, text: "National Express coaches from London" },
        { icon: Plane, text: "Liverpool John Lennon Airport" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    newquay: {
      name: "Newquay",
      region: "Cornwall",
      image: "https://media.istockphoto.com/id/1211485656/photo/surfboard-and-palm-tree-on-beach-background.jpg?s=612x612&w=0&k=20&c=sjiA2xKDegW63sCAOc_b95aE6aDOuFIHUtasbKXFw7M=",
      overview: "Stunning surf beaches, coastal walks and vibrant nightlife in Cornwall's party town.",
      quickFacts: {
        fromLondon: "5 hours by train",
        bestTime: "May to September for beach activities",
        nightlife: "Beach bars, seafront clubs",
        dining: "Fresh seafood, beachside dining",
        beachAccess: "Multiple stunning surf beaches",
        accommodation: "Coastal properties with sea views",
        priceRange: "£75-£100 per night",
        activities: "Surfing, coastal walks, beach clubs"
      },
      gettingThere: [
        { icon: Train, text: "Train from London Paddington (5 hours)" },
        { icon: Car, text: "A30 via Exeter (approx 5 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Newquay Airport" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    bristol: {
      name: "Bristol",
      region: "South West England",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-bristol-harbo-235d69cd-20251019170653.jpg",
      overview: "Creative harbour city with fantastic food scene, nightlife and cultural attractions.",
      quickFacts: {
        fromLondon: "1.5-2 hours by train",
        bestTime: "Year-round destination",
        nightlife: "Harbourside bars, Park Street clubs, Stokes Croft venues",
        dining: "Diverse food scene, harbourside restaurants",
        beachAccess: "Weston-super-Mare 30 minutes away",
        accommodation: "Harbourside apartments, Clifton townhouses",
        priceRange: "£75-£105 per night",
        activities: "Clifton Suspension Bridge, street art tours, harbour walks"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (1.5-2 hours)" },
        { icon: Car, text: "M4 motorway (approx 2.5 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Bristol Airport" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    cambridge: {
      name: "Cambridge",
      region: "Cambridgeshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cambridge-uni-706b7fc1-20251019170701.jpg",
      overview: "Historic university city with beautiful colleges, punting and sophisticated dining.",
      quickFacts: {
        fromLondon: "1 hour by train",
        bestTime: "Year-round, especially spring and summer",
        nightlife: "Traditional pubs, cocktail bars, student nightlife",
        dining: "College dining, riverside restaurants",
        beachAccess: "No beach but River Cam for punting",
        accommodation: "College-area townhouses, modern apartments",
        priceRange: "£80-£110 per night",
        activities: "Punting, college tours, museums"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London King's Cross (1 hour)" },
        { icon: Car, text: "M11 motorway (approx 1.5 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Stansted Airport 30 minutes away" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    oxford: {
      name: "Oxford",
      region: "Oxfordshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-oxford-univer-e05e954c-20251019170708.jpg",
      overview: "Stunning architecture, world-famous university and elegant bars and restaurants.",
      quickFacts: {
        fromLondon: "1 hour by train",
        bestTime: "Year-round destination",
        nightlife: "Traditional pubs, sophisticated cocktail bars",
        dining: "Fine dining, college-area restaurants",
        beachAccess: "No beach but River Thames for walks",
        accommodation: "Historic townhouses, modern properties",
        priceRange: "£85-£115 per night",
        activities: "College tours, museums, river walks"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (1 hour)" },
        { icon: Car, text: "M40 motorway (approx 1.5 hours)" },
        { icon: Bus, text: "Oxford Tube and X90 from London" },
        { icon: Plane, text: "Heathrow Airport 40 minutes away" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    leeds: {
      name: "Leeds",
      region: "West Yorkshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-leeds-city-ce-2b3778ad-20251019170714.jpg",
      overview: "Buzzing northern city with incredible shopping, dining and legendary nightlife.",
      quickFacts: {
        fromLondon: "2.5 hours by train",
        bestTime: "Year-round party city",
        nightlife: "Call Lane bars, Headrow clubs, cocktail venues",
        dining: "Trinity Kitchen, restaurants, street food",
        beachAccess: "No beach but canal walks",
        accommodation: "City centre apartments, Victorian properties",
        priceRange: "£70-£95 per night",
        activities: "Shopping, museums, bar crawls"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London King's Cross (2.5 hours)" },
        { icon: Car, text: "M1 motorway (approx 3.5 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Leeds Bradford Airport" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    nottingham: {
      name: "Nottingham",
      region: "Nottinghamshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-nottingham-ci-c74b1381-20251019170721.jpg",
      overview: "Historic city with Robin Hood heritage, great nightlife and vibrant student scene.",
      quickFacts: {
        fromLondon: "2 hours by train",
        bestTime: "Year-round destination",
        nightlife: "Hockley bars, Market Square clubs",
        dining: "Diverse food scene, historic pubs",
        beachAccess: "No beach but canal walks",
        accommodation: "City centre properties, Lace Market lofts",
        priceRange: "£70-£95 per night",
        activities: "Castle tours, shopping, nightlife"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London St Pancras (2 hours)" },
        { icon: Car, text: "M1 motorway (approx 2.5 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "East Midlands Airport 20 minutes away" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    sheffield: {
      name: "Sheffield",
      region: "South Yorkshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-sheffield-cit-c9093e0d-20251019170737.jpg",
      overview: "Green city surrounded by Peak District with friendly locals and great value.",
      quickFacts: {
        fromLondon: "2.5 hours by train",
        bestTime: "Year-round destination",
        nightlife: "West Street bars, Devonshire Quarter",
        dining: "Independent restaurants, street food",
        beachAccess: "No beach but Peak District nearby",
        accommodation: "City centre properties, student-area houses",
        priceRange: "£65-£90 per night",
        activities: "Peak District walks, shopping, museums"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London St Pancras (2.5 hours)" },
        { icon: Car, text: "M1 motorway (approx 3 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Robin Hood Airport 30 minutes away" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    exeter: {
      name: "Exeter",
      region: "Devon",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-exeter-cathed-62bbdacd-20251019170745.jpg",
      overview: "Cathedral city with Roman history, beautiful quayside and Devon countryside.",
      quickFacts: {
        fromLondon: "2.5 hours by train",
        bestTime: "Year-round, especially spring/summer",
        nightlife: "Quayside bars, student nightlife",
        dining: "Quayside restaurants, Devon produce",
        beachAccess: "Exmouth beach 20 minutes away",
        accommodation: "Georgian properties, modern apartments",
        priceRange: "£75-£100 per night",
        activities: "Cathedral tours, quayside walks, shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (2.5 hours)" },
        { icon: Car, text: "M5 motorway (approx 3 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Exeter Airport" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    chester: {
      name: "Chester",
      region: "Cheshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-chester-city--d1134f79-20251019170752.jpg",
      overview: "Roman walled city with unique shopping rows and riverside walks.",
      quickFacts: {
        fromLondon: "2.5 hours by train",
        bestTime: "Year-round destination",
        nightlife: "Historic pubs, riverside bars",
        dining: "The Rows restaurants, traditional pubs",
        beachAccess: "North Wales coast 30 minutes",
        accommodation: "Historic properties, city walls area",
        priceRange: "£75-£100 per night",
        activities: "City walls walk, shopping Rows, river cruises"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Euston (2.5 hours)" },
        { icon: Car, text: "M6 motorway (approx 3.5 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Liverpool or Manchester airports" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    durham: {
      name: "Durham",
      region: "County Durham",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-durham-cathed-5ca6e566-20251019170759.jpg",
      overview: "UNESCO World Heritage site with stunning cathedral and historic university.",
      quickFacts: {
        fromLondon: "3 hours by train",
        bestTime: "Year-round destination",
        nightlife: "Historic pubs, student bars",
        dining: "Riverside restaurants, traditional dining",
        beachAccess: "Durham Coast 20 minutes",
        accommodation: "City centre properties, riverside houses",
        priceRange: "£70-£95 per night",
        activities: "Cathedral tours, river walks, castle visit"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London King's Cross (3 hours)" },
        { icon: Car, text: "A1(M) motorway (approx 4.5 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Newcastle Airport 30 minutes" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    canterbury: {
      name: "Canterbury",
      region: "Kent",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-canterbury-ca-dca05dc1-20251019170811.jpg",
      overview: "Medieval city with famous cathedral, cobbled streets and charming tea rooms.",
      quickFacts: {
        fromLondon: "1 hour by train",
        bestTime: "Year-round destination",
        nightlife: "Historic pubs, student nightlife",
        dining: "Medieval-style restaurants, afternoon tea",
        beachAccess: "Whitstable beaches 20 minutes",
        accommodation: "Medieval properties, modern apartments",
        priceRange: "£75-£100 per night",
        activities: "Cathedral tours, city walks, shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London St Pancras (1 hour)" },
        { icon: Car, text: "M2/A2 (approx 1.5 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "London airports within 90 minutes" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    blackpool: {
      name: "Blackpool",
      region: "Lancashire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-blackpool-tow-64085652-20251019170818.jpg",
      overview: "Classic seaside resort with famous tower, pleasure beach and lively entertainment.",
      quickFacts: {
        fromLondon: "3 hours by train",
        bestTime: "Summer for beach and illuminations",
        nightlife: "Seafront clubs, pub scene, entertainment venues",
        dining: "Fish and chips, seafront restaurants",
        beachAccess: "Direct beach access",
        accommodation: "Seafront properties, Victorian guesthouses",
        priceRange: "£65-£90 per night",
        activities: "Pleasure Beach, Tower, illuminations"
      },
      gettingThere: [
        { icon: Train, text: "Trains from London Euston via Preston (3 hours)" },
        { icon: Car, text: "M6 motorway (approx 4.5 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Blackpool Airport or Manchester" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    cotswolds: {
      name: "Cotswolds",
      region: "South West England",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cotswolds-cou-81699b79-20251019170824.jpg",
      overview: "Picturesque villages, rolling hills and luxury country retreats.",
      quickFacts: {
        fromLondon: "2 hours by car",
        bestTime: "Spring and summer for countryside",
        nightlife: "Traditional country pubs",
        dining: "Michelin-starred gastropubs, country dining",
        beachAccess: "No beach but stunning countryside",
        accommodation: "Country manor houses, converted barns",
        priceRange: "£85-£120 per night",
        activities: "Village walks, spa treatments, countryside tours"
      },
      gettingThere: [
        { icon: Train, text: "Train to Cheltenham/Moreton-in-Marsh then taxi" },
        { icon: Car, text: "M40/A40 (approx 2 hours)" },
        { icon: Bus, text: "Limited coach services" },
        { icon: Plane, text: "Birmingham or Bristol airports" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    margate: {
      name: "Margate",
      region: "Kent",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-margate-seafr-9f3138d3-20251019170830.jpg",
      overview: "Trendy seaside town with sandy beaches, vintage shops and creative scene.",
      quickFacts: {
        fromLondon: "1.5 hours by train",
        bestTime: "Summer for beach, year-round for arts",
        nightlife: "Beach bars, vintage pubs, independent venues",
        dining: "Seafront restaurants, creative dining scene",
        beachAccess: "Direct beach access",
        accommodation: "Seafront apartments, Victorian properties",
        priceRange: "£75-£100 per night",
        activities: "Turner Contemporary, beach, vintage shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London St Pancras (1.5 hours)" },
        { icon: Car, text: "M2/A299 (approx 2 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "London airports within 90 minutes" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    harrogate: {
      name: "Harrogate",
      region: "North Yorkshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-harrogate-tow-ef6ad8e6-20251019170838.jpg",
      overview: "Elegant spa town with beautiful gardens, boutique shops and afternoon tea.",
      quickFacts: {
        fromLondon: "3 hours by train",
        bestTime: "Year-round, especially spring",
        nightlife: "Sophisticated bars, traditional pubs",
        dining: "Fine dining, tea rooms, gastropubs",
        beachAccess: "No beach but spa town heritage",
        accommodation: "Victorian spa properties, boutique houses",
        priceRange: "£80-£110 per night",
        activities: "Spa treatments, gardens, afternoon tea"
      },
      gettingThere: [
        { icon: Train, text: "Trains from London King's Cross via Leeds (3 hours)" },
        { icon: Car, text: "A1(M) motorway (approx 3.5 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Leeds Bradford Airport 20 minutes" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    "st-ives": {
      name: "St Ives",
      region: "Cornwall",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-st-ives-harbo-608d18b9-20251019170846.jpg",
      overview: "Stunning harbour town with golden beaches, art galleries and seafood restaurants.",
      quickFacts: {
        fromLondon: "5.5 hours by train",
        bestTime: "Summer for beaches, year-round for arts",
        nightlife: "Beach bars, harbour pubs",
        dining: "Fresh seafood, harbourside restaurants",
        beachAccess: "Multiple golden beaches",
        accommodation: "Harbour properties, coastal houses",
        priceRange: "£80-£110 per night",
        activities: "Beaches, Tate St Ives, coastal walks"
      },
      gettingThere: [
        { icon: Train, text: "Train from London Paddington to St Ives (5.5 hours)" },
        { icon: Car, text: "A30 via Exeter (approx 5.5 hours)" },
        { icon: Bus, text: "Limited coach services" },
        { icon: Plane, text: "Newquay Airport 40 minutes" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    windsor: {
      name: "Windsor",
      region: "Berkshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-windsor-castl-304247da-20251019170853.jpg",
      overview: "Royal town with historic castle, Thames riverside and elegant hotels.",
      quickFacts: {
        fromLondon: "30 minutes by train",
        bestTime: "Year-round destination",
        nightlife: "Riverside bars, traditional pubs",
        dining: "Fine dining, riverside restaurants",
        beachAccess: "No beach but River Thames walks",
        accommodation: "Georgian properties, riverside houses",
        priceRange: "£85-£120 per night",
        activities: "Windsor Castle, Thames walks, Eton visit"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Waterloo/Paddington (30 mins)" },
        { icon: Car, text: "M4/M25 (approx 1 hour)" },
        { icon: Bus, text: "Green Line coaches from London" },
        { icon: Plane, text: "Heathrow Airport 15 minutes" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    "stratford-upon-avon": {
      name: "Stratford-upon-Avon",
      region: "Warwickshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-stratford-upo-660c5853-20251019170900.jpg",
      overview: "Shakespeare's birthplace with Tudor buildings, theatre and riverside walks.",
      quickFacts: {
        fromLondon: "2.5 hours by train",
        bestTime: "Year-round, especially for theatre",
        nightlife: "Traditional pubs, riverside bars",
        dining: "Historic restaurants, theatre dining",
        beachAccess: "No beach but River Avon walks",
        accommodation: "Tudor-style properties, riverside houses",
        priceRange: "£80-£110 per night",
        activities: "Shakespeare attractions, theatre, river walks"
      },
      gettingThere: [
        { icon: Train, text: "Trains from London Marylebone (2.5 hours)" },
        { icon: Car, text: "M40 motorway (approx 2 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Birmingham Airport 40 minutes" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    plymouth: {
      name: "Plymouth",
      region: "Devon",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-plymouth-wate-a14909bf-20251019170907.jpg",
      overview: "Historic waterfront city with maritime heritage and stunning coastal views.",
      quickFacts: {
        fromLondon: "3.5 hours by train",
        bestTime: "Summer for waterfront, year-round for city",
        nightlife: "Barbican bars, student nightlife, waterfront clubs",
        dining: "Fresh seafood, Barbican restaurants",
        beachAccess: "Plymouth Hoe and nearby beaches",
        accommodation: "Waterfront properties, city apartments",
        priceRange: "£75-£100 per night",
        activities: "Barbican walks, National Marine Aquarium, Dartmoor"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (3.5 hours)" },
        { icon: Car, text: "M5/A38 (approx 4 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Exeter Airport 50 minutes" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
    cheltenham: {
      name: "Cheltenham",
      region: "Gloucestershire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cheltenham-to-be3b5273-20251019170915.jpg",
      overview: "Regency spa town famous for festivals, horse racing and elegant architecture.",
      quickFacts: {
        fromLondon: "2 hours by train",
        bestTime: "March for racing festival, year-round for spa",
        nightlife: "Sophisticated bars, festival venues",
        dining: "Fine dining, Regency tea rooms, gastropubs",
        beachAccess: "No beach but Cotswolds countryside nearby",
        accommodation: "Regency townhouses, spa properties",
        priceRange: "£80-£110 per night",
        activities: "Racecourse, spa treatments, Cotswolds tours"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (2 hours)" },
        { icon: Car, text: "M4/M5 (approx 2 hours)" },
        { icon: Bus, text: "National Express coaches" },
        { icon: Plane, text: "Birmingham or Bristol airports" }
      ],
      nightlife: [],
      brunch: [],
      activities: []
    },
      birmingham: {
        name: "Birmingham",
        region: "West Midlands",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-birmingham-ci-2022de45-20251019170730.jpg",
        overview: "Britain's second city with world-class shopping, diverse dining and buzzing nightlife.",
        quickFacts: {
          fromLondon: "1.5 hours by train",
          bestTime: "Year-round destination",
          nightlife: "Broad Street clubs, Digbeth venues, cocktail bars",
          dining: "Balti Triangle, Michelin dining, international food",
          beachAccess: "No beach but canal network",
          accommodation: "City centre apartments, Victorian properties",
          priceRange: "£70-£95 per night",
          activities: "Shopping Bullring, museums, canal walks"
        },
        gettingThere: [
          { icon: Train, text: "Direct trains from London Euston (1.5 hours)" },
          { icon: Car, text: "M1/M6 (approx 2 hours)" },
          { icon: Bus, text: "National Express coaches" },
          { icon: Plane, text: "Birmingham Airport" }
        ],
        nightlife: [],
        brunch: [],
        activities: []
      },
      cornwall: {
        name: "Cornwall",
        region: "South West England",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
        overview: "Cornwall is England's ultimate coastal escape, offering stunning beaches, dramatic cliffs, and charming fishing villages. Perfect for group getaways seeking surfing, seafood, and spectacular scenery.",
        quickFacts: {
          fromLondon: "5-6 hours by train or car",
          bestTime: "May to September for beaches and outdoor activities",
          nightlife: "Coastal pubs, beach bars, seafront restaurants",
          dining: "Fresh seafood, Cornish pasties, award-winning restaurants",
          beachAccess: "Hundreds of stunning beaches including Fistral, Porthcurno, St Ives",
          accommodation: "Coastal cottages, beachfront properties, luxury farmhouses",
          priceRange: "£80-£120 per night",
          activities: "Surfing, coastal walks, Eden Project, boat trips, rock pooling"
        },
        gettingThere: [
          { icon: Train, text: "Trains from London Paddington to Truro/Penzance (5-6 hours)" },
          { icon: Car, text: "A30 via Exeter (approx 5-6 hours)" },
          { icon: Bus, text: "National Express coaches" },
          { icon: Plane, text: "Newquay Airport" }
        ],
        nightlife: [],
        brunch: [],
        activities: []
      },
      devon: {
        name: "Devon",
        region: "South West England",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        overview: "Devon combines dramatic coastlines, rolling countryside, and charming market towns. From the rugged Dartmoor to the English Riviera, it's perfect for groups seeking natural beauty and outdoor adventures.",
        quickFacts: {
          fromLondon: "3-4 hours by train or car",
          bestTime: "Year-round, best May to September for beaches",
          nightlife: "Traditional pubs, coastal bars, Torquay nightlife",
          dining: "Cream teas, fresh seafood, gastropubs",
          beachAccess: "Beautiful beaches on both north and south coasts",
          accommodation: "Coastal properties, Dartmoor lodges, country estates",
          priceRange: "£75-£110 per night",
          activities: "Dartmoor hiking, coastal walks, surfing, kayaking, cream teas"
        },
        gettingThere: [
          { icon: Train, text: "Trains from London Paddington to Exeter (2.5-3 hours)" },
          { icon: Car, text: "M5 motorway (approx 3-4 hours)" },
          { icon: Bus, text: "National Express coaches" },
          { icon: Plane, text: "Exeter Airport" }
        ],
        nightlife: [],
        brunch: [],
        activities: []
      },
      yorkshire: {
        name: "Yorkshire",
        region: "Northern England",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        overview: "Yorkshire offers dramatic moors, historic cities, and warm northern hospitality. From the Yorkshire Dales to the North York Moors, it's perfect for groups seeking countryside escapes and city breaks.",
        quickFacts: {
          fromLondon: "2-3 hours by train",
          bestTime: "Year-round, spring and autumn for walking",
          nightlife: "York, Leeds, and Sheffield city nightlife",
          dining: "Traditional pubs, Yorkshire puddings, local produce",
          beachAccess: "Yorkshire coast with Whitby, Scarborough, Robin Hood's Bay",
          accommodation: "Country houses, farmhouses, Yorkshire Dales lodges",
          priceRange: "£70-£100 per night",
          activities: "Walking, castle visits, steam railways, coastal towns"
        },
        gettingThere: [
          { icon: Train, text: "Trains from London King's Cross to York (2 hours)" },
          { icon: Car, text: "A1(M) motorway (approx 3-4 hours)" },
          { icon: Bus, text: "National Express coaches" },
          { icon: Plane, text: "Leeds Bradford or Robin Hood Airport" }
        ],
        nightlife: [],
        brunch: [],
        activities: []
      },
      norfolk: {
        name: "Norfolk",
        region: "East Anglia",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        overview: "Norfolk offers vast beaches, the unique Norfolk Broads, and charming coastal villages. Perfect for groups seeking peaceful countryside, birdwatching, and traditional seaside charm.",
        quickFacts: {
          fromLondon: "2-3 hours by train or car",
          bestTime: "Spring to autumn for beaches and Broads",
          nightlife: "Norwich city nightlife, coastal pubs",
          dining: "Fresh seafood, Cromer crab, local produce",
          beachAccess: "Miles of sandy beaches including Holkham, Wells-next-the-Sea",
          accommodation: "Coastal cottages, Broads boats, country houses",
          priceRange: "£70-£100 per night",
          activities: "Norfolk Broads boating, birdwatching, beach walks, seal watching"
        },
        gettingThere: [
          { icon: Train, text: "Trains from London Liverpool Street to Norwich (2 hours)" },
          { icon: Car, text: "A11 via Cambridge (approx 2.5 hours)" },
          { icon: Bus, text: "National Express coaches" },
          { icon: Plane, text: "Norwich Airport or Stansted" }
        ],
        nightlife: [],
        brunch: [],
        activities: []
      },
      suffolk: {
        name: "Suffolk",
        region: "East Anglia",
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
        overview: "Suffolk combines charming medieval villages, sandy beaches, and gentle countryside. From Southwold to Aldeburgh, it's perfect for groups seeking culture, coastline, and relaxation.",
        quickFacts: {
          fromLondon: "1.5-2.5 hours by train or car",
          bestTime: "Spring to autumn for beaches and festivals",
          nightlife: "Ipswich nightlife, coastal pubs, beach bars",
          dining: "Fresh seafood, Aldeburgh fish & chips, local produce",
          beachAccess: "Beautiful beaches at Southwold, Aldeburgh, Felixstowe",
          accommodation: "Coastal cottages, country houses, converted barns",
          priceRange: "£70-£100 per night",
          activities: "Beach walks, Southwold pier, Snape Maltings, birdwatching"
        },
        gettingThere: [
          { icon: Train, text: "Trains from London Liverpool Street to Ipswich (1.5 hours)" },
          { icon: Car, text: "A12 via Colchester (approx 2 hours)" },
          { icon: Bus, text: "National Express coaches" },
          { icon: Plane, text: "Stansted Airport" }
        ],
        nightlife: [],
        brunch: [],
        activities: []
      },
      sussex: {
        name: "Sussex",
        region: "South East England",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        overview: "Sussex offers the iconic South Downs, historic towns, and vibrant coastal resorts. From the lanes of Brighton to the cliffs of Beachy Head, it's perfect for groups seeking beach life and countryside.",
        quickFacts: {
          fromLondon: "1-2 hours by train or car",
          bestTime: "Year-round, especially spring and summer for beaches",
          nightlife: "Brighton legendary nightlife, Eastbourne, Hastings",
          dining: "Seafood, Brighton restaurants, gastropubs",
          beachAccess: "Brighton, Eastbourne, Camber Sands, West Wittering",
          accommodation: "Regency townhouses, coastal properties, South Downs lodges",
          priceRange: "£75-£110 per night",
          activities: "South Downs walks, Brighton shopping, castle visits, vineyards"
        },
        gettingThere: [
          { icon: Train, text: "Trains from London Victoria/London Bridge (1 hour to Brighton)" },
          { icon: Car, text: "M23/A23 (approx 1.5 hours)" },
          { icon: Bus, text: "National Express and Megabus" },
          { icon: Plane, text: "Gatwick Airport nearby" }
        ],
        nightlife: [],
        brunch: [],
        activities: []
      },
      "peak-district": {
        name: "Peak District",
        region: "Central England",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        overview: "The Peak District is England's first national park, offering dramatic landscapes, charming villages, and outdoor adventures. Perfect for groups seeking walking, cycling, and countryside retreats.",
        quickFacts: {
          fromLondon: "2.5-3 hours by train or car",
          bestTime: "Year-round, spring and autumn for walking",
          nightlife: "Traditional country pubs, Buxton and Bakewell",
          dining: "Traditional pubs, Bakewell pudding, local produce",
          beachAccess: "No beaches but stunning reservoirs and rivers",
          accommodation: "Country houses, converted barns, stone cottages",
          priceRange: "£75-£105 per night",
          activities: "Walking, cycling, caving, rock climbing, spa towns"
        },
        gettingThere: [
          { icon: Train, text: "Trains from London St Pancras to Sheffield/Manchester" },
          { icon: Car, text: "M1 motorway (approx 3 hours)" },
          { icon: Bus, text: "National Express coaches" },
          { icon: Plane, text: "Manchester or East Midlands airports" }
        ],
        nightlife: [],
        brunch: [],
        activities: []
      },
    };

  const destination = destinationsData[slug] || {
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    region: "UK",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
    overview: `Discover luxury group accommodation in ${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}. Perfect for hen parties, celebrations, and group getaways with stunning houses featuring hot tubs, pools, and exceptional amenities.`,
    quickFacts: {
      fromLondon: "Easily accessible from London",
      bestTime: "Year-round destination",
      nightlife: "Vibrant bars, clubs, and entertainment",
      dining: "Excellent restaurants and dining options",
      beachAccess: "Check specific location for beach access",
      accommodation: "Luxury group houses with hot tubs and modern amenities",
      priceRange: "£70-£120 per night for group accommodation",
      activities: "Shopping, dining, entertainment, and local attractions"
    },
    gettingThere: [
      { icon: Train, text: "Accessible by train from major UK cities" },
      { icon: Car, text: "Easy access via motorways" },
      { icon: Bus, text: "Regular coach services available" },
      { icon: Plane, text: "Nearest airports provide good connections" }
    ],
    nightlife: [],
    brunch: [],
    activities: []
  };

  // Location-specific properties data from original
  const propertiesByLocation: Record<string, any[]> = {
    london: [
      {
        id: "1",
        title: "The Kensington Residence",
        location: "London, Greater London",
        sleeps: 20,
        bedrooms: 10,
        priceFrom: 120,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-82828771-20251019163638.jpg",
        features: ["Hot Tub", "Cinema Room", "Roof Terrace"],
        slug: "kensington-residence",
      },
      {
        id: "2",
        title: "Shoreditch Loft House",
        location: "London, Greater London",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 105,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-an-i-60588db0-20251019163645.jpg",
        features: ["Games Room", "City Views", "Hot Tub"],
        slug: "shoreditch-loft",
      },
      {
        id: "3",
        title: "Chelsea Manor House",
        location: "London, Greater London",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 98,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-an-e-053848fb-20251019163658.jpg",
        features: ["Garden", "Hot Tub", "Parking"],
        slug: "chelsea-manor",
      },
    ],
    brighton: [
      {
        id: "1",
        title: "The Brighton Manor",
        location: "Brighton, East Sussex",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 89,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-gr-18e00f17-20251019163902.jpg",
        features: ["Hot Tub", "Pool", "Games Room"],
        slug: "brighton-manor",
      },
      {
        id: "2",
        title: "Brighton Seafront Villa",
        location: "Brighton, East Sussex",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 79,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-st-87e31c86-20251019163913.jpg",
        features: ["Sea View", "Hot Tub", "BBQ"],
        slug: "brighton-villa",
      },
      {
        id: "3",
        title: "The Lanes Townhouse",
        location: "Brighton, East Sussex",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 69,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-an-e-89ca9be8-20251019163920.jpg",
        features: ["City Centre", "Roof Terrace"],
        slug: "lanes-townhouse",
      },
    ],
    bath: [
      {
        id: "1",
        title: "Georgian Spa House",
        location: "Bath, Somerset",
        sleeps: 18,
        bedrooms: 9,
        priceFrom: 110,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-bath-uk-city-79258396-20251018100352.jpg",
        features: ["Hot Tub", "Period Features", "Garden"],
        slug: "georgian-spa-house",
      },
      {
        id: "2",
        title: "Royal Crescent Villa",
        location: "Bath, Somerset",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 95,
        image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
        features: ["City Views", "Hot Tub", "Games Room"],
        slug: "royal-crescent-villa",
      },
      {
        id: "3",
        title: "Riverside Bath House",
        location: "Bath, Somerset",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 85,
        image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80",
        features: ["River Views", "Hot Tub", "Parking"],
        slug: "riverside-bath-house",
      },
    ],
    manchester: [
      {
        id: "1",
        title: "Northern Quarter Loft",
        location: "Manchester, Greater Manchester",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 85,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-manchester-u-fdc0037c-20251018100402.jpg",
        features: ["Hot Tub", "Industrial Chic", "Roof Terrace"],
        slug: "northern-quarter-loft",
      },
      {
        id: "2",
        title: "Spinningfields Penthouse",
        location: "Manchester, Greater Manchester",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 95,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        features: ["City Views", "Games Room", "Hot Tub"],
        slug: "spinningfields-penthouse",
      },
      {
        id: "3",
        title: "Deansgate Warehouse",
        location: "Manchester, Greater Manchester",
        sleeps: 20,
        bedrooms: 10,
        priceFrom: 75,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        features: ["Hot Tub", "Cinema Room", "Bar Area"],
        slug: "deansgate-warehouse",
      },
    ],
    "lake-district": [
      {
        id: "1",
        title: "Windermere Lakeside Lodge",
        location: "Lake District, Cumbria",
        sleeps: 18,
        bedrooms: 9,
        priceFrom: 110,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-lake-district-51198f8c-20251019170636.jpg",
        features: ["Hot Tub", "Lake Views", "Sauna"],
        slug: "windermere-lakeside-lodge",
      },
      {
        id: "2",
        title: "Ambleside Mountain Retreat",
        location: "Lake District, Cumbria",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 95,
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
        features: ["Hot Tub", "Mountain Views", "Games Room"],
        slug: "ambleside-mountain-retreat",
      },
      {
        id: "3",
        title: "Keswick Country House",
        location: "Lake District, Cumbria",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 85,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
        features: ["Hot Tub", "Garden", "Log Fire"],
        slug: "keswick-country-house",
      },
    ],
    bournemouth: [
      {
        id: "1",
        title: "Bournemouth Beach House",
        location: "Bournemouth, Dorset",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 95,
        image: "https://images.unsplash.com/photo-1581974206179-4cf0049a2d90?w=800&q=80",
        features: ["Hot Tub", "Sea Views", "Beach Access"],
        slug: "bournemouth-beach-house",
      },
      {
        id: "2",
        title: "Clifftop Villa",
        location: "Bournemouth, Dorset",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 85,
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
        features: ["Hot Tub", "Pool", "Garden"],
        slug: "clifftop-villa",
      },
      {
        id: "3",
        title: "Sandbanks Retreat",
        location: "Bournemouth, Dorset",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 79,
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        features: ["Beach Access", "Hot Tub", "BBQ"],
        slug: "sandbanks-retreat",
      },
    ],
    york: [
      {
        id: "1",
        title: "York Minster House",
        location: "York, North Yorkshire",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 89,
        image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
        features: ["Hot Tub", "Historic Features", "Garden"],
        slug: "york-minster-house",
      },
      {
        id: "2",
        title: "Shambles Georgian Townhouse",
        location: "York, North Yorkshire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 82,
        image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80",
        features: ["City Centre", "Hot Tub", "Period Features"],
        slug: "shambles-georgian-townhouse",
      },
      {
        id: "3",
        title: "Riverside York Retreat",
        location: "York, North Yorkshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 75,
        image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80",
        features: ["River Views", "Hot Tub", "Games Room"],
        slug: "riverside-york-retreat",
      },
    ],
    cardiff: [
      {
        id: "1",
        title: "Cardiff Bay Penthouse",
        location: "Cardiff, South Wales",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 85,
        image: "https://images.unsplash.com/photo-1590698933947-a202b069a861?w=800&q=80",
        features: ["Hot Tub", "Bay Views", "Roof Terrace"],
        slug: "cardiff-bay-penthouse",
      },
      {
        id: "2",
        title: "Castle Quarter House",
        location: "Cardiff, South Wales",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 79,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/cardiff-city-center-photograph%2c-iconic-caf939c9-20251017161252.jpg",
        features: ["City Centre", "Hot Tub", "Games Room"],
        slug: "castle-quarter-house",
      },
      {
        id: "3",
        title: "Victorian Cardiff Terrace",
        location: "Cardiff, South Wales",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 69,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
        features: ["Hot Tub", "Garden", "Parking"],
        slug: "victorian-cardiff-terrace",
      },
    ],
    newcastle: [
      {
        id: "1",
        title: "Quayside Warehouse Loft",
        location: "Newcastle, Tyne and Wear",
        sleeps: 18,
        bedrooms: 9,
        priceFrom: 79,
        image: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&q=80",
        features: ["Hot Tub", "River Views", "Industrial Style"],
        slug: "quayside-warehouse-loft",
      },
      {
        id: "2",
        title: "Grey Street Townhouse",
        location: "Newcastle, Tyne and Wear",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 72,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
        features: ["City Centre", "Hot Tub", "Period Features"],
        slug: "grey-street-townhouse",
      },
      {
        id: "3",
        title: "Jesmond Party House",
        location: "Newcastle, Tyne and Wear",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 65,
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
        features: ["Hot Tub", "Games Room", "Garden"],
        slug: "jesmond-party-house",
      },
    ],
  };

  const properties = propertiesByLocation[slug] || propertiesByLocation.brighton || [];

  const faqs = [
    {
      question: `What's the best time to visit ${destination.name} for a group celebration?`,
      answer: destination.quickFacts.bestTime,
    },
    {
      question: `How do I get to ${destination.name} from London?`,
      answer: destination.quickFacts.fromLondon,
    },
    {
      question: `What's the nightlife like in ${destination.name}?`,
      answer: destination.quickFacts.nightlife,
    },
    {
      question: `What activities are available for groups in ${destination.name}?`,
      answer: destination.quickFacts.activities,
    },
    {
      question: `How much does group accommodation in ${destination.name} cost?`,
      answer: `Group accommodation in ${destination.name} typically costs ${destination.quickFacts.priceRange}. This is often split between guests, making it excellent value per person.`,
    },
    {
      question: "How do I book a property?",
      answer: "Simply browse our properties, select your dates, and submit an enquiry. Our team will respond within 24 hours with availability and booking details. You'll book directly with the property owner.",
    },
  ];

  return (
    <>
      <UKServiceSchema 
        type="itemList" 
        data={{
          items: properties
        }} 
      />
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Destinations", url: "/destinations" },
            { name: destination.name, url: `/destinations/${slug}` }
          ]
        }}
      />
      <UKServiceSchema 
        type="faq" 
        data={{ faqs }} 
      />

        {/* Hero */}
        <div className="relative h-[500px] mt-20 overflow-hidden bg-black">
          <Image 
            src={destination.image} 
            alt={destination.name} 
            fill 
            className="object-cover" 
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20"></div>
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="max-w-[1200px] mx-auto px-6 pb-12">
              <h1 className="text-white mb-2 drop-shadow-lg" style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                {destination.name}
              </h1>
              <div className="flex items-center gap-2 text-white text-xl mb-6 drop-shadow-md" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                <MapPin className="w-5 h-5 drop-shadow-md" />
                <span>{destination.region}</span>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-8 py-4 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  <Link href="/contact">Check Availability</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-8 py-4 font-medium bg-white/10 border-white text-white hover:bg-white hover:text-black"
                >
                  <Link href="/properties">Browse Properties</Link>
                </Button>
              </div>
              <TrustBadges variant="compact" className="text-white/90" />
            </div>
          </div>
        </div>

        {/* SEO Content Section with Internal Links */}
        <section className="py-12 bg-white border-b border-[var(--color-bg-secondary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-4">
                Looking for the perfect <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen party houses in {destination.name}</Link>? 
                Group Escape Houses offers stunning <Link href="/large-group-accommodation" className="text-[var(--color-accent-sage)] hover:underline font-medium">large group accommodation</Link> perfect 
                for celebrations. Our <Link href="/large-holiday-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">large holiday houses</Link> feature 
                amazing amenities including <Link href="/houses-with-hot-tubs" className="text-[var(--color-accent-sage)] hover:underline font-medium">hot tubs</Link>, swimming pools, 
                and <Link href="/houses-with-games-rooms" className="text-[var(--color-accent-sage)] hover:underline font-medium">games rooms</Link> to make your weekend unforgettable.
              </p>
              <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                Whether you're planning a <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen weekend</Link>, <Link href="/special-celebrations" className="text-[var(--color-accent-sage)] hover:underline font-medium">special celebration</Link>, 
                or <Link href="/weekend-breaks" className="text-[var(--color-accent-sage)] hover:underline font-medium">weekend break</Link>, {destination.name} combines the 
                perfect location with our <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">luxury houses</Link>. 
                Explore our <Link href="/experiences" className="text-[var(--color-accent-sage)] hover:underline font-medium">experiences</Link> to add cocktail classes, spa treatments, 
                and more. Also discover other popular destinations including <Link href="/destinations/lake-district" className="text-[var(--color-accent-sage)] hover:underline font-medium">the Lake District</Link>, <Link href="/destinations/cotswolds" className="text-[var(--color-accent-sage)] hover:underline font-medium">Cotswolds</Link>, 
                and <Link href="/destinations" className="text-[var(--color-accent-sage)] hover:underline font-medium">more UK group accommodation destinations</Link>.
              </p>
            </div>
            
            {/* Category Links Section */}
            <div className="mt-8 pt-8 border-t border-[var(--color-bg-secondary)]">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Browse by Property Type</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/large-group-accommodation" className="inline-flex items-center px-4 py-2 bg-[var(--color-bg-primary)] rounded-full text-sm font-medium hover:bg-[var(--color-accent-sage)] hover:text-white transition-colors">
                  Large Group Accommodation
                </Link>
                <Link href="/large-holiday-houses" className="inline-flex items-center px-4 py-2 bg-[var(--color-bg-primary)] rounded-full text-sm font-medium hover:bg-[var(--color-accent-sage)] hover:text-white transition-colors">
                  Large Holiday Houses
                </Link>
                <Link href="/houses-with-hot-tubs" className="inline-flex items-center px-4 py-2 bg-[var(--color-bg-primary)] rounded-full text-sm font-medium hover:bg-[var(--color-accent-sage)] hover:text-white transition-colors">
                  Houses with Hot Tubs
                </Link>
                <Link href="/houses-with-games-rooms" className="inline-flex items-center px-4 py-2 bg-[var(--color-bg-primary)] rounded-full text-sm font-medium hover:bg-[var(--color-accent-sage)] hover:text-white transition-colors">
                  Houses with Games Rooms
                </Link>
                <Link href="/hen-party-houses" className="inline-flex items-center px-4 py-2 bg-[var(--color-bg-primary)] rounded-full text-sm font-medium hover:bg-[var(--color-accent-sage)] hover:text-white transition-colors">
                  Hen Party Houses
                </Link>
              </div>
            </div>
          </div>
        </section>

      {/* Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Why {destination.name}?
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
                {destination.overview}
              </p>
              
              <div className="space-y-4 mt-6">
                <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                  {destination.name} stands out as one of the UK's premier destinations for <Link href="/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen party celebrations</Link>. 
                  Our carefully selected <Link href="/properties" className="text-[var(--color-accent-sage)] hover:underline font-medium">luxury properties</Link> in the area provide the perfect base for your celebration, 
                  featuring essential amenities like <Link href="/features/hot-tub" className="text-[var(--color-accent-sage)] hover:underline font-medium">private hot tubs</Link>, <Link href="/features/games-room" className="text-[var(--color-accent-sage)] hover:underline font-medium">games rooms</Link>, 
                  and spacious living areas designed for group entertainment.
                </p>
                
                <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                  Beyond the accommodation, {destination.name} offers an incredible range of activities to enhance your <Link href="/weekend-breaks" className="text-[var(--color-accent-sage)] hover:underline font-medium">weekend break</Link>. 
                  From world-class dining and vibrant nightlife to unique <Link href="/experiences" className="text-[var(--color-accent-sage)] hover:underline font-medium">experiences</Link> like cocktail masterclasses, spa treatments, 
                  and private chef dinners, there's something to suit every group's taste and budget.
                </p>
                
                <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                  Looking for other celebration options? Explore our <Link href="/house-styles/party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">party houses</Link> for 
                  lively group gatherings, <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">luxury houses</Link> for upscale celebrations, 
                  or browse our collection of <Link href="/destinations" className="text-[var(--color-accent-sage)] hover:underline font-medium">UK destinations</Link>.
                </p>
                
                <div className="mt-6 pt-6 border-t border-[var(--color-bg-secondary)]">
                  <h4 className="text-lg font-semibold mb-3 text-[var(--color-text-primary)]">Helpful Travel Resources</h4>
                  <div className="flex flex-wrap gap-4">
                    <a href="https://www.visitbritain.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-sage)] hover:underline font-medium inline-flex items-center gap-1">
                      Visit Britain Official Tourism
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                    {slug === "brighton" && (
                      <a href="https://www.visitbrighton.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-sage)] hover:underline font-medium inline-flex items-center gap-1">
                        Visit Brighton & Hove
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                    {slug === "london" && (
                      <a href="https://www.visitlondon.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-sage)] hover:underline font-medium inline-flex items-center gap-1">
                        Visit London Official
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                    {slug === "bath" && (
                      <a href="https://visitbath.co.uk" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-sage)] hover:underline font-medium inline-flex items-center gap-1">
                        Visit Bath Official
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-[var(--color-accent-pink)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">From London</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.fromLondon}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Best Time to Visit</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.bestTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Moon className="w-5 h-5 text-[var(--color-accent-sage)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Nightlife</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.nightlife}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Dining</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.dining}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Waves className="w-5 h-5 text-[var(--color-accent-pink)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Beach Access</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.beachAccess}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-[var(--color-accent-sage)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Accommodation</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.accommodation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PoundSterling className="w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Price Range</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.priceRange}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PartyPopper className="w-5 h-5 text-[var(--color-accent-pink)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Activities</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.activities}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting There */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Navigation className="w-5 h-5 text-[var(--color-accent-pink)]" />
            <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Getting There
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destination.gettingThere.map((option: any, index: number) => {
              const Icon = option.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-accent-sage)]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[var(--color-accent-sage)]" />
                  </div>
                  <p className="text-[var(--color-neutral-dark)] flex-1">{option.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nightlife */}
      {destination.nightlife && destination.nightlife.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <Moon className="w-5 h-5 text-[var(--color-accent-sage)]" />
              <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Top Nightlife Spots
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.nightlife.map((venue: any, index: number) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                  {venue.image && !imageErrors[`nightlife-${index}`] ? (
                    <div className="relative h-48 overflow-hidden bg-[var(--color-bg-secondary)]">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={() => handleImageError(`nightlife-${index}`)}
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 overflow-hidden bg-[var(--color-bg-secondary)] flex items-center justify-center">
                      <Moon className="w-16 h-16 text-[var(--color-accent-sage)] opacity-30" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="font-semibold mb-2 text-[var(--color-text-primary)]">{venue.name}</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{venue.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brunch & Dining */}
      {destination.brunch && destination.brunch.length > 0 && (
        <section className="py-16 bg-[var(--color-bg-secondary)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <UtensilsCrossed className="w-5 h-5 text-[var(--color-accent-gold)]" />
              <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Best Brunch & Dining
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.brunch.map((venue: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  {!imageErrors[`brunch-${index}`] ? (
                    <div className="relative h-48 overflow-hidden bg-[var(--color-bg-primary)]">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={() => handleImageError(`brunch-${index}`)}
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 overflow-hidden bg-[var(--color-bg-primary)] flex items-center justify-center">
                      <UtensilsCrossed className="w-16 h-16 text-[var(--color-accent-gold)] opacity-30" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="font-semibold mb-2 text-[var(--color-text-primary)]">{venue.name}</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{venue.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Activities */}
      {destination.activities && destination.activities.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-5 h-5 text-[var(--color-accent-pink)]" />
              <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Things to Do
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.activities.map((activity: any, index: number) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                  {activity.image && !imageErrors[`activity-${index}`] ? (
                    <div className="relative h-48 overflow-hidden bg-[var(--color-bg-secondary)]">
                      <Image
                        src={activity.image}
                        alt={activity.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={() => handleImageError(`activity-${index}`)}
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 overflow-hidden bg-[var(--color-bg-secondary)] flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-[var(--color-accent-pink)] opacity-30" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="font-semibold mb-2 text-[var(--color-text-primary)]">{activity.name}</p>
                    {activity.description && (
                      <p className="text-sm text-[var(--color-neutral-dark)]">{activity.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Add to Your Stay - Experiences */}
      <AddExperiencesToStay />

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Everything you need to know about visiting {destination.name}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[var(--color-bg-primary)] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <span className="font-semibold text-[var(--color-text-primary)] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties in this area */}
      <section className="py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Hen Party Houses in {destination.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/contact">Check Availability and Book</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}