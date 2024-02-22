import { json, ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { ZillowResponseError } from "~/utils/errors";
import { writeFile, readFile, access, mkdir } from "fs/promises";
import { dirname, join } from "path";
import {
  ZillowPropertyData,
  getZillowDataFromHtml,
  modifyAddress,
} from "~/utils/helper";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    // Perform server-side tasks, such as fetching data from a database or making external API requests
    const { url, address } = await request.json();
    // before doing this, let's check and see if we have the data stored locally
    const modifiedAddress = modifyAddress(address);

    const localData = await getLocalPropertyData(modifiedAddress);

    if (!localData) {
      // Fetch data from Zillow
      const propertyData = await fetchPropertyDataFromZillow(url);

      // Save data to local storage
      saveLocalPropertyData(modifiedAddress, propertyData);

      // Return the fetched data as JSON
      return json({
        propertyData,
      });
    }

    // getting here means we have local data
    // check and see if timestamp is less than 24 hours
    const currentTime = new Date().getTime();
    if (!localData.timestamp) throw new Error("No timestamp found");

    const localDataTime = new Date(localData.timestamp).getTime();
    const timeDifference = currentTime - localDataTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (localData && hoursDifference < 720) {
      // only save after 30 days
      return json({
        propertyData: localData,
      });
    }

    const propertyData = await fetchPropertyDataFromZillow(url);
    saveLocalPropertyData(modifiedAddress, propertyData);

    return json({
      propertyData,
    });

    // Fetch data from Zillow
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

async function getLocalPropertyData(
  modifiedAddress: string
): Promise<ZillowPropertyData | null> {
  try {
    const data = await readFile(
      join("app", "localPropertyData", `${modifiedAddress}.json`),
      "utf8"
    );
    return JSON.parse(data);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      // File doesn't exist
      return null;
    }
    throw err;
  }
}

async function fetchPropertyDataFromZillow(
  url: string
): Promise<ZillowPropertyData> {
  const data = await getPropertyDataFromZillow(url);

  const html: string = data.substring(Math.floor(data.length * 0.25));

  const pattern = `</script></div></div><div id="__NEXT_SCRIPTS_DEV__"></div><script id="__NEXT_DATA__" type="application/json">`;

  const propertyData = getZillowDataFromHtml(html, pattern);
  if (!propertyData) throw new Error("No property found");
  propertyData.timestamp = new Date().toISOString();
  return propertyData;
}

async function saveLocalPropertyData(
  modifiedAddress: string,
  propertyData: ZillowPropertyData
): Promise<void> {
  const filePath = join("app", "localPropertyData", `${modifiedAddress}.json`);
  const directory = dirname(filePath);
  try {
    await access(directory); // Check if directory exists
  } catch (err) {
    // Directory doesn't exist, create it
    await mkdir(directory, { recursive: true });
  }
  await writeFile(filePath, JSON.stringify(propertyData));
}
