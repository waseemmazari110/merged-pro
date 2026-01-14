
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

const activities = [
  "Abba Bottomless Brunch", "ABBA Dance Class", "Adonis Cabaret", "Alcotraz Prison Cocktail Experience",
  "Archery Tag", "Axe Throwing", "Back To The 80s Dance Class", "Back To The 90s Dance Class",
  "Banyan Brunch", "Bar And Club Night", "Barbie Dance Class", "Belly Dancing Lessons",
  "Bespoke Fragrance Design", "Betrayers Party", "Beyonce Dancing", "Body Painting", "Bollywood Dancing",
  "Boom Battle Bar Package", "Boozy Bottomless Brunch", "Bottomless Brunch", "Boy Toy Bottomless Brunch",
  "Bubble Football", "Bubble Mayhen", "Buff Bingo Brunch", "Bunting Making", "Burger & Booze Afternoon Tea",
  "Burlesque Lessons", "Can-Can Lessons", "Challenge Point Game", "Charleston", "Cheeky Challenge Arena",
  "Cheerleading Lessons", "Chicago Dancing", "Chicken Rush", "Chocolate Making", "Chocolate Making Masterclass",
  "Choose Your Pop Star Dance Class", "City Treasure Hunt", "Clay Shooting", "Cocktail Making",
  "Cocktail Mixing & Meal", "Cocktail Party", "Comedy Club", "Cosy Club", "Cosy Club Brunch",
  "Cuban Afternoon Tea With Prosecco", "Cuban Bottomless Brunch", "Cuban Cocktail Class With Tapas",
  "Dirty Dancing", "Dirty Dancing Brunch Show", "Disney Dance Class", "DIY Crafting Kit",
  "DIY Vamp That Vulva Kit", "Dodgeball", "Dominatrix Lesson", "Drag Bottomless Brunch",
  "Drag Extravaganza", "Dreamboys"
];

const now = new Date().toISOString();

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO experiences (
      title, slug, duration, group_size_min, group_size_max, price_from, 
      description, hero_image, is_published, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  activities.forEach(title => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    stmt.run(
      title, 
      slug, 
      "2 hours", 
      8, 
      20, 
      45.0, 
      `Exciting ${title} experience in Manchester. Perfect for hen parties and group celebrations.`,
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      0, // Draft
      now, 
      now
    );
  });

  stmt.finalize();
});

db.close();
console.log("Draft pages created in database.");
