interface ImageSize {
  width: number;
  height: number;
}

export function loadImage(
  src: string,
  crossOrigin?: 'anonymous' | 'use-credentials',
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}


/**
 * 获取image
 */
export const getImageSize = async (src: string): Promise<ImageSize> => {
  const image = await loadImage(src);
  return {
    width: image.width,
    height: image.height,
  };
};