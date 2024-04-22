import { TokenPayload } from "./helper.d";
import jwt from "jsonwebtoken";
// app/sessions.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node"; // or cloudflare/deno
import invariant from "invariant";
import { User, UserService } from "~/models/user";
import { Params } from "@remix-run/react";
import { UserNotFoundError } from "./errors";
invariant(process.env.REACT_SESSION_SECRET, "REACT_SESSION_SECRET is required");
invariant(process.env.REACT_JWT_SECRET, "REACT_JWT_SECRET is required");

type SessionData = {
  token: string;
};

type SessionFlashData = {
  error: string;
};

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "__session",

    // all of these are optional
    // domain: process.env.NODE_ENV === "production" ? "" : "localhost",
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    // expires: new Date(Date.now() + 60_000),
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.REACT_SESSION_SECRET],
    secure: process.env.ENV === "production",
  },
});
export const { getSession, commitSession, destroySession } = sessionStorage;

export async function createUserSession(
  { email, id }: User,
  redirectTo: string
) {
  const token = jwt.sign(
    { email, id },
    process.env.REACT_JWT_SECRET as string,
    {
      expiresIn: 60 * 60 * 24 * 30,
    }
  );
  const session = await getSession();
  session.set("token", token);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return session;
}

export async function getTokenPayload(request: Request) {
  const session = await getUserSession(request);
  const token = session.get("token");
  // verify token
  if (!token || typeof token !== "string") return null;
  const payload = jwt.verify(
    token,
    process.env.REACT_JWT_SECRET as string
  ) as TokenPayload; // throws if invalid otherwise decoded
  return payload;
}

export async function requireToken(request: Request) {
  const payload = await getTokenPayload(request);
  // check if using user in database
  if (!payload) return logout(request);

  const { id } = payload;
  try {
    await UserService.getUserById(id);
  } catch (e) {
    return logout(request);
  }

  return payload;
}

export async function getUser(request: Request) {
  const payload = await getTokenPayload(request);
  if (!payload) return null;
  const { id } = payload;
  try {
    const user = await UserService.getUserById(id);
    return user;
  } catch (error) {
    return logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  throw redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function checkForToken(request: Request) {
  const payload = await getTokenPayload(request);
  if (payload) throw redirect("/getting-started");
}

export async function validateUser(request: Request, params: Params<string>) {
  invariant(params.userId, "No user id found in params");
  let payload;
  try {
    payload = await getTokenPayload(request);
    if (!payload) return null;
    const { id } = payload;
    await UserService.getUserById(id); // throws UserNotFoundError

    if (params.userId && params.userId !== id.toString()) {
      throw new Error("Unauthorized access");
    }
  } catch (e) {
    if (e instanceof UserNotFoundError) return logout(request);
    if (e instanceof Error) {
      throw redirect("/getting-started?error=unauthorized");
    }
  }
  return payload;
}
