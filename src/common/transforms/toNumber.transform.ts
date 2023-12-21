export const toNumber = ({ value }: { value?: unknown }) => {
  if (Number.isNaN(parseFloat(value as string))) {
    return undefined;
  }

  return parseFloat(value as string);
};
