import { Body, Controller, Get, Post } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { PolicyDto } from '@dtos';
import { PolicyAssignmentTargetType } from '@constants';
import { Serialize } from '@decorators/serialize.decorator';

@Serialize(PolicyDto.Read)
@Controller('policies')
export class PoliciesController {
  constructor(private readonly policyService: PoliciesService) {}

  @Post()
  async createPolicy(@Body() policy: PolicyDto.Create) {
    return await this.policyService.createPolicy(policy);
  }

  @Post('/user-assignment')
  async assignPoliciesToUser(@Body() assignment: PolicyDto.Assign) {
    return await this.policyService.assignPolicies(
      assignment.policyIds,
      assignment.targetId,
      PolicyAssignmentTargetType.Account,
    );
  }

  @Post('/group-assignment')
  async assignPoliciesToGroup(@Body() assignment: PolicyDto.Assign) {
    return await this.policyService.assignPolicies(
      assignment.policyIds,
      assignment.targetId,
      PolicyAssignmentTargetType.UserGroup,
    );
  }

  @Post('/revoke')
  async revokePolicies(@Body() assignment: PolicyDto.Assign) {
    return await this.policyService.revokePolicies(
      assignment.policyIds,
      assignment.targetId,
    );
  }

  @Get()
  async getAll() {
    return await this.policyService.getAll();
  }
}
