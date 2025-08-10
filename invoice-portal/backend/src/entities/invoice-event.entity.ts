import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { User } from './user.entity';

@Entity()
export class InvoiceEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actor_user_id' })
  actor: User | null;

  @Column()
  event_type: string;

  @Column({ type: 'jsonb', nullable: true })
  event_data: any;

  @CreateDateColumn()
  ts: Date;
}
