/**
 * UK Date Formatting Utilities
 * All dates across the site use dd/mm/yy format
 */

/**
 * Format date to UK short format: dd/mm/yy
 */
export function formatDateUK(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

/**
 * Format date to UK long format: dd/mm/yyyy
 */
export function formatDateUKLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Convert ISO date string (YYYY-MM-DD) from database to UK format (DD/MM/YYYY)
 * Specifically for database date fields like check_in_date and check_out_date
 */
export function formatDatabaseDateToUK(isoDateString: string): string {
  if (!isoDateString) return '';
  
  // Direct string parsing for YYYY-MM-DD format
  const parts = isoDateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  
  // Fallback to Date object parsing
  return formatDateUKLong(isoDateString);
}

/**
 * Format date range to UK format: dd/mm/yy - dd/mm/yy
 */
export function formatDateRangeUK(from: Date | string, to: Date | string): string {
  return `${formatDateUK(from)} - ${formatDateUK(to)}`;
}

/**
 * Format date with month name: dd Month yyyy (e.g., 27 November 2025)
 */
export function formatDateWithMonth(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
}

/**
 * Format date for month and year only: Month yyyy
 */
export function formatMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', { 
    month: 'long', 
    year: 'numeric' 
  });
}

/**
 * Get current UK date in formatted string: dd/mm/yyyy
 */
export function nowUKFormatted(): string {
  return formatDateUKLong(new Date());
}

/**
 * Parse UK date format (dd/mm/yyyy or dd/mm/yy) to Date object
 */
export function parseUKDate(ukDateString: string): Date {
  const parts = ukDateString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    let year = parseInt(parts[2], 10);
    
    // Handle 2-digit year
    if (year < 100) {
      year += 2000;
    }
    
    return new Date(year, month, day);
  }
  
  throw new Error(`Invalid UK date format: ${ukDateString}`);
}

/**
 * Add days to a UK date string and return as UK formatted string
 */
export function addDaysUK(ukDateString: string, days: number): string {
  const date = parseUKDate(ukDateString);
  date.setDate(date.getDate() + days);
  return formatDateUKLong(date);
}

/**
 * Calculate next billing date based on interval
 */
export function calculateNextBillingDate(currentDate: string, interval: 'month' | 'year', intervalCount: number = 1): string {
  const date = new Date(currentDate);
  
  if (interval === 'month') {
    date.setMonth(date.getMonth() + intervalCount);
  } else if (interval === 'year') {
    date.setFullYear(date.getFullYear() + intervalCount);
  }
  
  return formatDateUKLong(date);
}