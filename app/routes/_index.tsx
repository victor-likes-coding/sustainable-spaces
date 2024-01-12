import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="w-full h-without-nav bg-primary text-white">
      <main className="px-16 h-full flex justify-center align-middle flex-col text-center">
        <h1 className="text-3xl mb-8">
          Welcome to{" "}
          <span className="font-bold text-secondary">Sustainable Spaces</span>
        </h1>
        <button
          type="button"
          className="bg-green-700 font-bold px-2 py-2 rounded-full mx-12"
        >
          Get Started
        </button>
      </main>
    </div>
  );
}
