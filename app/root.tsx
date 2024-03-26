import type { LinksFunction } from "@remix-run/node";
import tailwindStyles from "./tailwind.css";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { NextUIProvider } from "@nextui-org/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-default">
        <NextUIProvider>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </NextUIProvider>
      </body>
    </html>
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
