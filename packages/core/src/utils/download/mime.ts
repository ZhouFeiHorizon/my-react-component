// https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types

/** 标准MIME类型到文件扩展名映射（符合IANA注册表） */
export const MIME_TO_EXT_MAP = {
  // 图片类型
  'image/jpeg': ['jpeg', 'jpg'],
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
  'image/x-icon': 'ico',
  'image/tiff': ['tiff', 'tif'],
  'image/apng': 'apng',
  'image/heic': 'heic',

  // 文档类型
  'application/pdf': 'pdf',
  'application/zip': 'zip',
  'application/x-rar-compressed': 'rar',
  'application/x-7z-compressed': '7z',
  'application/x-tar': 'tar',
  'application/gzip': 'gz',
  'application/x-bzip2': 'bz2',

  // Office文档
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.oasis.opendocument.text': 'odt',

  // 文本类型
  'text/plain': 'txt',
  'text/html': ['html', 'htm'],
  'text/css': 'css',
  'text/javascript': ['js', 'mjs'],
  'text/csv': 'csv',
  'text/xml': 'xml',
  'application/json': 'json',
  'text/markdown': 'md',

  // 音视频类型
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'audio/webm': 'weba',
  'audio/aac': 'aac',

  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogv',
  'video/x-msvideo': 'avi',
  'video/quicktime': 'mov',

  // 其他常见类型
  'application/octet-stream': 'bin',
  'application/x-shockwave-flash': 'swf',
  'application/x-msdownload': 'exe',
  'font/woff': 'woff',
  'font/woff2': 'woff2',
} as const;

function extValToArray(extVal?: any): string[] {
  if (!extVal) {
    return [];
  }
  return Array.isArray(extVal) ? extVal : [extVal];
}

/** 扩展名到MIME类型反向映射（自动生成） */
export const EXT_TO_MIME_MAP = (() => {
  const map: Record<string, string> = {};
  for (const [mime, extVal] of Object.entries(MIME_TO_EXT_MAP)) {
    const exts = extValToArray(extVal);
    for (const ext of exts) {
      map[ext] = mime;
    }
  }
  return map;
})();

/**
 * 根据MIME类型获取首选文件扩展名
 * @param mime - 标准MIME类型（支持带参数，如'text/html; charset=UTF-8'）
 * @returns 首选文件扩展名，未知类型返回'bin'
 */
export function getExtensionFromMime(mime: string): string {
  // 标准化MIME类型（移除参数并小写化）
  const [normalizedMime] = mime.split(';').map((s) => s.trim().toLowerCase());

  // 优先查找精确匹配
  const extVal = MIME_TO_EXT_MAP[normalizedMime as keyof typeof MIME_TO_EXT_MAP];
  const exts = extValToArray(extVal);
  if (exts.length) {
    return exts[0];
  }

  // 尝试猜测类型（如'application/vnd.ms-excel.sheet.macroEnabled.12'）
  const parts = normalizedMime.split(/[/+-]/);
  const candidate = parts[parts.length - 1];
  return /^[a-z0-9]{1,8}$/i.test(candidate) ? candidate : 'bin';
}

/**
 * 根据文件扩展名获取MIME类型
 * @param ext - 文件扩展名（不区分大小写，可带点号）
 * @returns 对应的MIME类型，未知扩展名返回'application/octet-stream'
 */
export function getMimeFromExtension(ext: string): string {
  // 标准化扩展名（移除点号并小写化）
  const normalizedExt = ext.replace(/^\./, '').toLowerCase();
  return EXT_TO_MIME_MAP[normalizedExt] || 'application/octet-stream';
}
