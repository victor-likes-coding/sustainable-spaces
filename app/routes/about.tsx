// import type { MetaFunction } from "@remix-run/node";
// import { Link } from "@remix-run/react";

import Button from "~/components/button";

export default function About() {
  return (
    <div className="w-full h-without-nav-auto bg-primary text-white">
      <main className="px-8 h-full flex flex-col gap-4 pb-8">
        <h2 className="text-lg font-bold pt-6 text-center">Our Company Goal</h2>
        <p className="text-md">
          At{" "}
          <span className="text-secondary font-bold">Sustainable Spaces</span>,
          we are dedicated to creating affordable rental solutions and
          connecting homeowners with those in need of housing. Our comprehensive
          approach simplifies real estate investing, offering vital services
          such as tenant screening, background checks, efficient rent
          collection, and facilitating the buying and selling of properties
          within our community.
        </p>

        <p>
          To make our low-cost rental options a reality, we utilize a unique
          crowdfunding approach, pooling resources from our users. Coupled with
          creative financing and other innovative tools, we can directly
          purchase properties from homeowners, ensuring affordability. While
          homeowners are welcome to list their properties on our platform, they
          should be aware that they will be competing with the attractive prices
          we are able to offer through our direct purchase strategy.
        </p>

        <Button text="Donate Today" className="mt-2" />
      </main>
    </div>
  );
}
