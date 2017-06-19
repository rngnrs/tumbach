import sharp from 'sharp';

import * as Files from '../core/files';
import * as Tools from '../helpers/tools';

export function match(mimeType) {
  return Files.isPdfType(mimeType);
}

export function suffixMatchesMimeType(suffix, mimeType) {
  return 'pdf' === suffix && 'application/pdf' === mimeType;
}

export function defaultSuffixForMimeType(mimeType) {
  return ('application/pdf' === mimeType) ? 'pdf' : null;
}

export function thumbnailSuffixForMimeType(mimeType) {
  return ('application/pdf' === mimeType) ? 'png' : null;
}

export async function createThumbnail(file, thumbPath, path) {
  await new Promise((resolve, reject) => {
    sharp(`${path}`).png().resize(200, 200).max().toFile(thumbPath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
  let thumbInfo = Files.getImageSize(thumbPath);
  if (!thumbInfo) {
    throw new Error(Tools.translate('Failed to identify image file: $[1]', '', thumbPath));
  }
  return {
    thumbDimensions: {
      width: thumbInfo.width,
      height: thumbInfo.height
    }
  };
}
