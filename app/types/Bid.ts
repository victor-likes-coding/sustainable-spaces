import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { z } from "zod";
import { db } from "~/utils/db.server";

export const BidSchema = z.object({
  bid: z.number({ coerce: true }),
  propertyId: z.number({ coerce: true }),
  userId: z.number({ coerce: true }),
});

export type BidSchema = z.infer<typeof BidSchema>;

type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Bid {
  id: number;
  amount: number;
  propertyId: number;
  userId: number;
  created: Date;
  updated: Date;
  status: BidStatus;
}

type BidSelect = Prisma.BidSelect<DefaultArgs>;

export abstract class BidService {
  static async create(bid: BidSchema) {
    const validatedBid = BidService.validateBid(bid);

    if (!validatedBid.success) throw new Error("Invalid bid");

    const id = await this.checkForExistingBid(validatedBid.data);

    if (!id)
      return db.bid.create({
        data: {
          amount: validatedBid.data.bid,
          propertyId: validatedBid.data.propertyId,
          userId: validatedBid.data.userId,
        },
        select: {
          id: true,
        },
      });

    return this.updateExistingBid(validatedBid.data, id);
  }

  static validateBid(bid: BidSchema) {
    return BidSchema.safeParse(bid);
  }

  static async checkForExistingBid(
    bid: BidSchema,
    select: BidSelect = { id: true }
  ) {
    const data = await db.bid.findFirst({
      where: {
        userId: bid.userId,
        propertyId: bid.propertyId,
        status: "PENDING",
      },
      select,
    });

    if (!data) return false;

    return data.id;
  }

  static updateExistingBid(bid: BidSchema, id: number) {
    return db.bid.update({
      data: {
        amount: bid.bid,
      },
      where: {
        id,
        userId: bid.userId,
        propertyId: bid.propertyId,
        status: "PENDING",
      },
    });
  }
}
