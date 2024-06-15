import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PolicyAssignmentTargetType } from '@constants';

@Schema({ timestamps: true })
export class PolicyAssignment {
  @Prop({ type: Types.ObjectId, ref: 'Policy', required: true })
  policyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  targetId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(PolicyAssignmentTargetType),
    required: true,
  })
  targetType: PolicyAssignmentTargetType;
}

export const PolicyAssignmentSchema =
  SchemaFactory.createForClass(PolicyAssignment);
export type PolicyAssignmentDocument = PolicyAssignment & Document;
