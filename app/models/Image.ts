import { z } from "zod";
import { db } from "~/utils/db.server";

export const databaseImageFields = {
  id: z.number(),
  url: z.string(),
  propertyId: z.number(),
  created: z.string().datetime().or(z.date()),
  updated: z.string().datetime().or(z.date()),
  active: z.boolean(),
};

export const databaseImageSchema = z.object(databaseImageFields);

export type ImageSchema = z.infer<typeof databaseImageSchema>;

export abstract class ImageService {
  static async addImageUrls(propertyId: number, urls: string[]) {
    const images = urls.map((url) => ({
      url,
      propertyId,
    }));
    return db.image.createMany({
      data: images,
    });
  }

  static async updateImage(id: number, data: Partial<ImageSchema>) {
    return db.image.update({
      where: { id },
      data,
    });
  }

  static async deactivateImages(images: ImageSchema[]) {
    const ids = images.map((image) => image.id);
    if (ids.length === 0) return;
    return db.image.updateMany({
      where: { id: { in: ids } },
      data: { active: false },
    });
  }
}
