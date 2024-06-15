import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  AccountUserGroup,
  AccountUserGroupSchema,
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
          name: Account.name,
          schema: AccountSchema,
        },
        {
          name: PolicyAssignment.name,
          schema: PolicyAssignmentSchema,
        },
        {
          name: AccountUserGroup.name,
          schema: AccountUserGroupSchema,
        },
        {
          name: Policy.name,
          schema: PolicySchema,
        },
      ],
      'local_connection',
    ),
  ],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
