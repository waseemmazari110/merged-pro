import { feature, product, priceItem, featureItem, pricedFeatureItem } from "atmn";

export const propertyBookings = feature({
  id: "property_bookings",
  name: "Property Bookings",
  type: "continuous_use",
});

export const experienceAddons = feature({
  id: "experience_addons",
  name: "Experience Add-ons",
  type: "single_use",
});

export const browseProperties = feature({
  id: "browse_properties",
  name: "Browse Properties",
  type: "boolean",
});

export const saveFavorites = feature({
  id: "save_favorites",
  name: "Save Favorites",
  type: "boolean",
});

export const viewPricing = feature({
  id: "view_pricing",
  name: "View Pricing",
  type: "boolean",
});

export const bookingConfirmation = feature({
  id: "booking_confirmation",
  name: "Booking Confirmation",
  type: "boolean",
});

export const dateReservation = feature({
  id: "date_reservation",
  name: "Date Reservation",
  type: "boolean",
});

export const experienceAddonsAccess = feature({
  id: "experience_addons_access",
  name: "Experience Add-ons Access",
  type: "boolean",
});

export const free = product({
  id: "free",
  name: "Free Plan",
  is_default: true,
  items: [
    featureItem({
      feature_id: browseProperties.id,
    }),
    featureItem({
      feature_id: saveFavorites.id,
    }),
    featureItem({
      feature_id: viewPricing.id,
    }),
  ],
});

export const depositSmall = product({
  id: "deposit_small",
  name: "Small Property Deposit",
  items: [
    priceItem({
      price: 200,
    }),
    featureItem({
      feature_id: propertyBookings.id,
      included_usage: 1,
    }),
    featureItem({
      feature_id: bookingConfirmation.id,
    }),
    featureItem({
      feature_id: dateReservation.id,
    }),
    featureItem({
      feature_id: experienceAddonsAccess.id,
    }),
  ],
});

export const depositMedium = product({
  id: "deposit_medium",
  name: "Medium Property Deposit",
  items: [
    priceItem({
      price: 350,
    }),
    featureItem({
      feature_id: propertyBookings.id,
      included_usage: 1,
    }),
    featureItem({
      feature_id: bookingConfirmation.id,
    }),
    featureItem({
      feature_id: dateReservation.id,
    }),
    featureItem({
      feature_id: experienceAddonsAccess.id,
    }),
  ],
});

export const depositLarge = product({
  id: "deposit_large",
  name: "Large Property Deposit",
  items: [
    priceItem({
      price: 500,
    }),
    featureItem({
      feature_id: propertyBookings.id,
      included_usage: 1,
    }),
    featureItem({
      feature_id: bookingConfirmation.id,
    }),
    featureItem({
      feature_id: dateReservation.id,
    }),
    featureItem({
      feature_id: experienceAddonsAccess.id,
    }),
  ],
});

export const addonCocktail = product({
  id: "addon_cocktail",
  name: "Cocktail Masterclass",
  is_add_on: true,
  items: [
    pricedFeatureItem({
      feature_id: experienceAddons.id,
      price: 50,
      billing_units: 1,
      usage_model: "prepaid",
    }),
  ],
});

export const addonChef = product({
  id: "addon_chef",
  name: "Private Chef",
  is_add_on: true,
  items: [
    pricedFeatureItem({
      feature_id: experienceAddons.id,
      price: 55,
      billing_units: 1,
      usage_model: "prepaid",
    }),
  ],
});

export const addonPaint = product({
  id: "addon_paint",
  name: "Sip & Paint",
  is_add_on: true,
  items: [
    pricedFeatureItem({
      feature_id: experienceAddons.id,
      price: 45,
      billing_units: 1,
      usage_model: "prepaid",
    }),
  ],
});

export const addonPamper = product({
  id: "addon_pamper",
  name: "Pamper Party",
  is_add_on: true,
  items: [
    pricedFeatureItem({
      feature_id: experienceAddons.id,
      price: 65,
      billing_units: 1,
      usage_model: "prepaid",
    }),
  ],
});

export const addonYoga = product({
  id: "addon_yoga",
  name: "Yoga & Wellness",
  is_add_on: true,
  items: [
    pricedFeatureItem({
      feature_id: experienceAddons.id,
      price: 40,
      billing_units: 1,
      usage_model: "prepaid",
    }),
  ],
});

export const addonMystery = product({
  id: "addon_mystery",
  name: "Murder Mystery Night",
  is_add_on: true,
  items: [
    pricedFeatureItem({
      feature_id: experienceAddons.id,
      price: 50,
      billing_units: 1,
      usage_model: "prepaid",
    }),
  ],
});