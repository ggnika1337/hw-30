import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  fullName!: string;

  @Prop({ type: String, required: true })
  gender!: string;

  @Prop({ type: Number })
  phoneNumber!: number;

  @Prop({ type: Number })
  age!: number;

  @Prop({ type: String, unique: true })
  email!: string;

  @Prop({ type: String })
  password: string;

  @Prop({ default: Date.now })
  subStart!: Date;

  @Prop()
  subEnd!: Date;

  @Prop({
    default: false,
  })
  isActive!: boolean;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
      },
    ],
    default: [],
  })
  expenses!: Types.ObjectId[];

  @Prop({ default: 0 })
  totalSpent!: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
