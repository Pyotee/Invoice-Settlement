import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column()
  file_key: string;

  @Column({ nullable: true })
  checksum: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  mime_type: string;
}
