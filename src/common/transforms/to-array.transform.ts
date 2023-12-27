export const toArray = ({ value }: { value?: unknown }, separator = ',') => {
  if (value && typeof value.toString === 'function') {
    return value.toString().split(separator);
  }
  return value;
};
