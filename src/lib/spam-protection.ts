/**
 * Comprehensive Spam Protection Utility
 * Reusable across all forms and API routes
 */

// ============================================
// CONFIGURATION
// ============================================

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_SUBMISSIONS_PER_IP = 50; // Increased from 1
const MIN_FORM_FILL_TIME_MS = 2000; // Decreased from 12000 (2 seconds)
const MAX_FORM_FILL_TIME_MS = 30 * 60 * 1000; // Increased from 15 minutes to 30 minutes
const MIN_USER_CLICKS = 1; // Decreased from 3
const MIN_USER_KEYSTROKES_TRUSTED = 1; // Decreased from 10
const MIN_USER_KEYSTROKES_UNTRUSTED = 2; // Decreased from 15
const MAX_EMAIL_LENGTH = 100; // Increased from 60
const MIN_EMAIL_LENGTH = 5; // Decreased from 6

// ============================================
// IN-MEMORY STORAGE (replace with database in production)
// ============================================

interface RateLimitEntry {
  count: number;
  firstSubmission: number;
  emails: string[];
}

interface BlacklistEntry {
  timestamp: number;
  reason: string;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const ipBlacklist = new Map<string, BlacklistEntry>();
const emailBlacklist = new Map<string, BlacklistEntry>();

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  
  // Clean rate limits
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now - entry.firstSubmission > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(ip);
    }
  }
  
  // Clean blacklists (keep for 30 days)
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  for (const [ip, entry] of ipBlacklist.entries()) {
    if (now - entry.timestamp > thirtyDaysMs) {
      ipBlacklist.delete(ip);
    }
  }
  for (const [email, entry] of emailBlacklist.entries()) {
    if (now - entry.timestamp > thirtyDaysMs) {
      emailBlacklist.delete(email);
    }
  }
}, 60 * 60 * 1000); // Run every hour

