import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').references(() => properties.id, { onDelete: 'cascade' }),
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
  
  // Stripe Payment Integration
  stripeCustomerId: text('stripe_customer_id'), // Stripe customer ID for guest
  stripeDepositPaymentIntentId: text('stripe_deposit_payment_intent_id'), // Deposit payment intent
  stripeBalancePaymentIntentId: text('stripe_balance_payment_intent_id'), // Balance payment intent
  stripeDepositChargeId: text('stripe_deposit_charge_id'), // Successful deposit charge
  stripeBalanceChargeId: text('stripe_balance_charge_id'), // Successful balance charge
  stripeRefundId: text('stripe_refund_id'), // Refund ID if applicable
  paymentMetadata: text('payment_metadata', { mode: 'json' }), // Additional payment info
  
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
  role: text("role").notNull().default("guest"), // 'guest', 'owner', 'admin'
  phone: text("phone"),
  companyName: text("company_name"), // For owners
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
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
  ownerId: text('owner_id').references(() => user.id, { onDelete: 'set null' }), // Link to owner user
  ownerContact: text('owner_contact'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  
  // Listing Status & Approval Workflow
  status: text('status').notNull().default('pending'), // 'pending', 'approved', 'rejected'
  rejectionReason: text('rejection_reason'), // Admin's reason for rejection
  approvedBy: text('approved_by').references(() => user.id, { onDelete: 'set null' }), // Admin who approved
  approvedAt: text('approved_at'), // Approval timestamp
  
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
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

// ============================================
// INTERNAL CRM SYSTEM - PHASE 1
// ============================================

// CRM Owner Profiles - Extended owner information for CRM
export const crmOwnerProfiles = sqliteTable('crm_owner_profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  businessName: text('business_name'),
  website: text('website'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  postalCode: text('postal_code'),
  country: text('country').default('UK'),
  alternatePhone: text('alternate_phone'),
  alternateEmail: text('alternate_email'),
  taxId: text('tax_id'),
  businessType: text('business_type'), // 'individual', 'company', 'partnership'
  registrationNumber: text('registration_number'),
  preferredContactMethod: text('preferred_contact_method').default('email'), // 'email', 'phone', 'sms'
  notes: text('notes'),
  tags: text('tags', { mode: 'json' }), // Array of tags for categorization
  source: text('source').default('website'), // 'website', 'referral', 'marketing', 'direct'
  status: text('status').notNull().default('active'), // 'active', 'inactive', 'suspended'
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// CRM Enquiries - Track all enquiries and link to owners/properties
export const crmEnquiries = sqliteTable('crm_enquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: text('owner_id').references(() => user.id, { onDelete: 'set null' }),
  propertyId: integer('property_id').references(() => properties.id, { onDelete: 'set null' }),
  guestName: text('guest_name').notNull(),
  guestEmail: text('guest_email').notNull(),
  guestPhone: text('guest_phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  enquiryType: text('enquiry_type').notNull().default('general'), // 'booking', 'property_info', 'partnership', 'general'
  status: text('status').notNull().default('new'), // 'new', 'contacted', 'qualified', 'converted', 'lost', 'spam'
  priority: text('priority').default('medium'), // 'low', 'medium', 'high', 'urgent'
  assignedTo: text('assigned_to'), // Staff member handling this enquiry
  source: text('source').default('website'), // 'website', 'phone', 'email', 'referral', 'social'
  checkInDate: text('check_in_date'),
  checkOutDate: text('check_out_date'),
  numberOfGuests: integer('number_of_guests'),
  budget: real('budget'),
  notes: text('notes'),
  followUpDate: text('follow_up_date'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  closedAt: text('closed_at'),
});

// CRM Activity Log - Track all interactions and activities
export const crmActivityLog = sqliteTable('crm_activity_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  entityType: text('entity_type').notNull(), // 'owner', 'enquiry', 'property', 'booking'
  entityId: text('entity_id').notNull(), // ID of the related entity
  activityType: text('activity_type').notNull(), // 'email', 'phone_call', 'meeting', 'note', 'status_change', 'document_upload'
  title: text('title').notNull(),
  description: text('description'),
  outcome: text('outcome'), // Result of the activity
  performedBy: text('performed_by'), // User who performed the activity
  metadata: text('metadata', { mode: 'json' }), // Additional data (email body, call duration, etc)
  createdAt: text('created_at').notNull(),
});

// CRM Notes & Reminders
export const crmNotes = sqliteTable('crm_notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  entityType: text('entity_type').notNull(), // 'owner', 'enquiry', 'property'
  entityId: text('entity_id').notNull(),
  noteType: text('note_type').default('note'), // 'note', 'reminder', 'todo'
  title: text('title'),
  content: text('content').notNull(),
  priority: text('priority').default('normal'), // 'low', 'normal', 'high'
  dueDate: text('due_date'), // For reminders and todos
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),
  completedAt: text('completed_at'),
  createdBy: text('created_by'),
  assignedTo: text('assigned_to'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// CRM Property Links - Track which properties are linked to owners in CRM
export const crmPropertyLinks = sqliteTable('crm_property_links', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: text('owner_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  propertyId: integer('property_id').references(() => properties.id, { onDelete: 'cascade' }),
  linkStatus: text('link_status').notNull().default('active'), // 'active', 'pending', 'inactive'
  ownershipType: text('ownership_type').default('full'), // 'full', 'partial', 'managed'
  commissionRate: real('commission_rate'),
  contractStartDate: text('contract_start_date'),
  contractEndDate: text('contract_end_date'),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ============================================
// MILESTONE 2 - SUBSCRIPTIONS & BILLING
// ============================================

// Subscriptions table - Track user subscriptions (Stripe/Autumn)
export const subscriptions = sqliteTable('subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id'),
  stripeCustomerId: text('stripe_customer_id'),
  planName: text('plan_name').notNull(), // 'free', 'basic', 'premium', 'enterprise'
  planType: text('plan_type').notNull(), // 'monthly', 'yearly'
  status: text('status').notNull().default('active'), // 'active', 'cancelled', 'expired', 'past_due', 'trialing'
  currentPeriodStart: text('current_period_start').notNull(), // DD/MM/YYYY
  currentPeriodEnd: text('current_period_end').notNull(), // DD/MM/YYYY
  cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }).default(false),
  cancelledAt: text('cancelled_at'), // DD/MM/YYYY HH:mm:ss
  trialStart: text('trial_start'), // DD/MM/YYYY
  trialEnd: text('trial_end'), // DD/MM/YYYY
  amount: real('amount').notNull(), // Subscription amount
  currency: text('currency').notNull().default('GBP'),
  interval: text('interval').notNull(), // 'month', 'year'
  intervalCount: integer('interval_count').default(1),
  metadata: text('metadata', { mode: 'json' }), // Additional subscription data
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// Invoices table - Track all invoices and payments
export const invoices = sqliteTable('invoices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  subscriptionId: integer('subscription_id').references(() => subscriptions.id, { onDelete: 'set null' }),
  stripeInvoiceId: text('stripe_invoice_id').unique(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  invoiceNumber: text('invoice_number').notNull().unique(),
  status: text('status').notNull().default('draft'), // 'draft', 'open', 'paid', 'void', 'uncollectible'
  description: text('description'),
  amountDue: real('amount_due').notNull(),
  amountPaid: real('amount_paid').default(0),
  amountRemaining: real('amount_remaining').notNull(),
  currency: text('currency').notNull().default('GBP'),
  taxAmount: real('tax_amount').default(0),
  subtotal: real('subtotal').notNull(),
  total: real('total').notNull(),
  dueDate: text('due_date'), // DD/MM/YYYY
  paidAt: text('paid_at'), // DD/MM/YYYY HH:mm:ss
  invoiceDate: text('invoice_date').notNull(), // DD/MM/YYYY
  periodStart: text('period_start'), // DD/MM/YYYY
  periodEnd: text('period_end'), // DD/MM/YYYY
  billingReason: text('billing_reason'), // 'subscription_create', 'subscription_cycle', 'manual'
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  invoicePdf: text('invoice_pdf'), // URL to invoice PDF
  hostedInvoiceUrl: text('hosted_invoice_url'), // Stripe hosted invoice URL
  metadata: text('metadata', { mode: 'json' }),
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// Payments table - Comprehensive payment tracking for all Stripe transactions
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  
  // Stripe references
  stripeCustomerId: text('stripe_customer_id'),
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  stripeChargeId: text('stripe_charge_id'),
  stripeInvoiceId: text('stripe_invoice_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripeSessionId: text('stripe_session_id'),
  subscriptionPlan: text('subscription_plan'),
  userRole: text('user_role'),
  
  // Payment details
  amount: real('amount').notNull(), // Amount in currency units (e.g., 19.99 for £19.99)
  currency: text('currency').notNull().default('GBP'),
  paymentStatus: text('payment_status').notNull(), // 'succeeded', 'pending', 'failed', 'canceled', 'refunded', 'partially_refunded'
  paymentMethod: text('payment_method'), // 'card', 'bank_transfer', etc.
  paymentMethodBrand: text('payment_method_brand'), // 'visa', 'mastercard', etc.
  paymentMethodLast4: text('payment_method_last4'), // Last 4 digits of card
  
  // Transaction details
  description: text('description'),
  billingReason: text('billing_reason'), // 'subscription_create', 'subscription_cycle', 'subscription_update', 'manual', 'booking'
  receiptUrl: text('receipt_url'), // Stripe receipt URL
  receiptEmail: text('receipt_email'),
  
  // Refund information
  refundAmount: real('refund_amount').default(0),
  refundedAt: text('refunded_at'), // DD/MM/YYYY HH:mm:ss
  refundReason: text('refund_reason'),
  
  // Relations
  invoiceId: integer('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
  subscriptionId: integer('subscription_id').references(() => subscriptions.id, { onDelete: 'set null' }),
  bookingId: integer('booking_id').references(() => bookings.id, { onDelete: 'set null' }),
  
  // Additional metadata
  failureCode: text('failure_code'), // Stripe failure code if payment failed
  failureMessage: text('failure_message'),
  networkStatus: text('network_status'), // 'approved_by_network', 'declined_by_network', etc.
  riskLevel: text('risk_level'), // 'normal', 'elevated', 'highest'
  riskScore: integer('risk_score'), // Stripe Radar risk score
  
  // Metadata and timestamps
  metadata: text('metadata', { mode: 'json' }), // Additional Stripe metadata
  stripeEventId: text('stripe_event_id'), // For idempotency
  processedAt: text('processed_at'), // DD/MM/YYYY HH:mm:ss - When webhook processed
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// ============================================
// MILESTONE 2 - MEDIA MANAGEMENT
// ============================================

// Media table - Centralized media library for all uploads
export const media = sqliteTable('media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull().unique(),
  fileType: text('file_type').notNull(), // 'image', 'video', 'document', 'audio'
  mimeType: text('mime_type').notNull(), // 'image/jpeg', 'video/mp4', etc.
  fileSize: integer('file_size').notNull(), // Size in bytes
  width: integer('width'), // For images/videos
  height: integer('height'), // For images/videos
  duration: integer('duration'), // For videos/audio in seconds
  altText: text('alt_text'),
  caption: text('caption'),
  description: text('description'),
  title: text('title'),
  entityType: text('entity_type'), // 'property', 'experience', 'destination', 'blog', 'user', 'general'
  entityId: text('entity_id'), // ID of the related entity
  uploadedBy: text('uploaded_by').references(() => user.id, { onDelete: 'set null' }),
  folder: text('folder').default('general'), // Organize media into folders
  tags: text('tags', { mode: 'json' }), // Array of tags for searching
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
  thumbnailUrl: text('thumbnail_url'), // For videos/documents
  metadata: text('metadata', { mode: 'json' }), // EXIF data, video metadata, etc.
  storageProvider: text('storage_provider').default('supabase'), // 'supabase', 's3', 'cloudinary'
  storageKey: text('storage_key'), // Key/path in storage provider
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// ============================================
// MILESTONE 2 - ENQUIRIES SYSTEM
// ============================================

// Enquiries table - General enquiries from website forms
export const enquiries = sqliteTable('enquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  enquiryType: text('enquiry_type').notNull().default('general'), // 'general', 'booking', 'property', 'partnership', 'support'
  source: text('source').default('website'), // 'website', 'email', 'phone', 'social'
  status: text('status').notNull().default('new'), // 'new', 'in_progress', 'resolved', 'closed', 'spam'
  priority: text('priority').default('medium'), // 'low', 'medium', 'high', 'urgent'
  assignedTo: text('assigned_to'), // Staff member assigned to this enquiry
  propertyId: integer('property_id').references(() => properties.id, { onDelete: 'set null' }),
  checkInDate: text('check_in_date'), // DD/MM/YYYY - for booking enquiries
  checkOutDate: text('check_out_date'), // DD/MM/YYYY - for booking enquiries
  numberOfGuests: integer('number_of_guests'),
  occasion: text('occasion'),
  budget: real('budget'),
  preferredLocations: text('preferred_locations', { mode: 'json' }), // Array of locations
  specialRequests: text('special_requests'),
  referralSource: text('referral_source'), // How they heard about us
  marketingConsent: integer('marketing_consent', { mode: 'boolean' }).default(false),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  adminNotes: text('admin_notes'),
  internalNotes: text('internal_notes'),
  responseTemplate: text('response_template'), // Template used for response
  respondedAt: text('responded_at'), // DD/MM/YYYY HH:mm:ss
  respondedBy: text('responded_by'),
  resolvedAt: text('resolved_at'), // DD/MM/YYYY HH:mm:ss
  metadata: text('metadata', { mode: 'json' }),
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// Seasonal Pricing table - Milestone 8
export const seasonalPricing = sqliteTable('seasonal_pricing', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // e.g., "Summer Peak Season"
  seasonType: text('season_type').notNull(), // 'peak', 'high', 'mid', 'low', 'off-peak'
  startDate: text('start_date').notNull(), // DD/MM/YYYY
  endDate: text('end_date').notNull(), // DD/MM/YYYY
  pricePerNight: real('price_per_night').notNull(),
  minimumStay: integer('minimum_stay'), // nights
  dayType: text('day_type').notNull().default('any'), // 'weekday', 'weekend', 'any'
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  priority: integer('priority').default(0), // Higher priority = applied first
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// Special Date Pricing table - Milestone 8
export const specialDatePricing = sqliteTable('special_date_pricing', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // e.g., "Christmas Week"
  date: text('date').notNull(), // DD/MM/YYYY
  endDate: text('end_date'), // For multi-day events, DD/MM/YYYY
  pricePerNight: real('price_per_night').notNull(),
  minimumStay: integer('minimum_stay'),
  isAvailable: integer('is_available', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// Performance Stats table - Milestone 9
export const performanceStats = sqliteTable('performance_stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  entityType: text('entity_type').notNull(), // 'property', 'owner', 'platform'
  entityId: text('entity_id'), // Property ID, Owner ID, or null for platform-wide
  period: text('period').notNull(), // 'daily', 'weekly', 'monthly', 'yearly'
  periodStart: text('period_start').notNull(), // DD/MM/YYYY
  periodEnd: text('period_end').notNull(), // DD/MM/YYYY
  
  // Traffic Metrics
  pageViews: integer('page_views').default(0),
  uniqueVisitors: integer('unique_visitors').default(0),
  avgSessionDuration: integer('avg_session_duration').default(0), // seconds
  bounceRate: real('bounce_rate').default(0), // percentage
  
  // Enquiry Metrics
  totalEnquiries: integer('total_enquiries').default(0),
  newEnquiries: integer('new_enquiries').default(0),
  inProgressEnquiries: integer('in_progress_enquiries').default(0),
  resolvedEnquiries: integer('resolved_enquiries').default(0),
  avgResponseTime: integer('avg_response_time').default(0), // minutes
  conversionRate: real('conversion_rate').default(0), // percentage
  
  // Booking Metrics
  totalBookings: integer('total_bookings').default(0),
  confirmedBookings: integer('confirmed_bookings').default(0),
  cancelledBookings: integer('cancelled_bookings').default(0),
  pendingBookings: integer('pending_bookings').default(0),
  totalRevenue: real('total_revenue').default(0),
  avgBookingValue: real('avg_booking_value').default(0),
  occupancyRate: real('occupancy_rate').default(0), // percentage
  
  // Guest Metrics
  totalGuests: integer('total_guests').default(0),
  returningGuests: integer('returning_guests').default(0),
  avgGuestsPerBooking: real('avg_guests_per_booking').default(0),
  
  // Rating Metrics
  totalReviews: integer('total_reviews').default(0),
  avgRating: real('avg_rating').default(0),
  fiveStarReviews: integer('five_star_reviews').default(0),
  fourStarReviews: integer('four_star_reviews').default(0),
  threeStarReviews: integer('three_star_reviews').default(0),
  twoStarReviews: integer('two_star_reviews').default(0),
  oneStarReviews: integer('one_star_reviews').default(0),
  
  // Financial Metrics
  depositsPaid: real('deposits_paid').default(0),
  balancesPaid: real('balances_paid').default(0),
  pendingPayments: real('pending_payments').default(0),
  refundsIssued: real('refunds_issued').default(0),
  
  // Marketing Metrics
  emailSent: integer('email_sent').default(0),
  emailOpened: integer('email_opened').default(0),
  emailClicked: integer('email_clicked').default(0),
  emailOpenRate: real('email_open_rate').default(0), // percentage
  emailClickRate: real('email_click_rate').default(0), // percentage
  
  // Metadata
  metadata: text('metadata', { mode: 'json' }), // Additional custom metrics
  calculatedAt: text('calculated_at').notNull(), // DD/MM/YYYY HH:mm:ss
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// Availability Calendar - Milestone 10
export const availabilityCalendar = sqliteTable('availability_calendar', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // DD/MM/YYYY
  isAvailable: integer('is_available', { mode: 'boolean' }).default(true),
  status: text('status').notNull().default('available'), // 'available', 'booked', 'blocked', 'maintenance'
  price: real('price'), // Price for this specific date (overrides seasonal pricing)
  minimumStay: integer('minimum_stay').default(1),
  bookingId: integer('booking_id').references(() => bookings.id, { onDelete: 'set null' }), // Link to booking if booked
  notes: text('notes'),
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// Orchards Payment Integration - Milestone 10
export const orchardsPayments = sqliteTable('orchards_payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  orchardsTransactionId: text('orchards_transaction_id').unique(),
  orchardsPaymentUrl: text('orchards_payment_url'),
  paymentType: text('payment_type').notNull(), // 'deposit', 'balance', 'full'
  amount: real('amount').notNull(),
  currency: text('currency').notNull().default('GBP'),
  status: text('status').notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'
  paidAt: text('paid_at'), // DD/MM/YYYY HH:mm:ss
  refundedAt: text('refunded_at'), // DD/MM/YYYY HH:mm:ss
  failureReason: text('failure_reason'),
  metadata: text('metadata', { mode: 'json' }), // Orchards API response data
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// Property Reviews - Milestone 10
export const propertyReviews = sqliteTable('property_reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  bookingId: integer('booking_id').references(() => bookings.id, { onDelete: 'set null' }),
  guestName: text('guest_name').notNull(),
  guestEmail: text('guest_email'),
  rating: integer('rating').notNull(), // 1-5
  title: text('title'),
  review: text('review').notNull(),
  cleanliness: integer('cleanliness'), // 1-5
  accuracy: integer('accuracy'), // 1-5
  communication: integer('communication'), // 1-5
  location: integer('location'), // 1-5
  value: integer('value'), // 1-5
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false), // Verified booking
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  ownerResponse: text('owner_response'),
  respondedAt: text('responded_at'), // DD/MM/YYYY HH:mm:ss
  createdAt: text('created_at').notNull(), // DD/MM/YYYY HH:mm:ss
  updatedAt: text('updated_at').notNull(), // DD/MM/YYYY HH:mm:ss
});

// Export alias for user table (for convenience in queries)
export const users = user;