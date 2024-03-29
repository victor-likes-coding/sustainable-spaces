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
          <footer className="bg-dark text-white p-4 text-[.6rem] px-8 relative z-100 bottom-0 left-0 xsmall:hidden">
            <nav className="flex justify-between flex-wrap">
              <div className="col-wrapper flex flex-col gap-2">
                <div className="underline">Useful Links</div>
                <Link to={{ pathname: "/" }}>Home</Link>
                <Link to="/about">About</Link>
                <Link to="/services">Services</Link>
                <Link to="/privacy">
                  Privacy <span className="hidden">Policy</span>
                </Link>
                <Link to="/tos">
                  Terms <span className="hidden">and Conditions</span>
                </Link>
              </div>
              <div className="col-wrapper flex flex-col gap-2">
                <div className="underline">Community</div>
                <Link to="/help">Help</Link>
                <Link to="/properties">Properties</Link>
                <Link to="/forum">Forum</Link>
                <Link to="/support">Support</Link>
              </div>

              <div className="col-wrapper flex flex-col gap-2">
                <div className="underline">Contact</div>
                <Link to="mailto:some-email@email.com" target="__blank">
                  some-email@email.com
                </Link>
                <Link to="tel:+1-800-123-4567" target="__blank">
                  +1 (800) 123-4567
                </Link>
                <div>New York, NY 10012, US</div>
              </div>
              <div className="flex w-full justify-around"></div>
            </nav>
          </footer>
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
