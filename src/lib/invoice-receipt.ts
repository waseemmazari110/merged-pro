/**
 * Milestone 5: Invoice & Receipt Generation
 * Generate professional invoices and receipts with UK formatting
 * All dates in DD/MM/YYYY format, timestamps in DD/MM/YYYY HH:mm:ss
 */

import { db } from '@/db';
import { invoices, subscriptions, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nowUKFormatted, formatDateUK, formatDateTimeUK } from '@/lib/date-utils';

// ============================================
// TYPES
// ============================================

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string; // DD/MM/YYYY
  dueDate: string | null; // DD/MM/YYYY
  paidAt: string | null; // DD/MM/YYYY HH:mm:ss
  status: string;
  
  // Customer details
  customerName: string;
  customerEmail: string;
  customerId: string;
  
  // Billing details
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  
  // Line items
  items: InvoiceLineItem[];
  
  // Amounts
  subtotal: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  
  // Period
  periodStart: string | null; // DD/MM/YYYY
  periodEnd: string | null; // DD/MM/YYYY
  
  // Payment
  paymentMethod?: string;
  lastFourDigits?: string;
  
  // Additional info
  notes?: string;
  termsAndConditions?: string;
  
  // URLs
  invoicePdf?: string | null;
  hostedInvoiceUrl?: string | null;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  period?: string;
}

export interface ReceiptData extends InvoiceData {
  receiptNumber: string;
  paymentDate: string; // DD/MM/YYYY HH:mm:ss
  paymentStatus: 'paid';
  transactionId: string;
}

// ============================================
// LOGGING
// ============================================

