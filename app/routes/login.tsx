import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import Navbar from "~/components/navbar";
import { UserService, elevatedAuthData, userAuthData } from "~/models/user";
import { authError } from "~/utils/helper";
import { useEffect, useRef } from "react";
import { DataValidationEror, UserNotFoundError } from "~/utils/errors";
import { checkForToken, createUserSession } from "~/utils/sessions.server";

// import Button from "~/components/button";

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone(); // fixes locking up the readable stream for the request object
  const formData = await clonedRequest.formData();
  const errors = {
    message: "",
    email: "",
    password: "",
  };
  const data: userAuthData | elevatedAuthData = Object.fromEntries(
    formData
  ) as userAuthData;

  // ? TODO: send back error messages based on what's wrong

  // check if admin for superuser
  if (data.adminCode && data.adminCode === process.env.ADMIN_CODE) {
    // set admin in data
    data.admin = true;
  }

  // assuming everything is good, create a user / session
  // redirect to properties
  try {
    const user = await UserService.login(data);
    return createUserSession({ ...user }, data.redirectTo ?? "/property");
  } catch (error) {
    console.log(`We've encountered an error.`);
    // this catch should only be triggered if the auth data validation fails
    if (error instanceof DataValidationEror) {
      const newErrors: authError = JSON.parse(error.message);
      return json({
        errors: {
          ...errors,
          ...newErrors,
        },
      });
    }

    if (error instanceof UserNotFoundError) {
      return json({
        errors: {
          ...errors,
          message: error.message,
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

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);
  return (
    <>
      <Navbar />
      <div className="w-full h-without-nav-fixed bg-primary text-white">
        <main className="px-4 h-full flex flex-col justify-center pb-32">
          <div className="w-full px-2">
            <h1
              className={`${
                actionData?.errors?.message ? "mt-10" : "my-10"
              } text-2xl font-bold text-center`}
            >
              Login
            </h1>
            {/* {actionData?.errors?.message ? ( */}
            <div className="text-red-600 font-semibold text-center mb-4">
              {actionData?.errors.message}
            </div>
            {/* ) : null} */}
            <Form
              method="post"
              className="w-full h-auto flex flex-col gap-4 mb-2"
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
                  className="rounded-sm pl-2 text-secondary"
                />
                {actionData?.errors?.email ? (
                  <div className="pt-1 text-red-600" id="email-error">
                    {actionData.errors.email}
                  </div>
                ) : null}
              </div>
              <div className="input-group w-full flex flex-col gap-1">
                <div className="password-row flex justify-between text-sm">
                  <label htmlFor="password" className="text-sm">
                    Password
                  </label>
                  <Link
                    to="forgot-password"
                    className="font-semibold text-secondary"
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
                {actionData?.errors?.password ? (
                  <div className="pt-1 text-red-600" id="password-error">
                    {actionData.errors.password}
                  </div>
                ) : null}
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
                  className="rounded-sm bg-secondary py-2 text-xs font-bold"
                >
                  Login
                </button>
              </div>
            </Form>
            <div className="login-redirect text-sm text-center">
              Don&#39;t have an account?{" "}
              <Link to="/signup" className="text-secondary font-semibold ml-1">
                Sign up
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
