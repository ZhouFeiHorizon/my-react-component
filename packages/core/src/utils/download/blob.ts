import { triggerDownload } from './core';
import { normalizeFilename, FileNamingOptions, getDownloadName } from './filename';
import { getExtensionFromMime } from './mime';

export function blobSave(blob: Blob, options: FileNamingOptions = {}) {
  const ext = getExtensionFromMime(blob.type);
  const downloadName = getDownloadName(options);
  const filename = normalizeFilename(downloadName, ext);

  if ('msSaveOrOpenBlob' in window.navigator) {
    // ie使用的下载方式
    return (window.navigator as any).msSaveOrOpenBlob(blob, filename);
  }

  const blobUrl = URL.createObjectURL(blob);
  triggerDownload(blobUrl, filename);
  URL.revokeObjectURL(blobUrl);
}
