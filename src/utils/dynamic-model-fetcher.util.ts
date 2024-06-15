import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class DynamicModelFetcher {
  constructor(
    @InjectConnection('local_connection')
    private readonly connection: Connection,
  ) {}

  async fetchEntity(modelName: string, id: string): Promise<any> {
    const model: Model<any> = this.connection.model(modelName);
    const entity = await model.findById(id).exec();
    if (!entity) {
      throw new NotFoundException(`${modelName} with ID ${id} not found`);
    }
    return entity;
  }
}
