export const responseSuccess = (
  data: any,
  statusCode: number = 200,
  message: string = '',
): object => {
  return {
    now: new Date(),
    status_code: statusCode,
    data: data,
    message: message,
  };
};