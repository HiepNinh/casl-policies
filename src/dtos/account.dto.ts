import { Expose, Type } from 'class-transformer';
import { IsArray, IsString, MinLength } from 'class-validator';
import { PolicyDto } from '@dtos';
import { ExposeId } from '@decorators';

export class Create {
  @IsString()
  @Expose()
  username: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsArray()
  @Expose()
  title: string[];
}

export class Read extends Create {
  @ExposeId()
  @IsString()
  _id: string;
}

export class ReadDetail extends Read {
  @Expose()
  @Type(() => PolicyDto.Read)
  policies: PolicyDto.Read[];

  @Expose()
  groups: any;
}
