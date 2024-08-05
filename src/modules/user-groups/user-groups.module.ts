import { Module } from '@nestjs/common';
import { UserGroupsController } from './user-groups.controller';
import { UserGroupsService } from './user-groups.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserGroup,
  UserGroupSchema,
  AccountUserGroup,
  AccountUserGroupSchema,
} from '@entities';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: UserGroup.name,
          schema: UserGroupSchema,
        },
        {
          name: AccountUserGroup.name,
          schema: AccountUserGroupSchema,
        },
      ],
      'local_connection',
    ),
  ],
  controllers: [UserGroupsController],
  providers: [UserGroupsService],
  exports: [UserGroupsService],
})
export class UserGroupsModule {}
