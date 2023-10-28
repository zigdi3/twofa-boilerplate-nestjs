import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ select: false })
  authConfirmToken: string;

  @Column({ default: false, nullable: true })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
