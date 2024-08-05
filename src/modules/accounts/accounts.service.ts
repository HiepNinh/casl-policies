import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
  Account,
  AccountDocument,
  AccountUserGroup,
  AccountUserGroupDocument,
  Policy,
  PolicyAssignment,
  PolicyAssignmentDocument,
  PolicyDocument,
} from '@entities';
import { AccountDto } from '@dtos';
import { ConfigService } from '@nestjs/config';
import { BcryptUtil } from '@utils';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name, 'local_connection')
    private readonly accountModel: SoftDeleteModel<AccountDocument>,
    @InjectModel(PolicyAssignment.name, 'local_connection')
    private readonly policyAssignmentModel: SoftDeleteModel<PolicyAssignmentDocument>,
    @InjectModel(AccountUserGroup.name, 'local_connection')
    private readonly accountUserGroupModel: SoftDeleteModel<AccountUserGroupDocument>,
    @InjectModel(Policy.name, 'local_connection')
    private readonly policyModel: SoftDeleteModel<PolicyDocument>,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async register(accountData: AccountDto.Create) {
    // Hasing password with private key
    accountData.password = await BcryptUtil.hashPassword(accountData.password);

    // Save account to database
    const account = await this.accountModel.create(accountData);
    return account;
  }

  async getAll() {
    return await this.accountModel.find().exec();
  }

  async getOne(query: any) {
    // Fetch the account
    const account = await this.accountModel.findOne(query).exec();

    if (!account) {
      return null;
    }

    // Fetch related AccountUserGroups to get userGroupIds
    const userGroups = await this.accountUserGroupModel
      .find({ accountId: account._id.toString() })
      .select('userGroupId')
      .exec();
    const userGroupIds = userGroups.map((ug) => ug.userGroupId.toString());

    // Combine account ID and userGroupIds for the policy assignment query
    const targetIds = [account._id.toString(), ...userGroupIds];

    // Fetch distinct policyIds from related PolicyAssignments
    const policyAssignmentAggregation = await this.policyAssignmentModel
      .aggregate([
        {
          $match: {
            targetId: { $in: targetIds },
          },
        },
        { $group: { _id: '$policyId' } },
      ])
      .exec();
    const distinctPolicyIds = policyAssignmentAggregation.map((pa) => pa._id);

    // Fetch the policies using the distinct policyIds
    const policies = await this.policyModel
      .find({ _id: { $in: distinctPolicyIds } })
      .exec();

    return { ...account, policies, groups: userGroupIds };
  }

  async getById(_id: string) {
    return await this.getOne({ _id });
  }
}
