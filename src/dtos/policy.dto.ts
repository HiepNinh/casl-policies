import { Action, Effect, Subject } from '@constants';
import { ExposeId } from '@decorators';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Statement {
  @IsEnum(Effect)
  @Expose()
  effect: 'Allow' | 'Deny';

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  @Expose()
  actions: Action[];

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  @Expose()
  resources: Subject[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  fields?: string[];

  @IsOptional()
  @Expose()
  conditions?: Record<string, any>;
}

export class Create {
  @IsString()
  @Expose()
  version: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Statement)
  @Expose()
  statements: Statement[];
}

export class Read extends Create {
  @ExposeId()
  @IsString()
  _id: string;
}

export class Assign {
  @IsArray()
  @IsString({ each: true })
  policyIds: string[];

  @IsString()
  targetId: string;
}
