import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json } from "@remix-run/react";
import Button from "~/components/button";
import Footer from "~/components/Footer";
import Navbar from "~/components/navbar";
import { checkForToken } from "~/utils/sessions.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // check and see if user is already logged in
  // if so, redirect to properties
  // if not, continue
  await checkForToken(request);
  return json({});
}

export default function Index() {
  return (
    <>
      <Navbar />
      <div className="w-full h-without-nav-fixed bg-custom-primary">
        <main className="px-16 h-full flex justify-center align-middle flex-col text-center">
          <h1 className="text-3xl mb-5">
            Welcome to{" "}
            <span className="font-bold text-secondary">Sustainable Spaces</span>
          </h1>
          <Button text="Get Started" link={true} to="/signup" />
          <Link to={"/about"} className="text-sm mt-2 underline">
            Learn more
          </Link>
          <Footer isVisible />
        </main>
      </div>
    </>
  );
}
