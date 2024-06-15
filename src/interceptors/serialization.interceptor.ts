import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { SERIALIZE } from '@decorators';

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(map((data) => this.transformResponse(context, data)));
  }

  private transformResponse(context: ExecutionContext, data: any): any {
    const targetClass = this.reflector.getAllAndOverride(SERIALIZE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (targetClass) {
      const instance = plainToInstance(targetClass, data, {
        excludeExtraneousValues: true,
      });
      return instance;
    }
    return data;
  }
}