// ============================================
// DISPOSABLE EMAIL DOMAINS (200+)
// ============================================

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'throwaway.email',
  'mailinator.com', 'maildrop.cc', 'temp-mail.org', 'getnada.com',
  'trashmail.com', 'yopmail.com', 'mailnesia.com', 'fakeinbox.com',
  'throwawaymail.com', 'spamgourmet.com', 'mailcatch.com', 'mytemp.email',
  'sharklasers.com', 'guerrillamail.info', 'grr.la', 'guerrillamail.biz',
  'guerrillamail.de', 'spam4.me', 'temporary-mail.net', 'disposableemailaddresses.com',
  'mintemail.com', 'emailondeck.com', 'jetable.org', 'getairmail.com',
  'tempinbox.com', 'mailexpire.com', 'tempmail.net', 'discard.email',
  'mailtemp.info', 'anonymousemail.me', 'tempmailaddress.com', 'emailsensei.com',
  'mohmal.com', 'trashinbox.net', 'receiveee.com', 'maileater.com',
  'suremail.info', 'emailtemporario.com.br', 'tempemail.net', 'tempsky.com',
  'spambox.us', 'inboxkitten.com', 'guerrillamailblock.com', 'tempmail2.com',
  'mvrht.com', 'nospam.ze.tc', 'armyspy.com', 'cuvox.de', 'dayrep.com',
  'einrot.com', 'fleckens.hu', 'gustr.com', 'jourrapide.com', 'rhyta.com',
  'superrito.com', 'teleworm.us', 'mailforspam.com', 'fake-mail.com',
  'fakemailgenerator.com', 'fakemail.net', 'spamthisplease.com', 'thankyou2010.com',
  'trash-mail.at', 'trash2009.com', 'wegwerfmail.de', 'wegwerf-email.de',
  'emailfake.com', 'faketempmail.com', 'tempmail.us', 'temp-mails.com',
  'temporary-mail.com', 'temp-mail.io', 'tempr.email', 'tmpmail.net',
  'tmpmail.org', 'tmpnator.live', 'tmail.ws', 'tmailweb.com',
  'dropmail.me', 'moakt.com', 'nowmymail.net', 'rootfest.net',
  'spamfree24.com', 'spamfree24.de', 'spamfree24.eu', 'spamfree24.info',
  'spamfree24.net', 'spamfree24.org', 'spam.la', 'trashmail.at',
  'anonymbox.com', 'bugmenot.com', 'deadaddress.com', 'despam.it',
  'disposeamail.com', 'dodgeit.com', 'dodgit.com', 'dontreg.com',
  'drdrb.net', 'e4ward.com', 'emailias.com', 'fakemailz.com',
  'filzmail.com', 'get2mail.fr', 'get1mail.com', 'getonemail.com',
  'getonemail.net', 'gishpuppy.com', 'great-host.in', 'greensloth.com',
  'harakirimail.com', 'hidemail.de', 'ihateyoualot.info', 'imails.info',
  'incognitomail.com', 'incognitomail.net', 'jnxjn.com', 'keepmymail.com',
  'killmail.com', 'killmail.net', 'link2mail.net', 'lookugly.com',
  'lopl.co.cc', 'lr78.com', 'maboard.com', 'mail-temporaire.fr',
  'mail.by', 'mail.mezimages.net', 'mail2world.com', 'mail4trash.com',
  'mailbidon.com', 'mailblocks.com', 'mailcatch.com', 'maileater.com',
  'mailfa.tk', 'mailin8r.com', 'mailinater.com', 'mailinator.net',
  'mailinator2.com', 'mailincubator.com', 'mailme.lv', 'mailmetrash.com',
  'mailmoat.com', 'mailnull.com', 'mailshell.com', 'mailsiphon.com',
  'mailslite.com', 'mailzilla.com', 'mbx.cc', 'mega.zik.dj',
  'meltmail.com', 'messagebeamer.de', 'mierdamail.com', 'mintemail.com',
  'moburl.com', 'moncourrier.fr.nf', 'monemail.fr.nf', 'mt2009.com',
  'mx0.wwwnew.eu', 'mycleaninbox.net', 'mytrashmail.com', 'netmails.com',
  'netmails.net', 'netzidiot.de', 'neverbox.com', 'no-spam.ws',
  'nobulk.com', 'noclickemail.com', 'nogmailspam.info', 'nomail.xl.cx',
  'nomail2me.com', 'nospam.ze.tc', 'nospam4.us', 'nospamfor.us',
  'nospammail.net', 'notmailinator.com', 'nowhere.org', 'nowmymail.com',
  'objectmail.com', 'obobbo.com', 'oneoffemail.com', 'onewaymail.com',
  'online.ms', 'oopi.org', 'ordinaryamerican.net', 'otherinbox.com',
  'ourklips.com', 'outlawspam.com', 'ovpn.to', 'owlpic.com',
  'pancakemail.com', 'pimpedupmyspace.com', 'pjjkp.com', 'politikerclub.de',
  'pookmail.com', 'privacy.net', 'proxymail.eu', 'prtnx.com',
  'putthisinyourspamdatabase.com', 'qq.com', 'quickinbox.com', 'rcpt.at',
  'reallymymail.com', 'recode.me', 'recursor.net', 'reliable-mail.com',
  'rhyta.com', 'rmqkr.net', 'rtrtr.com', 's0ny.net',
  'safe-mail.net', 'safersignup.de', 'safetymail.info', 'sandelf.de'
]);

// ============================================
// SUSPICIOUS TLDs
// ============================================

const SUSPICIOUS_TLDS = new Set([
  '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.click',
  '.link', '.loan', '.work', '.date', '.racing', '.bid', '.stream',
  '.download', '.party', '.trade', '.accountant', '.science', '.review',
  '.country', '.kim', '.cricket', '.faith', '.win', '.email'
]);

