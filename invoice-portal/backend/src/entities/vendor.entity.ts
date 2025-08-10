import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  contact_email: string;

  @Column({ default: 'active' })
  status: string;
}
