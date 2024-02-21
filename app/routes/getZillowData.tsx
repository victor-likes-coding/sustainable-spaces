import { json, ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { ZillowResponseError } from "~/utils/errors";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    // Perform server-side tasks, such as fetching data from a database or making external API requests
    const { url } = await request.json();
    const data = await getPropertyDataFromZillow(url);

    // Return the fetched data as JSON
    return json({
      data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors appropriately
    return json(
      { error: "An error occurred while fetching data." },
      { status: 500 }
    );
  }
};

// Function to fetch data from an external API (replace this with your actual data fetching logic)
async function getPropertyDataFromZillow(url: string) {
  // Example: Fetch data from an external API
  const response = await fetch(url);

  // Check if the request was successful (status code 2xx)
  if (!response.ok) {
    throw new ZillowResponseError({
      response,
    });
  }

  // Retrieve the response body as text (HTML)
  const htmlString = await response.text();

  return htmlString;
}
