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

  static getInactiveImages(images: ImageSchema[]) {
    return images?.filter((image) => !image.active) || [];
  }

  static async deactivateImages(images?: ImageSchema[]) {
    if (!images) return;

    const inactiveImages = this.getInactiveImages(images);
    if (inactiveImages.length === 0 || !inactiveImages) return;

    const ids = new Set(images.map((image) => image.id)); // remove duplicates for whatever reason
    if (ids.size === 0) return;
    // return db.image.updateMany({
    //   where: { id: { in: Array.from(ids) } },
    //   data: { active: false },
    // });
  }
}
