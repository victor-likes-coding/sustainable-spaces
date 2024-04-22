import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import tailwindStyles from "./tailwind.css";
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { NextUIProvider } from "@nextui-org/react";
import ModernNavbar from "./components/ModernNavbar";
import { getTokenPayload } from "./utils/sessions.server";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const payload = await getTokenPayload(request);
  return json({ isLoggedIn: !!payload });
};

export default function App() {
  const { isLoggedIn } = useLoaderData<typeof loader>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <Document title="Sustainable Spaces">
      <Layout
        isLoggedIn={isLoggedIn}
        isSidebarOpen={isSidebarOpen}
        changeSidebarState={setIsSidebarOpen}
      >
        <NextUIProvider>
          <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <div className="container-wrapper w-screen min-h-screen h-auto bg-custom-primary">
            <Outlet />
          </div>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </NextUIProvider>
      </Layout>
    </Document>
  );
}

export function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="font-default">{children}</body>
    </html>
  );
}

export function Layout({
  children,
  isLoggedIn,
  changeSidebarState,
  isSidebarOpen,
}: {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  changeSidebarState: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen?: boolean;
}) {
  return (
    <>
      {children}
      <ModernNavbar
        isSideBarOpen={isSidebarOpen}
        onClick={() => changeSidebarState((prev) => !prev)}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);
  let message: string = "";
  if (
    error instanceof Error &&
    error.name === "PrismaClientKnownRequestError"
  ) {
    message = "You need an internet connection to be able to view this page.";
  }
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Oh no!</h1>
        <p>Something went wrong.</p>
        <p>{message}</p>
        <Scripts />
      </body>
    </html>
  );
}
