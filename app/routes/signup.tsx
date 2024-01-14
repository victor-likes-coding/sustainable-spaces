import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import Navbar from "~/components/navbar";

// import Button from "~/components/button";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  return json({
    message: "success",
  });
}

export default function Signup() {
  return (
    <>
      <Navbar />
      <div className="w-full h-without-nav-fixed bg-primary text-white">
        <main className="px-4 h-full flex flex-col justify-center pb-32">
          <div className="w-full px-2">
            <h1 className="my-10 text-2xl font-bold text-center">
              Sign up for an account
            </h1>
            <Form
              method="post"
              className="w-full h-auto flex flex-col gap-4 mb-2"
            >
              <div className="input-group w-full flex flex-col gap-1">
                <label htmlFor="email" className="text-sm">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="rounded-sm pl-2 text-secondary"
                />
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
                  type="password"
                  id="password"
                  name="password"
                  className="rounded-sm text-secondary pl-2"
                />
              </div>

              <div className="input-group w-full flex flex-col gap-1">
                <button
                  type="submit"
                  className="rounded-sm bg-secondary py-2 text-xs font-bold"
                >
                  Sign up
                </button>
              </div>
            </Form>
            <div className="login-redirect text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-secondary font-semibold ml-1">
                Sign in
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
