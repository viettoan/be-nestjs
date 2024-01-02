import { BadRequestException, HttpStatus } from '@nestjs/common';

export function getFileFilter(mimeTypes: string[], extensions: string[]) {
  return (
    _req: unknown,
    file: {
      /** Field name specified in the form */
      fieldname: string;
      /** Name of the file on the user's computer */
      originalname: string;
      /** Encoding type of the file */
      encoding: string;
      /** Mime type of the file */
      mimetype: string;
      /** Size of the file in bytes */
      size: number;
      /** The folder to which the file has been saved (DiskStorage) */
      destination: string;
      /** The name of the file within the destination (DiskStorage) */
      filename: string;
      /** Location of the uploaded file (DiskStorage) */
      path: string;
      /** A Buffer of the entire file (MemoryStorage) */
      buffer: Buffer;
    },
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!mimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('File import không đúng định dạng'),
        false,
      );
    }
    let valid = false;
    extensions.forEach((extension) => {
      if (
        file.originalname &&
        file.originalname.toLowerCase().endsWith(`.${extension.toLowerCase()}`)
      ) {
        valid = true;
      }
    });
    if (!valid) {
      return callback(
        new BadRequestException('File import không đúng định dạng'),
        false,
      );
    }
    return callback(null, true);
  };
}

export function getImageFileFilter() {
  return getFileFilter(['image/png', 'image/jpeg'], ['jpg', 'jpeg', 'png']);
}

export function getExcelFileFilter() {
  return getFileFilter(
    [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ],
    ['xls', 'xlsx'],
  );
}

export function getPDFFileFilter() {
  return getFileFilter(['application/pdf'], ['pdf']);
}
