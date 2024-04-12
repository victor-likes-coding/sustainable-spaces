import { Buffer } from "buffer";
import sharp from "sharp";

export type SupportedFileTypes =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/tiff"
  | "image/avif";

interface CompressionOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: SupportedFileTypes; // Assuming these are your supported formats
}

type CompressImage = (
  imageBuffer: Buffer,
  options: CompressionOptions
) => Promise<Buffer>;

export const compressImage: CompressImage = async (imageBuffer, options) => {
  let sharpInstance = sharp(imageBuffer);

  if (options.width || options.height) {
    sharpInstance = sharpInstance.resize(options.width, options.height);
  }

  // Default format settings
  const defaultQuality = options.quality ?? 80; // Default quality if not specified
  switch (options.format) {
    case "image/jpeg":
      sharpInstance = sharpInstance.jpeg({
        quality: options.quality ?? defaultQuality,
      });
      break;
    case "image/png":
      sharpInstance = sharpInstance.png({
        quality: options.quality ?? defaultQuality,
      });
      break;
    case "image/webp":
      sharpInstance = sharpInstance.webp({
        quality: options.quality ?? defaultQuality,
      });
      break;
    case "image/tiff":
      sharpInstance = sharpInstance.tiff({
        quality: options.quality ?? defaultQuality,
      });
      break;
    case "image/avif":
      sharpInstance = sharpInstance.avif({
        quality: options.quality ?? defaultQuality,
      });
      break;
    default:
      // If format is not supported or not specified, default to JPEG
      sharpInstance = sharpInstance.jpeg({ quality: defaultQuality });
      console.warn(`Unsupported or no format specified, defaulting to JPEG.`);
      break;
  }

  return sharpInstance.toBuffer();
};
