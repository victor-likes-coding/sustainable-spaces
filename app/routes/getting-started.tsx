import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import Navbar from "~/components/navbar";
import { TokenPayload, getLoggedInStatus } from "~/utils/helper";
import { requireToken } from "~/utils/sessions.server";
import SearchImage from "../assets/images/undraw_house_searching_re_stk8.svg";
import ManageImage from "../assets/images/undraw_add_information_j2wg.svg";
import DonateImage from "../assets/images/undraw_transfer_money_re_6o1h.svg";

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
      <div className="w-full h-without-nav-auto bg-primary">
        <main className="px-8 h-full flex align-middle flex-col text-center py-6">
          <h1 className="text-2xl font-bold text-white mb-4">I want to...</h1>
          <div className="services w-full flex gap-6 flex-col">
            <div className="service-card p-2 rounded-md border bg-white drop-shadow-md">
              <div className="svg-wrapper w-full">
                <img src={SearchImage} alt="Search for house" />
              </div>
              <div className="service-card-body mt-2">
                <div className="service-card-title">View Properties</div>
              </div>
            </div>

            <div className="service-card bg-white p-2 rounded-md">
              <div className="svg-wrapper w-full">
                <img src={ManageImage} alt="Manage Properties" />
              </div>
              <div className="service-card-body mt-2">
                <div className="service-card-title">Manage Properties</div>
              </div>
            </div>

            <div className="service-card bg-white p-2 rounded-md text-center">
              <div className="svg-wrapper w-3/5 mx-auto">
                <img src={DonateImage} alt="Manage Properties" />
              </div>
              <div className="service-card-body mt-2">
                <div className="service-card-title">Crowdfund</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
