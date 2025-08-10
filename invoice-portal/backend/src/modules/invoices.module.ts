import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Attachment } from '../entities/attachment.entity';
import { InvoiceEvent } from '../entities/invoice-event.entity';
import { InvoicesController } from '../controllers/invoices.controller';
import { MailerService } from '../services/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Attachment, InvoiceEvent])],
  controllers: [InvoicesController],
  providers: [MailerService],
})
export class InvoicesModule {}
