import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import Navbar from "~/components/navbar";
import { UserService, elevatedAuthData, userAuthData } from "~/models/user";
import { useEffect, useRef, useState } from "react";
import {
  DataValidationEror,
  IncorrectEmailOrPasswordError,
  UserNotFoundError,
} from "~/utils/errors";
import { checkForToken, createUserSession } from "~/utils/sessions.server";
import Loader from "~/components/Loader";
import Footer from "~/components/Footer";
import { getFormData } from "~/utils/getFormData";

// import Button from "~/components/button";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await getFormData(request);
  const errors = {
    message: "",
    email: "",
    password: "",
  };
  const data: userAuthData | elevatedAuthData = Object.fromEntries(
    formData
  ) as userAuthData;

  // ? TODO: send back error messages based on what's wrong

  // assuming everything is good, create a user / session
  // redirect to properties
  try {
    const user = await UserService.login(data);
    return await createUserSession({ ...user }, data.redirectTo ?? "/property");
  } catch (error) {
    // this catch should only be triggered if the auth data validation fails

    if (error instanceof DataValidationEror) {
      return json({
        errors: {
          ...errors,
          ...error.errs,
          message: error.message,
        },
      });
    }

    if (
      error instanceof UserNotFoundError ||
      error instanceof IncorrectEmailOrPasswordError
    ) {
      return json({
        errors: {
          ...errors,
          message: error.message,
        },
      });
    }
    if (
      (error as { name: string }).name === "PrismaClientInitializationError"
    ) {
      return json({
        errors: {
          ...errors,
          message: "Server is down. Please try again at a later time.",
        },
      });
    }

    // if we get here, something went wrong that I haven't accounted for
    return json({
      errors: {
        ...errors,
        message: "Something went wrong. Please try again.",
      },
    });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  // check and see if user is already logged in
  // if so, redirect to properties
  // if not, continue
  await checkForToken(request);
  return json({});
}

export default function Signup() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const actionData = useActionData<typeof action>(); // should only be the errors
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }

    if (isLoading) {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);
  return (
    <>
      <Navbar />
      <div className="w-full h-screen bg-custom-primary text-white">
        <main className="px-4 h-full flex flex-col justify-center pb-32">
          <div className="w-full px-2">
            <h1
              className={`${
                actionData?.errors?.message ? "mt-10" : "my-10"
              } text-2xl font-bold text-center`}
            >
              Login
            </h1>
            <div className="text-red-600 font-semibold text-center mb-4 text-xs">
              {actionData?.errors.message}
            </div>
            <Form
              onSubmit={() => setIsLoading(true)}
              method="post"
              className="w-full h-auto flex flex-col gap-2 mb-2"
            >
              <div className="input-group w-full flex flex-col gap-1">
                <label htmlFor="email" className="text-sm">
                  Email address
                </label>
                <input
                  ref={emailRef}
                  required
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={true}
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  aria-invalid={actionData?.errors?.email ? true : undefined}
                  aria-describedby="email-error"
                  className="rounded-sm pl-2 text-custom-secondary"
                />
                <div
                  className="pt-1 text-red-600 text-xs font-semibold"
                  id="email-error"
                >
                  {actionData?.errors?.email}
                </div>
              </div>
              <div className="input-group w-full flex flex-col gap-1">
                <div className="password-row flex justify-between text-sm">
                  <label htmlFor="password" className="text-sm">
                    Password
                  </label>
                  <Link
                    to="forgot-password"
                    className="font-semibold text-custom-secondary"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  ref={passwordRef}
                  autoComplete="new-password"
                  aria-invalid={actionData?.errors?.password ? true : undefined}
                  aria-describedby="password-error"
                  type="password"
                  id="password"
                  name="password"
                  className="rounded-sm text-secondary pl-2"
                />
                <div
                  className="pt-1 text-red-600 text-xs font-semibold"
                  id="password-error"
                >
                  {actionData?.errors?.password}
                </div>
              </div>
              <input
                type="text"
                name="adminCode"
                className="hidden rounded-sm text-secondary pl-2"
              />
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get("redirectTo") ?? undefined}
              />

              <div className="input-group w-full flex flex-col gap-1">
                <button
                  type="submit"
                  className="rounded-sm bg-custom-secondary py-2 text-xs font-bold"
                >
                  Login
                </button>
              </div>
            </Form>
            <div className="login-redirect text-sm text-center">
              Don&#39;t have an account?{" "}
              <Link
                to="/signup"
                className="text-custom-secondary font-semibold ml-1"
              >
                Sign up
              </Link>
            </div>
          </div>
        </main>
        <Footer isVisible />
      </div>
      {isLoading ? (
        <Loader text="Signing in" color="success" labelColor="success" />
      ) : null}
    </>
  );
}
