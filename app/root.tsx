import type { LinksFunction } from "@remix-run/node";
import tailwindStyles from "./tailwind.css";
import Logo from "./assets/images/logo-transparent.png";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

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
      <body>
        <nav className="bg-primary sticky top-0 left-0">
          <div className="brand-wrapper flex items-center font-bold text-green-700">
            <div className="logo-wrapper w-12">
              <img src={Logo} alt="logo" className="w-full" />
            </div>
            <div className="text-sm relative right-1 hidden">
              Sustainable Spaces
            </div>
          </div>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
