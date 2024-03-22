import { z } from "zod";
import { db } from "~/utils/db.server";

export const databaseImageFields = {
  id: z.number(),
  url: z.string(),
  propertyId: z.number(),
  created: z.string().datetime().or(z.date()),
  updated: z.string().datetime().or(z.date()),
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
}
