import { ExposeId } from '@decorators/expose-objectId.decorator';
import { Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class Create {
  @Expose()
  @IsString()
  name: string;
}

export class Read extends Create {
  @ExposeId()
  @IsString()
  _id: string;

  @Expose()
  @IsString()
  creator: string;
}

export class UsersList {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
