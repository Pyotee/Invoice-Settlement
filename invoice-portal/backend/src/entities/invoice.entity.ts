import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vendor } from './vendor.entity';
import { User } from './user.entity';

export type InvoiceStatus = 'uploaded' | 'under_review' | 'approved' | 'rejected' | 'settled';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ nullable: true })
  invoice_no: string;

  @Column({ length: 50 })
  reference_no: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: string;

  @Column({ length: 3 })
  currency: string;

  @Column({ type: 'date', nullable: true })
  issue_date: string | null;

  @Column({ type: 'date', nullable: true })
  due_date: string | null;

  @Column({ type: 'varchar', default: 'uploaded' })
  status: InvoiceStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploaded_by: User | null;

  @Column({ nullable: true })
  file_key: string;

  @Column({ nullable: true })
  file_version: string;

  @Column({ nullable: true })
  checksum: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
