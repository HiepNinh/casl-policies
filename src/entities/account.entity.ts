import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Account {
  static readonly modelName = 'Account';

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: [{ type: String }],
  })
  title: string[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
export type AccountDocument = Account & Document;
