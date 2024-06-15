import { subject as an, Subject as CaslSubject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { CHECK_POLICIES_KEY, RequiredPolicy } from '@decorators';
import { CaslAbilityFactory } from '@modules/index.services';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DynamicModelFetcher } from '@utils';
import { omit, isEmpty } from 'lodash';
import { Action, Subject } from '@constants';

@Injectable()
export class PoliciesGuard<
  A extends string = Action,
  S extends CaslSubject = Subject,
> implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,
    @Inject(DynamicModelFetcher)
    private readonly dynamicModelFetcher: DynamicModelFetcher,
    @Inject(CaslAbilityFactory)
    private caslAbilityFactory: CaslAbilityFactory<A, S>,
  ) {}

  /**
   * Main method that determines if the current request can proceed based on defined policies.
   * @param context - The execution context, containing the request and response objects.
   * @returns A boolean indicating whether the request is allowed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve policies defined for the route handler and class
    const policies =
      this.reflector.getAllAndOverride<RequiredPolicy<A, S>[]>(
        CHECK_POLICIES_KEY,
        [context.getHandler(), context.getClass()],
      ) || [];
    if (isEmpty(policies)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const account = request.user;
    // Define the abilities based on the user's policies
    const ability = await this.caslAbilityFactory.defineAbility(
      account.policies,
      account,
    );

    const conditionContext: Record<string, any> = {};

    for (const policy of policies) {
      const subject: string = policy.subject as string;

      // Validate fields in the request body against updatable fields defined in the policies
      if (request.body) {
        this.checkUpdatableFields(policy, ability, request);
      }

      // Fetch entity dynamically if ID is present in the request parameters
      if (request.params[`${subject.toLowerCase()}Id`]) {
        await this.fetchEntityIfNeeded(subject, request, conditionContext);
      }
    }

    // Check if all policies are satisfied
    return this.checkPolicies(policies, ability, conditionContext);
  }

  /**
   * Checks if the fields in the request body are allowed to be updated based on the policy.
   * @param policy - The policy that defines the allowed actions and subjects.
   * @param ability - The ability object that checks permissions.
   * @param request - The incoming request object.
   */
  private checkUpdatableFields(
    policy: RequiredPolicy<A, S>,
    ability: any,
    request: any,
  ): void {
    const subjectKey = (policy.subject as string).toLowerCase();
    const bodyToCheck = request.body[subjectKey]
      ? request.body[subjectKey]
      : request.body;

    // Retrieve the fields that are permitted to be updated
    const updatableFields = permittedFieldsOf(
      ability,
      policy.action,
      policy.subject,
      {
        fieldsFrom: (rule) => rule.fields || [],
      },
    );

    // If there are specific updatable fields defined, check for unallowed fields in the request body
    if (updatableFields.length > 0) {
      const unallowedFields = Object.keys(omit(bodyToCheck, updatableFields));
      if (unallowedFields.length > 0) {
        throw new BadRequestException(
          `Fields not allowed to be updated: ${unallowedFields.join(', ')}`,
        );
      }
    }
  }

  /**
   * Fetches the entity dynamically based on the policy subject and request parameter ID, if needed.
   * @param subject - The subject entity defined in the policy.
   * @param request - The incoming request object.
   * @param conditionContext - The context object where fetched entities are stored.
   */
  private async fetchEntityIfNeeded(
    subject: string,
    request: any,
    conditionContext: Record<string, any>,
  ): Promise<void> {
    const entity = await this.dynamicModelFetcher.fetchEntity(
      subject,
      request.params[`${subject.toLowerCase()}Id`],
    );
    if (entity) {
      conditionContext[subject.toLowerCase()] = entity;
    } else {
      throw new BadRequestException(`Entity not found for subject: ${subject}`);
    }
  }

  /**
   * Checks if all policies are satisfied based on the abilities and condition context.
   * @param policies - The array of policies to be checked.
   * @param ability - The ability object that checks permissions.
   * @param conditionContext - The context object containing fetched entities.
   * @returns A boolean indicating whether all policies are satisfied.
   */
  private checkPolicies(
    policies: RequiredPolicy<A, S>[],
    ability: any,
    conditionContext: Record<string, any>,
  ): boolean {
    return policies.every((policy) => {
      const subject: string = policy.subject as string;
      return ability.can(
        policy.action,
        conditionContext[subject.toLowerCase()]
          ? an(subject, conditionContext[subject.toLowerCase()])
          : policy.subject,
      );
    });
  }
}
