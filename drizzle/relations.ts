import { relations } from "drizzle-orm/relations";
import { properties, bookings, user, account, session, destinations, destinationImages, experiences, experienceFaqs, experienceImages, propertyFeatures, propertyImages, reviews, crmEnquiries, crmOwnerProfiles, crmPropertyLinks, enquiries, subscriptions, invoices, media, payments, propertyReviews, availabilityCalendar, orchardsPayments, seasonalPricing, specialDatePricing } from "./schema";

export const bookingsRelations = relations(bookings, ({one, many}) => ({
	property: one(properties, {
		fields: [bookings.propertyId],
		references: [properties.id]
	}),
	payments: many(payments),
	propertyReviews: many(propertyReviews),
	availabilityCalendars: many(availabilityCalendar),
	orchardsPayments: many(orchardsPayments),
}));

export const propertiesRelations = relations(properties, ({one, many}) => ({
	bookings: many(bookings),
	user_approvedBy: one(user, {
		fields: [properties.approvedBy],
		references: [user.id],
		relationName: "properties_approvedBy_user_id"
	}),
	user_ownerId: one(user, {
		fields: [properties.ownerId],
		references: [user.id],
		relationName: "properties_ownerId_user_id"
	}),
	propertyFeatures: many(propertyFeatures),
	propertyImages: many(propertyImages),
	reviews: many(reviews),
	crmEnquiries: many(crmEnquiries),
	crmPropertyLinks: many(crmPropertyLinks),
	enquiries: many(enquiries),
	propertyReviews: many(propertyReviews),
	availabilityCalendars: many(availabilityCalendar),
	seasonalPricings: many(seasonalPricing),
	specialDatePricings: many(specialDatePricing),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	properties_approvedBy: many(properties, {
		relationName: "properties_approvedBy_user_id"
	}),
	properties_ownerId: many(properties, {
		relationName: "properties_ownerId_user_id"
	}),
	crmEnquiries: many(crmEnquiries),
	crmOwnerProfiles: many(crmOwnerProfiles),
	crmPropertyLinks: many(crmPropertyLinks),
	invoices: many(invoices),
	media: many(media),
	subscriptions: many(subscriptions),
	payments: many(payments),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const destinationImagesRelations = relations(destinationImages, ({one}) => ({
	destination: one(destinations, {
		fields: [destinationImages.destinationId],
		references: [destinations.id]
	}),
}));

export const destinationsRelations = relations(destinations, ({many}) => ({
	destinationImages: many(destinationImages),
}));

export const experienceFaqsRelations = relations(experienceFaqs, ({one}) => ({
	experience: one(experiences, {
		fields: [experienceFaqs.experienceId],
		references: [experiences.id]
	}),
}));

export const experiencesRelations = relations(experiences, ({many}) => ({
	experienceFaqs: many(experienceFaqs),
	experienceImages: many(experienceImages),
}));

export const experienceImagesRelations = relations(experienceImages, ({one}) => ({
	experience: one(experiences, {
		fields: [experienceImages.experienceId],
		references: [experiences.id]
	}),
}));

export const propertyFeaturesRelations = relations(propertyFeatures, ({one}) => ({
	property: one(properties, {
		fields: [propertyFeatures.propertyId],
		references: [properties.id]
	}),
}));

export const propertyImagesRelations = relations(propertyImages, ({one}) => ({
	property: one(properties, {
		fields: [propertyImages.propertyId],
		references: [properties.id]
	}),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	property: one(properties, {
		fields: [reviews.propertyId],
		references: [properties.id]
	}),
}));

export const crmEnquiriesRelations = relations(crmEnquiries, ({one}) => ({
	property: one(properties, {
		fields: [crmEnquiries.propertyId],
		references: [properties.id]
	}),
	user: one(user, {
		fields: [crmEnquiries.ownerId],
		references: [user.id]
	}),
}));

export const crmOwnerProfilesRelations = relations(crmOwnerProfiles, ({one}) => ({
	user: one(user, {
		fields: [crmOwnerProfiles.userId],
		references: [user.id]
	}),
}));

export const crmPropertyLinksRelations = relations(crmPropertyLinks, ({one}) => ({
	property: one(properties, {
		fields: [crmPropertyLinks.propertyId],
		references: [properties.id]
	}),
	user: one(user, {
		fields: [crmPropertyLinks.ownerId],
		references: [user.id]
	}),
}));

export const enquiriesRelations = relations(enquiries, ({one}) => ({
	property: one(properties, {
		fields: [enquiries.propertyId],
		references: [properties.id]
	}),
}));

export const invoicesRelations = relations(invoices, ({one, many}) => ({
	subscription: one(subscriptions, {
		fields: [invoices.subscriptionId],
		references: [subscriptions.id]
	}),
	user: one(user, {
		fields: [invoices.userId],
		references: [user.id]
	}),
	payments: many(payments),
}));

export const subscriptionsRelations = relations(subscriptions, ({one, many}) => ({
	invoices: many(invoices),
	user: one(user, {
		fields: [subscriptions.userId],
		references: [user.id]
	}),
	payments: many(payments),
}));

export const mediaRelations = relations(media, ({one}) => ({
	user: one(user, {
		fields: [media.uploadedBy],
		references: [user.id]
	}),
}));

export const paymentsRelations = relations(payments, ({one}) => ({
	booking: one(bookings, {
		fields: [payments.bookingId],
		references: [bookings.id]
	}),
	subscription: one(subscriptions, {
		fields: [payments.subscriptionId],
		references: [subscriptions.id]
	}),
	invoice: one(invoices, {
		fields: [payments.invoiceId],
		references: [invoices.id]
	}),
	user: one(user, {
		fields: [payments.userId],
		references: [user.id]
	}),
}));

export const propertyReviewsRelations = relations(propertyReviews, ({one}) => ({
	booking: one(bookings, {
		fields: [propertyReviews.bookingId],
		references: [bookings.id]
	}),
	property: one(properties, {
		fields: [propertyReviews.propertyId],
		references: [properties.id]
	}),
}));

export const availabilityCalendarRelations = relations(availabilityCalendar, ({one}) => ({
	booking: one(bookings, {
		fields: [availabilityCalendar.bookingId],
		references: [bookings.id]
	}),
	property: one(properties, {
		fields: [availabilityCalendar.propertyId],
		references: [properties.id]
	}),
}));

export const orchardsPaymentsRelations = relations(orchardsPayments, ({one}) => ({
	booking: one(bookings, {
		fields: [orchardsPayments.bookingId],
		references: [bookings.id]
	}),
}));

export const seasonalPricingRelations = relations(seasonalPricing, ({one}) => ({
	property: one(properties, {
		fields: [seasonalPricing.propertyId],
		references: [properties.id]
	}),
}));

export const specialDatePricingRelations = relations(specialDatePricing, ({one}) => ({
	property: one(properties, {
		fields: [specialDatePricing.propertyId],
		references: [properties.id]
	}),
}));