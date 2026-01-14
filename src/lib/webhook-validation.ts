/**
 * Webhook Signature Validation Utilities
 * Global Rules:
 * - Always validate webhook signatures
 * - Never process unverified webhooks
 * - Log all webhook attempts
 */

import crypto from 'crypto';

/**
 * Verify Stripe webhook signature
 * @param payload - Raw request body as string
 * @param signature - Stripe-Signature header value
 * @param secret - Webhook secret from Stripe dashboard
 * @returns true if signature is valid
 */
export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string,
  secret: string
): boolean {
  try {
    const payloadString = Buffer.isBuffer(payload) ? payload.toString('utf8') : payload;
    
    // Extract timestamp and signatures from header
    const elements = signature.split(',');
    const timestamp = elements.find(e => e.startsWith('t='))?.split('=')[1];
    const signatures = elements
      .filter(e => e.startsWith('v1='))
      .map(e => e.split('=')[1]);

    if (!timestamp || signatures.length === 0) {
      console.error('❌ Invalid Stripe signature format');
      return false;
    }

    // Construct the signed payload
    const signedPayload = `${timestamp}.${payloadString}`;
    
    // Compute expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    // Compare signatures using timing-safe comparison
    const isValid = signatures.some(sig => 
      crypto.timingSafeEqual(
        Buffer.from(sig, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      )
    );

    if (!isValid) {
      console.error('❌ Stripe webhook signature verification failed');
      return false;
    }

    // Check timestamp tolerance (5 minutes)
    const timestampAge = Math.floor(Date.now() / 1000) - parseInt(timestamp);
    if (timestampAge > 300) {
      console.error('❌ Stripe webhook timestamp too old:', timestampAge, 'seconds');
      return false;
    }

    console.log('✅ Stripe webhook signature verified');
    return true;

  } catch (error) {
    console.error('❌ Error verifying Stripe webhook:', error);
    return false;
  }
}

/**
 * Verify CRM webhook signature (TreadSoft)
 * @param payload - Raw request body
 * @param signature - Webhook signature header
 * @param secret - Webhook secret from CRM settings
 * @returns true if signature is valid
 */
export function verifyCRMWebhook(
  payload: string | Buffer,
  signature: string,
  secret: string
): boolean {
  try {
    const payloadString = Buffer.isBuffer(payload) ? payload.toString('utf8') : payload;
    
    // Compute expected signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadString, 'utf8')
      .digest('hex');

    // Timing-safe comparison
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      console.error('❌ CRM webhook signature verification failed');
      return false;
    }

    console.log('✅ CRM webhook signature verified');
    return true;

  } catch (error) {
    console.error('❌ Error verifying CRM webhook:', error);
    return false;
  }
}

/**
 * Verify generic HMAC webhook signature
 * @param payload - Raw request body
 * @param signature - Signature header value
 * @param secret - Webhook secret
 * @param algorithm - HMAC algorithm (default: sha256)
 * @returns true if signature is valid
 */
export function verifyHMACWebhook(
  payload: string | Buffer,
  signature: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256'
): boolean {
  try {
    const payloadString = Buffer.isBuffer(payload) ? payload.toString('utf8') : payload;
    
    const expectedSignature = crypto
      .createHmac(algorithm, secret)
      .update(payloadString, 'utf8')
      .digest('hex');

    // Remove common prefixes
    const cleanSignature = signature
      .replace('sha256=', '')
      .replace('sha512=', '');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(cleanSignature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      console.error(`❌ HMAC webhook signature verification failed (${algorithm})`);
      return false;
    }

    console.log(`✅ HMAC webhook signature verified (${algorithm})`);
    return true;

  } catch (error) {
    console.error('❌ Error verifying HMAC webhook:', error);
    return false;
  }
}

/**
 * Log webhook attempt
 * @param provider - Webhook provider name
 * @param event - Event type
 * @param success - Whether verification succeeded
 */
export function logWebhookAttempt(
  provider: string,
  event: string,
  success: boolean
): void {
  const timestamp = new Date().toISOString();
  const status = success ? '✅' : '❌';
  
  console.log(`${status} [${timestamp}] Webhook: ${provider} - ${event} - ${success ? 'Verified' : 'Failed'}`);
}

/**
 * Extract raw body from Next.js request
 * Required for webhook signature verification
 */
export async function getRawBody(req: Request): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  
  if (!reader) {
    throw new Error('Request body is not readable');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));
}
