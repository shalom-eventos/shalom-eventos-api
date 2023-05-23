interface IParams {
  keyword: string;
  separator?: string;
  withHash?: boolean;
  hash?: string;
}

/**
 * Generates a slug based on keywords
 */
export const generateSlug = ({
  keyword,
  separator = '-',
  withHash = false,
  hash,
}: IParams) => {
  const slug = `${keyword.toLowerCase()}`.replace(
    /([^a-z0-9 ]+)|\s/gi,
    separator
  );

  if (!withHash) return slug;

  const hashCode = hash ?? String(new Date().getTime()).substring(8);

  return slug + separator + hashCode;
};
