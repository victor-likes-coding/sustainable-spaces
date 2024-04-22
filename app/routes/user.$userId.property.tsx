// Layout file
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, Outlet } from "@remix-run/react";
import { validateUser } from "~/utils/sessions.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  // route is only accessible to the logged in user
  try {
    await validateUser(request, params);
  } catch (e) {
    // invariant error
    return json({ status: 401 });
  }
  return json({});
}

export default function Page() {
  return (
    <div className="w-full h-full min-h-screen pt-4">
      <Outlet />
    </div>
  );
}
