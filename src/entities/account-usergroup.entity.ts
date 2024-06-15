import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AccountUserGroup {
  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  accountId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserGroup', required: true })
  userGroupId: Types.ObjectId;
}

export const AccountUserGroupSchema =
  SchemaFactory.createForClass(AccountUserGroup);
export type AccountUserGroupDocument = AccountUserGroup & Document;
