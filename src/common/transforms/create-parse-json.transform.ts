import { Type } from '@nestjs/common';

export function createParseJsonTransform<T>(ClassRef: Type<T>) {
  return ({ value }: { value?: unknown }) => {
    if (value && typeof value.toString === 'function') {
      const result = new ClassRef();
      const data = JSON.parse(value.toString()) as unknown;
      return Object.assign(result as object, data);
    }
    return undefined;
  };
}