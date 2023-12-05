import { MongoServerError } from 'mongodb';

type responseType = {
  errors?: object;
  data?: object;
  status_code: number;
  message: string;
  now: Date;
};

export const responseSuccess = (
  data: any,
  statusCode: number = 200,
  message: string = '',
): responseType => {
  return {
    now: new Date(),
    status_code: statusCode,
    data: data,
    message: message,
  };
};

export const responseErrors = (
  errors: any,
  statusCode: number = 500,
): responseType => {
  if (errors instanceof MongoServerError) {
    return handleMongoServerError(errors, statusCode);
  }

  return {
    errors: [],
    status_code: statusCode,
    message: errors.message || '',
    now: new Date(),
  };
};

const handleMongoServerError = (
  errors: MongoServerError,
  statusCode: number = 500,
): responseType => {
  const response = {
    errors: [],
    status_code: statusCode,
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
