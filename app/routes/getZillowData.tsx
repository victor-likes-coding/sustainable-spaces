import { json, ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { ZillowResponseError } from "~/utils/errors";
import { writeFile, readFile, access, mkdir } from "fs/promises";
import { dirname, join } from "path";
import {
  AdditionalMutationData,
  ZillowPropertyData,
  getZillowDataFromHtml,
  modifyAddress,
} from "~/utils/helper";

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import { Page } from "puppeteer";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    // Perform server-side tasks, such as fetching data from a database or making external API requests
    const { url, address } = await request.json();
    // before doing this, let's check and see if we have the data stored locally
    const propertyData = await getPropertyData(url, address);
    addTaxData(propertyData);

    // Return the fetched data as JSON
    return json({
      propertyData,
    });
  } catch (err) {
    return json({
      error: "An error occurred while fetching data.",
      status: 500,
    });
  }
};

type State = "FL"; // | "GA" | "AL" | "MS" | "LA" | "TX" | "SC" | "NC" | "TN";

function addTaxData(
  propertyData: ZillowPropertyData & Partial<AdditionalMutationData>
): void {
  if (propertyData.tax) return;

  // get state tax rate
  // get purchase price
  // calculate tax
  // add tax to propertyData

  const {
    address: { state },
    price,
  } = propertyData;

  // based on 2 letter state, get tax rate
  const taxes: Record<State, number> = {
    FL: 0.0072,
  };

  const taxRate = taxes[state as State];
  if (!taxRate || !price) return; // we don't have tax data for this state yet or a purchase price

  const tax = price * taxRate;
  propertyData.tax = tax; // yearly tax rate
}

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

export async function typeAddress(page: Page, url: string, address: string) {
  page.setDefaultTimeout(5000);
  await page.goto(url);
  const inputSelector =
    "input[placeholder='Enter an address, neighborhood, city, or ZIP code']";
  await page.waitForSelector(inputSelector);

  // Select the input field
  const inputField = await page.$(inputSelector);

  if (!inputField) {
    throw new Error("Input field not found");
  }

  // Type into the input field
  await inputField.type(address);
  const button = await page.$(".StyledIconButton-c11n-8-86-1__sc-1pb8vz8-0");
  if (!button) {
    throw new Error("Button not found");
  }
  await button.click();
}

export async function getInsuranceData(
  page: Page,
  propertyData: ZillowPropertyData
) {
  await page.waitForSelector("#home-insurance");
  const insuranceData = await page.evaluate(() => {
    // #home-insurance is an input element
    const insuranceData: HTMLInputElement | null =
      document.querySelector("#home-insurance");

    if (!insuranceData) return;
    return insuranceData.value;
  });

  if (!insuranceData) throw new Error("No insurance data found");

  propertyData.insurance = Number(insuranceData);
}

export async function getPropertyData(url: string, address: string) {
  const modifiedAddress = modifyAddress(address);

  // check for local data
  const localData = await getLocalPropertyData(modifiedAddress);

  if (localData) {
    // getting here means we have local data
    // check and see if timestamp is less than 30 days
    const isFreshData = await checkFreshnessOfLocalData(localData);
    if (isFreshData) {
      return localData;
    }
  }

  // Fetch data from Zillow
  const propertyData = await fetchPropertyDataFromZillow(url);

  // Save data to local storage
  saveLocalPropertyData(modifiedAddress, propertyData); // handles most of the data we need

  // also we need to grab the insurance information and anything else we need from the actual zillow page in puppeteer
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  await typeAddress(page, url, "6803 119th Place North, Largo, FL, USA");
  await getInsuranceData(page, propertyData);
  await browser.close();
  return propertyData;
}

async function checkFreshnessOfLocalData(localData: ZillowPropertyData) {
  const currentTime = new Date().getTime();
  if (!localData.timestamp) throw new Error("No timestamp found");

  const localDataTime = new Date(localData.timestamp).getTime();
  const timeDifference = currentTime - localDataTime;
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  return localData && hoursDifference < 720;
}
