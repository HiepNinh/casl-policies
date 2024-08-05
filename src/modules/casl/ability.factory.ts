import { Injectable } from '@nestjs/common';
import {
  MongoAbility,
  Subject as CaslSubject,
  createMongoAbility,
  MongoQuery,
  RawRuleOf,
} from '@casl/ability';
import { Action, Subject, Effect } from '@constants';
import { get, isEmpty } from 'lodash';

export type Abilities<A extends string, S extends CaslSubject> = [A, S];
export type AppAbility<A extends string, S extends CaslSubject> = MongoAbility<
  Abilities<A, S>,
  MongoQuery
>;

@Injectable()
export class CaslAbilityFactory<
  A extends string = Action,
  S extends CaslSubject = Subject,
> {
  constructor() {}

  async defineAbility(policies: any, user: any): Promise<AppAbility<A, S>> {
    // Flatten all statements from policies
    const allStatements = policies.flatMap((policy) => policy.statements);
    const rules: RawRuleOf<AppAbility<A, S>>[] = [];

    // Process all statements
    allStatements.forEach((statement) => {
      const fields = !isEmpty(statement.fields) ? statement.fields : undefined;
      const conditions = !isEmpty(statement.conditions)
        ? this.replacePlaceholders(statement.conditions, user)
        : undefined;

      const rule = {
        action: statement.actions,
        subject: statement.resources,
        fields,
        conditions,
      } as RawRuleOf<AppAbility<A, S>>;

      if (statement.effect === Effect.Allow) {
        rules.unshift(rule);
      } else if (statement.effect === Effect.Deny) {
        rule.inverted = true;
        // Place deny rules at the end
        rules.push(rule);
      }
    });

    return createMongoAbility<AppAbility<A, S>>(rules);
  }

  /**
   * Recursively replaces placeholders in the conditions object with values from the user object.
   * @param conditions - The conditions object with placeholders.
   * @param user - The user object containing values to replace placeholders.
   * @returns The conditions object with placeholders replaced.
   */
  private replacePlaceholders(conditions: any, user: any): any {
    // Traverse the conditions object
    for (const key in conditions) {
      if (typeof conditions[key] === 'object' && conditions[key] !== null) {
        // Recursively replace placeholders in nested objects
        conditions[key] = this.replacePlaceholders(conditions[key], user);
      } else if (typeof conditions[key] === 'string') {
        // Replace the placeholder if it matches the {{}} pattern
        conditions[key] = this.replacePlaceholder(conditions[key], user);
      }
    }
    return conditions;
  }

  /**
   * Replaces a single placeholder with the corresponding value from the user object.
   * @param placeholder - The placeholder string.
   * @param user - The user object containing values to replace placeholders.
   * @returns The string with placeholders replaced.
   */
  private replacePlaceholder(placeholder: string, user: any): any {
    const regex = /{{(.*?)}}/g;
    return placeholder.replace(regex, (_, path) =>
      get(user, path.trim(), `{{${path}}}`),
    );
  }
}
