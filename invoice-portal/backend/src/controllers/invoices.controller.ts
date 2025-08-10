import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceEvent } from '../entities/invoice-event.entity';
import { MailerService } from '../services/mailer.service';

class CreateInvoiceDto {
  referenceNo: string;
  amount: string;
  currency: string;
  invoiceNo?: string;
  issueDate?: string;
  dueDate?: string;
  fileKey?: string;
}

@Controller('invoices')
export class InvoicesController {
  constructor(
    @InjectRepository(Invoice) private invoices: Repository<Invoice>,
    @InjectRepository(InvoiceEvent) private events: Repository<InvoiceEvent>,
    private mailer: MailerService,
  ) {}

  @Post()
  async create(@Body() dto: CreateInvoiceDto) {
    // Minimal validation
    if (!dto.referenceNo || !dto.amount || !dto.currency) {
      return { ok: false, message: 'referenceNo, amount, currency are required' };
    }
    if (!/^[A-Z]{3}$/.test(dto.currency)) {
      return { ok: false, message: 'currency must be ISO 4217 (e.g., KWD)' };
    }
    const invoice = this.invoices.create({
      reference_no: dto.referenceNo,
      amount: dto.amount,
      currency: dto.currency,
      invoice_no: dto.invoiceNo || null,
      issue_date: dto.issueDate || null,
      due_date: dto.dueDate || null,
      status: 'under_review',
      file_key: dto.fileKey || null,
    });
    const saved = await this.invoices.save(invoice);
    await this.events.save(this.events.create({
      invoice: saved,
      event_type: 'created',
      event_data: { reference_no: dto.referenceNo },
    }));

    // Send dev email to Mailhog
    await this.mailer.sendNewInvoiceEmail({
      to: 'ace.h.zaidi@gmail.com',
      referenceNo: saved.reference_no,
      amount: saved.amount,
      currency: saved.currency,
      invoiceNo: saved.invoice_no || undefined,
      issueDate: saved.issue_date || undefined,
      dueDate: saved.due_date || undefined,
      checksum: saved.checksum || '',
      invoiceId: saved.id,
    });

    return { ok: true, id: saved.id };
  }

  @Get()
  async list(
    @Query('q') q?: string,
    @Query('currency') currency?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const where: any = {};
    if (q) where.reference_no = ILike(f"%{q}%");
    if (currency) where.currency = currency.toUpperCase();
    if (status) where.status = status;
    if (from && to) where.created_at = Between(new Date(from), new Date(to));
    const data = await this.invoices.find({ where, order: { created_at: 'DESC' } });
    return { ok: true, data };
  }
}
