import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserGroup {
  static readonly modelName = 'UserGroup';

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId })
  creator: Types.ObjectId;
}

export const UserGroupSchema = SchemaFactory.createForClass(UserGroup);
export type UserGroupDocument = UserGroup & Document;
