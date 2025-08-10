import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../data-source';
import { UsersModule } from './users.module';
import { VendorsModule } from './vendors.module';
import { InvoicesModule } from './invoices.module';
import { HealthController } from '../controllers/health.controller';
import { MailerService } from '../services/mailer.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true, // DEV only
      }),
    }),
    UsersModule,
    VendorsModule,
    InvoicesModule,
  ],
  controllers: [HealthController],
  providers: [MailerService],
})
export class AppModule {}