function logInvoiceAction(action: string, details?: any) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] Invoice/Receipt: ${action}`, details || '');
}

// ============================================
// INVOICE GENERATION
// ============================================

/**
 * Generate invoice data from database record
 */
export async function generateInvoiceData(invoiceId: string): Promise<InvoiceData | null> {
  try {
    logInvoiceAction('Generating invoice data', { invoiceId });

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, parseInt(invoiceId)))
      .limit(1);

    if (!invoice) {
      logInvoiceAction('Invoice not found', { invoiceId });
      return null;
    }

    // Get customer details
    const [customer] = await db
      .select()
      .from(user)
      .where(eq(user.id, invoice.userId))
      .limit(1);

    // Get subscription details if exists
    let subscription = null;
    if (invoice.subscriptionId) {
      [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, invoice.subscriptionId))
        .limit(1);
    }

    // Build line items
    const items: InvoiceLineItem[] = [];
    
    if (subscription) {
      const period = invoice.periodStart && invoice.periodEnd
        ? `${invoice.periodStart} - ${invoice.periodEnd}`
        : undefined;

      items.push({
        description: subscription.planName || 'Subscription',
        quantity: 1,
        unitPrice: invoice.subtotal || 0,
        amount: invoice.subtotal || 0,
        period,
      });
    } else {
      // Generic item
      items.push({
        description: invoice.description || 'Service',
        quantity: 1,
        unitPrice: invoice.subtotal || 0,
        amount: invoice.subtotal || 0,
      });
    }

    const invoiceData: InvoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      paidAt: invoice.paidAt,
      status: invoice.status || 'draft',
      
      customerName: customer?.name || invoice.customerName || '',
      customerEmail: customer?.email || invoice.customerEmail || '',
      customerId: invoice.userId,
      
      items,
      
      subtotal: invoice.subtotal || 0,
      taxAmount: invoice.taxAmount || 0,
      total: invoice.total || 0,
      amountPaid: invoice.amountPaid || 0,
      amountDue: invoice.amountDue || 0,
      currency: invoice.currency || 'GBP',
      
      periodStart: invoice.periodStart,
      periodEnd: invoice.periodEnd,
      
      invoicePdf: invoice.invoicePdf,
      hostedInvoiceUrl: invoice.hostedInvoiceUrl,
      
      notes: 'Thank you for your business!',
      termsAndConditions: 'Payment is due within 30 days. Late payments may incur additional charges.',
    };

    logInvoiceAction('Invoice data generated', { invoiceNumber: invoice.invoiceNumber });
    return invoiceData;

  } catch (error) {
    logInvoiceAction('Failed to generate invoice data', {
      error: (error as Error).message,
    });
    return null;
  }
}

/**
 * Generate receipt data from paid invoice
 */
export async function generateReceiptData(invoiceId: string): Promise<ReceiptData | null> {
  try {
    logInvoiceAction('Generating receipt data', { invoiceId });

    const invoiceData = await generateInvoiceData(invoiceId);
    
    if (!invoiceData) {
      return null;
    }

    if (invoiceData.status !== 'paid' || !invoiceData.paidAt) {
      logInvoiceAction('Invoice not paid, cannot generate receipt', { invoiceId });
      return null;
    }

    // Get original invoice record for transaction ID
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, parseInt(invoiceId)))
      .limit(1);

    const receiptData: ReceiptData = {
      ...invoiceData,
      receiptNumber: invoiceData.invoiceNumber.replace('INV-', 'RCP-'),
      paymentDate: invoiceData.paidAt,
      paymentStatus: 'paid',
      transactionId: invoice.stripePaymentIntentId || invoiceData.invoiceNumber,
    };

    logInvoiceAction('Receipt data generated', {
      receiptNumber: receiptData.receiptNumber,
    });

    return receiptData;

  } catch (error) {
    logInvoiceAction('Failed to generate receipt data', {
      error: (error as Error).message,
    });
    return null;
  }
}

// ============================================
// HTML GENERATION
// ============================================

/**
 * Generate HTML invoice
 */
export function generateInvoiceHTML(data: InvoiceData): string {
  const { items, subtotal, taxAmount, total, currency } = data;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.description}</strong>
        ${item.period ? `<br><small style="color: #6b7280;">Period: ${item.period}</small>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;"><strong>${formatCurrency(item.amount)}</strong></td>
    </tr>
  `).join('');

  const statusBadge = data.status === 'paid' 
    ? '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">PAID</span>'
    : data.status === 'open'
    ? '<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">OPEN</span>'
    : '<span style="background: #6b7280; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">DRAFT</span>';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3b82f6;
    }
    .company-info h1 {
      margin: 0;
      color: #1e40af;
      font-size: 28px;
    }
    .invoice-details {
      text-align: right;
    }
    .invoice-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }
    .info-block h3 {
      margin: 0 0 10px 0;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    th {
      background: #f3f4f6;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #d1d5db;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .totals-row.total {
      border-top: 2px solid #3b82f6;
      border-bottom: 2px solid #3b82f6;
      font-size: 20px;
      font-weight: 700;
      color: #1e40af;
      margin-top: 10px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-header">
    <div class="company-info">
      <h1>Escape Houses</h1>
      <p style="margin: 5px 0; color: #6b7280;">Property Management Platform</p>
    </div>
    <div class="invoice-details">
      <h2 style="margin: 0 0 10px 0;">INVOICE</h2>
      <p style="margin: 5px 0;"><strong>${data.invoiceNumber}</strong></p>
      <p style="margin: 5px 0;">${statusBadge}</p>
    </div>
  </div>

  <div class="invoice-meta">
    <div class="info-block">
      <h3>Bill To</h3>
      <p style="margin: 5px 0;"><strong>${data.customerName}</strong></p>
      <p style="margin: 5px 0; color: #6b7280;">${data.customerEmail}</p>
      ${data.billingAddress ? `
        <p style="margin: 5px 0; color: #6b7280;">
          ${data.billingAddress.line1}<br>
          ${data.billingAddress.line2 ? data.billingAddress.line2 + '<br>' : ''}
          ${data.billingAddress.city}, ${data.billingAddress.postcode}<br>
          ${data.billingAddress.country}
        </p>
      ` : ''}
    </div>
    <div class="info-block">
      <h3>Invoice Details</h3>
      <p style="margin: 5px 0;"><strong>Invoice Date:</strong> ${data.invoiceDate}</p>
      ${data.dueDate ? `<p style="margin: 5px 0;"><strong>Due Date:</strong> ${data.dueDate}</p>` : ''}
      ${data.paidAt ? `<p style="margin: 5px 0; color: #10b981;"><strong>Paid on:</strong> ${data.paidAt}</p>` : ''}
      ${data.periodStart && data.periodEnd ? `
        <p style="margin: 5px 0;"><strong>Period:</strong><br>${data.periodStart} - ${data.periodEnd}</p>
      ` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center; width: 80px;">Qty</th>
        <th style="text-align: right; width: 120px;">Unit Price</th>
        <th style="text-align: right; width: 120px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>${formatCurrency(subtotal)}</span>
    </div>
    ${taxAmount > 0 ? `
      <div class="totals-row">
        <span>Tax (VAT):</span>
        <span>${formatCurrency(taxAmount)}</span>
      </div>
    ` : ''}
    <div class="totals-row total">
      <span>Total:</span>
      <span>${formatCurrency(total)}</span>
    </div>
    ${data.status !== 'paid' && data.amountDue > 0 ? `
      <div class="totals-row" style="color: #dc2626; font-weight: 600;">
        <span>Amount Due:</span>
        <span>${formatCurrency(data.amountDue)}</span>
      </div>
    ` : ''}
  </div>

  ${data.notes ? `
    <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 4px;">
      <strong>Notes:</strong><br>
      ${data.notes}
    </div>
  ` : ''}

  ${data.termsAndConditions ? `
    <div class="footer">
      <strong>Terms & Conditions:</strong><br>
      ${data.termsAndConditions}
    </div>
  ` : ''}

  <div class="footer" style="text-align: center; margin-top: 40px;">
    <p>Generated on ${nowUKFormatted()}</p>
    <p>Escape Houses | Property Management Platform | www.escapehouses.com</p>
  </div>
</body>
</html>
  `;
}

