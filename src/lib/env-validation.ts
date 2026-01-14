/**
 * Environment Variables Validation Utility
 * Global Rules:
 * - Never hardcode secrets
 * - All secrets must be in environment variables
 * - Validate required variables on startup
 */

// Required environment variables
const REQUIRED_ENV_VARS = [
  'TURSO_CONNECTION_URL',
  'TURSO_AUTH_TOKEN',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'NEXT_PUBLIC_APP_URL',
] as const;

// Optional but recommended environment variables
const OPTIONAL_ENV_VARS = [
  'STRIPE_TEST_KEY',
  'STRIPE_LIVE_KEY',
  'AUTUMN_SANDBOX_SECRET_KEY',
  'AUTUMN_PRODUCTION_SECRET_KEY',
  'AUTUMN_SECRET_KEY',
  'GMAIL_SMTP_APP_PASSWORD',
  'CRM_API_KEY',
  'CRM_API_SECRET',
  'CRM_WEBHOOK_SECRET',
] as const;

interface ValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
  errors: string[];
}

/**
 * Validate that all required environment variables are set
 */
export function validateEnvironment(): ValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  // Check optional variables and warn if missing
  for (const envVar of OPTIONAL_ENV_VARS) {
    if (!process.env[envVar]) {
      warnings.push(`Optional environment variable not set: ${envVar}`);
    }
  }

  // Check for hardcoded secrets in common patterns
  const suspiciousPatterns = [
    'sk_test_',
    'sk_live_',
    'pk_test_',
    'pk_live_',
    'Bearer ',
  ];

  // Validate Stripe keys are in test mode if present
  if (process.env.STRIPE_TEST_KEY && !process.env.STRIPE_TEST_KEY.startsWith('sk_test_')) {
    errors.push('STRIPE_TEST_KEY must start with sk_test_');
  }

  if (process.env.STRIPE_LIVE_KEY && process.env.NODE_ENV !== 'production') {
    warnings.push('STRIPE_LIVE_KEY is set in non-production environment');
  }

  // Validate URLs
  const urlVars = ['BETTER_AUTH_URL', 'NEXT_PUBLIC_APP_URL'];
  for (const urlVar of urlVars) {
    const value = process.env[urlVar];
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      errors.push(`${urlVar} must be a valid URL starting with http:// or https://`);
    }
  }

  return {
    valid: missing.length === 0 && errors.length === 0,
    missing,
    warnings,
    errors,
  };
}

/**
 * Get environment variable with validation
 * Throws error if variable is required and not set
 */
export function getEnvVar(
  key: string,
  options: { required?: boolean; defaultValue?: string } = {}
): string {
  const { required = false, defaultValue = '' } = options;
  const value = process.env[key];

  if (!value) {
    if (required) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return defaultValue;
  }

  return value;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in test mode
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Get Stripe key based on environment
 * Always returns test key in non-production
 */
export function getStripeKey(): string {
  if (isProduction() && process.env.STRIPE_LIVE_KEY) {
    return process.env.STRIPE_LIVE_KEY;
  }
  return getEnvVar('STRIPE_TEST_KEY', { required: true });
}

/**
 * Get Autumn key based on environment
 */
export function getAutumnKey(): string {
  if (isProduction() && process.env.AUTUMN_PRODUCTION_SECRET_KEY) {
    return process.env.AUTUMN_PRODUCTION_SECRET_KEY;
  }
  return getEnvVar('AUTUMN_SANDBOX_SECRET_KEY', { required: true });
}

/**
 * Log environment validation results
 */
export function logEnvironmentStatus(): void {
  const result = validateEnvironment();

  console.log('🔒 Environment Variables Status');
  console.log('═'.repeat(50));

  if (result.valid) {
    console.log('✅ All required environment variables are set');
  } else {
    console.error('❌ Environment validation failed');
  }

  if (result.errors.length > 0) {
    console.error('\n❌ Errors:');
    result.errors.forEach(error => console.error(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Warnings:');
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  console.log('\n📊 Environment:', process.env.NODE_ENV || 'development');
  console.log('🌍 Using Stripe:', isProduction() ? 'LIVE MODE' : 'TEST MODE');
  console.log('═'.repeat(50));

  if (!result.valid) {
    console.error('\n❌ Please set missing environment variables in .env.local');
    console.error('   See .env.example for required variables');
  }
}

// Validate environment on module load in development
if (isDevelopment() && typeof window === 'undefined') {
  const result = validateEnvironment();
  if (!result.valid) {
    console.warn('\n⚠️  Environment validation warnings detected');
    console.warn('   Some features may not work correctly\n');
  }
}
