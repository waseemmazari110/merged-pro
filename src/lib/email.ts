import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EnquiryEmailData {
  name: string;
  email: string;
  phone: string;
  checkin?: string;
  checkout?: string;
  groupSize: string | number;
  occasion?: string;
  addons?: string[];
  message?: string;
  propertyTitle?: string;
  propertySlug?: string;
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  groupSize: string;
  dates: string;
  location?: string;
  experiences?: string[];
  message?: string;
}

interface PartnerRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyName?: string;
  location: string;
  bedrooms: string | number;
  sleeps: string | number;
  membershipTier?: string;
  features?: string;
  website?: string;
  message?: string;
}

export async function sendEnquiryEmail(data: EnquiryEmailData) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #89A38F; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1F2937; }
            .value { color: #374151; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Property Enquiry</h1>
            </div>
            <div class="content">
              ${data.propertyTitle ? `
                <div class="field">
                  <span class="label">Property:</span> 
                  <span class="value">${data.propertyTitle}</span>
                </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Name:</span> 
                <span class="value">${data.name}</span>
              </div>
              
              <div class="field">
                <span class="label">Email:</span> 
                <span class="value">${data.email}</span>
              </div>
              
              <div class="field">
                <span class="label">Phone:</span> 
                <span class="value">${data.phone}</span>
              </div>
              
              ${data.checkin && data.checkout ? `
                <div class="field">
                  <span class="label">Dates:</span> 
                  <span class="value">${data.checkin} to ${data.checkout}</span>
                </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Group Size:</span> 
                <span class="value">${data.groupSize}</span>
              </div>
              
              ${data.occasion ? `
                <div class="field">
                  <span class="label">Occasion:</span> 
                  <span class="value">${data.occasion}</span>
                </div>
              ` : ''}
              
              ${data.addons && data.addons.length > 0 ? `
                <div class="field">
                  <span class="label">Experiences Requested:</span>
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    ${data.addons.map(addon => `<li>${addon}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${data.message ? `
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="value" style="margin-top: 5px; white-space: pre-wrap;">${data.message}</div>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Group Escape Houses<br>11a North Street, Brighton BN41 1DH</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Group Escape Houses <enquiries@groupescapehouses.co.uk>',
      to: ['hello@groupescapehouses.co.uk'],
      subject: `New Enquiry: ${data.propertyTitle || 'Property Enquiry'} - ${data.name}`,
      html: htmlContent,
      replyTo: data.email,
    });

    if (error) {
      console.error('❌ Failed to send enquiry email:', error);
      throw error;
    }

    console.log('✅ Enquiry email sent successfully:', emailData?.id);
    return emailData;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendContactEmail(data: ContactEmailData) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #89A38F; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1F2937; }
            .value { color: #374151; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span> 
                <span class="value">${data.name}</span>
              </div>
              
              <div class="field">
                <span class="label">Email:</span> 
                <span class="value">${data.email}</span>
              </div>
              
              ${data.phone ? `
                <div class="field">
                  <span class="label">Phone:</span> 
                  <span class="value">${data.phone}</span>
                </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Group Size:</span> 
                <span class="value">${data.groupSize}</span>
              </div>
              
              <div class="field">
                <span class="label">Preferred Dates:</span> 
                <span class="value">${data.dates}</span>
              </div>
              
              ${data.location ? `
                <div class="field">
                  <span class="label">Preferred Location:</span> 
                  <span class="value">${data.location}</span>
                </div>
              ` : ''}
              
              ${data.experiences && data.experiences.length > 0 ? `
                <div class="field">
                  <span class="label">Experiences Requested:</span>
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    ${data.experiences.map(exp => `<li>${exp}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${data.message ? `
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="value" style="margin-top: 5px; white-space: pre-wrap;">${data.message}</div>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Group Escape Houses<br>11a North Street, Brighton BN41 1DH</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Group Escape Houses <enquiries@groupescapehouses.co.uk>',
      to: ['hello@groupescapehouses.co.uk'],
      subject: `New Contact Form: ${data.name} - ${data.groupSize} guests`,
      html: htmlContent,
      replyTo: data.email,
    });

    if (error) {
      console.error('❌ Failed to send contact email:', error);
      throw error;
    }

    console.log('✅ Contact email sent successfully:', emailData?.id);
    return emailData;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  // ... existing code
}

export async function sendMagicLinkEmail(email: string, url: string) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #89A38F; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { background: #89A38F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Login to Group Escape Houses</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested a secure login link for Group Escape Houses. Click the button below to sign in to your account instantly.</p>
              <a href="${url}" class="button">Log in to my account</a>
              <p style="margin-top: 30px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
              <p>Best regards,<br>The Group Escape Houses Team</p>
            </div>
            <div class="footer">
              <p>Group Escape Houses<br>11a North Street, Brighton BN41 1DH</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Group Escape Houses <enquiries@groupescapehouses.co.uk>',
      to: [email],
      subject: 'Your Group Escape Houses Login Link',
      html: htmlContent,
    });

    if (error) {
      console.error('❌ Failed to send magic link email:', error);
      throw error;
    }

    console.log('✅ Magic link email sent successfully to:', email);
    return emailData;
  } catch (error) {
    console.error('Magic link email error:', error);
    throw error;
  }
}

export async function sendPartnerRegistrationEmail(data: PartnerRegistrationData) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #89A38F; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1F2937; }
            .value { color: #374151; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Accommodation Listing Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span> 
                <span class="value">${data.firstName} ${data.lastName}</span>
              </div>
              
              <div class="field">
                <span class="label">Email:</span> 
                <span class="value">${data.email}</span>
              </div>
              
              <div class="field">
                <span class="label">Phone:</span> 
                <span class="value">${data.phone}</span>
              </div>
              
              <div class="field">
                <span class="label">Property Name:</span> 
                <span class="value">${data.propertyName || 'N/A'}</span>
              </div>
              
              <div class="field">
                <span class="label">Location:</span> 
                <span class="value">${data.location}</span>
              </div>
              
              <div class="field">
                <span class="label">Bedrooms:</span> 
                <span class="value">${data.bedrooms}</span>
              </div>
              
              <div class="field">
                <span class="label">Max Guests:</span> 
                <span class="value">${data.sleeps}</span>
              </div>
              
              <div class="field">
                <span class="label">Membership Tier:</span> 
                <span class="value">${data.membershipTier || 'Not selected'}</span>
              </div>
              
              <div class="field">
                <span class="label">Website:</span> 
                <span class="value">${data.website || 'N/A'}</span>
              </div>
              
              <div class="field">
                <span class="label">Features:</span> 
                <span class="value">${data.features || 'N/A'}</span>
              </div>
              
              ${data.message ? `
                <div class="field">
                  <span class="label">Additional Message:</span>
                  <div class="value" style="margin-top: 5px; white-space: pre-wrap;">${data.message}</div>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Group Escape Houses<br>11a North Street, Brighton BN41 1DH</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Group Escape Houses <enquiries@groupescapehouses.co.uk>',
      to: ['hello@groupescapehouses.co.uk'],
      subject: `Accommodation listing submission: ${data.propertyName || (data.firstName + ' ' + data.lastName)}`,
      html: htmlContent,
      replyTo: data.email,
    });

    if (error) {
      console.error('❌ Failed to send partner registration email:', error);
      throw error;
    }

    console.log('✅ Partner registration email sent successfully:', emailData?.id);
    return emailData;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}
