import * as XLSX from 'xlsx';

export type ConvertToJsonOpt<T> = {
  header?: (keyof T)[];

  range?: unknown;

  blankrows?: boolean;

  defval?: unknown;

  raw?: boolean;

  skipHidden?: boolean;

  rawNumbers?: boolean;
};

export const readData = (data: unknown, opts?: XLSX.ParsingOptions) => {
  return XLSX.read(data, opts);
};

export function convertToJson<T>(
  worksheet: XLSX.WorkSheet,
  options: ConvertToJsonOpt<T> = {}
) {
  return XLSX.utils.sheet_to_json<T>(worksheet, {
    ...options,
    header: options.header as string[] | undefined,
  });
}

export const getHeader = (worksheet: XLSX.WorkSheet): string[] => {
  const aoa = XLSX.utils.sheet_to_json<string[]>(worksheet, {
    header: 1,
  });
  return aoa[0];
};

export const verifyHeader = (worksheet: XLSX.WorkSheet, headers: string[]) => {
  const sheetHeaders = getHeader(worksheet);
  let success = true;
  for (let i = 0; i < headers.length; i += 1) {
    if (!sheetHeaders[i]) success = false;
    if (!sheetHeaders[i].startsWith(headers[i])) success = false;
    if (!success) {
      break;
    }
  }
  if (!success) {
    throw new Error(`Invalid file header`);
  }
};
