import { Module } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Policy,
  PolicyAssignment,
  PolicyAssignmentSchema,
  PolicySchema,
} from '@entities';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Policy.name,
          schema: PolicySchema,
        },
        {
          name: PolicyAssignment.name,
          schema: PolicyAssignmentSchema,
        },
      ],
      'local_connection',
    ),
  ],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
