declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
  if (typeof window !== "undefined") {
    console.log(`[Analytics] ${eventName}`, params);
  }
}

export const AuthEvents = {
  VIEW_SIGNUP_PAGE: "view_signup_page",
  CLICK_APPLE_LOGIN: "click_apple_login",
  CLICK_GOOGLE_LOGIN: "click_google_login",
  SUBMIT_EMAIL_SIGNUP: "submit_email_signup",
  SIGNUP_SUCCESS: "signup_success",
  LOGIN_SUCCESS: "login_success",
  SELECT_ACCOUNT_TYPE_CUSTOMER: "select_account_type_customer",
  SELECT_ACCOUNT_TYPE_OWNER: "select_account_type_owner",
  SIGNUP_ABANDON_EMAIL: "signup_abandon_email",
  SIGNUP_ABANDON_PASSWORD: "signup_abandon_password",
};
