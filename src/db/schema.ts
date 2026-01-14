import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyName: text('property_name').notNull(),
  propertyLocation: text('property_location'),
  guestName: text('guest_name').notNull(),
  guestEmail: text('guest_email').notNull(),
  guestPhone: text('guest_phone').notNull(),
  checkInDate: text('check_in_date').notNull(),
  checkOutDate: text('check_out_date').notNull(),
  numberOfGuests: integer('number_of_guests').notNull(),
  occasion: text('occasion'),
  bookingStatus: text('booking_status').notNull().default('pending'),
  totalPrice: real('total_price'),
  depositAmount: real('deposit_amount'),
  depositPaid: integer('deposit_paid', { mode: 'boolean' }).default(false),
  balanceAmount: real('balance_amount'),
  balancePaid: integer('balance_paid', { mode: 'boolean' }).default(false),
  specialRequests: text('special_requests'),
  experiencesSelected: text('experiences_selected', { mode: 'json' }),
  adminNotes: text('admin_notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
    role: text("role").notNull().default("customer"),
    phoneNumber: text("phone"),
    propertyName: text("company_name"),
  propertyWebsite: text("property_website"),
  planId: text("plan_id"),
  paymentStatus: text("payment_status").default("pending"),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// CMS Tables

// Properties table
export const properties = sqliteTable('properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: text('owner_id').references(() => user.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  location: text('location').notNull(),
  region: text('region').notNull(),
  sleepsMin: integer('sleeps_min').notNull(),
  sleepsMax: integer('sleeps_max').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  priceFromMidweek: real('price_from_midweek').notNull(),
  priceFromWeekend: real('price_from_weekend').notNull(),
  description: text('description').notNull(),
  houseRules: text('house_rules'),
  checkInOut: text('check_in_out'),
  iCalURL: text('ical_url'),
  heroImage: text('hero_image').notNull(),
  heroVideo: text('hero_video'),
  floorplanURL: text('floorplan_url'),
  mapLat: real('map_lat'),
  mapLng: real('map_lng'),
  ownerContact: text('owner_contact'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  isPublished: integer('is_published', { mode: 'boolean' }).default(false),
  status: text('status').notNull().default('pending'),
  plan: text('plan'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripePriceId: text('stripe_price_id'),
  stripeInvoiceId: text('stripe_invoice_id'),
  nextPaymentDate: text('next_payment_date'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Property images table
export const propertyImages = sqliteTable('property_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  imageURL: text('image_url').notNull(),
  caption: text('caption'),
  orderIndex: integer('order_index').default(0),
  createdAt: text('created_at').notNull(),
});

// Property features table
export const propertyFeatures = sqliteTable('property_features', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  featureName: text('feature_name').notNull(),
  createdAt: text('created_at').notNull(),
});

// Experiences table
export const experiences = sqliteTable('experiences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  duration: text('duration').notNull(),
  groupSizeMin: integer('group_size_min').notNull(),
  groupSizeMax: integer('group_size_max').notNull(),
  priceFrom: real('price_from').notNull(),
  description: text('description').notNull(),
  included: text('included', { mode: 'json' }),
  whatToProvide: text('what_to_provide', { mode: 'json' }),
  heroImage: text('hero_image').notNull(),
  category: text('category'),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Experience images table
export const experienceImages = sqliteTable('experience_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  experienceId: integer('experience_id').notNull().references(() => experiences.id, { onDelete: 'cascade' }),
  imageURL: text('image_url').notNull(),
  orderIndex: integer('order_index').default(0),
  createdAt: text('created_at').notNull(),
});

// Experience FAQs table
export const experienceFaqs = sqliteTable('experience_faqs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  experienceId: integer('experience_id').notNull().references(() => experiences.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  orderIndex: integer('order_index').default(0),
  createdAt: text('created_at').notNull(),
});

// Destinations table
export const destinations = sqliteTable('destinations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cityName: text('city_name').notNull(),
  slug: text('slug').notNull().unique(),
  region: text('region').notNull(),
  overview: text('overview').notNull(),
  travelTips: text('travel_tips'),
  topVenues: text('top_venues', { mode: 'json' }),
  heroImage: text('hero_image').notNull(),
  mapArea: text('map_area'),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Destination images table
export const destinationImages = sqliteTable('destination_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  destinationId: integer('destination_id').notNull().references(() => destinations.id, { onDelete: 'cascade' }),
  imageURL: text('image_url').notNull(),
  caption: text('caption'),
  orderIndex: integer('order_index').default(0),
  createdAt: text('created_at').notNull(),
});

// Reviews table
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestName: text('guest_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  propertyId: integer('property_id').references(() => properties.id),
  reviewDate: text('review_date').notNull(),
  guestImage: text('guest_image'),
  isApproved: integer('is_approved', { mode: 'boolean' }).default(false),
  isPublished: integer('is_published', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Blog posts table
export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').notNull(),
  body: text('body').notNull(),
  featuredImage: text('featured_image').notNull(),
  category: text('category').notNull(),
  tags: text('tags', { mode: 'json' }),
  author: text('author').notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  isPublished: integer('is_published', { mode: 'boolean' }).default(false),
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// FAQs table
export const faqs = sqliteTable('faqs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull(),
  orderIndex: integer('order_index').default(0),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Partners table
export const partners = sqliteTable('partners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull(),
  region: text('region'),
  website: text('website'),
  contactEmail: text('contact_email'),
  commissionNotes: text('commission_notes'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Saved properties table
export const savedProperties = sqliteTable('saved_properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').notNull(),
});

// Saved quotes table
export const savedQuotes = sqliteTable('saved_quotes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  quotePayload: text('quote_payload', { mode: 'json' }).notNull(),
  createdAt: text('created_at').notNull(),
});

// Enquiries table
export const enquiries = sqliteTable('enquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'property' or 'experience' or 'general'
  propertyId: integer('property_id').references(() => properties.id),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  recipientEmail: text('recipient_email').notNull(),
  status: text('status').notNull().default('sent'),
  createdAt: text('created_at').notNull(),
});

// Spam protection tables
export const spamBlacklist = sqliteTable('spam_blacklist', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(), // 'ip' or 'email'
  value: text('value').notNull().unique(),
  reason: text('reason'),
  expiresAt: text('expires_at'),
  createdAt: text('created_at').notNull(),
});

export const spamSubmissions = sqliteTable('spam_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ip: text('ip'),
  email: text('email'),
  formType: text('form_type'),
  reason: text('reason'),
  userAgent: text('user_agent'),
  payload: text('payload', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
});
