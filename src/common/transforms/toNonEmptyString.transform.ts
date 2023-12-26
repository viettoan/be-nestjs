export const toNonEmptyString = ({ value }: { value?: unknown }) => {
  if (value && typeof value.toString === 'function') {
    return value.toString();
  }
  return undefined;
};
