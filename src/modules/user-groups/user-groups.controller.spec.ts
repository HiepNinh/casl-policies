import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupsController } from './user-groups.controller';

describe('UserGroupsController', () => {
  let controller: UserGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupsController],
    }).compile();

    controller = module.get<UserGroupsController>(UserGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
