import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Vendor } from './entities/vendor.entity';
import { Invoice } from './entities/invoice.entity';
import { Attachment } from './entities/attachment.entity';
import { InvoiceEvent } from './entities/invoice-event.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'invoice',
  password: process.env.DATABASE_PASS || 'invoice',
  database: process.env.DATABASE_NAME || 'invoice_portal',
  synchronize: true, // NOTE: for DEV only; use migrations in prod
  logging: false,
  entities: [User, Vendor, Invoice, Attachment, InvoiceEvent],
  migrations: [],
  subscribers: [],
});
