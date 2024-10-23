import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm";

export enum SplitType {
    EQUAL = "equal",
    EXACT = "exact",
    PERCENT = "percent",
}

class ReceiverUser {
    @Column()
    email: string

    @Column()
    name: string
}

class UserShare {
    @Column()
    email: string

    @Column()
    amount: number

    @Column()
    percent: number | null
}

@Entity()
export class Expense {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    date: Date

    @Column()
    amount: number

    @Column()
    description: string

    @Column()
    paid_to: ReceiverUser[]

    @Column()
    paid_by: string

    @Column({
        type: 'enum',
        enum: SplitType,
    })
    split_type: SplitType

    @Column(type => UserShare)
    shares: UserShare[]

    @CreateDateColumn()
    created_at: Date
}
