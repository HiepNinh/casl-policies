import {
  Expose,
  TransformFnParams,
  Transform,
  ExposeOptions,
} from 'class-transformer';

export const ExposeId =
  (options?: ExposeOptions): PropertyDecorator =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  (target: Object, propertyKey: string | symbol) => {
    Transform(
      (params: TransformFnParams) =>
        params.obj[options?.name ? options.name : propertyKey],
    )(target, propertyKey);
    Expose(options)(target, propertyKey);
  };
