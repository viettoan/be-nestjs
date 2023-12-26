export function CreateSearchLikeQueryUtil(
  query: string | undefined,
): RegExp | undefined {
  return query ? new RegExp(`${query}`) : undefined;
}
