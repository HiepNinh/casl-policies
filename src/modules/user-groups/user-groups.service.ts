import { UserGroupDto } from '@dtos';
import {
  AccountUserGroup,
  AccountUserGroupDocument,
  UserGroup,
  UserGroupDocument,
} from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class UserGroupsService {
  constructor(
    @InjectModel(UserGroup.name, 'local_connection')
    private readonly userGroupModel: SoftDeleteModel<UserGroupDocument>,
    @InjectModel(AccountUserGroup.name, 'local_connection')
    private readonly accountUserGroupModel: SoftDeleteModel<AccountUserGroupDocument>,
  ) {}

  async create(group: UserGroupDto.Create, creator: string) {
    return await this.userGroupModel.create({ ...group, creator });
  }

  async add(userGroupId: string, userIds: string[]) {
    const usersAdded = userIds.map((userId) => ({
      accountId: userId,
      userGroupId,
    }));
    return await this.accountUserGroupModel.insertMany(usersAdded);
  }

  async remove(userGroupId: string, userIds: string[]) {
    return await this.accountUserGroupModel.deleteMany({
      userGroupId: userGroupId,
      accountId: { $in: userIds },
    });
  }

  async getAll() {
    return await this.userGroupModel.find().exec();
  }
}
