import { Serialize } from '@decorators';
import { UserGroupDto } from '@dtos';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';

@Serialize(UserGroupDto.Read)
@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly userGroupService: UserGroupsService) {}

  @Post()
  async createGroup(@Body() group: UserGroupDto.Create, @Req() req) {
    return await this.userGroupService.create(group, req.user._id);
  }

  @Post(':id')
  async addUsers(
    @Param('id') groupId: string,
    @Body() users: UserGroupDto.UsersList,
  ) {
    return await this.userGroupService.add(groupId, users.userIds);
  }

  @Post(':id')
  async removeUsers(
    @Param('id') groupId: string,
    @Body() users: UserGroupDto.UsersList,
  ) {
    return await this.userGroupService.remove(groupId, users.userIds);
  }

  @Get()
  async getAll() {
    return await this.userGroupService.getAll();
  }
}