// ============================================
// TRUSTED EMAIL DOMAINS
// ============================================

const TRUSTED_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'aol.com', 'protonmail.com', 'mail.com', 'zoho.com', 'gmx.com',
  'btinternet.com', 'sky.com', 'virginmedia.com', 'talktalk.net',
  'live.com', 'live.co.uk', 'me.com', 'mac.com'
]);

// ============================================
// SUSPICIOUS PATTERNS
// ============================================

const SUSPICIOUS_PATTERNS = [
  /^test\d+@/i,
  /^user\d+@/i,
  /^admin@/i,
  /^info@/i,
  /^contact@/i,
  /^support@/i,
  /^noreply@/i,
  /^no-reply@/i,
  /\+spam/i,
  /\+test/i,
  /\+junk/i,
  /^[a-z]{3,}\d{6,}@/i, // Pattern like abc123456@
  /^[0-9]{10,}@/i, // All numbers
  /(.)\1{4,}/, // Same character repeated 5+ times (aaaaa)
  /^[a-z]{1,2}@/i, // Very short local part (a@, ab@)
  /^\d+@/i, // Starts with only numbers
  /^[^a-z0-9]+@/i // Starts with special characters only
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || '';
}

/**
 * Calculate email entropy (randomness)
 */
function calculateEntropy(str: string): number {
  const len = str.length;
  const frequencies: { [key: string]: number } = {};
  
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  let entropy = 0;
  for (const freq of Object.values(frequencies)) {
    const p = freq / len;
    entropy -= p * Math.log2(p);
  }
  
  return entropy;
}

/**
 * Check if email is disposable
 */
function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

/**
 * Check if email has suspicious TLD
 */
function hasSuspiciousTLD(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  for (const tld of SUSPICIOUS_TLDS) {
    if (domain.endsWith(tld)) return true;
  }
  
  return false;
}

/**
 * Check if email matches suspicious patterns
 */
function matchesSuspiciousPattern(email: string): boolean {
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(email)) return true;
  }
  return false;
}

/**
 * Check if domain is trusted
 */
function isTrustedDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return TRUSTED_EMAIL_DOMAINS.has(domain);
}

/**
 * Validate JavaScript challenge
 */
function validateChallenge(challenge: string): boolean {
  try {
    const now = Math.floor(Date.now() / 10000);
    // Allow current or previous window to account for network delay/clock drift
    return challenge === now.toString() || challenge === (now - 1).toString() || challenge === (now + 1).toString();
  } catch {
    return false;
  }
}

/**
 * Blacklist an IP address
 */
export function blacklistIP(ip: string, reason: string): void {
  ipBlacklist.set(ip, {
    timestamp: Date.now(),
    reason
  });
  console.log(`🚫 IP blacklisted: ${ip} - ${reason}`);
}

/**
 * Blacklist an email address
 */
export function blacklistEmail(email: string, reason: string): void {
  emailBlacklist.set(email.toLowerCase(), {
    timestamp: Date.now(),
    reason
  });
  console.log(`🚫 Email blacklisted: ${email} - ${reason}`);
}

// ============================================
// MAIN SPAM PROTECTION FUNCTION
// ============================================

export interface SpamCheckData {
  email: string;
  honeypot?: string;
  timestamp?: string;
  challenge?: string;
  userInteraction?: {
    clicks: number;
    keystrokes: number;
  };
}

export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
  shouldBlacklist?: boolean;
}

/**
 * Comprehensive spam protection check
 * Returns { isSpam: true, reason: string } if spam detected
 * Returns { isSpam: false } if legitimate
 */
