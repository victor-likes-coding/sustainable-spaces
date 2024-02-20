// import { Form, Link } from "@remix-run/react";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Navbar from "~/components/navbar";
import { db } from "~/utils/db.server";
import {
  TokenPayload,
  createZillowUrl,
  getLoggedInStatus,
  getZillowDataFromHtml,
} from "~/utils/helper";
import { requireToken } from "~/utils/sessions.server";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import invariant from "invariant";
import { useRef } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  invariant(
    process.env.REACT_APP_GOOGLE_MAPS_API,
    "REACT_APP_GOOGLE_MAPS_API is not defined"
  );
  try {
    const payload = await requireToken(request);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API;
    console.log(apiKey);
    return json({
      payload,
      apiKey,
    });
  } catch (error) {
    return json({
      payload: {},
      apiKey: "",
    });
  }
};

export default function Index() {
  const { payload, apiKey } = useLoaderData<typeof loader>();
  const isLoggedIn: boolean = getLoggedInStatus(payload as TokenPayload);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlaceChanged = async () => {
    const place = inputRef.current?.value;
    // now that we have a complete address, we can search zillow with axios
    try {
      const serverResponse = await fetch("/getZillowData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: createZillowUrl(place) }),
      });
      const { data } = await serverResponse.json();

      // for now the data is @ the .25% mark
      const html: string = data.substring(Math.floor(data.length * 0.25));

      const pattern = `</script></div></div><div id="__NEXT_SCRIPTS_DEV__"></div><script id="__NEXT_DATA__" type="application/json">`;

      const property = getZillowDataFromHtml(html, pattern);
      console.log(property);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className={`w-full h-without-nav-fixed bg-primary text-white`}>
        <main className="px-4 h-full flex flex-col pt-6">
          <h1 className="text-4xl font-bold text-center pb-4">Add Property</h1>
          <div className="w-full">
            <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
              <Autocomplete
                className="text-black"
                onLoad={(autocomplete) => {
                  console.log("Autocomplete loaded: ", autocomplete);
                }}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for a location"
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                />
              </Autocomplete>
            </LoadScript>
          </div>
        </main>
      </div>
    </>
  );
}
