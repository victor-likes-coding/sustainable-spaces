import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { BidService } from "~/types/Bid";
import { getFormData } from "~/utils/getFormData";
import { checkInvariant, requireToken } from "~/utils/sessions.server";

export async function action({ request, params }: ActionFunctionArgs) {
  checkInvariant(params, "propertyId");
  // needs to check if the user performing the action is logged in
  const payload = await requireToken(request);
  // needs to make sure we're not bidding on a property we own.
  // formData should have bid, and propertyId
  if (!payload) return redirect("/login");

  const formData = await getFormData(request);
  const { bid, propertyId } = Object.fromEntries(formData) as {
    bid: string;
    propertyId: string;
  };

  // convert bid to integer/number
  const parsedBid = parseInt(bid.replace(/[^0-9.-]+/g, ""));

  const data = {
    bid: parsedBid,
    propertyId: parseInt(propertyId),
    userId: payload.id,
  };

  // create the bid
  const { id } = await BidService.create(data);

  if (!id) return redirect("/property?success=false");

  return redirect("/property?success=true");
}

export async function loader() {
  return redirect("/property");
}
