import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import Navbar from "~/components/navbar";
import { TokenPayload } from "~/utils/helper";
import { requireToken } from "~/utils/sessions.server";
import SearchImage from "../assets/images/undraw_house_searching_re_stk8.svg";
import ManageImage from "../assets/images/undraw_add_information_j2wg.svg";
import DonateImage from "../assets/images/undraw_transfer_money_re_6o1h.svg";
import { getLoggedInStatus } from "~/utils/getLoggedInStatus";
import { ServiceCard } from "~/components/ServiceCard";

export async function loader({ request }: LoaderFunctionArgs) {
  // check and see if user is already logged in
  // if so, redirect to properties
  // if not, continue
  const payload = await requireToken(request);
  return json({ payload });
}

export default function Index() {
  const { payload } = useLoaderData<typeof loader>();
  const isLoggedIn: boolean = getLoggedInStatus(payload as TokenPayload);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="w-full h-screen bg-custom-primary">
        <main className="px-8 h-full flex align-middle flex-col text-center py-6">
          <h1 className="text-2xl font-bold text-white mb-4">I want to...</h1>
          <div className="services w-full flex gap-6 flex-col">
            <ServiceCard
              title="View Properties"
              url={SearchImage}
              to="/property/"
            />
            <ServiceCard
              title="Manage Properties"
              url={ManageImage}
              to={`/user/${payload.id}/property`}
            />
            <ServiceCard
              to="/donate"
              title="Crowdfund"
              url={DonateImage}
              style={{
                outer: "text-center",
                svg: "w-[60%] mx-auto",
              }}
            />
          </div>
        </main>
      </div>
    </>
  );
}
