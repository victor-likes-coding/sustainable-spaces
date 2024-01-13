// import { Form, Link } from "@remix-run/react";

import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";

// import Button from "~/components/button";

export const loader = async () => {
  return json({
    properties: await db.property.findUnique({ where: { id: 1 } }),
  });
};

export default function Property() {
  return (
    <div className="w-full h-without-nav-fixed bg-primary text-white">
      <main className="px-4 h-full flex flex-col pt-6">hello</main>
    </div>
  );
}
