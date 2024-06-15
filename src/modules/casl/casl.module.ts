import { DynamicModule, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './ability.factory';
import { Action, Subject } from '@constants';
import { Subject as CaslSubject } from '@casl/ability';

@Module({})
export class CaslModule {
  static forRoot<
    A extends string = Action,
    S extends CaslSubject = Subject,
  >(): DynamicModule {
    return {
      module: CaslModule,
      providers: [
        {
          provide: CaslAbilityFactory,
          useClass: CaslAbilityFactory<A, S>,
        },
      ],
      exports: [CaslAbilityFactory],
    };
  }
}