export async function checkForSpam(
  request: Request,
  data: SpamCheckData
): Promise<SpamCheckResult> {
  const ip = getClientIP(request);
  const userAgent = getUserAgent(request);
  const email = data.email.toLowerCase().trim();
  
  // ==========================================
  // 1. IP BLACKLIST CHECK
  // ==========================================
  
  if (ipBlacklist.has(ip)) {
    const entry = ipBlacklist.get(ip)!;
    return {
      isSpam: true,
      reason: `IP blacklisted: ${entry.reason}`,
      shouldBlacklist: false
    };
  }
  
  // ==========================================
  // 2. EMAIL BLACKLIST CHECK
  // ==========================================
  
  if (emailBlacklist.has(email)) {
    const entry = emailBlacklist.get(email)!;
    return {
      isSpam: true,
      reason: `Email blacklisted: ${entry.reason}`,
      shouldBlacklist: false
    };
  }
  
  // ==========================================
  // 3. HONEYPOT CHECK
  // ==========================================
  
  if (data.honeypot && data.honeypot.trim() !== '') {
    blacklistIP(ip, 'Honeypot triggered');
    return {
      isSpam: true,
      reason: 'Honeypot field filled (bot detected)',
      shouldBlacklist: true
    };
  }
  
  // ==========================================
  // 4. USER AGENT VALIDATION
  // ==========================================
  
  if (!userAgent || userAgent.length < 20) {
    blacklistIP(ip, 'Invalid user agent');
    return {
      isSpam: true,
      reason: 'Invalid or missing user agent',
      shouldBlacklist: true
    };
  }
  
  // ==========================================
  // 5. JAVASCRIPT CHALLENGE
  // ==========================================
  
  if (data.challenge && !validateChallenge(data.challenge)) {
    blacklistIP(ip, 'Failed JavaScript challenge');
    return {
      isSpam: true,
      reason: 'JavaScript challenge failed',
      shouldBlacklist: true
    };
  }
  
  // ==========================================
  // 6. TIME-BASED VALIDATION
  // ==========================================
  
  if (data.timestamp) {
    const formLoadTime = parseInt(data.timestamp);
    const now = Date.now();
    const timeTaken = now - formLoadTime;
    
    if (timeTaken < MIN_FORM_FILL_TIME_MS) {
      blacklistIP(ip, `Form filled too quickly (${timeTaken}ms)`);
      return {
        isSpam: true,
        reason: `Form filled too quickly (${(timeTaken / 1000).toFixed(1)}s)`,
        shouldBlacklist: true
      };
    }
    
    if (timeTaken > MAX_FORM_FILL_TIME_MS) {
      return {
        isSpam: true,
        reason: 'Form session expired (stale)',
        shouldBlacklist: false
      };
    }
  }
  
  // ==========================================
  // 7. USER INTERACTION VALIDATION
  // ==========================================
  
  if (data.userInteraction) {
    const { clicks, keystrokes } = data.userInteraction;
    const isTrusted = isTrustedDomain(email);
    const minKeystrokes = isTrusted ? MIN_USER_KEYSTROKES_TRUSTED : MIN_USER_KEYSTROKES_UNTRUSTED;
    
    if (clicks < MIN_USER_CLICKS) {
      blacklistIP(ip, `Insufficient clicks (${clicks})`);
      return {
        isSpam: true,
        reason: `Insufficient user interaction (clicks: ${clicks})`,
        shouldBlacklist: true
      };
    }
    
    if (keystrokes < minKeystrokes) {
      blacklistIP(ip, `Insufficient keystrokes (${keystrokes})`);
      return {
        isSpam: true,
        reason: `Insufficient user interaction (keystrokes: ${keystrokes})`,
        shouldBlacklist: true
      };
    }
  }
  
  // ==========================================
  // 8. EMAIL LENGTH VALIDATION
  // ==========================================
  
  if (email.length < MIN_EMAIL_LENGTH || email.length > MAX_EMAIL_LENGTH) {
    return {
      isSpam: true,
      reason: 'Invalid email length',
      shouldBlacklist: false
    };
  }
  
  // ==========================================
  // 9. EMAIL FORMAT VALIDATION
  // ==========================================
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isSpam: true,
      reason: 'Invalid email format',
      shouldBlacklist: false
    };
  }
  
  // ==========================================
  // 10. DISPOSABLE EMAIL CHECK
  // ==========================================
  
  if (isDisposableEmail(email)) {
    blacklistEmail(email, 'Disposable email domain');
    return {
      isSpam: true,
      reason: 'Disposable email address not allowed',
      shouldBlacklist: true
    };
  }
  
  // ==========================================
  // 11. SUSPICIOUS TLD CHECK
  // ==========================================
  
  if (hasSuspiciousTLD(email)) {
    blacklistEmail(email, 'Suspicious TLD');
    return {
      isSpam: true,
      reason: 'Suspicious email domain',
      shouldBlacklist: true
    };
  }
  
  // ==========================================
  // 12. SUSPICIOUS PATTERN CHECK
  // ==========================================
  
  if (matchesSuspiciousPattern(email)) {
    blacklistEmail(email, 'Suspicious email pattern');
    return {
      isSpam: true,
      reason: 'Suspicious email pattern detected',
      shouldBlacklist: true
    };
  }
  
  // ==========================================
  // 13. EMAIL ENTROPY CHECK
  // ==========================================
  
  const localPart = email.split('@')[0];
  const entropy = calculateEntropy(localPart);
  
  // Too simple (entropy < 2.5, e.g., "aaa@", "111@")
  if (entropy < 2.5) {
    return {
      isSpam: true,
      reason: 'Email too simple (suspicious pattern)',
      shouldBlacklist: false
    };
  }
  
  // Too random (entropy > 4.5, e.g., "xjk3j2h9s4@")
  if (entropy > 4.5) {
    return {
      isSpam: true,
      reason: 'Email too random (suspicious pattern)',
      shouldBlacklist: false
    };
  }
  
  // ==========================================
  // 14. RATE LIMITING
  // ==========================================
  
  const now = Date.now();
  const rateLimit = rateLimitStore.get(ip);
  
  if (rateLimit) {
    // Check if within rate limit window
    if (now - rateLimit.firstSubmission < RATE_LIMIT_WINDOW_MS) {
      // Check if exceeded submission limit
      if (rateLimit.count >= MAX_SUBMISSIONS_PER_IP) {
        blacklistIP(ip, 'Rate limit exceeded');
        return {
          isSpam: true,
          reason: 'Too many submissions. Please try again tomorrow.',
          shouldBlacklist: true
        };
      }
      
      // Check if same email already used
      if (rateLimit.emails.includes(email)) {
        blacklistEmail(email, 'Duplicate email submission');
        return {
          isSpam: true,
          reason: 'Email already submitted',
          shouldBlacklist: true
        };
      }
      
      // Update rate limit
      rateLimit.count++;
      rateLimit.emails.push(email);
    } else {
      // Reset rate limit
      rateLimitStore.set(ip, {
        count: 1,
        firstSubmission: now,
        emails: [email]
      });
    }
  } else {
    // Initialize rate limit
    rateLimitStore.set(ip, {
      count: 1,
      firstSubmission: now,
      emails: [email]
    });
  }
  
  // ==========================================
  // ALL CHECKS PASSED - LEGITIMATE
  // ==========================================
  
  console.log(`✅ Spam check passed for ${email} from ${ip}`);
  
  return {
    isSpam: false
  };
}

// ============================================
// EXPORT BLACKLIST MANAGEMENT
// ============================================

export function getBlacklists() {
  return {
    ips: Array.from(ipBlacklist.entries()).map(([ip, entry]) => ({
      ip,
      ...entry
    })),
    emails: Array.from(emailBlacklist.entries()).map(([email, entry]) => ({
      email,
      ...entry
    }))
  };
}

export function clearBlacklists() {
  ipBlacklist.clear();
  emailBlacklist.clear();
  console.log('🗑️ All blacklists cleared');
}
