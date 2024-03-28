import { Storage } from "@google-cloud/storage";
import { invariant } from "framer-motion";
import { compressImage, SupportedFileTypes } from "./compressImage";

invariant(!!process.env.GCP_KEY_FILE, "GCP_KEY_FILE is required");
invariant(!!process.env.GCP_STORAGE_BUCKET, "GCP_STORAGE_BUCKET is required");

const storage = new Storage({
  keyFilename: process.env.GCP_KEY_FILE!,
});

const bucket = storage.bucket(process.env.GCP_STORAGE_BUCKET!);

/**
 * Uploads an image to Google Cloud Storage.
 *
 * @param imageBuffer - The buffer containing image data.
 * @param imageName - The name for the image file in the storage.
 * @param contentType - The MIME type of the image (e.g., 'image/jpeg').
 * @returns The URL of the uploaded image.
 */
export const uploadImage = async (
  imageBuffer: Buffer,
  imageName: string,
  contentType: string
): Promise<string> => {
  const file = bucket.file(imageName);
  const stream = file.createWriteStream({
    metadata: { contentType },
  });

  return new Promise((resolve, reject) => {
    stream.on("error", reject);
    stream.on("finish", () => {
      // Construct and resolve the public URL for the uploaded file
      const publicUrl = `https://storage.googleapis.com/${
        bucket.name
      }/${encodeURIComponent(imageName)}`;
      resolve(publicUrl);
    });
    stream.end(imageBuffer);
  });
};

export const uploadImages = async (files: FormDataEntryValue[]) => {
  let imageUrls: string[] = [];

  if (files.length > 0) {
    const uploadPromises = files.map(async (file) => {
      if (file instanceof File) {
        // Convert file to buffer
        const originalBuffer = Buffer.from(await file.arrayBuffer());
        // Compress the image
        const compressedBuffer = await compressImage(originalBuffer, {
          width: 800, // Example width, adjust as needed
          format: file.type as SupportedFileTypes, // Or dynamically determine based on file.type
          quality: 80, // Adjust quality as needed
        });
        return uploadImage(compressedBuffer, file.name, file.type);
      }
      return null;
    });
    imageUrls = (await Promise.all(uploadPromises)).filter(
      (url) => url != null
    );
  }
  return imageUrls;
};