/**
 * Generate HTML receipt with "Paid on DD/MM/YYYY at HH:mm:ss" format
 */
export function generateReceiptHTML(data: ReceiptData): string {
  const { items, subtotal, taxAmount, total, currency, paymentDate } = data;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.description}</strong>
        ${item.period ? `<br><small style="color: #6b7280;">Period: ${item.period}</small>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;"><strong>${formatCurrency(item.amount)}</strong></td>
    </tr>
  `).join('');

  // Parse payment date for display
  const [datePart, timePart] = paymentDate.split(' ');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt ${data.receiptNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .receipt-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 12px;
    }
    .receipt-header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
    }
    .receipt-header .receipt-number {
      font-size: 18px;
      opacity: 0.9;
    }
    .paid-badge {
      display: inline-block;
      background: white;
      color: #059669;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .payment-info {
      background: #f0fdf4;
      border: 2px solid #10b981;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
      text-align: center;
    }
    .payment-info .paid-date {
      font-size: 18px;
      color: #059669;
      font-weight: 600;
      margin: 10px 0;
    }
    .invoice-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }
    .info-block h3 {
      margin: 0 0 10px 0;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    th {
      background: #f3f4f6;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #d1d5db;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .totals-row.total {
      border-top: 2px solid #10b981;
      border-bottom: 2px solid #10b981;
      font-size: 20px;
      font-weight: 700;
      color: #059669;
      margin-top: 10px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="receipt-header">
    <h1>✓ PAYMENT RECEIPT</h1>
    <div class="receipt-number">${data.receiptNumber}</div>
    <div class="paid-badge">PAID IN FULL</div>
  </div>

  <div class="payment-info">
    <p style="margin: 0; color: #6b7280; font-size: 14px;">Payment Received</p>
    <div class="paid-date">Paid on ${datePart} at ${timePart}</div>
    <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">Transaction ID: ${data.transactionId}</p>
  </div>

  <div class="invoice-meta">
    <div class="info-block">
      <h3>Paid By</h3>
      <p style="margin: 5px 0;"><strong>${data.customerName}</strong></p>
      <p style="margin: 5px 0; color: #6b7280;">${data.customerEmail}</p>
    </div>
    <div class="info-block">
      <h3>Receipt Details</h3>
      <p style="margin: 5px 0;"><strong>Receipt Number:</strong> ${data.receiptNumber}</p>
      <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
      <p style="margin: 5px 0;"><strong>Payment Date:</strong> ${paymentDate}</p>
      ${data.periodStart && data.periodEnd ? `
        <p style="margin: 5px 0;"><strong>Service Period:</strong><br>${data.periodStart} - ${data.periodEnd}</p>
      ` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center; width: 80px;">Qty</th>
        <th style="text-align: right; width: 120px;">Unit Price</th>
        <th style="text-align: right; width: 120px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>${formatCurrency(subtotal)}</span>
    </div>
    ${taxAmount > 0 ? `
      <div class="totals-row">
        <span>Tax (VAT):</span>
        <span>${formatCurrency(taxAmount)}</span>
      </div>
    ` : ''}
    <div class="totals-row total">
      <span>Total Paid:</span>
      <span>${formatCurrency(total)}</span>
    </div>
  </div>

  <div style="margin-top: 40px; padding: 20px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px; text-align: center;">
    <p style="margin: 0; color: #059669; font-weight: 600; font-size: 16px;">
      ✓ Thank you for your payment!
    </p>
    <p style="margin: 10px 0 0 0; color: #6b7280;">
      This receipt confirms that payment has been received in full.
    </p>
  </div>

  <div class="footer">
    <p>Generated on ${nowUKFormatted()}</p>
    <p>Escape Houses | Property Management Platform</p>
    <p>For support, contact: support@escapehouses.com</p>
  </div>
</body>
</html>
  `;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get all invoices for user
 */
export async function getUserInvoicesWithDetails(userId: string) {
  try {
    const userInvoices = await db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, userId));

    return userInvoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      status: inv.status,
      total: inv.total,
      currency: inv.currency,
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate,
      paidAt: inv.paidAt,
      canGenerateReceipt: inv.status === 'paid' && inv.paidAt !== null,
      hostedInvoiceUrl: inv.hostedInvoiceUrl,
      invoicePdf: inv.invoicePdf,
    }));

  } catch (error) {
    logInvoiceAction('Failed to get user invoices', {
      error: (error as Error).message,
    });
    return [];
  }
}

/**
 * Get invoice by number
 */
export async function getInvoiceByNumber(invoiceNumber: string) {
  try {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.invoiceNumber, invoiceNumber))
      .limit(1);

    return invoice || null;

  } catch (error) {
    logInvoiceAction('Failed to get invoice by number', {
      error: (error as Error).message,
    });
    return null;
  }
}

