import { z } from 'zod';

export const validate = <T>(schema: z.ZodSchema<T>, data: T) => {
  return schema.safeParse(data);
};

export const getValidationErrors = (
  result: z.SafeParseReturnType<any, any>
) => {
  return (
    result.error?.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })) || []
  );
};
