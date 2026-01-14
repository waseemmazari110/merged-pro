import { ChefHat, Utensils, Paintbrush, Wine, Palette, Mic2, Sparkles, Camera, Heart, Coffee, Gift, Music, PartyPopper, Flower2, Scissors, Flame, Pizza, GlassWater, Dumbbell, Users } from "lucide-react";

export const experiencesData: Record<string, any> = {
    "private-chef": {
      title: "Private Chef Experience",
      duration: "3-4 hours",
      priceFrom: 65,
      groupSize: "8-24 guests",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-a-private-ch-e336a153-20251018105040.jpg",
      gallery: [
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-priva-eb946e05-20251024112454.jpg",
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-beautif-052b2939-20251027101941.jpg",
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-priva-23564d70-20251024130257.jpg"
      ],
      icon: ChefHat,
      description: "Treat your group to a restaurant-quality dining experience in the comfort of your own property. Our professional chefs will arrive with all ingredients, prepare a stunning three-course meal tailored to your preferences, and handle all the clearing up. It's the perfect way to enjoy gourmet food without lifting a finger, leaving you free to focus on celebrating with your guests. This experience is highly recommended for milestone birthdays and sophisticated hen parties in destinations like Bath, The Cotswolds, and the Lake District.",
      recommendedLocations: ["Bath", "Cotswolds", "Lake District", "London"],
      included: ["Professional private chef for the evening", "Three-course gourmet meal tailored to your group", "All ingredients, equipment, and serving ware", "Menu planning consultation beforehand", "Full table service and presentation", "Kitchen cleanup and washing up"],

    whatToProvide: ["Dining space and table setup", "Basic kitchen facilities (oven, hob, fridge)", "Crockery and cutlery for your group size", "Let us know about any dietary requirements in advance"],
    pricing: [{ size: "8-12 guests", price: 75 }, { size: "13-18 guests", price: 68 }, { size: "19-24 guests", price: 65 }],
    faqs: [
      { question: "Can we customise the menu?", answer: "Absolutely! Our chefs will work with you to create a menu that suits your group's preferences and dietary requirements. We can accommodate vegetarian, vegan, gluten-free, and other dietary needs." },
      { question: "What time does the chef arrive?", answer: "The chef typically arrives 1-2 hours before your preferred dining time to prepare. We'll coordinate the exact timing with you when booking." },
      { question: "Does the price include drinks?", answer: "The price includes all food and chef service. Drinks are not included, but we can arrange wine pairing recommendations or beverage delivery services for an additional cost." },
      { question: "How far in advance should we book?", answer: "We recommend booking at least 2-3 weeks in advance to ensure availability, especially for weekend dates. However, we can sometimes accommodate last-minute bookings if our chefs are available." },
      { question: "What if someone has allergies?", answer: "Please let us know about any allergies or dietary restrictions when booking. Our chefs are experienced in catering to various dietary needs and will ensure everyone has a safe and delicious meal." },
      { question: "Can the chef prepare a special birthday cake or dessert?", answer: "Yes! We can arrange for special desserts, birthday cakes, or celebration treats as part of your meal. Just let us know your requirements when booking." },
      { question: "What happens if we need to cancel?", answer: "Cancellations made more than 7 days before the event receive a full refund. Cancellations within 7 days are subject to a 50% cancellation fee due to ingredient purchases and chef scheduling." }
    ]
  },
  "bbq-catering": {
    title: "BBQ Catering",
    duration: "3-4 hours",
    priceFrom: 45,
    groupSize: "10-30 guests",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
      "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
      "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&q=80"
    ],
    icon: Flame,
    description: "Fire up your celebration with a professional BBQ catering service. Our experienced BBQ chefs will bring everything needed to create a delicious outdoor feast. From succulent burgers and sausages to grilled vegetables and gourmet sides, we'll serve up a crowd-pleasing spread while you relax and enjoy the party atmosphere.",
    included: ["Professional BBQ chef", "All BBQ equipment and fuel", "Premium meats and vegetarian options", "Selection of sides and salads", "Condiments and serving ware", "Setup and cleanup"],
    whatToProvide: ["Outdoor space for BBQ setup", "Tables for food service", "Plates and cutlery", "Let us know dietary requirements"],
    pricing: [{ size: "10-15 guests", price: 50 }, { size: "16-22 guests", price: 47 }, { size: "23-30 guests", price: 45 }],
    faqs: [
      { question: "What's on the menu?", answer: "Our standard menu includes burgers, sausages, chicken, halloumi, mixed salads, coleslaw, and bread rolls. We can customize based on your preferences." },
      { question: "What if it rains?", answer: "We can set up under covered areas or use gazebos. If extreme weather prevents outdoor cooking, we'll discuss alternative arrangements." },
      { question: "Do you cater for vegetarians and vegans?", answer: "Yes! We always include vegetarian options like halloumi and grilled vegetables, and can provide additional vegan options upon request." },
      { question: "How long does the BBQ take to set up?", answer: "Our chef arrives approximately 1 hour before service time to set up the BBQ, prepare ingredients, and ensure everything is ready for your preferred dining time." },
      { question: "Can we request specific meats or dishes?", answer: "Absolutely! We're happy to customize the menu. Popular additions include ribs, kebabs, corn on the cob, and gourmet burgers. Just let us know your preferences when booking." },
      { question: "Is the BBQ equipment suitable for all properties?", answer: "We use professional, portable BBQ equipment suitable for most outdoor spaces. We'll confirm your outdoor setup is suitable when you book." }
    ]
  },
  "pizza-making-class": {
    title: "Pizza Making Class",
    duration: "2-3 hours",
    priceFrom: 42,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=80",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80"
    ],
    icon: Pizza,
    description: "Get hands-on and create your own authentic Italian pizzas from scratch. Our expert instructor will teach you how to make perfect dough, create delicious sauce, and top your pizzas with premium ingredients. Then watch as they're cooked to perfection in a portable pizza oven. It's interactive, fun, and incredibly tasty!",
    included: ["Professional pizza-making instructor", "All ingredients for dough and toppings", "Portable pizza oven", "Chef's hats and aprons", "Recipe cards to take home", "Eat your creations together"],
    whatToProvide: ["Kitchen or outdoor space", "Tables for preparation", "Access to water", "Appetite for delicious pizza!"],
    pricing: [{ size: "8-12 guests", price: 45 }, { size: "13-16 guests", price: 43 }, { size: "17-20 guests", price: 42 }],
    faqs: [
      { question: "Can we choose our own toppings?", answer: "Absolutely! We provide a wide selection of toppings including vegetarian and vegan options." },
      { question: "Do we really get to eat what we make?", answer: "Yes! You'll enjoy your freshly made pizzas together as part of the experience." },
      { question: "Is this suitable for beginners?", answer: "Yes! Our instructor will guide you through every step, from making the dough to creating the perfect pizza. No experience needed." },
      { question: "How many pizzas does each person make?", answer: "Each guest typically makes 1-2 personal-sized pizzas, depending on appetite and time. Everyone gets to customize their own creation." },
      { question: "Can we accommodate dietary requirements?", answer: "Yes! We offer gluten-free dough options and can provide vegan cheese and toppings. Please let us know your requirements when booking." },
      { question: "What toppings are included?", answer: "We provide classic toppings like mozzarella, tomatoes, pepperoni, mushrooms, peppers, olives, ham, pineapple, rocket, and more. We can also arrange specialty toppings upon request." }
    ]
  },
  "butlers-in-the-buff": {
    title: "Butlers in the Buff",
    duration: "2-3 hours",
    priceFrom: 170,
    groupSize: "8-25 guests",
    image: "https://butlersinthebuff.co.uk/wp-content/uploads/2023/05/fun_friendly.jpg.webp",
    gallery: [
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Unknown-1-1765203408189.jpeg",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Unknown-1765203410720.jpeg"
    ],
    icon: Heart,
    description: "Add some cheeky fun to your celebration with our handsome butlers who serve in nothing but an apron and bow tie! Professional, friendly, and entertaining, our butlers will serve drinks, canapés, and bring plenty of laughs to your party. It's the ultimate hen party experience that'll have everyone giggling and creating unforgettable memories.",
    included: ["Handsome professional butler", "Drinks service and hosting", "Games and entertainment", "Photo opportunities", "Canapé service (food not included)", "Guaranteed fun and laughter"],
    whatToProvide: ["Drinks and canapés to be served", "Party atmosphere", "Cameras ready for photos!", "Age 18+ guests only"],
    pricing: [{ size: "Standard booking", price: 170 }],
    pricingType: "per group",
    faqs: [
      { question: "What do the butlers wear?", answer: "Our butlers wear a collar, cuffs, bow tie, and a smart black apron - and that's it! All butlers are professional, respectful, and great fun." },
      { question: "What will they do?", answer: "They'll serve drinks and canapés, host games, pose for photos, and keep the party atmosphere buzzing throughout the session." },
      { question: "Is this suitable for all ages?", answer: "This experience is for guests aged 18 and over only. All participants must be adults." },
      { question: "Can we request a specific butler?", answer: "While we can't guarantee specific individuals, you can let us know your preferences and we'll do our best to match your group's taste." },
      { question: "How professional are the butlers?", answer: "Our butlers are experienced professionals who know how to keep things fun and respectful. They're great at reading the room and ensuring everyone feels comfortable." },
      { question: "Do we need to provide food and drinks?", answer: "Yes, the price includes the butler's service, but you'll need to provide the drinks and canapés you'd like served. We can recommend quantities based on your group size." },
      { question: "Can we extend the booking time?", answer: "Yes! If you're having too much fun to stop, you can extend the booking for an additional fee, subject to the butler's availability." }
    ]
  },
  "bottomless-brunch": {
    title: "Bottomless Brunch",
    duration: "2 hours",
    priceFrom: 55,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      "https://images.unsplash.com/photo-1568096889942-6eedde686635?w=800&q=80",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"
    ],
    icon: Coffee,
    description: "Start your day the right way with a bottomless brunch experience at your property. Enjoy a delicious selection of brunch dishes paired with unlimited prosecco, mimosas, or cocktails for two hours. Our team will handle all the catering and service, so you can sit back, sip, and savour with your group.",
    included: ["Professional catering team", "Selection of brunch dishes", "Unlimited prosecco, mimosas, or cocktails for 2 hours", "Table service and presentation", "All serving ware and glassware", "Setup and cleanup"],
    whatToProvide: ["Dining space and seating", "Tables for food service", "Let us know dietary requirements", "Ready to celebrate!"],
    pricing: [{ size: "8-12 guests", price: 60 }, { size: "13-16 guests", price: 57 }, { size: "17-20 guests", price: 55 }],
    faqs: [
      { question: "What food is included?", answer: "A selection of brunch classics including pastries, eggs, avocado toast, pancakes, fresh fruit, and more. We can tailor to dietary needs." },
      { question: "What drinks are included?", answer: "Unlimited prosecco, mimosas, Bellinis, or selected cocktails for 2 hours. We can discuss your drink preferences when booking." },
      { question: "What time can we start?", answer: "Bottomless brunch typically starts between 10am and 1pm. We'll work with you to find the perfect time for your group." },
      { question: "Is there a drinks limit per person?", answer: "While the drinks are unlimited within the 2-hour window, we serve responsibly and may slow service if guests have had enough. We want everyone to have fun safely!" },
      { question: "Can we have mocktails instead?", answer: "Absolutely! We can create delicious mocktail options for non-drinkers or pregnant guests. The experience is just as fun without alcohol." },
      { question: "What happens after the 2 hours?", answer: "After the 2-hour bottomless period ends, guests are welcome to continue the party with drinks they've purchased separately. We're happy to recommend local suppliers or delivery services." }
    ]
  },
  "life-drawing": {
    title: "Life Drawing",
    duration: "1.5-2 hours",
    priceFrom: 48,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-hen-p-ad7cda19-20251208143330.jpg",
    gallery: [
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-fun-h-50c33e05-20251208144301.jpg",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/stock-photograph-of-hen-party-life-drawi-9de7246e-20251208144301.jpg",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-life-drawing--c1728805-20251208144302.jpg"
    ],
    icon: Paintbrush,
    description: "Get cheeky and creative with a life drawing class featuring a naked male model! Under the guidance of a professional art tutor, you'll learn basic drawing techniques while having a laugh with your group. Whether you're talented or terrible, it's guaranteed to be hilarious. Everyone takes home their masterpiece as a unique souvenir.",
    included: ["Professional art tutor", "Naked male model", "Drawing materials for each guest", "Step-by-step instruction", "Plenty of laughs", "Take home your artwork"],
    whatToProvide: ["Table space for drawing", "Chairs for participants", "Good lighting", "Open minds and sense of humour!"],
    pricing: [{ size: "8-12 guests", price: 52 }, { size: "13-16 guests", price: 50 }, { size: "17-20 guests", price: 48 }],
    faqs: [
      { question: "Is it really a naked model?", answer: "Yes! Our professional male models are experienced, friendly, and completely comfortable. It's all done in good fun and great taste." },
      { question: "Do we need drawing experience?", answer: "Not at all! The tutor will guide you through basic techniques, but the focus is on fun rather than masterpieces." },
      { question: "Can we choose what the model wears or poses in?", answer: "The model will be fully nude for the authentic life drawing experience. The tutor will guide the poses, typically starting with quick sketches and moving to longer poses." },
      { question: "How many drawings do we create?", answer: "You'll typically create 3-5 drawings, starting with quick 5-minute sketches and building up to longer 20-30 minute detailed pieces." },
      { question: "Is the model respectful and professional?", answer: "Absolutely! Our models are experienced professionals who work regularly with life drawing classes. They're friendly, professional, and great at putting everyone at ease." },
      { question: "Can we take photos during the session?", answer: "You can take photos of your artwork, but please ask the model's permission before taking any photos that include them. Respect and consent are important to us." },
      { question: "What if someone feels uncomfortable?", answer: "Our tutor and model are experienced at making everyone feel comfortable. If anyone feels uneasy, they're welcome to step out at any time. Most groups find it hilarious and less awkward than expected!" }
    ]
  },
  "gin-tasting": {
    title: "Gin Tasting",
    duration: "2 hours",
    priceFrom: 48,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80",
      "https://images.unsplash.com/photo-1509657298582-2f760f76fa1d?w=800&q=80",
      "https://images.unsplash.com/photo-1560508562-27d0de6b7d66?w=800&q=80"
    ],
    icon: GlassWater,
    description: "Discover the wonderful world of gin with a guided tasting experience. Sample a selection of premium gins from around the UK, learn about botanicals and distilling processes, and find your perfect serve. Mix and match with different tonics and garnishes to create your ideal G&T. It's educational, sophisticated, and seriously enjoyable.",
    included: ["Expert gin host", "Tasting selection of 5-6 premium gins", "Variety of tonics and garnishes", "Tasting notes and information", "Glassware and ice", "Recipe cards to take home"],
    whatToProvide: ["Table space for tasting station", "Seating for participants", "Ice and water", "Designated drivers arranged"],
    pricing: [{ size: "8-12 guests", price: 52 }, { size: "13-16 guests", price: 50 }, { size: "17-20 guests", price: 48 }],
    faqs: [
      { question: "How many gins do we taste?", answer: "You'll sample 5-6 premium gins, with enough for everyone to find their favourites and learn about different styles." },
      { question: "Can we keep drinking after?", answer: "The tasting includes sample measures. You're welcome to purchase full bottles of any gins you love to enjoy later!" },
      { question: "What will we learn?", answer: "You'll discover how gin is made, the role of different botanicals, how to taste gin properly, and which tonics and garnishes complement different gin styles." },
      { question: "Are the gins included in the price?", answer: "Yes! All gins, tonics, garnishes, and glassware are included. You just need to provide ice and a space for the tasting." },
      { question: "Can we request specific gin brands?", answer: "While we provide a carefully curated selection, you can let us know if there are specific gins you'd love to try and we'll do our best to include them." },
      { question: "Is food included?", answer: "Light nibbles like crackers are provided to cleanse the palate. If you'd like more substantial food, we can recommend catering options to pair with your tasting." }
    ]
  },
  "wine-tasting": {
    title: "Wine Tasting",
    duration: "2 hours",
    priceFrom: 50,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&q=80",
      "https://images.unsplash.com/photo-1566753323558-f212ad96c84d?w=800&q=80",
      "https://images.unsplash.com/photo-1513618827672-0d7c5ad591b1?w=800&q=80"
    ],
    icon: Wine,
    description: "Elevate your celebration with a sophisticated wine tasting experience. A professional sommelier will guide you through a selection of carefully chosen wines from around the world. Learn tasting techniques, discover flavour profiles, and enjoy paired nibbles. It's a refined and delicious way to spend an afternoon or evening with your group.",
    included: ["Professional sommelier host", "Tasting selection of 6 wines", "Tasting notes and guidance", "Paired cheese and charcuterie", "Wine glasses and accessories", "Educational and fun experience"],
    whatToProvide: ["Table space for tasting", "Seating for participants", "Water for palate cleansing", "Transport arrangements"],
    pricing: [{ size: "8-12 guests", price: 55 }, { size: "13-16 guests", price: 52 }, { size: "17-20 guests", price: 50 }],
    faqs: [
      { question: "What wines will we taste?", answer: "We'll take you on a journey through reds, whites, and potentially a sparkling or rosé, showcasing different regions and grape varieties." },
      { question: "Is food included?", answer: "Yes! We provide a selection of cheese, charcuterie, and crackers paired perfectly with the wines." },
      { question: "Do we need wine knowledge?", answer: "Not at all! Our sommelier will explain everything in an accessible, fun way. It's perfect for beginners and wine enthusiasts alike." },
      { question: "Can we request wines from specific regions?", answer: "Absolutely! If you'd like to focus on French wines, New World wines, or a specific region, let us know when booking and we'll tailor the selection." },
      { question: "How much wine is in each tasting?", answer: "Each tasting is a sample measure (approximately 75ml), which is perfect for appreciating the wine without getting too tipsy. That's about half a standard glass per wine." },
      { question: "Can we buy bottles of wines we love?", answer: "While we don't sell wine directly, we'll provide details of where to purchase any wines you particularly enjoyed." }
    ]
  },
  "mobile-beauty-bar": {
    title: "Mobile Beauty Bar",
    duration: "2-4 hours",
    priceFrom: 38,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80"
    ],
    icon: Sparkles,
    description: "Transform your property into a luxury beauty salon with our mobile beauty bar. Our professional beauticians offer a range of treatments including manicures, pedicures, makeup application, and more. Get glammed up together before your night out or enjoy a relaxing pampering session. It's convenient, luxurious, and perfect for groups.",
    included: ["Professional beauty therapists", "All beauty products and equipment", "Choice of treatments", "Sanitary stations and setup", "Personalized service", "Group package discounts"],
    whatToProvide: ["Space with tables and good lighting", "Access to plug sockets", "Chairs for clients", "Treatment preferences in advance"],
    pricing: [{ size: "8-12 guests", price: 42 }, { size: "13-16 guests", price: 40 }, { size: "17-20 guests", price: 38 }],
    faqs: [
      { question: "What treatments are available?", answer: "Choose from manicures, gel polish, pedicures, makeup application, lash extensions, eyebrow shaping, and more. We'll create a custom package for your group." },
      { question: "How long does each treatment take?", answer: "Treatment times vary: manicures 30-45 mins, makeup 30 mins, lashes 60 mins. We'll schedule to ensure everyone's ready on time." },
      { question: "Can we mix and match treatments?", answer: "Absolutely! Each guest can choose their preferred treatments. We'll create a schedule so everyone gets what they want." },
      { question: "Do you bring all products and equipment?", answer: "Yes! We bring everything needed, including professional nail products, makeup, lash supplies, and all equipment. You just need to provide the space." },
      { question: "Can we have multiple therapists?", answer: "Yes, for larger groups we bring multiple therapists so several treatments can happen simultaneously. This ensures everyone's pampered on schedule." },
      { question: "What brands do you use?", answer: "We use professional salon-quality brands for all treatments. If you have specific product preferences or allergies, let us know when booking." }
    ]
  },
  "dance-class": {
    title: "Dance Class",
    duration: "1.5-2 hours",
    priceFrom: 40,
    groupSize: "8-25 guests",
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&q=80",
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&q=80",
      "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80"
    ],
    icon: Music,
    description: "Get your group moving with a fun and energetic dance class! Choose from styles like street dance, Bollywood, Charleston, or even a full hen party choreography. Our professional instructor will teach you an easy-to-follow routine that'll have everyone laughing, bonding, and busting moves. Perfect for creating hilarious videos and burning off some energy.",
    included: ["Professional dance instructor", "Choreographed routine", "Music and sound system", "Warm-up and cool-down", "Video recording of performance", "Guaranteed laughs and memories"],
    whatToProvide: ["Space to move and dance", "Bluetooth speaker or sound system", "Comfortable clothing and trainers", "Energy and enthusiasm!"],
    pricing: [{ size: "8-12 guests", price: 45 }, { size: "13-18 guests", price: 42 }, { size: "19-25 guests", price: 40 }],
    faqs: [
      { question: "Do we need dance experience?", answer: "Not at all! Our instructors tailor the routine to your group's ability. It's all about having fun, not being perfect." },
      { question: "What style of dance?", answer: "You can choose! Popular options include street dance, Bollywood, 90s throwback, Charleston, or a custom hen party routine." },
      { question: "How much space do we need?", answer: "Ideally a living room or large space where everyone can spread out with arms extended. We can adapt to your available space." },
      { question: "Will we learn a full routine?", answer: "Yes! You'll learn a complete choreographed routine that you can perform and record at the end of the session." },
      { question: "Can we film the session?", answer: "Absolutely! We encourage filming and photos. The instructor will record a final performance video that you can share and keep forever." },
      { question: "What should we wear?", answer: "Comfortable clothes you can move in and trainers or dance shoes. Nothing too restrictive - think leggings and a t-shirt." }
    ]
  },
  "pamper-party-package": {
    title: "Pamper Party Package",
    duration: "3-4 hours",
    priceFrom: 70,
    groupSize: "8-16 guests",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80"
    ],
    icon: Gift,
    description: "Indulge in the ultimate pampering experience with our comprehensive package. Combining multiple treatments including mini facials, hand massages, makeup touch-ups, and nail care, this package lets everyone enjoy a variety of treatments in one luxurious session. It's the perfect way to relax and bond before the big celebrations.",
    included: ["Multiple professional therapists", "Mini facial for each guest", "Hand and arm massage", "Manicure or polish", "Light makeup application", "All products and equipment", "Relaxing atmosphere with music"],
    whatToProvide: ["Multiple treatment spaces", "Good lighting", "Comfortable seating", "Towels and robes if available"],
    pricing: [{ size: "8-10 guests", price: 78 }, { size: "11-13 guests", price: 74 }, { size: "14-16 guests", price: 70 }],
    faqs: [
      { question: "What's included in the package?", answer: "Each guest receives a mini facial, hand massage, manicure or nail polish, and light makeup touch-up - perfect preparation for your celebration!" },
      { question: "How many therapists will there be?", answer: "We bring multiple therapists to ensure treatments run smoothly and everyone is pampered in time." },
      { question: "How long does the full package take per person?", answer: "Each guest's full treatment package takes approximately 90 minutes. With multiple therapists, we can treat several people simultaneously." },
      { question: "Can we add extra treatments?", answer: "Yes! You can add additional services like full facials, pedicures, or massage extensions for an extra cost." },
      { question: "Do you bring facial products for different skin types?", answer: "Yes, our therapists bring products suitable for all skin types, including sensitive skin, and will customize facials based on individual needs." },
      { question: "What if we have different treatment preferences?", answer: "While this is a set package, there's flexibility in polish colors, makeup styles, and facial products to suit everyone's preferences." }
    ]
  },
  "make-up-artist": {
    title: "Make-up Artist",
    duration: "2-3 hours",
    priceFrom: 40,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
      "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80"
    ],
    icon: Sparkles,
    description: "Look absolutely stunning with professional makeup application from our talented makeup artists. Whether you want a natural glow or full glamour, our artists will create the perfect look for each person. Using premium products and the latest techniques, everyone will feel confident and camera-ready for your celebrations.",
    included: ["Professional makeup artist", "Premium makeup products", "Individual consultation", "Full face makeup application", "False lashes if desired", "Touch-up tips and tricks"],
    whatToProvide: ["Space with mirrors and natural light", "Chairs for clients", "Access to plug sockets", "Inspiration photos welcome"],
    pricing: [{ size: "8-12 guests", price: 45 }, { size: "13-16 guests", price: 42 }, { size: "17-20 guests", price: 40 }],
    faqs: [
      { question: "How long does each makeup take?", answer: "Each full face makeup application takes approximately 30-45 minutes. We'll schedule appointments to ensure everyone's ready on time." },
      { question: "Can we bring inspiration photos?", answer: "Absolutely! Bringing photos helps our artists understand exactly what look you're hoping to achieve." },
      { question: "Are false lashes included?", answer: "Yes! We can apply false lashes as part of your makeup if you'd like them. We'll discuss this during your consultation." },
      { question: "What makeup brands do you use?", answer: "We use professional, high-quality makeup brands suitable for all skin types. Products are long-lasting and camera-ready." },
      { question: "Can we have multiple artists?", answer: "Yes! For larger groups, we can provide multiple makeup artists to ensure everyone's ready on schedule." },
      { question: "Will the makeup last all night?", answer: "Yes! We use long-lasting, professional products and techniques. We'll also give you touch-up tips and can provide a small touch-up kit." }
    ]
  },
  "yoga-session": {
    title: "Yoga Session",
    duration: "1.5 hours",
    priceFrom: 35,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80"
    ],
    icon: Dumbbell,
    description: "Start your celebration with mindful movement and relaxation. Our qualified yoga instructor will lead a session tailored to all abilities, combining gentle stretches, breathing exercises, and meditation. It's the perfect way to energize the group, ease any pre-celebration nerves, and set a positive tone for the weekend ahead.",
    included: ["Qualified yoga instructor", "Guided session for all levels", "Yoga mats for all participants", "Relaxation and meditation", "Calming music", "Post-session herbal tea"],
    whatToProvide: ["Indoor or outdoor space to spread out", "Quiet environment", "Comfortable clothing for movement", "Water bottles for participants"],
    pricing: [{ size: "8-12 guests", price: 38 }, { size: "13-16 guests", price: 37 }, { size: "17-20 guests", price: 35 }],
    faqs: [
      { question: "Do we need yoga experience?", answer: "Not at all! Our instructor will adapt the session for all levels, from complete beginners to experienced yogis." },
      { question: "What style of yoga?", answer: "We typically offer a gentle flow suitable for all abilities, but can adapt to your group's preferences - vinyasa, yin, or even laughter yoga!" },
      { question: "What should we wear?", answer: "Comfortable, stretchy clothing that allows full range of movement. Leggings and a t-shirt or vest work perfectly." },
      { question: "Do we need to bring our own mats?", answer: "No, we provide yoga mats for all participants. Just bring yourself and an open mind!" },
      { question: "How much space do we need?", answer: "Each person needs a yoga mat's worth of space (roughly 6ft x 3ft). A large living room or outdoor area typically works well for groups." },
      { question: "Is this suitable for pregnant women?", answer: "Yes! Our instructors can modify poses for pregnancy. Please let us know in advance so we can adapt the session appropriately." }
    ]
  },
  "photography-package": {
    title: "Photography Package",
    duration: "2-3 hours",
    priceFrom: 55,
    groupSize: "8-30 guests",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80"
    ],
    icon: Camera,
    description: "Capture every special moment with a professional photographer. From candid shots during activities to styled group photos, you'll receive stunning images that perfectly document your celebration. No more worrying about who's taking the photos - everyone can be in the pictures and enjoy the moment while our photographer works their magic.",
    included: ["Professional photographer", "2-3 hours coverage", "Candid and posed photography", "Group and individual shots", "Professionally edited photos", "Online gallery for downloading", "High-resolution digital images"],
    whatToProvide: ["Access to property and activities", "Shot list or special requests", "Let us know key moments to capture", "Everyone's permission for photos"],
    pricing: [{ size: "8-15 guests", price: 60 }, { size: "16-22 guests", price: 57 }, { size: "23-30 guests", price: 55 }],
    faqs: [
      { question: "How many photos do we receive?", answer: "You'll typically receive 100-200 professionally edited images depending on the package length and activities covered." },
      { question: "How soon do we get the photos?", answer: "Photos are usually delivered within 2-3 weeks via an online gallery where you can download and share them." },
      { question: "Can we request specific shots?", answer: "Absolutely! Send us a shot list beforehand, and our photographer will make sure to capture all your must-have moments." },
      { question: "Will you capture candid moments as well as posed shots?", answer: "Yes! We balance posed group shots with natural, candid moments throughout your celebration for a complete story of your event." },
      { question: "Can we extend the photography time?", answer: "Yes! If you'd like longer coverage, we can extend the package. This is great if you have multiple activities or want evening photos too." },
      { question: "What format are the photos delivered in?", answer: "You'll receive high-resolution JPEG files via a private online gallery, perfect for printing and sharing on social media." }
    ]
  },
  "flower-crown-making": {
    title: "Flower Crown Making",
    duration: "1.5-2 hours",
    priceFrom: 35,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
    gallery: [
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-women-m-ae355045-20251024112745.jpg",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-beautif-6e71a563-20251024112747.jpg",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-group-o-c6f54c3e-20251024112747.jpg"
    ],
    icon: Flower2,
    description: "Get creative and make beautiful flower crowns for your group. Perfect Instagram moment included. Take home your handmade creations!",
    included: ["Professional florist instructor", "Fresh flowers and greenery", "All crafting materials and tools", "Step-by-step guidance", "Take-home flower crowns", "Group photo session with crowns"],
    whatToProvide: ["Table space for crafting", "Good natural lighting", "Chairs for participants", "Enthusiasm and creativity!"],
    pricing: [{ size: "8-12 guests", price: 40 }, { size: "13-16 guests", price: 37 }, { size: "17-20 guests", price: 35 }],
    faqs: [
      { question: "How long do the crowns last?", answer: "Fresh flower crowns last 1-2 days with proper care. We'll provide tips to keep them looking their best!" },
      { question: "Can we choose the flowers?", answer: "Yes! We can tailor the color scheme and flower types to match your group's preferences and wedding colors." },
      { question: "Is this suitable for beginners?", answer: "Absolutely! Our florist will guide you through every step. No experience needed - just creativity and enthusiasm!" },
      { question: "Can we wear them out later?", answer: "Yes! The crowns are sturdy enough to wear for the rest of the day or evening. They're perfect for photos and nights out." },
      { question: "What types of flowers are included?", answer: "We use a mix of seasonal fresh flowers and greenery. Popular choices include roses, baby's breath, daisies, eucalyptus, and ferns." },
      { question: "Can children join this activity?", answer: "Yes! It's a great activity for mixed age groups. Our instructor will adapt the complexity based on the participants." }
    ]
  },
  "cocktail-masterclass": {
    title: "Cocktail Masterclass",
    duration: "2 hours",
    priceFrom: 50,
    groupSize: "8-20 guests",
    image: "https://butlersinthebuff.co.uk/wp-content/uploads/2023/05/fun_friendly.jpg.webp",
    gallery: [
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/hen-party-cocktail-classes-4-e1657801576427.jpg-1760963913852.webp",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80"
    ],
    slug: "cocktail-masterclass",
    icon: Wine,
    description: "Shake things up with a professional cocktail masterclass led by an expert mixologist. Learn to create classic and contemporary cocktails while enjoying a fun, hands-on experience. Each guest will master three different cocktails, complete with professional techniques, garnishing tips, and plenty of tasting along the way. Perfect for bringing your group together with laughs, learning, and delicious drinks.",
    included: ["Professional mixologist instructor", "All spirits, mixers, and ingredients for 3 cocktails per person", "Bar equipment and glassware", "Recipe cards to take home", "Cocktail-making techniques and tips", "Fun group atmosphere with music"],
    whatToProvide: ["Kitchen or bar area with counter space", "Ice and a freezer", "Glasses if you prefer to use your own", "Designated drivers or transport arrangements"],
    pricing: [{ size: "8-12 guests", price: 55 }, { size: "13-16 guests", price: 52 }, { size: "17-20 guests", price: 50 }],
    faqs: [
      { question: "What cocktails will we learn?", answer: "You'll typically learn three cocktails, which can include classics like Mojitos, Espresso Martinis, and Cosmopolitans, or we can tailor the selection to your group's preferences." },
      { question: "Is the alcohol included?", answer: "Yes! All spirits, mixers, and ingredients are included in the price. We bring everything you need." },
      { question: "Can non-drinkers participate?", answer: "Absolutely! We can create mocktail versions of any cocktails so everyone can join in the fun." },
      { question: "Do we need any cocktail experience?", answer: "Not at all! Our mixologist will teach you everything from scratch, including proper shaking techniques, muddling, layering, and garnishing." },
      { question: "Can we choose which cocktails to learn?", answer: "Yes! Let us know your favorites or if there are specific cocktails you'd love to master, and we'll tailor the class accordingly." },
      { question: "Do we get to drink what we make?", answer: "Absolutely! You'll enjoy each cocktail you create. It's learning and tasting all in one fun session." },
      { question: "Can we take the recipes home?", answer: "Yes! Everyone receives recipe cards so you can recreate your favorite cocktails at home and impress your friends." }
    ]
  },
  "sip-and-paint": {
    title: "Sip & Paint",
    duration: "2-3 hours",
    priceFrom: 45,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-sip-a-b0921423-20251024095025.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"
    ],
    slug: "sip-and-paint",
    icon: Palette,
    description: "Unleash your inner artist with a relaxed and fun painting session. No experience needed - our friendly instructor will guide you step-by-step to create your own masterpiece. Enjoy your favourite drinks while you paint, chat, and laugh with your group. Everyone takes home their own canvas as a unique memento of your celebration. It's creative, social, and brilliantly fun.",
    included: ["Professional art instructor", "Canvas for each guest", "All paints, brushes, and art supplies", "Aprons to protect clothing", "Step-by-step guidance to complete your painting", "Set-up and clean-up"],
    whatToProvide: ["Table space for painting", "Good lighting", "Chairs for all participants", "Drinks and snacks (we recommend prosecco!)"],
    pricing: [{ size: "8-12 guests", price: 48 }, { size: "13-16 guests", price: 47 }, { size: "17-20 guests", price: 45 }],
    faqs: [
      { question: "Do we need any art experience?", answer: "Not at all! Our instructor will guide you through every step. It's designed to be fun and relaxed, not intimidating." },
      { question: "What will we paint?", answer: "We can tailor the painting to your group - popular choices include landscapes, abstract designs, or even a cheeky hen-themed piece!" },
      { question: "How long does it take to complete?", answer: "Most paintings are completed within 2-3 hours, but the pace is flexible based on your group's preference." },
      { question: "Can we bring our own drinks?", answer: "Absolutely! We encourage you to sip your favorite beverages while painting. Prosecco and wine are popular choices!" },
      { question: "What size is the canvas?", answer: "Each guest receives a standard 16x20 inch canvas - perfect for displaying at home or giving as a gift." },
      { question: "Is there a theme?", answer: "We can work with you to choose a theme that suits your group - from sunsets and flowers to abstract art or personalized designs." },
      { question: "Do we get to keep the paintings?", answer: "Yes! Everyone takes home their own completed canvas as a unique souvenir of the celebration." }
    ]
  },
  "hair-styling": {
    title: "Hair Styling",
    duration: "2-3 hours",
    priceFrom: 35,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80"
    ],
    slug: "hair-styling",
    icon: Scissors,
    description: "Get glammed up with professional hair styling for your group. Our talented stylists will come to your property and create beautiful looks for your evening out. From elegant updos to beachy waves, bouncy blow-dries to braided styles, we'll make sure everyone looks and feels fabulous. Perfect before a big night out or special celebration dinner.",
    included: ["Professional mobile hair stylist", "Consultation for each guest", "Wash, blow-dry, and style", "Hair products and styling tools", "Touch-up tips and product recommendations", "Group discounts for larger parties"],
    whatToProvide: ["Space with mirrors and good lighting", "Access to plug sockets", "Hair washed beforehand (or let us know if you'd like wet hair styling)", "Any specific style inspiration photos"],
    pricing: [{ size: "8-12 guests", price: 40 }, { size: "13-16 guests", price: 37 }, { size: "17-20 guests", price: 35 }],
    faqs: [
      { question: "How long does each person take?", answer: "Each styling typically takes 20-30 minutes, depending on the complexity. We'll schedule to ensure everyone's ready on time." },
      { question: "Can we bring inspiration photos?", answer: "Yes, please do! It helps our stylists understand exactly what you're looking for." },
      { question: "Do you provide hair extensions or accessories?", answer: "We can arrange extensions and accessories for an additional cost - just let us know when booking." },
      { question: "Should we wash our hair before?", answer: "Day-old hair actually styles better! But if you prefer fresh-washed hair, that works too. Let us know your preference." },
      { question: "Can we have multiple stylists?", answer: "Yes! For larger groups, we provide multiple stylists to ensure everyone's styled efficiently and ready on schedule." },
      { question: "What styles can you do?", answer: "Anything from sleek blow-dries to elegant updos, braids, curls, waves, and everything in between. Our stylists are versatile and skilled!" },
      { question: "Will the style last all night?", answer: "Yes! We use professional products and techniques to ensure your style holds throughout your celebration. We'll also give you touch-up tips." }
    ]
  },
  "karaoke-night": {
    title: "Karaoke Night",
    duration: "3-4 hours",
    priceFrom: 40,
    groupSize: "8-30 guests",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
      "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80"
    ],
    slug: "karaoke-night",
    icon: Mic2,
    description: "Bring the party to your property with a full karaoke setup. Belt out your favourite tunes with our professional sound system, wireless microphones, and access to thousands of songs. Our host will keep the energy high, manage the playlist, and make sure everyone gets their moment in the spotlight. From power ballads to guilty pleasure pop anthems, it's guaranteed to be a night of laughs and unforgettable performances.",
    included: ["Professional karaoke system with screen", "Two wireless microphones", "Sound system and speakers", "Access to 10,000+ songs across all genres", "Karaoke host to manage the night", "Disco lights and party atmosphere"],
    whatToProvide: ["Space for the equipment and performance area", "TV or projector screen (or we can provide one)", "Power sockets", "Your best singing voices and confidence!"],
    pricing: [{ size: "8-15 guests", price: 45 }, { size: "16-25 guests", price: 42 }, { size: "26-30 guests", price: 40 }],
    faqs: [
      { question: "What if we can't sing?", answer: "That's what makes it fun! Karaoke is all about having a laugh and letting loose - no talent required." },
      { question: "Can we request specific songs?", answer: "Yes! Our system has over 10,000 songs, and you can send us a wishlist beforehand to make sure your favourites are ready to go." },
      { question: "Is there a host included?", answer: "Yes, our experienced host will run the evening, manage the tech, and keep the energy high so you can focus on performing!" },
      { question: "How loud is the system?", answer: "Our professional sound system is adjustable and suitable for properties. We'll set the volume to be fun without disturbing neighbors." },
      { question: "Can we do duets or group songs?", answer: "Absolutely! We have two microphones, so duets are encouraged. Group numbers with everyone singing along always go down a treat!" },
      { question: "What music genres are available?", answer: "Everything! From 80s classics to current chart hits, Disney songs to rock anthems. Pop, R&B, country, musicals - we've got it all." }
    ]
  },
  "spa-treatments": {
    title: "Spa Treatments",
    duration: "2-3 hours",
    priceFrom: 75,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-luxury-spa-t-15d1f1e0-20251021222805.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80"
    ],
    slug: "spa-treatments",
    icon: Sparkles,
    description: "Treat your group to ultimate relaxation with professional spa treatments at your property. Our mobile spa therapists bring everything needed to create a tranquil spa experience without leaving your accommodation. Choose from massages, facials, manicures, pedicures, and more. It's the perfect way to unwind before a big night out or simply indulge in some well-deserved pampering with your group.",
    included: ["Qualified mobile spa therapists", "All treatment products and equipment", "Massage tables, towels, and robes", "Relaxing music and aromatherapy", "Choice of treatments tailored to your group", "Set-up and clean-up"],
    whatToProvide: ["Quiet space for treatments (bedrooms work perfectly)", "Access to warm water", "Comfortable temperature in treatment rooms", "Let us know treatment preferences in advance"],
    pricing: [{ size: "8-12 guests", price: 85 }, { size: "13-16 guests", price: 80 }, { size: "17-20 guests", price: 75 }],
    faqs: [
      { question: "What treatments can we choose?", answer: "Popular options include Swedish massage, back massage, express facials, manicures, pedicures, and reflexology. We'll work with you to create a spa menu for your group." },
      { question: "How long is each treatment?", answer: "Treatments typically range from 30-60 minutes per person. We'll schedule a rotation so everyone gets pampered." },
      { question: "Can we have multiple therapists?", answer: "Yes! For larger groups, we can bring multiple therapists so treatments happen simultaneously and everyone's finished in time." },
      { question: "What do we need to wear?", answer: "Comfortable, loose clothing. For massages, you'll undress to your comfort level and be covered with towels throughout." },
      { question: "Can we customize the spa menu?", answer: "Absolutely! Mix and match treatments based on your group's preferences. Some might want massages while others prefer facials - we're flexible!" },
      { question: "Are the therapists qualified?", answer: "Yes! All our therapists are fully qualified, insured professionals with extensive experience in mobile spa services." },
      { question: "What if we have specific health conditions?", answer: "Please let us know about any health conditions, injuries, or concerns when booking. Our therapists will adapt treatments accordingly to ensure everyone's safety and comfort." }
    ]
  }
};

export const relatedExperiences = [
  {
    title: "Cocktail Masterclass",
    duration: "2 hours",
    priceFrom: 50,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/hen-party-cocktail-classes-4-e1657801576427.jpg-1760963913852.webp",
    slug: "cocktail-masterclass",
  },
  {
    title: "Private Chef Experience",
    duration: "3-4 hours",
    priceFrom: 65,
    groupSize: "8-24 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-a-private-ch-e336a153-20251018105040.jpg",
    slug: "private-chef",
  },
  {
    title: "Sip & Paint",
    duration: "2-3 hours",
    priceFrom: 45,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-sip-a-b0921423-20251024095025.jpg",
    slug: "sip-and-paint",
  },
  {
    title: "Hair Styling",
    duration: "2-3 hours",
    priceFrom: 35,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    slug: "hair-styling",
  },
  {
    title: "Karaoke Night",
    duration: "3-4 hours",
    priceFrom: 40,
    groupSize: "8-30 guests",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    slug: "karaoke-night",
  },
  {
    title: "Spa Treatments",
    duration: "2-3 hours",
    priceFrom: 75,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-luxury-spa-t-15d1f1e0-20251021222805.jpg",
    slug: "spa-treatments",
  },
];