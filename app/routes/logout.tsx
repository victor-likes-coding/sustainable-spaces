import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { logout } from "~/utils/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  return await logout(request);
}

export async function loader() {
  return redirect("/");
}
