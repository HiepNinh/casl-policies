import { Injectable } from '@nestjs/common';
import {
  Policy,
  PolicyAssignment,
  PolicyAssignmentDocument,
  PolicyDocument,
} from '@entities';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { PolicyDto } from '@dtos';
import { PolicyAssignmentTargetType } from '@constants';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectModel(Policy.name, 'local_connection')
    private readonly policyModel: SoftDeleteModel<PolicyDocument>,
    @InjectModel(PolicyAssignment.name, 'local_connection')
    private readonly policyAssignmentModel: SoftDeleteModel<PolicyAssignmentDocument>,
  ) {}

  async createPolicy(policy: PolicyDto.Create) {
    console.log(policy);
    return await this.policyModel.create(policy);
  }

  async assignPolicies(
    pilicyIds: string[],
    targetId: string,
    targetType: PolicyAssignmentTargetType,
  ) {
    const policyAssignments = pilicyIds.map((policyId) => ({
      policyId,
      targetId,
      targetType,
    }));
    return await this.policyAssignmentModel.insertMany(policyAssignments);
  }

  async revokePolicies(policyIds: string[], targetId: string) {
    return await this.policyAssignmentModel.deleteMany({
      targetId: targetId,
      policyId: { $in: policyIds },
    });
  }

  async getAll() {
    return await this.policyModel.find().exec();
  }
}
