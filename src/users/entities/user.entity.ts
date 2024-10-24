import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

class UserAmount {
  @Column()
  email: string;

  @Column()
  amount: number;
}

@Entity('user')
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  user_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  mobile: string;

  @Column()
  balance: number;

  @Column()
  dues: UserAmount[];

  @Column()
  transaction_history: string[];

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
