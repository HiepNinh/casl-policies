import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Policy {
  static readonly modelName = 'Policy';

  @Prop({ required: true })
  version: string;

  @Prop({
    type: [
      {
        effect: { type: String, required: true },
        actions: { type: MongooseSchema.Types.Mixed, required: true },
        resources: { type: MongooseSchema.Types.Mixed, required: true },
        fields: { type: [{ type: String }] },
        conditions: { type: Map, of: MongooseSchema.Types.Mixed },
      },
    ],
    required: true,
    validate: {
      validator: function (value: any) {
        return value.every((item: any) => {
          const actionsValid =
            typeof item.actions === 'string' || Array.isArray(item.actions);
          const resourcesValid =
            typeof item.resources === 'string' || Array.isArray(item.resources);
          return actionsValid && resourcesValid;
        });
      },
      message: (props) =>
        `${props.path} should be a string or an array of strings`,
    },
  })
  statements: {
    effect: 'Allow' | 'Deny';
    actions: string | string[];
    resources: string | string[];
    fields: string[];
    conditions?: Record<string, any>;
  }[];
}

export const PolicySchema = SchemaFactory.createForClass(Policy);
export type PolicyDocument = Policy & Document;
