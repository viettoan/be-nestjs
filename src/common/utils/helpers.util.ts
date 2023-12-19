import { MongoServerError } from 'mongodb';

type responseType = {
  errors?: object;
  data?: object;
  status: number;
  message: string;
  now: Date;
};

export const responseSuccess = (
  data: any,
  status: number = 200,
  message: string = '',
): responseType => {
  return {
    now: new Date(),
    status,
    data,
    message,
  };
};

export const responseErrors = (
  errors: any,
  status: number = 500,
): responseType => {
  if (errors instanceof MongoServerError) {
    return handleMongoServerError(errors, status);
  }

  return {
    errors: [],
    status,
    message: errors.message || '',
    now: new Date(),
  };
};

const handleMongoServerError = (
  errors: MongoServerError,
  status: number = 500,
): responseType => {
  const response = {
    errors: [],
    status,
    message: '',
    now: new Date(),
  };
  const [path, value] = Object.entries(errors.keyValue)[0];
  response.message = '';

  switch (errors.code) {
    case 11000:
      response.errors.push({
        [path]: {
          value,
          message: capitalizeFirstLetter(path) + ' đã tồn tại',
        },
      });
      break;
    default:
      response.message = errors.message;
  }

  return response;
};

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
