import { SetMetadata } from '@nestjs/common';
import { Subject as CaslSubject } from '@casl/ability';
import { Action, Subject } from '@constants';

export interface RequiredPolicy<
  A extends string = Action,
  S extends CaslSubject = Subject,
> {
  action: A;
  subject: S;
}

export const CHECK_POLICIES_KEY = 'check_policy';

export const CheckPolicies = <
  A extends string = Action,
  S extends CaslSubject = Subject,
>(
  ...policies: RequiredPolicy<A, S>[]
) => SetMetadata(CHECK_POLICIES_KEY, policies);
