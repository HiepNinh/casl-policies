import { DynamicModule, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './ability.factory';
import { Action, Subject } from '@constants';
import { Subject as CaslSubject } from '@casl/ability';
import { PoliciesGuard } from '@guards/policies.guard';
import { DynamicModelFetcher } from '@utils';
import { Reflector } from '@nestjs/core';

@Module({})
export class CaslModule {
  static forRoot<
    A extends string = Action,
    S extends CaslSubject = Subject,
  >(): DynamicModule {
    return {
      module: CaslModule,
      providers: [
        Reflector,
        DynamicModelFetcher,
        {
          provide: CaslAbilityFactory,
          useClass: CaslAbilityFactory<A, S>,
        },
        {
          provide: PoliciesGuard,
          useClass: PoliciesGuard<A, S>,
        },
      ],
      exports: [
        Reflector,
        DynamicModelFetcher,
        CaslAbilityFactory,
        PoliciesGuard,
      ],
    };
  }
}
