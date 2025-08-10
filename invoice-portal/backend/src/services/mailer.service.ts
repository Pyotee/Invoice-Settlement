import * as nodemailer from 'nodemailer';

export class MailerService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    secure: false,
    auth: (process.env.SMTP_USER && process.env.SMTP_PASS) ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  });

  async sendNewInvoiceEmail(params: {
    to: string;
    referenceNo: string;
    amount: string;
    currency: string;
    invoiceNo?: string;
    issueDate?: string;
    dueDate?: string;
    checksum?: string;
    invoiceId: string;
  }) {
    const subject = `[Invoice Portal] New Invoice ${params.referenceNo}`;
    const body = `Vendor: (demo)
Reference No: ${params.referenceNo}
Invoice No: ${params.invoiceNo || '—'}
Amount: ${params.amount} ${params.currency}
Issue Date: ${params.issueDate || '—'} | Due Date: ${params.dueDate || '—'}
Status: under_review

Checksum (SHA-256): ${params.checksum || ''}
Audit ID: ${params.invoiceId}
`;
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@invoice-portal.local',
      to: params.to,
      subject,
      text: body,
    });
  }
}
