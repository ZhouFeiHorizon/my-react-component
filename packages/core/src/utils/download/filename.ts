import { getMimeFromExtension, EXT_TO_MIME_MAP } from './mime';

/** 文件命名选项 */
export interface FileNamingOptions {
  /**
   * 直接指定的文件名（最高优先级）
   */
  filename?: string;
  /**
   * 从响应头解析的文件名（次优先级）
   */
  responseFilename?: string;
  /**
   * 从URL解析的文件名（第三优先级）
   */
  url?: string;
  /**
   * 默认文件名（最低优先级）
   */
  defaultFilename?: string;
}

/** 从响应头解析文件名 */
export function parseFilenameFromHeader(header: string): string | undefined {
  const encodedMatch = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(header);
  if (encodedMatch) {
    return decodeURIComponent(encodedMatch[1]);
  }

  const plainMatch = /filename="?([^";]+)"?/i.exec(header);
  return plainMatch?.[1] ? decodeURIComponent(plainMatch[1]) : undefined;
}

/** 从URL路径解析干净文件名 */
export function getFilenameFromUrl(url: string): string | undefined {
  try {
    const { pathname } = new URL(url);
    return pathname
      .split('/')
      .pop()
      ?.replace(/[^a-zA-Z0-9_.-]/g, '');
  } catch {
    return undefined;
  }
}

/** 获取文件扩展名（最长支持8个字符） */
export function getFileExtension(filename: string): string | undefined {
  const match = filename.match(/\.([a-zA-Z0-9]{1,8})$/i);
  return match?.[1]?.toLowerCase();
}

/**
 * 获取下载文件名
 */
export function getDownloadName({ url, filename, responseFilename, defaultFilename }: FileNamingOptions) {
  if (filename) {
    return filename;
  }
  if (responseFilename) {
    return responseFilename;
  }

  if (url) {
    const urlFilename = getFilenameFromUrl(url);
    if (urlFilename) {
      const urlExt = getFileExtension(urlFilename)?.toLowerCase();

      // 正常文件名
      if (urlExt && EXT_TO_MIME_MAP[urlExt]) {
        return urlFilename;
      }
      if (!defaultFilename) {
        // 不是正常的文件名&没有默认值
        return urlFilename;
      }
    }
  }

  return defaultFilename || 'download';
}

/**
 * 确保文件扩展名正确
 */
export function normalizeFilename(filename: string, targetExt: string): string {
  const currentExt = getFileExtension(filename)?.toLowerCase();
  const normalizedTargetExt = targetExt.toLowerCase();

  if (!currentExt) {
    return `${filename}.${normalizedTargetExt}`;
  }

  if (currentExt === normalizedTargetExt) {
    return filename;
  }

  const currentMime = getMimeFromExtension(currentExt);
  const targetMime = getMimeFromExtension(normalizedTargetExt);

  // 如果 MIME 类型相同（如 jpg vs jpeg），不修改扩展名
  if (currentMime && targetMime && currentMime === targetMime) {
    return filename;
  }

  // 移除原扩展名，添加目标扩展名
  const nameWithoutExt = filename.slice(0, -(currentExt.length + 1)); // +1 for dot
  return `${nameWithoutExt}.${normalizedTargetExt}`;
}
