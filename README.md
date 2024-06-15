# Casl Policies

A package to manage and enforce policies in a NestJS application using CASL

## Installation

To install the package, use the following command:

```
npm install casl-policies
```

## Setup

#### Step 1: Define Action and Subject Types

Define your `Action` and `Subject` types. If not defined, default ones will be used.

```js
export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subject = 'Policy' | 'Account' | 'UserGroup' | 'all';
```

#### Step 2: Importing Necessary Classes from casl-policies package

Import the necessary classes such as `Guard`, and `CaslModule` from casl-policies package.

```js
// app.module.ts
import { Module } from '@nestjs/common';
import { CaslModule, PoliciesGuard, DynamicModelFetcher } from 'casl-policies';

// Define your action and subject types
type MyAction = 'create' | 'read' | 'update' | 'delete';
type MySubject = 'User' | 'Post';

@Module({
  imports: [
    CaslModule.forRoot<MyAction, MySubject>(),
  ],
  providers: [
    DynamicModelFetcher,
    {
      provide: 'POLICIES_GUARD',
      useClass: PoliciesGuard<MyAction, MySubject>,
    },
  ],
})
export class AppModule {}
```

#### Step 3: Custom Decorator

Define a custom decorator that will call `CheckPolicies<A, S>`, imported from `casl-policies`.

```js
// custom-check-policies.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RequiredPolicy, CheckPolicies } from 'casl-policies';

export const CustomCheckPolicies = (...policies: RequiredPolicy<MyAction, MySubject>[]) => {
  return CheckPolicies<MyAction, MySubject>(...policies);
};
```

#### Step 4: Using the Decorator in Controller

```js
// my.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CustomCheckPolicies } from './custom-check-policies.decorator';

@Controller('my-controller')
export class MyController {
  @CustomCheckPolicies<MyAction, MySubject>({ action: 'read', subject: 'User', conditions: {} })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a user with id ${id}`;
  }

  @CustomCheckPolicies<MyAction, MySubject>({ action: 'write', subject: 'User', conditions: {} })
  @Post()
  create(@Body() createDto: any) {
    return 'This action adds a new user';
  }
}
```

#### Step5: Put into practices with Example Policy

```js
[
  {
    "version": "2012-10-17",
    "statements": [
      {
        "effect": "Allow",
        "actions": ["read"],
        "resources": ["Account"],
        "fields": [],
        "conditions": {
          "title": {
            "$nin": ["CEO", "CTO"]
          }
        }
      }
    ]
  },
  {
    "version": "2012-10-17",
    "statements": [
      {
        "effect": "Allow",
        "actions": [update", "delete"],
        "resources": ["Account"],
        "fields": [],
        "conditions": {
          "_id": "{{_id}}"
        }
      }
    ]
  },
  {
    "version": "2012-10-17",
    "statements": [
      {
        "effect": "Deny",
        "actions": ["update", "delete"],
        "resources": ["Policy"],
        "fields": ["version"],
        "conditions": {}
      }
    ]
  }
]
```

## Explanation

#### Building Ability in CaslFactory

The `CaslAbilityFactory` class is responsible for defining user abilities based on policies. It processes policies, replaces placeholders in conditions with user data, and builds abilities using `AbilityBuilder`. Allow rules are pushed to the end of the rules array, while deny rules are unshifted to the beginning, ensuring deny rules are applied first.

#### How PoliciesGuard Works

The `PoliciesGuard` class checks if the current request can proceed based on defined policies. It retrieves policies defined for the route handler and class using `Reflector`, then defines abilities based on the user's policies using CaslAbilityFactory. It validates fields in the request body against updatable fields defined in the policies, fetches entities dynamically if an ID is present in the request parameters, and checks if all policies are satisfied using the can method of the ability object.

```js
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
```

## Conclusion

The `casl-policies` package provides a robust framework for managing and enforcing policies in a NestJS application using CASL. By defining your `Action` and `Subject` types, importing necessary classes from the `casl-policies` package, and setting up the `CaslModule` and `PoliciesGuard`, you can easily implement fine-grained access control in your application. Custom decorators such as `CheckPolicies` allow you to enforce these policies at the controller level, ensuring that only authorized actions are permitted based on the defined rules.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
