import { InferSubjects } from '@casl/ability';
import { Policy, Account, UserGroup } from '@entities';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subject =
  | InferSubjects<typeof Policy | typeof Account | typeof UserGroup, true>
  | 'all';
