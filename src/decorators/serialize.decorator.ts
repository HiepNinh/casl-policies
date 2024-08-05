import { SetMetadata } from '@nestjs/common';

export const SERIALIZE = 'serialize';
export const Serialize = (model: any) => SetMetadata(SERIALIZE, model);
